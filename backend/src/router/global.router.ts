import {Router} from "express";
import {guideRouter} from "./guide.router";
import {guideCommentsRouter} from "./guideComments.router";
import {followerRouter} from "./follower.router";

export const globalRouter = Router();

interface HelloWorldReponse {
    message: string;
}

globalRouter.get("/", (req, res) => {
    res.send({message: "hello world global"} as HelloWorldReponse);
});

//globalRouter.use("/riotApi", riotAPIRouter);
globalRouter.use("/guides", guideRouter);
globalRouter.use("/guidecomments", guideCommentsRouter);
globalRouter.use("/follower", followerRouter);

//globalRouter.use("/evaluation", evaluationRouter);