export default class Task {
  constructor({id, title, description, priority, creationDate = Date.now() , dueDate, isCompleted = false}) {
    this.id = id
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.creationDate = creationDate;
    this.dueDate = dueDate;
    this.isCompleted = isCompleted;
  }

  setComplete(isCompleted) {
    this.isCompleted = isCompleted
  }

  setTask({title, description, priority, dueDate}) {
    this.title = title || this.title;
    this.description = description || this.description;
    this.priority = priority || this.priority;
    this.dueDate = dueDate || this.dueDate;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      priority: this.priority,
      creationDate: this.creationDate,
      dueDate: this.dueDate,
      isCompleted: this.isCompleted,
    };
  }
}
