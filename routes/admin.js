import { Router } from "express";
import {
  getUniversities,
  createUniversity,
  getUniversity,
  updateUniversity,
  deleteUniversity,
} from "../data/universities.js";
import { getCourses } from "../data/courses.js";

const router = Router();
router.use((req, res, next) => {
  // TODO: create admin account with migration
  // if (req.session.user.role !== "admin") {
  //     return res.status(403).render("error", { status: 403, message: "Forbidden" });
  // }
  return next();
});

router
  .get("/", async (req, res) => {
    const universities = await getUniversities();
    return res.render("admin", { universities });
  })
  .get("/universities/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const university = await getUniversity(id);
      const courses = await getCourses(id);
      return res.render("edit-university", { university, courses });
    } catch (e) {
      return res.status(e.status).send(e);
    }
  })
  .post("/universities", async (req, res) => {
    const { name, location } = req.body;
    try {
      const university = await createUniversity({ name, location });
      return res.status(200).json(university);
    } catch (e) {
      return res.status(e.status).send(e);
    }
  })
  .patch("/universities/:id", async (req, res) => {
    const { id } = req.params;
    const { name, location } = req.body;
    try {
      const university = await updateUniversity(id, { name, location });
      return res.status(200).json(university);
    } catch (e) {
      console.error(e);
      return res.status(e.status).send(e);
    }
  })
  .delete("/universities/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await deleteUniversity(id);
      return res.status(200).json({ message: "University deleted" });
    } catch (e) {
      return res.status(e.status).send(e);
    }
  })
  .get("/courses/:id", async (req, res) => {
    return res.render("edit-course")
  })

export default router;
