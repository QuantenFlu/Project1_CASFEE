import Datastore from "nedb-promises";

export class Task {
  constructor({ title, description, priority, dueDate }) {
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.creationDate = new Date();
    this.dueDate = dueDate;
    this.isCompleted = false;
    this.state = "OPEN";
  }
}

export class TaskStore {
  constructor(db) {
    const options = { filename: "./source/data/task.db", autoload: true };
    this.db = db || new Datastore(options);
  }

  async add({ title, description, priority, dueDate }) {
    const task = new Task({ title, description, priority, dueDate });
    return this.db.insert(task);
  }

  async delete(id) {
    await this.db.update({ _id: id }, { $set: { state: "DELETED" } });
  }

  async update(task) {
    return this.db.update(
      { _id: task._id },
      {
        $set: {
          title: task.title,
          description: task.description,
          priority: task.priority,
          dueDate: task.dueDate,
          isCompleted: task.isCompleted,
          state: task.state
        },
      }
    );
  }

  async get(id) {
    return this.db.findOne({ _id: id });
  }

  async getAll(sortBy) {
    return (this.db.find({$or: [{state: "OPEN"}, {state: "COMPLETED"}]}).sort(sortBy).exec());
  }
}

export const taskStore = new TaskStore();
