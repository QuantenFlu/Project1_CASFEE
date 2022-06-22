import TaskStorage from "./data/task-storage.js";
import { httpService } from "./http-service.js";

export class TaskService {
  constructor(storage) {
    this.storage = storage || new TaskStorage();
    this.tasks = [ ];
  }

  async createTask(task) {
    return httpService.ajax("POST", "/tasks/", {task});
  }

  async getTasks() {
    return httpService.ajax("GET", "/tasks/", undefined);
  }

  async getTaskById(id) {
    return httpService.ajax("GET", `/tasks/${id}`, undefined)
  }

  async getTasksSorted(orderBy, sort) {
    return httpService.ajax("GET", `/tasks/?orderBy=${orderBy}&sortBy=${sort}`, undefined)
  }

  async updateTask(task) {
    return httpService.ajax("PATCH", `/tasks/${task._id}`, {task})
  }

  async deleteTask(id) {
    return httpService.ajax("DELETE", `/tasks/${id}`, undefined);
  }

  getTaskState(isCompleted, dueDate) {
    const timeStampToday = Date.now();
    const timeStampDueDate = new Date(dueDate).getTime();

    if (isCompleted) {
      return "checked"
    }

    if (timeStampDueDate < timeStampToday) {
      return "overdue";
    }

    return  "";
  }

  getFormatedDate(dueDate) {
    const date = new Date(dueDate);
    const year = date.getFullYear();
    let month = date.getMonth()+1;
    let dt = date.getDate();

    if (dt < 10) {
      dt = `0${  dt}`;
    }
    if (month < 10) {
      month = `0${  month}`;
    }
    return `${dt  }.${  month  }.${  year}`
  }

  // Create Symbols for Priority indicator
  showPrioritySymbols({priority, activeHtml, inactiveHtml}) {
    this.symbol = ``;
    for (let i = 0; i < priority; i++) {
      this.symbol += activeHtml;
    }
    for (let i = priority; i < 4; i++) {
      this.symbol += inactiveHtml;
    }
    return this.symbol;
  }

}

export const taskService = new TaskService();
