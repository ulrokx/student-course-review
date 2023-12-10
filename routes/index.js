import authRouter from "./auth.js";
import adminRouter from "./admin.js";
import homeRouter from "./home.js";
import universitiesRouter from "./universities.js";
import coursesRouter from "./courses.js";
import reviewsRouter from "./reviews.js";

const constructorMethod = async (app) => {
  app.use("/", homeRouter);
  app.use("/auth", authRouter);
  app.use("/admin", adminRouter);
  app.use("/universities", universitiesRouter);
  app.use("/courses", coursesRouter);
  app.use("/reviews", reviewsRouter);
  app.use("*", (req, res) => {
    res.render("error", { status: 404, message: "Page not found" });
  });
};

export default constructorMethod;
