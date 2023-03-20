import { Router } from "express";
import {
} from "../controller/follower.controller";
import {updateSummoner} from "../controller/summoner.controller";

export const summonerRouter = Router();

//summonerRouter.get("/summonerName", getSummoner);
summonerRouter.put("/updateSummoner/", updateSummoner);