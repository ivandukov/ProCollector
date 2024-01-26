import {Router} from "express";
import {addComment, getAllGuidesComment} from "../controller/guideComments.controller";

export const guideCommentsRouter = Router();

guideCommentsRouter.get("/", getAllGuidesComment);
guideCommentsRouter.post("/:id", addComment);

