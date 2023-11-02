import express from "express";
import configRoutes from "./routes/index.js";

const app = express();

await configRoutes(app);

app.use(express.json());

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
