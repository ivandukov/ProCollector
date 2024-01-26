import {Router} from "express";
import {updateSummoner} from "../controller/summoner.controller";

export const summonerRouter = Router();

//summonerRouter.get("/summonerName", getSummoner);
summonerRouter.put("/updateSummoner/", updateSummoner);