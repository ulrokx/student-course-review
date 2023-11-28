import { Router } from "express";
import { getUniversity } from "../data/universities.js";
import { getCourses } from "../data/courses.js";
import { idSchema } from "../data/validation.js";

const router = Router();

router.route("/:id").get(async (req, res) => {
  const { id } = req.params;
  const parseResults = idSchema.safeParse(id);
  if (!parseResults.success) {
    return res
      .status(400)
      .json({ message: parseResults.error.issues[0].message });
  }

  try {
    const university = await getUniversity(parseResults.data);
    const courses = await getCourses(parseResults.data);
    res.render("university", { university, courses });
  } catch (e) {
    res.status(404).render("error", {
      status: 404,
      message: "University not found",
    });
  }
});

export default router;
