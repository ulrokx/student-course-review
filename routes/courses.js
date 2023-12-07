import { Router } from "express";
import { getAllCourses, getCourse, getCourses } from "../data/courses.js";
import { searchCourse } from "../data/search.js";
import { idSchema, searchCourseSchema } from "../data/validation.js";

const router = Router();

const formatCourse = (course) => ({
  ...course,
  professors: course.professors.join(", "),
});

const formatCourses = (courses) => courses.map(formatCourse);

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
      res.render("course", { course: formatCourse(course) });
    } catch (e) {
      res.status(e.status).render("error", e);
    }
  });

export default router;
