export default class TaskStorage {
  constructor() {
    const tasks = localStorage.getItem("task-list") ? JSON.parse(localStorage.getItem("task-list")) : []
    this.tasks = tasks
    localStorage.setItem("task-list", JSON.stringify(tasks))
  }

  getAll() {
    return this.tasks
  }

  update(tasks) {
    localStorage.setItem("task-list", JSON.stringify(tasks));
    return this.tasks
  }

  clear() {
    this.tasks = [];
    localStorage.clear()
  }
}
