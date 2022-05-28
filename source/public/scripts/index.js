const themeButton = document.querySelector("#theme-button");
const addTaskButton = document.querySelector("#addTodo-button");
const closeAddTaskButton = document.querySelector("#close-add-task-button");
const taskList = document.querySelector("#task-list");
const taskForm = document.querySelector("#task-form");
const sortByPrioButton = document.querySelector("#button-priority");
const sortByDueDateButton = document.querySelector("#button-due-date");
const sortByCreationButton = document.querySelector("#button-created-date");
const sortByNameButton = document.querySelector("#button-by-name");
const sortResetButton = document.querySelector("#button-reset")
const taskListElement = document.querySelector("#task-list");
const darkMode = localStorage.getItem("dark-theme");
const taskStorage = localStorage.getItem("task-list")
  ? JSON.parse(localStorage.getItem("task-list"))
  : [];

const enableDarkMode = () => {
  document.body.classList.add("dark-theme");
  localStorage.setItem("dark-theme", "enabled");
};

const disableDarkMode = () => {
  document.body.classList.remove("dark-theme");
  localStorage.setItem("dark-theme", "disabled");
};

if (darkMode === "enabled") {
  enableDarkMode();
}

themeButton.addEventListener("click", () => {
  const mode = localStorage.getItem("dark-theme");
  if (mode === "disabled") {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});

function Task(title, description, priority, creationDate, dueDate, completed) {
  this.id = creationDate;
  this.title = title;
  this.description = description;
  this.priority = priority;
  this.creationDate = creationDate;
  this.dueDate = dueDate;
  this.completed = completed;
}

function sortByDueDate(task1, task2) {
  return task1.dueDate - task2.dueDate;
}

function sortByCreatedDate(task1, task2) {
  return task1.creationDate - task2.creationDate;
}

function sortByPriority(task1, task2) {
  return task2.priority - task1.priority;
}

function sortByName(task1, task2) {
  if(task1.title.toLowerCase() < task2.title.toLowerCase()) { return -1; }
  if(task1.title.toLowerCase() > task2.title.toLowerCase()) { return 1; }
  return 0;
}

function getTaskState(isChecked) {
  return isChecked ? "checked" : ""
}

function getStateText(isChecked) {
  return isChecked ? "erledigt" : "offen";
}

function createDaysUntil(task) {
  if (task.dueDate && !task.completed) {
    const dateToday = new Date();
    const dueDate = new Date(task.dueDate);
    const dateDifference = dueDate.getTime() - dateToday.getTime();
    const daysUntil = Math.ceil(dateDifference / (1000 * 60 * 60 * 24));

    return `<span class="task-item-due-date">Noch ${daysUntil} Tage</span>`;
  }

  return ``;
}

function createPrioritySign(priority) {
  let symbol = ``;
  for (let i = 0; i < priority; i++) {
    symbol += `<i class="fa-solid fa-bolt active-priority fa-lg"></i>`;
  }
  for (let i = priority; i < 4; i++) {
    symbol += `<i class="fa-solid fa-bolt inactive-priority fa-lg"></i>`;
  }
  return symbol;
}

function createTaskListHTML(tasks) {
  return tasks.map(
    (task) => `
 <div class="task-item-container" id="task-item-container">
    <div class="task-state"></div>
    <div class="task-title">
      <p class="todo-item-title">${task.title}</p>
    </div>
    <div class="task-complete">
      <div>
        <input type="checkbox" name="state-checkbox" id="task-state-checkbox" ${getTaskState(task.completed)} data-task-id="${task.id}" data-task-func="complete">
        <label for="task-state-checkbox">${getStateText(task.completed)}</label>
      </div>
      <button class="task-container-button task-button" data-task-id="${task.id}" data-task-func="edit">
        <i class="fa-solid fa-pen fa-lg task-button" data-task-id="${task.id}" data-task-func="edit"></i>
      </button>
      
    </div>
    <div class="task-due-date">
      ${createDaysUntil(task)}
    </div>
    <div class="task-description">
      <p class="todo-item-description">${task.description}</p>
    </div>
    <div class="task-priority">
      ${createPrioritySign(task.priority)}
    </div>
  </div>  `
  ).join('');
}

function renderList(tasks) {
  if (tasks.length === 0) {
    taskList.innerHTML = `<div><p>Keine Todos</p></div>`;
  } else {
    taskListElement.innerHTML = createTaskListHTML(tasks)
  }
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const createDate = new Date().getTime();
  const dueDate = new Date(
    document.querySelector("#due-date-id").value
  ).getTime();

  const newTask = new Task(
    document.querySelector("#title-id").value,
    document.querySelector("#description-id").value,
    document.querySelector("#priority-id").value,
    createDate,
    dueDate,
    false
  );

  taskStorage.push(newTask);
  localStorage.setItem("task-list", JSON.stringify(taskStorage));
  taskForm.reset();
  renderList(taskStorage)

  document.querySelector("#list-wrapper").style.display = "block";
  document.querySelector("#form-wrapper").style.display = "none";
});

function completeTask({tasks, taskId, isChecked}) {
  const index = tasks.findIndex((task =>task.id.toString() === taskId))
  // eslint-disable-next-line no-param-reassign
  tasks[index].completed = isChecked
  localStorage.setItem("task-list", JSON.stringify(tasks));
  renderList(tasks)
}

function taskClickEventHandler(event) {
  const {taskId} = event.target.dataset
  switch (event.target.dataset.taskFunc) {
    case "edit" :
      break;
    case "complete" :
      completeTask({tasks: taskStorage, taskId, isChecked: event.target.checked});
      break;

    default:
      break;
  }

}

taskListElement.addEventListener("click", taskClickEventHandler)

addTaskButton.addEventListener("click", () => {
  document.querySelector("#list-wrapper").style.display = "none";
  document.querySelector("#form-wrapper").style.display = "block";
});

closeAddTaskButton.addEventListener("click", () => {
  document.querySelector("#list-wrapper").style.display = "block";
  document.querySelector("#form-wrapper").style.display = "none";
});

sortByPrioButton.addEventListener("click", () => {
  renderList([...taskStorage].sort(sortByPriority));
});

sortByDueDateButton.addEventListener("click", () => {
  renderList([...taskStorage].sort(sortByDueDate));
});

sortByCreationButton.addEventListener("click", () => {
  renderList([...taskStorage].sort(sortByCreatedDate));
})

sortByNameButton.addEventListener("click", () => {
  renderList([...taskStorage].sort(sortByName));
})

sortResetButton.addEventListener("click", () => {
  const tasks = JSON.parse(localStorage.getItem("task-list"))
  renderList(tasks);
})

renderList(taskStorage);
