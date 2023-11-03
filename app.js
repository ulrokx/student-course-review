import express from "express";
import configRoutes from "./routes/index.js";
import session from "express-session";
import {engine} from "express-handlebars"

const app = express();
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')
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
