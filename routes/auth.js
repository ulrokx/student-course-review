import { Router } from "express";
import { loginSchema, registerSchema } from "../data/validation.js";
import { login, register } from "../data/auth.js";

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
        .render("error", {
          status: 400,
          message: parseResults.error.issues[0].message,
        });
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
    res.render("register");
  })
  .post("/register", async (req, res) => {
    const { body } = req;
    const parseResults = registerSchema.safeParse(body);
    if (!parseResults.success) {
      return res
        .status(400)
        .render("register", { error: parseResults.error.issues[0].message });
    }
    try {
      await register(parseResults.data);
      return res.redirect("/auth/login");
    } catch (e) {
      return res
        .status(e.status)
        .render("error", { status: e.status, message: e });
    }
  })
  .get("/logout", async (req, res) => {
    req.session.destroy();
    return res.redirect("/");
  });

export default router;
