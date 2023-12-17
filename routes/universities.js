import { Router } from "express";
import { getUniversities, getUniversity } from "../data/universities.js";
import { getCourses } from "../data/courses.js";
import {
  getCoursesOptionsSchema,
  idSchema,
  searchCourseSchema,
  searchUniversitySchema,
} from "../data/validation.js";
import { formatCourses } from "./courses.js";

const router = Router();

router
  .get("/", async (req, res) => {
    const { search } = req.query;
    const options = {};
    if (search) {
      const parseResults = searchUniversitySchema.safeParse(search);
      if (!parseResults.success) {
        return res
          .status(400)
          .json({ message: parseResults.error.issues[0].message });
      }
      options.search = parseResults.data;
    }
    try {
      const universities = await getUniversities(options);
      res.render("universities", {
        universities,
        search,
      });
    } catch (e) {
      res.status(e.status).render("error", e);
    }
  })
  .get("/:id", async (req, res) => {
    const { id } = req.params;
    const { search, sortBy } = req.query;
    const idParseResults = idSchema.safeParse(id);
    if (!idParseResults.success) {
      return res.status(400).render("error", {
        status: 400,
        message: idParseResults.error.issues[0].message,
      });
    }
    const parseResults = getCoursesOptionsSchema.safeParse({ search, sortBy });
    if (!parseResults.success) {
      return res.status(400).render("error", {
        status: 400,
        message: parseResults.error.issues[0].message,
      });
    }
    try {
      const university = await getUniversity(id);
      const courses = await getCourses({ universityId: id, search, sortBy });
      res.render("university", {
        university,
        courses: formatCourses(courses),
        search,
        sortBy,
      });
    } catch (e) {
      res.status(e.status).render("error", e);
    }
  });

export default router;
