import { Router } from "express";
import { loginSchema, registerSchema } from "../data/validation.js";
import { login, register } from "../data/auth.js";

const router = Router();

router
  .get("/login", async (req, res) => {
    res.render("login");
  })
  .post("/login", async (req, res) => {
    const { body } = req;
    const parseResults = loginSchema.safeParse(body);
    if (!parseResults.success) {
      return res
        .status(400)
        .json({ message: parseResults.error.issues[0].message });
    }
    try {
      const user = await login(parseResults.data);
      req.session.user = user;
      return res.status(200).json(user);
    } catch (e) {
      return res.status(e.status).send(e);
    }
  })
  .get("/register", async (req, res) => {
    res.render("register");
  })
  .post("/register", async (req, res) => {
    const { body } = req;
    const parseResults = registerSchema.safeParse(body);
    if (!parseResults.success) {
      return res
        .status(400)
        .json({ message: parseResults.error.issues[0].message });
    }
    try {
      const user = await register(parseResults.data);
      req.session.user = user;
      return res.status(200).json(user);
    } catch (e) {
      return res.status(e.status).send(e);
    }
  });

export default router;
