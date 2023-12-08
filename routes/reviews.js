import { Router } from "express";
import {
  createReviewSchema,
  idSchema,
  updateVoteSchema,
} from "../data/validation.js";
import { updateVote } from "../data/reviews.js";

const router = Router();

router.use((req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({
      status: 401,
      message: "You must be logged in",
    });
  }
  next();
});

router.post("/", async (req, res) => {
  const { courseId, rating, content } = req.body;
  const userId = req.session.user._id;
  const paramsParseResults = createReviewSchema.safeParse({
    courseId,
    rating,
    content,
  });
  const idParseResults = idSchema.safeParse(userId);
  if (!paramsParseResults.success) {
    return res
      .status(400)
      .json({ message: paramsParseResults.error.issues[0].message });
  }
  if (!idParseResults.success) {
    return res.status(400).json({ message: "Invalid id" });
  }
  try {
    await createReview(userId, paramsParseResults.data);
    res.redirect(`/courses/${courseId}`);
  } catch (e) {
    res.status(e.status).render("error", e);
  }
});

router.post("/vote", async (req, res) => {
  const { reviewId, vote } = req.body;
  const userId = req.session.user._id;
  const paramsParseResults = updateVoteSchema.safeParse({
    reviewId,
    vote,
  });
  const idParseResults = idSchema.safeParse(userId);
  if (!paramsParseResults.success) {
    return res
      .status(400)
      .json({ message: paramsParseResults.error.issues[0].message });
  }
  if (!idParseResults.success) {
    return res.status(400).json({ message: "Invalid id" });
  }
  try {
    const review = await updateVote(userId, paramsParseResults.data);
    return res.status(200).json(review);
  } catch (e) {
    return res.status(e.status).json(e);
  }
});

export default router;
