
const themeButton = document.getElementById("theme-button")
const addTodoButton = document.getElementById("addTodo-button")
const closeAddTodoButton = document.getElementById('close-addTodo-button')

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme")
})

addTodoButton.addEventListener("click", () => {
  document.getElementById("todo-input-section").style.height = "12rem"
})

closeAddTodoButton.addEventListener("click", () => {
  document.getElementById("todo-input-section").style.height= "0"
})