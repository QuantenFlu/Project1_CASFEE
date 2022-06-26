import { taskStore } from "../services/task-store.js";

export class TasksController {
  async getTasks(req, res) {
    const orderBy = req.query.orderBy || "creationDate";
    const sortBy = req.query.sortBy || 1;
    switch (orderBy) {
      case "creationDate":
        res.json(await taskStore.getAll({ creationDate: sortBy }));
        break;
      case "dueDate":
        res.json(await taskStore.getAll({ dueDate: sortBy }));
        break;
      case "title":
        res.json(await taskStore.getAll({ title: sortBy }));
        break;
      case "priority":
        res.json(await taskStore.getAll({ priority: sortBy }));
        break;
      default:
        res.json(await taskStore.getAll());
        break;
    }
  }

  async createTask(req, res) {
    res.json(await taskStore.add(req.body.task));
  }

  async showTask(req, res) {
    res.json(await taskStore.get(req.params.id));
  }

  async updateTask(req, res) {
    res.json(await taskStore.update(req.body.task));
  }

  async deleteTask(req, res) {
    res.status(204).json(await taskStore.delete(req.params.id));
  }
}

export const tasksController = new TasksController();
