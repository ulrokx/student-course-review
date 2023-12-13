import { Router } from "express";
import { loginSchema, registerSchema } from "../data/validation.js";
import { login, register } from "../data/auth.js";
import { getUniversities } from "../data/universities.js";

const router = Router();

router.use((req, res, next) => {
  if (req.session.user && req.url !== "/logout") {
    return res.redirect("/");
  }
  next();
});

router
  .get("/login", async (req, res) => {
    res.render("login");
  })
  .post("/login", async (req, res) => {
    const { body } = req;
    const { redirect } = req.query;
    const parseResults = loginSchema.safeParse(body);
    if (!parseResults.success) {
      return res
        .status(400)
        .json({ message: parseResults.error.issues[0].message });
    }
    try {
      const user = await login(parseResults.data);
      req.session.user = user;
      return res.redirect(redirect ?? "/");
    } catch (e) {
      return res.status(e.status).render("login", { error: e.message });
    }
  })
  .get("/register", async (req, res) => {
    const universities = await getUniversities();
    res.render("register", { universities });
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
      await register(parseResults.data);
      return res.redirect("/auth/login");
    } catch (e) {
      return res.status(e.status).send(e);
    }
  })
  .get("/logout", async (req, res) => {
    req.session.destroy();
    return res.redirect("/");
  });

export default router;
