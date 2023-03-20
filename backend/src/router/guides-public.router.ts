import {Router} from "express";
import {getAllGuides, getGuideById, getGuideByTitleAllUsers, getGuideByTitleUser} from "../controller/guide.controller";

export const guidePublicRouter = Router();

guidePublicRouter.get("/titleUser/", getGuideByTitleUser);
guidePublicRouter.get("/titleAllUsers/", getGuideByTitleAllUsers);
guidePublicRouter.get("/", getAllGuides);
guidePublicRouter.get("/byId/:id", getGuideById);


