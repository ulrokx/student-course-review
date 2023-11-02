import express from "express";
import configRoutes from "./routes/index.js";
import session from "express-session";

const app = express();
app.use(
  session({
    secret: process.env.SESSION_SECRET || "necco",
  }),
);

await configRoutes(app);

app.use(express.json());

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
