import { Router } from "express";
import {
  getMatchDataById,
  getSummonerByName
} from "../controller/externalAPIController/riotAPI.controller";

/**
 *
 */
export const riotAPIRouter = Router();

riotAPIRouter.get("/getSummonerByName", getSummonerByName); // region&:summonerName
riotAPIRouter.get("/getMatchDataById", getMatchDataById); // /:region&:matchId

