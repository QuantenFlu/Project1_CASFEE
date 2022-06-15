import express from "express";
import bodyParser from "body-parser"
import path, {dirname} from "path";

import {fileURLToPath} from "url";
import { taskRoutes } from "./source/routes/task-routes.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const app = express();

app.use(express.static(path.resolve('source/public/html')))
app.use(express.static(path.resolve('source/public')))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile("/html/index.html", {root: __dirname + '/source/public/'});
})

app.use((req, res, next) => {
  console.log(req.body || "No Body, looks like GET");
  next();
})

app.use("/tasks", taskRoutes);
