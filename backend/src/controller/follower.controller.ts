import {RequestHandler} from "express";
import {DI} from "../index";
import {CreateFollowerSchema, Follower} from "../entities";

/**
 * Get all followers
 */
export const getAllFollowers: RequestHandler<{}> = async (req, res) => {
    const Followers = await DI.followerRepository.findAll();
    res.status(200).json(Followers);
};

/**
 * Gets all followers for the logged in user
 */
export const getAllFollowersForUser: RequestHandler<{ userId: string }> = async (req, res) => {

    //get the req param id
    const userId = req.query.userId as string;
    if (!userId) {
        return res.status(400).json({errors: ["user id is required"]});
    }

    const user = await DI.userRepository.findOne({id: userId}, {populate: ["followers"]});

    console.log(user);
    res.status(200).json(user?.followers);
}

/**
 * Get a follower with a specific name
 */
export const getFollowerWithName: RequestHandler<{}> = async (req, res) => {
    const Follower = await DI.followerRepository.findOne({
        followerName: req.params
    });
    if (!Follower) {
        return res.status(403).json({errors: ["Follower doest not exist"]});
    }
    // print out
    res.status(200).json(Follower)
};

/**
 * Post a follower
 */
export const addFollower: RequestHandler<{ userId: string, followerName: string, region: string, profileIconId: number }> = async (req, res) => {
    const [validatedDataFollower] = await Promise.all([CreateFollowerSchema.validate(req.body).catch((e) => {
        res.status(400).json({errors: e.errors});
    })]);
    if (!validatedDataFollower) {
        return;
    }

    const newFollower = new Follower({
        followerName: validatedDataFollower.followerName,
        region: validatedDataFollower.region,
        profileIconId: validatedDataFollower.profileIconId
    });

    /* After that create follower and add them to summoner and user */
    const userID = validatedDataFollower.userId;
    const User = await DI.userRepository.findOne({
        id: userID
    });
    if (User) {
        newFollower.users.add(User);
        User.followers.add(newFollower)
    }

    await DI.followerRepository.persistAndFlush(newFollower);
    return res.status(201).send("Created Follower");
};

/**
 * Delete a follower
 * @param req
 * @param res
 */
export const deleteFollower: RequestHandler<{ followerId: string, userId: string }> = async (req, res) => {
    const followerId = req.params.followerId;
    const userId = req.params.userId;
    if (!followerId || !userId) {
        return res.status(400).json({errors: ["follower id is required"]});
    }

    const follower = await DI.followerRepository.findOne({
        id: followerId
    });

    if (!follower) {
        return res.status(403).json({errors: ["Follower doest not exist"]});
    }

    const userFollower = await DI.userRepository.findOne({
        id: userId
    }, {populate: ["followers"]});

    if (!userFollower) {
        return res.status(403).json({errors: ["User doest not exist"]});
    }

    await userFollower.followers.remove(follower);
    await DI.userRepository.persistAndFlush(userFollower);
    await DI.followerRepository.removeAndFlush(follower);


    return res.send(204);
};