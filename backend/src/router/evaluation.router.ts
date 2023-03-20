import { Router } from "express";
import {
  addEvaluation,
  getEvaluationMatch,
  getEvaluationUser
} from "../controller/evaluation.controller";


export const evaluationRouter = Router();


evaluationRouter.get("/getEvaluationMatch", getEvaluationMatch); //:region&:matchId&:summonerName
evaluationRouter.put("/addEvaluation/", addEvaluation);
evaluationRouter.get("/getEvaluationUser", getEvaluationUser);