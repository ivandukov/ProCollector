import {RequestHandler, Router} from "express"
import {DI} from "../index";
import {
  CreateGuideCommentsDTO,
  CreateGuideCommentsSchema,
 GuideComment
} from "../entities";

const router = Router();

/**
 * get all the comments
 */
export const getAllGuidesComment: RequestHandler<{}> = async (req, res) => {
 const comment = await DI.guideCommentRepository.findAll();
  res.status(200).json(comment);
};

/**
 * add a comment to the guide with the given ID
 */
export const addComment: RequestHandler<{}> = async (req, res) => {
  const validatedData = await CreateGuideCommentsSchema.validate(req.body).catch(
      (e) => {
        res.status(400).json({ errors: e.errors });
      }
  );
  if (!validatedData) {
    return;
  }
  const existingGuide = await DI.guideRepository.findOne(req.params);
  if (!existingGuide) {
    return res.status(403).json({ errors: ["there is no guide with this ID"] });
  }
  const createGuideCommentsDTO: CreateGuideCommentsDTO = {
    ...validatedData,
    creator: req.session.user!,
    guide: existingGuide!,
  };
  const comment = new GuideComment(createGuideCommentsDTO);

  await DI.guideRepository.persistAndFlush(comment);

  res.json(comment);
};
