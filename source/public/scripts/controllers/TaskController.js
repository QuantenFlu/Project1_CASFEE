import { taskService } from "../services/task-service.js";

export default class TaskController {
  constructor() {
    this.themeButton = document.querySelector("#theme-button");
    this.viewButtons = document.querySelectorAll(".button-view[data-view-action]");
    this.sortButtons = document.querySelectorAll(".button-sort[data-sort-by]")
    this.taskList = document.querySelector("#task-list")
    this.taskForm = document.querySelector("#task-form")
    this.mainContent = document.querySelector(".main-content[data-view]")
    this.clearButton = document.querySelector("#remove-all-tasks-button");
    this.sortOrder = {
      ascAlph: (string1, string2) => {
        if(string1.toLowerCase() < string2.toLowerCase()) {return -1;}
        if(string1.toLowerCase() > string2.toLowerCase()) {return 1;}
        return 0;
      },
      descAlph: (string1, string2) => {
        if(string1.toLowerCase() < string2.toLowerCase()) {return 1;}
        if(string1.toLowerCase() > string2.toLowerCase()) {return -1;}
        return 0;
      },
      ascNumb: (numb1, numb2) => numb1 - numb2,
      descNumb: (numb1, numb2) => numb2 - numb1,
    }
  }

  changeView(view) {
    this.mainContent.dataset.view = view;
  }

  setFormData(task) {
    this.updateTask = task;
    document.querySelector("#title-id").value = task.title;
    document.querySelector("#description-id").value = task.description;
    document.querySelector("#due-date-id").value = task.dueDate;
    document.querySelector("#priority-id").value = task.priority;
  }

  // Task Button handler
  taskClickEventHandler(event) {
    const {taskId, taskAction} = event.target.dataset
    switch (taskAction) {
      case "edit":
        this.changeView("form");
        this.setFormData(taskService.getTaskById(taskId))
        this.taskForm.setAttribute("data-save-type", "update")
        break;
      case "complete":
        taskService.completeTask({
          taskId,
          isChecked: event.target.checked
        });
        break;
      default:
        break;
    }
  }

  // Rendering Cards
  // eslint-disable-next-line class-methods-use-this
  showTaskListHTML(tasks) {
    return tasks
      .map((task) => `
        <div class="task-item-container" id="task-item-container" data-is-completed="${task.isCompleted.toString()}">
          <div class="task-state" data-task-state="${taskService.getTaskState(task.isCompleted)}"></div>
          <div class="task-title">
            <p class="todo-item-title">${task.title}</p>
          </div>
          <div class="task-complete">
            <div>
              <input type="checkbox" name="state-checkbox" id="task-state-checkbox" ${taskService.getTaskState(
                task.isCompleted
              )} data-task-id="${task.id}" data-task-action="complete">
              <label for="task-state-checkbox">${taskService.getTaskStateText(
                task.isCompleted
              )}</label>
            </div>
            <button class="task-button" data-task-id="${task.id}" data-task-action="edit">
              <i class="fa-solid fa-pen fa-lg" data-task-id="${task.id}" data-task-action="edit"></i>
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
        </div> `
      ).join("");
  }

  // Filter event
  taskFilterEventHandler(event) {
    const {sortBy, sortOrder} = event.target.dataset;
    switch (sortBy) {
      case "name":
        if(sortOrder === "asc") {
          taskService.sortList((task1, task2) => this.sortOrder.ascAlph(task1.title, task2.title));
          document.querySelector("#button-by-name").setAttribute("data-sort-order", "desc" );
        } else {
          taskService.sortList((task1, task2) => this.sortOrder.descAlph(task1.title, task2.title));
          document.querySelector("#button-by-name").setAttribute("data-sort-order", "asc");
        }
        break;
      case "due-date":
        if(sortOrder === "asc") {
          taskService.sortList((task1, task2) => this.sortOrder.ascNumb(new Date(task1.dueDate).getTime(), new Date(task2.dueDate).getTime()))
          document.querySelector("#button-due-date").setAttribute("data-sort-order", "desc" );
        } else {
          taskService.sortList((task1, task2) => this.sortOrder.descNumb(new Date(task1.dueDate).getTime(), new Date(task2.dueDate).getTime()))
          document.querySelector("#button-due-date").setAttribute("data-sort-order", "asc");
        }
        // taskService.sortList((task1, task2) => new Date(task1.dueDate).getTime() - new Date(task2.dueDate).getTime())
        break;
      case "created-date":
        if(sortOrder === "asc") {
          taskService.sortList((task1, task2) => this.sortOrder.ascNumb(new Date(task1.creationDate).getTime(), new Date(task2.creationDate).getTime()));
          document.querySelector("#button-created-date").setAttribute("data-sort-order", "desc" );
        } else {
          taskService.sortList((task1, task2) => this.sortOrder.descNumb(new Date(task1.creationDate).getTime(), new Date(task2.creationDate).getTime()));
          document.querySelector("#button-created-date").setAttribute("data-sort-order", "asc");
        }
        // taskService.sortList((task1, task2) => new Date(task2.creationDate).getTime() - new Date(task1.creationDate).getTime())
        break;
      case "priority":
        if(sortOrder === "asc") {
          taskService.sortList((task1, task2) => this.sortOrder.ascNumb(task1.priority, task2.priority));
          document.querySelector("#button-priority").setAttribute("data-sort-order", "desc" );
        } else {
          taskService.sortList((task1, task2) => this.sortOrder.descNumb(task1.priority, task2.priority));
          document.querySelector("#button-priority").setAttribute("data-sort-order", "asc");
        }
        // taskService.sortList((task1, task2) => task2.priority - task1.priority)
        break;
      case "reset":
        taskService.sortList((task1, task2) => this.sortOrder.ascNumb(task1.id, task2.id));
        break;
      case "hideCompleted":
        document.querySelector("#task-list").classList.toggle("hide-completed");
        document.querySelector("#button-filter").classList.toggle("button-sort-active")
        break;
      default:
        break
    }
  }

  // Set initial event handlers
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

    this.clearButton.addEventListener("click",() => {
      taskService.clear();
    })

    this.sortButtons.forEach(element => element.addEventListener("click", (event) =>{
      this.taskFilterEventHandler(event)
      this.renderTaskList()
    }))

    this.taskList.addEventListener("click", (event) => {
      this.taskClickEventHandler(event);
      this.renderTaskList();
    })

    // Submit Task
    this.taskForm.addEventListener("submit", (event) => {
      event.preventDefault()
      switch (event.target.dataset.saveType) {
        case "add":
          taskService.addTask({
            title: document.querySelector("#title-id").value,
            description: document.querySelector("#description-id").value,
            priority: document.querySelector("#priority-id").value,
            dueDate: document.querySelector("#due-date-id").value
          })
          break;

        case "update":
          taskService.updateTask({
            id: this.updateTask.id,
            title: document.querySelector("#title-id").value,
            description: document.querySelector("#description-id").value,
            priority: document.querySelector("#priority-id").value,
            dueDate: document.querySelector("#due-date-id").value
          })
          break;
        default:
          break;
      }

      this.changeView("list");
      this.renderTaskList();
    })
  }

  renderTaskList() {
    if (taskService.tasks.length === 0) {
      this.taskList.innerHTML = `<div><p>Keine Todos</p></div>`
    } else {
      this.taskList.innerHTML = this.showTaskListHTML(taskService.tasks)
    }
  }

  initialize() {
    this.initEventHandlers();
    taskService.loadData();
    this.renderTaskList();
  }
}

new TaskController().initialize()
