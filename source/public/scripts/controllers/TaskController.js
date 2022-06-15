import { taskService } from "../services/task-service.js";

export default class TaskController {
  constructor() {
    this.themeButton = document.querySelector("#theme-button");
    this.viewButtons = document.querySelectorAll(".button-view[data-view-action]");
    this.sortButtons = document.querySelectorAll(".button-sort[data-sort-by]")
    this.taskList = document.querySelector("#task-list")
    this.taskForm = document.querySelector("#task-form")
    this.mainContent = document.querySelector(".main-content[data-view]")
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

  // Task Button handler
  async taskClickEventHandler(event) {
    const {taskId, taskAction} = event.target.dataset
    switch (taskAction) {
      case "edit":
        this.task = await taskService.getTaskById(taskId)
        this.setFormData();
        this.taskForm.setAttribute("data-save-type", "update");
        this.changeView("form");
        break;
      case "complete":
        this.task = await taskService.getTaskById(taskId);
        await taskService.updateTask({...this.task, isCompleted: event.target.checked, state: event.target.checked ? "COMPLETED" :  "OPEN"})
        await this.getTaskList()
        break;
      case "delete":
        await taskService.deleteTask(taskId);
        break;
      default:
        break;
    }
  }

  // Rendering Cards
  showTaskListHTML(tasks) {
    return tasks
      .map((task) => `
        <li class="task-item-container" id="task-item-container" data-is-completed="${task.isCompleted.toString()}">
          <div class="task-state" data-task-state="${taskService.getTaskState(task.isCompleted)}"></div>
          <div class="task-title">
            <p class="todo-item-title">${task.title}</p>
          </div>
          <div class="task-complete">
            <div>
              <input type="checkbox" name="state-checkbox" id="task-state-checkbox" ${taskService.getTaskState(
                task.isCompleted
              )} data-task-id="${task._id}" data-task-action="complete">
              <label for="task-state-checkbox">${taskService.getTaskStateText(
                task.isCompleted
              )}</label>
            </div>
            <button class="task-button" data-task-id="${task._id}" data-task-action="delete">
              <i class="fa-solid fa-trash-can fa-lg" data-task-id="${task._id}" data-task-action="delete"></i>
            </button>
            <button class="task-button" data-task-id="${task._id}" data-task-action="edit">
              <i class="fa-solid fa-pen fa-lg" data-task-id="${task._id}" data-task-action="edit"></i>
            </button>
          </div>
          <div class="task-due-date">
            ${taskService.showDaysUntil(task)}
          </div>
          <div class="task-description">
            <p class="todo-item-description">${task.description}</p>
          </div>
          <div class="task-priority">
            ${taskService.showPrioritySymbols({
              priority: task.priority,
              activeHtml: '<i class="fa-solid fa-bolt fa-lg active-priority"></i>',
              inactiveHtml: '<i class="fa-solid fa-bolt fa-lg inactive-priority"></i>',
            })}
          </div>
        </li> `
      ).join("");
  }

  // Filter event
  async taskFilterEventHandler(event) {
    const {sortBy, sortOrder} = event.target.dataset;
    let taskList;
    switch (sortBy) {
      case "name":
        if(sortOrder === "asc") {
          taskList = await taskService.getTasksSorted("title", 1)
          document.querySelector("#button-by-name").setAttribute("data-sort-order", "desc" );
        } else {
          taskList = await taskService.getTasksSorted("title", -1)
          document.querySelector("#button-by-name").setAttribute("data-sort-order", "asc");
        }
        break;
      case "due-date":
        if(sortOrder === "asc") {
          taskList = await taskService.getTasksSorted("dueDate", 1)
          document.querySelector("#button-due-date").setAttribute("data-sort-order", "desc" );
        } else {
          taskList = await taskService.getTasksSorted("dueDate", -1)
          document.querySelector("#button-due-date").setAttribute("data-sort-order", "asc");
        }
        break;
      case "created-date":
        if(sortOrder === "asc") {
          taskList = await taskService.getTasksSorted("creationDate", 1)
          document.querySelector("#button-created-date").setAttribute("data-sort-order", "desc" );
        } else {
          taskList = await taskService.getTasksSorted("creationDate", -1)
          document.querySelector("#button-created-date").setAttribute("data-sort-order", "asc");
        }
        break;
      case "priority":
        if(sortOrder === "asc") {
          taskList = await taskService.getTasksSorted("priority", 1)
          document.querySelector("#button-priority").setAttribute("data-sort-order", "desc" );
        } else {
          taskList = await taskService.getTasksSorted("priority", -1)
          document.querySelector("#button-priority").setAttribute("data-sort-order", "asc");
        }
        break;
      case "reset":
        taskList = await taskService.getTasks()
        document.querySelector("#task-list").classList.remove("hide-completed")
        document.querySelector("#button-filter").classList.remove("button-sort-active");
        break;
      case "hideCompleted":
        document.querySelector("#task-list").classList.toggle("hide-completed");
        document.querySelector("#button-filter").classList.toggle("button-sort-active")
        break;
      default:
        break
    }
    if (taskList) {
      this.renderTaskList(taskList)
    }
  }

  initEventHandlers() {
    this.themeButton.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme")
    });

    this.viewButtons.forEach(element => element.addEventListener("click", (event) => {
      event.preventDefault()
      this.changeView(event.target.dataset.viewAction)
      this.taskForm.setAttribute("data-save-type", "add")
      this.taskForm.reset();
      })
    )

    this.sortButtons.forEach(element => element.addEventListener("click", (event) =>{
      this.taskFilterEventHandler(event)
    }))

    this.taskList.addEventListener("click", (event) => {
      this.taskClickEventHandler(event);
    })

    // Submit Task
    this.taskForm.addEventListener("submit", async (event) => {
      event.preventDefault()
      switch (event.target.dataset.saveType) {
        case "add":
          await taskService.createTask({
            title: document.querySelector("#title-id").value,
            description: document.querySelector("#description-id").value,
            priority: document.querySelector("#priority-id").value,
            dueDate: document.querySelector("#due-date-id").value
          })
          await this.getTaskList();
          break;

        case "update":
          await taskService.updateTask({
            ...this.task,
            title: document.querySelector("#title-id").value,
            description: document.querySelector("#description-id").value,
            priority: document.querySelector("#priority-id").value,
            dueDate: document.querySelector("#due-date-id").value
          })
          break;
        default:
          break;
      }

      await this.getTaskList();
      this.changeView("list");
    })
  }

  renderTaskList(taskList) {
    if (taskList.length === 0) {
      this.taskList.innerHTML = `<div><p>Keine Todos</p></div>`
    } else {
      this.taskList.innerHTML = this.showTaskListHTML(taskList)
    }
  }

  async getTaskList() {
    const taskList = await taskService.getTasks()
    this.renderTaskList(taskList)
  }

  initialize() {
    this.initEventHandlers();
    this.getTaskList();
  }
}

new TaskController().initialize()
