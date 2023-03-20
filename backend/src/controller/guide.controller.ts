import {RequestHandler} from "express"
import {DI} from "../index";
import {CreateGuideDTO, CreateGuideSchema, Guide} from "../entities";
import {wrap} from "@mikro-orm/core";


/**
 * get all the guides
 */
export const getAllGuides: RequestHandler<{}> = async (req, res) => {
    try {
        const guides = await DI.guideRepository.findAll({populate: ["creator.id", "creator.userName", "comments"]});
        res.status(200).json(guides);
    } catch (e: any) {
        return res.status(400).json({errors: [e.message]});
    }
};


export const getGuideById: RequestHandler<{ id: string }> = async (req, res) => {
    try {
        const guide = await DI.guideRepository.findOne(req.params.id, {populate: ["creator.id", "creator.userName", "comments"]});
        res.status(200).json(guide);
    } catch (e: any) {
        return res.status(400).json({errors: [e.message]});
    }
}

/**
 * get all the guides for the logged user
 */
export const getUserGuide: RequestHandler<{}> = async (req, res) => {
    try {
        const userId = req.query.userId as string;
        const guides = await DI.guideRepository.find(
            {
                creator: userId,
            },
            {populate: ["creator", "comments"]}
        );
        if (!guides) {
            return res.status(400).json({errors: ["User does not exist"]});
        }
        res.status(200).json(guides);
    } catch (e: any) {
        return res.status(400).json({errors: [e.message]});
    }
};

/**
 * add a neu guide to the logged user
 */
export const addGuide: RequestHandler<{}> = async (req, res) => {
    const validatedData = await CreateGuideSchema.validate(req.body).catch(
        (e) => {
            res.status(400).json({errors: e.errors});
        }
    );
    if (!validatedData) {
        return;
    }

    const user = await DI.userRepository.findOne({
        id: validatedData.userId,
    });

    if (!user) {
        res.status(400).json("Error: Could not find User by ID");
    }

    const createGuideDTO: CreateGuideDTO = {
        title: validatedData.title,
        text: validatedData.text,
        creator: user!,
        comments: [],
    };

    const guide = new Guide(createGuideDTO);

    await DI.guideRepository.persistAndFlush(guide);


    res.json(guide);
};

/**
 * delete the guide with the given ID
 */
export const deleteGuide: RequestHandler<{}> = async (req, res) => {
    try {
        const id = req.query.id as string;
        const existingGuide = await DI.guideRepository.find(
            {
                id: id
            }
        );
        if (!existingGuide) {
            return res.status(403).json({errors: ["You cant delete this id"]});
        }
        await DI.guideRepository.remove(existingGuide).flush();
        return res.send(204);

    } catch (e: any) {
        return res.status(400).json({errors: [e.message]});
    }
};

/**
 * modify the guide with the given ID
 */
export const modifyGuide: RequestHandler<{}> = async (req, res) => {
    try {
        const guide = await DI.guideRepository.findOne(req.params, {
            populate: ["comments"],
        });

        if (!guide) {
            return res.status(404).json({message: "guide not found"});
        }

        wrap(guide).assign(req.body);
        await DI.guideRepository.flush();

        res.json(guide);
    } catch (e: any) {
        return res.status(400).json({errors: [e.message]});
    }
};

/**
 * get the all guides with the given title for all users
 */
export const getGuideByTitleAllUsers: RequestHandler<{}> = async (req, res) => {

    try {
        const title = req.query.title as string;
        const guide = await DI.guideRepository.find(
            {
                title: title,
            },
            {populate: ["creator", "comments"]}
        );

        if (!guide) {
            return res.status(404).json({message: "guide not found"});
        }
        res.json(guide);
    } catch (e: any) {
        return res.status(400).json({errors: [e.message]});
    }
};


/**
 * get the all guides with the given title for all user
 */
export const getGuideByTitleUser: RequestHandler<{}> = async (req, res) => {


    try {
        const title = req.query.title as string;
        const userId = req.query.userId as string;

        const guide = await DI.guideRepository.findOne(
            {
                creator: userId,
                title: title,
            },
            {populate: ["comments"]}
        );

        if (!guide) {
            return res.status(404).json({message: "guide not found"});
        }
        res.json(guide);
    } catch (e: any) {
        return res.status(400).json({errors: [e.message]});
    }
};