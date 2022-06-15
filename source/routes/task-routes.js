import express from "express";
import {tasksController} from "../controller/tasks-controller.js";

const router = express.Router();

router.get("/", tasksController.getTasks);
router.post("/", tasksController.createTask);
router.get("/:id/", tasksController.showTask);
router.patch("/:id/", tasksController.updateTask);
router.delete("/:id/", tasksController.deleteTask);


export const taskRoutes = router
