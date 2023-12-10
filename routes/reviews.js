import { Router } from "express";
import {
  createReviewSchema,
  idSchema,
  updateVoteSchema,
} from "../data/validation.js";
import {
  createReview,
  deleteReview,
  updateReview,
  updateVote,
} from "../data/reviews.js";

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

// order is important here, else :id will catch vote
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

router.post("/:id", async (req, res) => {
  const { rating, content } = req.body;
  const courseId = req.params.id;
  const userId = req.session.user._id;
  const paramsParseResults = createReviewSchema.safeParse({
    rating,
    content,
  });
  const idParseResults = idSchema.safeParse(courseId);
  if (!paramsParseResults.success) {
    return res
      .status(400)
      .json({ message: paramsParseResults.error.issues[0].message });
  }
  if (!idParseResults.success) {
    return res.status(400).json({ message: "Invalid id" });
  }
  try {
    await createReview(userId, courseId, paramsParseResults.data);
    res.redirect(`/courses/${courseId}`);
  } catch (e) {
    res.status(e.status).render("error", e);
  }
});

router.patch("/:id", async (req, res) => {
  const { rating, content } = req.body;
  const courseId = req.params.id;
  const userId = req.session.user._id;
  const paramsParseResults = createReviewSchema.safeParse({
    rating,
    content,
  });
  const idParseResults = idSchema.safeParse(courseId);
  if (!paramsParseResults.success) {
    return res
      .status(400)
      .json({ message: paramsParseResults.error.issues[0].message });
  }
  if (!idParseResults.success) {
    return res.status(400).json({ message: "Invalid id" });
  }
  try {
    await updateReview(userId, courseId, paramsParseResults.data);
    res.redirect(`/courses/${courseId}`);
  } catch (e) {
    res.status(e.status).render("error", e);
  }
});

router.delete("/:id", async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.session.user._id;
  const reviewIdParseResults = idSchema.safeParse(reviewId);
  if (!reviewIdParseResults.success) {
    return res.status(400).json({ message: "Invalid id" });
  }
  try {
    await deleteReview(reviewId, userId);
    res.status(200);
  } catch (e) {
    res.status(e.status).render("error", e);
  }
});

export default router;
