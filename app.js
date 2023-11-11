import express from "express";
import configRoutes from "./routes/index.js";
import session from "express-session";
import { engine } from "express-handlebars";
import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";
import Handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.engine(
  "handlebars",
  engine({
    partialsDir: [path.join(__dirname, "views/partials")],
  }),
);
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(
  session({
    secret: process.env.SESSION_SECRET || "necco",
  }),
);
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

await configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
