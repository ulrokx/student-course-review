import fs from "fs";

const constructorMethod = async (app) => {
  const files = fs.readdirSync("routes");
  files.forEach(async (path) => {
    if (path === "index.js") {
      return;
    }
    const { pathPrefix, router } = await import(`./${path}`);
    app.use(pathPrefix, router);
  });
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Route Not found" });
  });
};

export default constructorMethod;
