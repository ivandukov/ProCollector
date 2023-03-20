import {Router} from "express";
import {addGuide, deleteGuide, getUserGuide, modifyGuide} from "../controller/guide.controller";

export const guideRouter = Router();

guideRouter.get("/userguides/", getUserGuide);
guideRouter.post("/", addGuide);
guideRouter.delete("/", deleteGuide);
guideRouter.put("/byId/:id", modifyGuide);


