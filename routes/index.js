import authRouter from "./auth.js";

const constructorMethod = async (app) => {
  app.use("/auth", authRouter);
  app.use("*", (req, res) => {
    res.render("error", { status: 404, message: "Page not found" });
  });
};

export default constructorMethod;
