/* eslint-disable class-methods-use-this */
import TaskStorage from "./data/task-storage.js";
import Task from "./task.js";

export class TaskService {
  constructor(storage) {
    this.storage = storage || new TaskStorage();
    this.tasks = [ ];
  }

  loadData() {
    this.tasks = this.storage.getAll().map(task => new Task({
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      creationDate: task.creationDate,
      dueDate: task.dueDate,
      isCompleted: task.isCompleted,
    }))

  }

  save() {
    this.storage.update(this.tasks)
  }

  clear() {
    this.storage.clear()
  }

  createTaskId() {
    return this.tasks.length + 1;
  }

  addTask(task) {
    const newTask = new Task({
      id: this.createTaskId(),
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate
    });

    this.tasks.push(newTask);
    this.save();
  }

  updateTask(task) {
    this.getTaskById(task.id)
    if (this.findTask) {
      this.findTask.setTask(task);
      this.save()
    }
  }

  getTaskById(taskId) {
    this.findTask = this.tasks.find(item => item.id.toString() === taskId.toString())
    return this.findTask;
  }

  completeTask({taskId, isChecked}) {
    const task = this.tasks.find(item => item.id.toString() === taskId.toString());
    if (task) {
      task.setComplete(isChecked)
      this.save()
    }
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
