import authRouter from "./auth.js";
import adminRouter from "./admin.js";
import searchRouter from "./search.js";

const constructorMethod = async (app) => {
  app.use("/", searchRouter);
  app.use("/auth", authRouter);
  app.use("/admin", adminRouter);
  app.use("*", (req, res) => {
    res.render("error", { status: 404, message: "Page not found" });
  });
};

export default constructorMethod;
