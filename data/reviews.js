import { ObjectId } from "mongodb";
import { reviews } from "../config/mongoCollections.js";
import {
  createReviewSchema,
  idSchema,
  updateVoteSchema,
} from "./validation.js";

export const createReview = async (userId, params) => {
  const paramsParseResults = createReviewSchema.safeParse(params);
  const idParseResults = idSchema.safeParse(userId);
  if (!paramsParseResults.success) {
    throw { status: 400, message: paramsParseResults.error.issues[0].message };
  }
  if (!idParseResults.success) {
    throw { status: 400, message: "Invalid id" };
  }
  const reviewsCollection = await reviews();
  const courseId = new ObjectId(paramsParseResults.data.courseId);
  userId = new ObjectId(userId);
  const existingReview = await reviewsCollection.findOne({
    userId,
    courseId,
  });
  if (existingReview) {
    throw { status: 400, message: "Cannot write multiple reviews" };
  }
  const insertedReview = await reviewsCollection.insertOne({
    ...paramsParseResults.data,
    userId,
    courseId,
    upvotes: [],
    downvotes: [],
    score: 0,
  });
  if (!insertedReview.acknowledged) {
    throw { status: 500, message: "Could not add review" };
  }
  return {
    _id: insertedReview.insertedId,
    ...paramsParseResults.data,
    userId,
    courseId,
    upvotes: [],
    downvotes: [],
    score: 0,
  };
};

export const getReviews = async (courseId) => {
  const parseResults = idSchema.safeParse(courseId);
  if (!parseResults.success) {
    throw { status: 400, message: "Invalid id" };
  }
  const reviewsCollection = await reviews();
  return reviewsCollection.find({ courseId: new ObjectId(courseId) }).toArray();
};

export const includesObjectId = (arr, id) =>
  arr.some((item) => item.equals(id));

export const updateVote = async (userId, params) => {
  const userIdParseResults = idSchema.safeParse(userId);
  const paramsParseResults = updateVoteSchema.safeParse(params);
  if (!userIdParseResults.success) {
    throw { status: 400, message: "Invalid id" };
  }
  if (!paramsParseResults.success) {
    throw { status: 400, message: paramsParseResults.error.issues[0].message };
  }
  userId = new ObjectId(userId);
  const reviewId = new ObjectId(paramsParseResults.data.reviewId);
  const reviewsCollection = await reviews();
  const review = await reviewsCollection.findOne({ _id: reviewId });
  if (!review) {
    throw { status: 404, message: "Review not found" };
  }
  const vote = paramsParseResults.data.vote;
  switch (vote) {
    case "upvote":
      if (includesObjectId(review.upvotes, userId)) {
        return review;
      }
      if (includesObjectId(review.downvotes, userId)) {
        await reviewsCollection.updateOne(
          { _id: reviewId },
          {
            $pull: { downvotes: userId },
            $push: { upvotes: userId },
            $inc: { score: 2 },
          },
        );
      } else {
        await reviewsCollection.updateOne(
          { _id: reviewId },
          { $push: { upvotes: userId }, $inc: { score: 1 } },
        );
      }
      break;
    case "downvote":
      if (includesObjectId(review.downvotes, userId)) {
        return review;
      }
      if (includesObjectId(review.upvotes, userId)) {
        await reviewsCollection.updateOne(
          { _id: reviewId },
          {
            $pull: { upvotes: userId },
            $push: { downvotes: userId },
            $inc: { score: -2 },
          },
        );
      } else {
        await reviewsCollection.updateOne(
          { _id: reviewId },
          { $push: { downvotes: userId }, $inc: { score: -1 } },
        );
      }
      break;
    case "novote":
      if (includesObjectId(review.upvotes, userId)) {
        await reviewsCollection.updateOne(
          { _id: reviewId },
          { $pull: { upvotes: userId }, $inc: { score: -1 } },
        );
      }
      if (includesObjectId(review.downvotes, userId)) {
        await reviewsCollection.updateOne(
          { _id: reviewId },
          { $pull: { downvotes: userId }, $inc: { score: 1 } },
        );
      }
      break;
    default:
      throw { status: 400, message: "Invalid vote" };
  }
  const updatedReview = await reviewsCollection.findOne({ _id: reviewId });
  return {
    ...updatedReview,
    // return current vote to ensure ui and db are in sync
    currentVote: includesObjectId(updatedReview.upvotes, userId)
      ? "upvote"
      : includesObjectId(updatedReview.downvotes, userId)
      ? "downvote"
      : "novote",
  };
};
