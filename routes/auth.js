import { Router } from "express";
import { loginSchema } from "../data/validation.js";
import { login } from "../data/auth.js";

const router = Router();

router
  .get("/login", async (req, res) => {
    res.render("login");
  })
  .post("/login", async (req, res) => {
    const { body } = req;
    const parseResults = loginSchema.safeParse(body);
    if (!parseResults.success) {
      return res.status(400).json({ message: "Bad request" });
    }
    const { email, password } = parseResults.data;
    try {
      const user = await login({ email, password });
      req.session.user = user;
      return res.status(200).json(user);
    } catch (e) {
      return res.status(e.status).send(e);
    }
  });

export default router;
