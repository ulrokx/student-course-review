import { Router } from "express";
import { getUniversities, getUniversity } from "../data/universities.js";
import { getCourses } from "../data/courses.js";
import { idSchema, searchUniversitySchema } from "../data/validation.js";
import { searchUniversity } from "../data/search.js";

const router = Router();

router
  .get("/", async (req, res) => {
    const { search } = req.query;
    if (!search) {
      const universities = await getUniversities();
      return res.render("universities", { universities });
    }
    const parseResults = searchUniversitySchema.safeParse(search);
    if (!parseResults.success) {
      return res
        .status(400).render("error", {status: 400, message: parseResults.error.issues[0].message  })
    }
    try {
      const universities = await searchUniversity(parseResults.data);
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
    const parseResults = idSchema.safeParse(id);
    if (!parseResults.success) {
      return res
        .status(400).render("error",{status: 400, message: parseResults.error.issues[0].message })
    }

    try {
      const university = await getUniversity(parseResults.data);
      const courses = await getCourses(parseResults.data);
      res.render("university", { university, courses });
    } catch (e) {
      res.status(e.status).render("error", e);
    }
  });

export default router;
