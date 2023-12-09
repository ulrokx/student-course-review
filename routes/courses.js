import { Router } from "express";
import { getAllCourses, getCourse, getCourses } from "../data/courses.js";
import { searchCourse } from "../data/search.js";
import { idSchema, searchCourseSchema } from "../data/validation.js";
import { getReviews, includesObjectId } from "../data/reviews.js";
import { formatDistance } from "date-fns";

const router = Router();

const formatCourse = (course) => ({
  ...course,
  professors: course.professors.join(", "),
});

const formatCourses = (courses) => courses.map(formatCourse);

const getCurrentVote = (review, userId) => {
  if (includesObjectId(review.upvotes, userId)) {
    return "upvote";
  }
  if (includesObjectId(review.downvotes, userId)) {
    return "downvote";
  }
  return "novote";
};

const addCurrentVotes = (reviews, userId) =>
  reviews.map((review) => ({
    ...review,
    currentVote: getCurrentVote(review, userId),
  }));

const getUserReview = (reviews, userId) =>
  reviews.find((review) => review.userId.toString() === userId.toString());

const removeUserReview = (reviews, userId) =>
  reviews.filter((review) => review.userId.toString() !== userId.toString());

const formatReview = (review) => ({
  ...review,
  createdAt: formatDistance(review._id.getTimestamp(), new Date(), {
    includeSeconds: true,
    addSuffix: true,
  }),
  updatedAt:
    review.updatedAt &&
    formatDistance(review.updatedAt, new Date(), {
      includeSeconds: true,
      addSuffix: true,
    }),
});

const formatReviews = (reviews) => reviews.map(formatReview);

router
  .get("/", async (req, res) => {
    const { search } = req.query;
    if (!search) {
      const courses = await getAllCourses();
      return res.render("courses", { courses: formatCourses(courses) });
    }
    const parseResults = searchCourseSchema.safeParse(search);
    if (!parseResults.success) {
      return res
        .status(400).render("error", {status: 400, message: parseResults.error.issues[0].message})
    }
    try {
      const courses = await searchCourse(parseResults.data);
      res.render("courses", {
        search,
        courses: formatCourses(courses),
      });
    } catch (e) {
      res.status(e.status).render("error", e);
    }
  })
  .get("/:id", async (req, res) => {
    const { id } = req.params;
    const parseResults = idSchema.safeParse(id);
    if (!parseResults.success) {
      return res
        .status(400).render("error",{status: 400, message: parseResults.error.issues[0].message })
        
    }
    try {
      const course = await getCourse(id);
      let reviews = await getReviews(id);
      if (req.session.user) {
        const userId = req.session.user._id;
        let review = null;
        if ((review = getUserReview(reviews, userId))) {
          reviews = removeUserReview(reviews, userId);
        }
        return res.render("course", {
          course: formatCourse(course),
          reviews: formatReviews(addCurrentVotes(reviews, userId)),
          review,
        });
      } else {
        return res.render("course", {
          course: formatCourse(course),
          reviews: formatReviews(reviews),
        });
      }
    } catch (e) {
      return res.status(e.status).render("error", e);
    }
  });

export default router;
