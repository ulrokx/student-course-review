import ObjectID from "bson-objectid";
import { z } from "zod";

export const idSchema = z
  .string()
  .trim()
  .refine((val) => ObjectID.isValid(val), {
    message: "Invalid id",
  });

const usernameRegExp = new RegExp(/^[a-zA-Z0-9_.\-]{3,16}$/);

const emailSchema = z.string().trim().email();

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" });

const usernameSchema = z.string().trim().regex(usernameRegExp, {
  message:
    "Username must be between 3 and 16 characters long and can only contain letters, numbers, underscores, hyphens, and periods",
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
  universityId: idSchema.or(z.undefined()),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const universityNameRegExp = new RegExp(/[a-zA-Z'-]/);

const universityNameSchema = z.string().min(10).regex(universityNameRegExp);

const universityLocationRegExp = new RegExp(/[a-zA-Z',-]/);

const universityLocationSchema = z
  .string()
  .min(3)
  .regex(universityLocationRegExp);

export const createUniversitySchema = z.object({
  name: universityNameSchema,
  location: universityLocationSchema,
});

export const updateUniversitySchema = createUniversitySchema.partial();

export const searchUniversitySchema = z.string().trim().min(1);

export const searchCourseSchema = z.string().trim().min(1);

export const sortByCourseSchema = z.enum(["rating-asc", "rating-desc"]);

export const getCoursesOptionsSchema = z.object({
  sortBy: sortByCourseSchema.or(z.undefined()).or(z.literal("")),
  universityId: idSchema.or(z.undefined()),
  search: searchCourseSchema.or(z.undefined()).or(z.literal("")),
});

const courseCodeSchema = z.string().min(3).max(10);

const courseNameSchema = z.string().min(3).max(40);

const professorsSchema = z.array(z.string().min(3).max(40)).min(1);

export const createCourseSchema = z.object({
  courseCode: courseCodeSchema,
  courseName: courseNameSchema,
  professors: professorsSchema,
});

export const updateCourseSchema = createCourseSchema.partial();

const reviewRatingSchema = z.preprocess(
  (val) => parseFloat(val),
  z
    .number()
    .min(0.5)
    .max(5)
    .refine((val) => val % 0.5 === 0, {
      message: "Rating must be a multiple of .5",
    }),
);

const reviewContentSchema = z.string().min(10).max(500);

export const createReviewSchema = z.object({
  rating: reviewRatingSchema,
  content: reviewContentSchema,
});

const voteSchema = z.enum(["upvote", "downvote", "novote"]);

export const updateVoteSchema = z.object({
  vote: voteSchema,
  reviewId: idSchema,
});
