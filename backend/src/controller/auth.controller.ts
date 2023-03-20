import {Router} from "express";
import {object, string} from "yup";
import {RegisterUserDTO, RegisterUserSchema, User} from "../entities";
import bcrypt from "bcrypt";
import {DI} from "../index";
import {createSummoner} from "./summoner.controller";
import {wrap} from "@mikro-orm/core";

const BCRYPT_SALT = 10;
const router = Router();
const LoginSchema = object({
    userName: string().required(),
    password: string().required(),
});

router.put("/update", async (req, res) => {
    const region = req.query.region as string;
    const newSummonerName = req.query.summonerName as string;
    const userName = req.query.userName as string;

    const user = await DI.userRepository.findOne({
        userName: userName,
    }, {populate: ["summonerName"]}).catch((e) => {
        console.log(e);
    });
    if (!user) {
        return res.status(400).json({errors: ["User does not exist"]});
    }

    try {
        const findSummoner = await DI.summonerRepository.findOne({
            name: newSummonerName,
            region: region,
        }, {populate: ["queues", "matches", "matches.evaluations"]}).catch((e) => {
            console.log(e);
        });
        if (!findSummoner) {
            const newSummoner = await createSummoner(region, newSummonerName);
            if (!newSummoner.errors) {
                user.summonerName = newSummoner
                await wrap(user).assign(user);
            } else {
                return res.status(400).json(newSummoner);
            }
        } else {
            user.summonerName = findSummoner;
            await wrap(user).assign(user);
        }

        const newUser = await DI.userRepository.findOne({
            userName: userName,
        }, {populate: ["summonerName", "summonerName.queues", "summonerName.matches", "summonerName.matches.evaluations"]}).catch((e) => {
            console.log(e);
        });
        if (!newUser) {
            return res.status(400).json({errors: ["User does not exist"]});
        }
        return res.status(201).json({User: newUser});

    } catch (e: any) {
        return res.status(400).json({errors: [e.message]});
    }
});


router.post("/login", async (req, res) => {

    /**
     * Request Body email /password -> validate
     */
    const validatedData = await LoginSchema.validate(req.body).catch((e) => {
        res.status(400).json({errors: e.errors});
    });
    if (!validatedData) {
        return;
    }

    /**
     * check if there is a user with the userName -> laud user
     */
    const user = await DI.userRepository.findOne({
        userName: validatedData.userName,
    }, {populate: ["summonerName", "summonerName.queues", "summonerName.matches", "summonerName.matches.evaluations"]}).catch((e) => {
        console.log(e);
    });
    if (!user) {
        return res.status(400).json({errors: ["User does not exist"]});
    }


    /**
     * compare password  with User Entry
     */
    const matchingPassword = await comparePasswordWithHash(
        validatedData.password,
        user.password
    );
    if (!matchingPassword) {
        return res.status(401).json({errors: ["password do not match"]});
    }
    req.session.user = user;
    req.session.save();
    return res.status(200).json({User: user},);
});

router.post("/register", async (req, res) => {
    console.log(req.body);
    const validatedData = await RegisterUserSchema.validate(req.body).catch(
        (e) => {
            console.log(req.body);
            res.status(400).json({errors: e.errors});
        }
    );
    if (!validatedData) {
        return;
    }
    const registerUserDto: RegisterUserDTO = {
        ...validatedData,
        password: await hashPassword(validatedData.password),
    };


    const existingUser = await DI.userRepository?.findOne({
        userName: validatedData.userName,
    });
    if (existingUser) {
        return res.status(400).json({errors: ["user already exists"]});
    }
    const newUser = new User(registerUserDto);

    try {
        const findSummoner = await DI.summonerRepository.findOne({
            name: req.body.summonerName,
            region: req.body.region,
        }, {populate: ["queues", "matches", "matches.evaluations", "users"]}).catch((e) => {
            console.log(e);
        });
        if (!findSummoner) {
            const newSummoner = await createSummoner(req.body.region, req.body.summonerName);
            if (!newSummoner.errors) {
                newUser.summonerName = newSummoner
                await DI.userRepository.persistAndFlush(newUser);
                return res.status(201).json(newUser);
            } else {
                return res.status(400).json(newSummoner);
            }
        }
        console.log("Summoner vorhanden!!!")
        //findSummoner.users.add(newUser);
        newUser.summonerName = findSummoner;
        await DI.userRepository.persistAndFlush(newUser);
        return res.status(201).json(newUser);

    } catch (e: any) {
        return res.status(400).json({errors: [e.message]});
    }

});
const hashPassword = (password: string) => bcrypt.hash(password, BCRYPT_SALT);
const comparePasswordWithHash = async (password: string, hash: string) => {
    try {
        return await bcrypt.compare(password, hash);
    } catch {
        return false;
    }
};
export const AuthController = router;
