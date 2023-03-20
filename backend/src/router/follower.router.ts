import {Router} from "express";
import {addFollower, deleteFollower, getAllFollowersForUser} from "../controller/follower.controller";

export const followerRouter = Router();

followerRouter.get("/", getAllFollowersForUser);
followerRouter.post("/", addFollower);
followerRouter.delete("/:followerId&:userId", deleteFollower);