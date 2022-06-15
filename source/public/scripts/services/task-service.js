import TaskStorage from "./data/task-storage.js";
import Task from "./task.js";
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

  getTaskState(isChecked) {
    return isChecked ? "checked" : "";
  }

  getTaskStateText(isChecked) {
    return isChecked ? "erledigt" : "offen"
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

  // Calculate Days until finish
  showDaysUntil(task) {
    if (task.dueDate && !task.isCompleted) {
      this.dateToday = new Date();
      this.dueDate = new Date(task.dueDate);
      this.dateDifference = this.dueDate.getTime() - this.dateToday.getTime();
      this.daysUntil = Math.ceil(this.dateDifference / (1000 * 60 * 60 * 24));

      return `<span class="task-item-due-date">Noch ${this.daysUntil} Tage</span>`
    }
    return ``;
  }

  sortList(sortBy) {
    return this.tasks.sort(sortBy)
  }
}

export const taskService = new TaskService();
