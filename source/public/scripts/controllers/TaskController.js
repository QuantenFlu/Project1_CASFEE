import { taskService } from "../services/task-service.js";
import {viewService} from "../services/view-service.js"

export default class TaskController {
  constructor() {
    this.themeButton = document.querySelector("#theme-button");
    this.viewButtons = document.querySelectorAll(
      ".button-view[data-view-action]"
    );
    this.sortButtons = document.querySelectorAll(".button-sort[data-sort-by]");
    this.taskList = document.querySelector("#task-list");
    this.taskForm = document.querySelector("#task-form");
    this.mainContent = document.querySelector(".main-content[data-view]");
  }

  setEmptyListHtml(text) {
    this.taskList.innerHTML = `
      <div class="no-tasks-list">
        <p>${text}</p>
        <i class="fa-solid fa-face-grin fa-10x"></i>
      </div>`;
  }

  changeView(view) {
    this.mainContent.dataset.view = view;
  }

  setFormData() {
    document.querySelector("#title-id").value = this.task.title;
    document.querySelector("#description-id").value = this.task.description;
    document.querySelector("#due-date-id").value = this.task.dueDate;
    document.querySelector("#priority-id").value = this.task.priority;
  }

  showTaskListHTML(tasks) {
    return tasks
      .map(
        (task) => `
        <li class="task-item-container" data-is-completed="${
          task.isCompleted
        }">
          <div class="task-state" data-task-state="${taskService.getTaskState(
          task.isCompleted,
          task.dueDate
        )}"></div>
          <div class="task-title">
            <span>${task.title}</span>
          </div>
          <div class="task-due-date">
              <span>${taskService.getFormatedDate(task.dueDate)}</span>
          </div>
          <div class="task-button-container">
            <button class="task-button" data-task-id="${
          task._id
        }" data-task-action="complete" data-task-state=${task.state}>
            <i class="fa-solid fa-check fa-lg" data-task-id="${
          task._id
        }" data-task-action="complete"></i>
            </button>
            
            <button class="task-button" data-task-id="${
          task._id
        }" data-task-action="edit">
              <i class="fa-solid fa-pen fa-lg" data-task-id="${
          task._id
        }" data-task-action="edit"></i>
            </button>
          </div>
          <div class="task-delete-container">
            <button class="task-button" data-task-id="${
          task._id
        }" data-task-action="delete">
              <i class="fa-solid fa-trash-can fa-lg" data-task-id="${
          task._id
        }" data-task-action="delete"></i>
            </button>
          </div>
          <div class="task-description">
            <span class="todo-item-description">${task.description}</span>
          </div>
          <div class="task-priority">
            ${taskService.showPrioritySymbols({
          priority: task.priority,
          activeHtml:
            '<i class="fa-solid fa-bolt fa-lg active-priority"></i>',
          inactiveHtml:
            '<i class="fa-solid fa-bolt fa-lg inactive-priority"></i>',
        })}
          </div>
        </li> `
      )
      .join("");
  }

  async taskClickEventHandler(event) {
    const { taskId, taskAction } = event.target.dataset;
    switch (taskAction) {
      case "edit":
        this.task = await taskService.getTaskById(taskId);
        this.setFormData();
        this.taskForm.setAttribute("data-save-type", "update");
        this.changeView("form");
        break;
      case "complete":
        this.task = await taskService.getTaskById(taskId);
        await taskService.updateTask({
          ...this.task,
          isCompleted: !this.task.isCompleted,
          state: this.task.isCompleted ? "OPEN" : "COMPLETED",
        });
        await this.getTaskList();
        break;
      case "delete":
        await taskService.deleteTask(taskId);
        await this.getTaskList();
        break;
      default:
        break;
    }
  }

  async taskFilterEventHandler(event) {
    const { sortBy, sortOrder } = event.target.dataset;
    let taskList;
    switch (sortBy) {
      case "name":
        if (sortOrder === "asc") {
          taskList = await taskService.getTasksSorted("title", 1);
          document
            .querySelector("#button-by-name")
            .setAttribute("data-sort-order", "desc");
        } else {
          taskList = await taskService.getTasksSorted("title", -1);
          document
            .querySelector("#button-by-name")
            .setAttribute("data-sort-order", "asc");
        }
        break;
      case "due-date":
        if (sortOrder === "asc") {
          taskList = await taskService.getTasksSorted("dueDate", 1);
          document
            .querySelector("#button-due-date")
            .setAttribute("data-sort-order", "desc");
        } else {
          taskList = await taskService.getTasksSorted("dueDate", -1);
          document
            .querySelector("#button-due-date")
            .setAttribute("data-sort-order", "asc");
        }
        break;
      case "created-date":
        if (sortOrder === "asc") {
          taskList = await taskService.getTasksSorted("creationDate", 1);
          document
            .querySelector("#button-created-date")
            .setAttribute("data-sort-order", "desc");
        } else {
          taskList = await taskService.getTasksSorted("creationDate", -1);
          document
            .querySelector("#button-created-date")
            .setAttribute("data-sort-order", "asc");
        }
        break;
      case "priority":
        if (sortOrder === "asc") {
          taskList = await taskService.getTasksSorted("priority", 1);
          document
            .querySelector("#button-priority")
            .setAttribute("data-sort-order", "desc");
        } else {
          taskList = await taskService.getTasksSorted("priority", -1);
          document
            .querySelector("#button-priority")
            .setAttribute("data-sort-order", "asc");
        }
        break;
      case "reset":
        taskList = await taskService.getTasks();
       this.taskList.classList.remove("hide-completed");
        document
          .querySelector("#button-filter")
          .classList.add("button-sort-active");
        break;
      case "hideCompleted":
        taskList = await taskService.getTasks();
        this.taskList.classList.toggle("hide-completed");
        document
          .querySelector("#button-filter")
          .classList.toggle("button-sort-active");
        break;
      default:
        break;
    }
    if (taskList) {
      this.renderTaskList(taskList);
    }
  }

  async taskFormSave(saveType) {
    switch (saveType) {
      case "add":
        await taskService.createTask({
          title: document.querySelector("#title-id").value,
          description: document.querySelector("#description-id").value,
          priority: document.querySelector("#priority-id").value,
          dueDate: document.querySelector("#due-date-id").value,
        });
        break;

      case "update":
        await taskService.updateTask({
          ...this.task,
          title: document.querySelector("#title-id").value,
          description: document.querySelector("#description-id").value,
          priority: document.querySelector("#priority-id").value,
          dueDate: document.querySelector("#due-date-id").value,
        });
        break;
      default:
        break;
    }
  }

  initEventHandlers() {
    this.themeButton.addEventListener("click", () => {
      viewService.changeTheme();
    });

    this.viewButtons.forEach((element) =>
      element.addEventListener("click", (event) => {
        event.preventDefault();
        this.changeView(event.target.dataset.viewAction);
        this.taskForm.setAttribute("data-save-type", "add");
        this.taskForm.reset();
      })
    );

    this.sortButtons.forEach((element) =>
      element.addEventListener("click", async (event) => {
        await this.taskFilterEventHandler(event);
      })
    );

    this.taskList.addEventListener("click", async (event) => {
      await this.taskClickEventHandler(event);
    });

    // Submit Task
    this.taskForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      await this.taskFormSave(event.target.dataset.saveType);

      await this.getTaskList();
      this.changeView("list");
    });
  }

  renderTaskList(taskList) {
    if (taskList.length === 0) {
      this.setEmptyListHtml("Noch keine Todos");
    } else if (this.taskList.classList.contains("hide-completed") && taskList.filter(task => task.isCompleted === false).length === 0) {
      this.setEmptyListHtml("Super, alle Todos erledigt")
    } else {
      this.taskList.innerHTML = this.showTaskListHTML(taskList);
    }
  }

  async getTaskList() {
    const taskList = await taskService.getTasks();
    this.renderTaskList(taskList);
  }

  initialize() {
    this.initEventHandlers();
    this.getTaskList()
  }
}

new TaskController().initialize();
