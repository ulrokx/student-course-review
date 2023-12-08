import { Router } from "express";
import { getAllCourses, getCourse, getCourses } from "../data/courses.js";
import { searchCourse } from "../data/search.js";
import { idSchema, searchCourseSchema } from "../data/validation.js";
import { getReviews, includesObjectId } from "../data/reviews.js";

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
        .status(400)
        .json({ message: parseResults.error.issues[0].message });
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
        .status(400)
        .json({ message: parseResults.error.issues[0].message });
    }
    try {
      const course = await getCourse(id);
      const reviews = await getReviews(id);
      res.render("course", {
        course: formatCourse(course),
        reviews: req.session.user
          ? addCurrentVotes(reviews, req.session.user._id)
          : reviews,
      });
    } catch (e) {
      res.status(e.status).render("error", e);
    }
  });

export default router;
