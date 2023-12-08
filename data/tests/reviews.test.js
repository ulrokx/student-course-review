import { ObjectId } from "mongodb";
import { reviews } from "../../config/mongoCollections.js";
import { createReview, getReviews, updateVote } from "../reviews.js";

jest.mock("../../config/mongoCollections.js");

describe("data/reviews", () => {
  describe("createReview", () => {
    it("should create a review", async () => {
      const userId = new ObjectId();
      const courseId = new ObjectId();
      const reviewsFindOne = jest.fn().mockResolvedValue(null);
      const reviewsInsertOne = jest.fn(() => {
        return { acknowledged: true, insertedId: new ObjectId() };
      });
      reviews.mockResolvedValue({
        findOne: reviewsFindOne,
        insertOne: reviewsInsertOne,
      });
      const result = await createReview(userId.toString(), {
        courseId: courseId.toString(),
        rating: 9,
        content: "Course is fantastic! Great professors as well.",
      });
      expect(result).toHaveProperty("_id");
      expect(result).toHaveProperty("courseId", courseId);
      expect(result).toHaveProperty("userId", userId);
      expect(result).toHaveProperty("rating", 9);
      expect(result).toHaveProperty("score", 0);
    });

    it("should throw an error if user already wrote a review", async () => {
      const userId = new ObjectId();
      const courseId = new ObjectId();
      const reviewsFindOne = jest.fn().mockResolvedValue({
        _id: new ObjectId(),
      });
      reviews.mockResolvedValue({
        findOne: reviewsFindOne,
      });
      expect(() =>
        createReview(userId.toString(), {
          courseId: courseId.toString(),
          rating: 9,
          content: "Course is fantastic! Great professors as well.",
        }),
      ).rejects.toHaveProperty("status", 400);
    });

    it("should throw 500 if insert fails", async () => {
      const userId = new ObjectId();
      const courseId = new ObjectId();
      const reviewsFindOne = jest.fn().mockResolvedValue(null);
      const reviewsInsertOne = jest.fn(() => {
        return { acknowledged: false };
      });
      reviews.mockResolvedValue({
        findOne: reviewsFindOne,
        insertOne: reviewsInsertOne,
      });
      expect(() =>
        createReview(userId.toString(), {
          courseId: courseId.toString(),
          rating: 9,
          content: "Course is fantastic! Great professors as well.",
        }),
      ).rejects.toHaveProperty("status", 500);
    });
  });

  describe("getReviews", () => {
    it("should get reviews", async () => {
      const courseId = new ObjectId();
      const reviewsFind = jest.fn().mockReturnValue({
        toArray: () => [
          {
            _id: new ObjectId(),
            courseId,
            userId: new ObjectId(),
            rating: 9,
            content: "Course is fantastic! Great professors as well.",
            score: 0,
          },
          {
            _id: new ObjectId(),
            courseId,
            userId: new ObjectId(),
            rating: 9,
            content: "Course is fantastic! Great professors as well.",
            score: 0,
          },
        ],
      });
      reviews.mockResolvedValue({
        find: reviewsFind,
      });
      const result = await getReviews(courseId.toString());
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty("_id");
      expect(result[0]).toHaveProperty("courseId", courseId);
      expect(result[0]).toHaveProperty("userId");
      expect(result[0]).toHaveProperty("rating", 9);
      expect(result[0]).toHaveProperty("score", 0);
    });
  });

  describe("updateVote", () => {
    it("should update a vote", async () => {
      const reviewId = new ObjectId();
      const userId = new ObjectId();
      const reviewsFindOne = jest.fn().mockReturnValue({
        _id: reviewId,
        userId,
        rating: 9,
        content: "Course is fantastic! Great professors as well.",
        score: 0,
        upvotes: [],
        downvotes: [],
      });
      const reviewsUpdateOne = jest.fn();
      reviews.mockResolvedValue({
        findOne: reviewsFindOne,
        updateOne: reviewsUpdateOne,
      });
      await updateVote(userId.toString(), {
        reviewId: reviewId.toString(),
        vote: "upvote",
      });
      expect(reviewsUpdateOne).toHaveBeenCalledWith(
        { _id: reviewsFindOne()._id },
        {
          $push: { upvotes: userId },
          $inc: { score: 1 },
        },
      );
    });

    it("should fail if review doesn't exist", async () => {
      const reviewId = new ObjectId();
      const userId = new ObjectId();
      const reviewsFindOne = jest.fn().mockReturnValue(null);
      const reviewsUpdateOne = jest.fn();
      reviews.mockResolvedValue({
        findOne: reviewsFindOne,
        updateOne: reviewsUpdateOne,
      });
      expect(() =>
        updateVote(userId.toString(), {
          reviewId: reviewId.toString(),
          vote: "upvote",
        }),
      ).rejects.toHaveProperty("status", 404);
    });
  });
});
