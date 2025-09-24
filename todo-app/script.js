// Selectors
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const clearCompleted = document.getElementById("clearCompleted");
const resetAll = document.getElementById("resetAll");

// Load tasks from localStorage
document.addEventListener("DOMContentLoaded", loadTasks);

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});
clearCompleted.addEventListener("click", clearCompletedTasks);
resetAll.addEventListener("click", resetTasks);

// Add Task
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const task = { text: taskText, completed: false };
  saveTask(task);
  renderTask(task);

  taskInput.value = "";
}

// Render a single task
function renderTask(task) {
  const li = document.createElement("li");
  li.className = "task" + (task.completed ? " completed" : "");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    updateStorage();
    li.classList.toggle("completed");
  });

  const span = document.createElement("span");
  span.textContent = task.text;

  const actions = document.createElement("div");
  actions.className = "actions";

  // Edit button
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "edit-btn";
  editBtn.onclick = () => editTask(span, task);

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn";
  deleteBtn.onclick = () => {
    li.remove();
    removeTask(task.text);
  };

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(actions);

  taskList.appendChild(li);
}

// Edit Task
function editTask(span, task) {
  const newText = prompt("Edit task:", span.textContent);
  if (newText !== null && newText.trim() !== "") {
    span.textContent = newText;
    task.text = newText;
    updateStorage();
  }
}

// Save Task in Local Storage
function saveTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTask(task);
}

// Get all tasks
function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

// Update storage
function updateStorage() {
  const tasks = [];
  document.querySelectorAll("#taskList .task").forEach(li => {
    tasks.push({
      text: li.querySelector("span").textContent,
      completed: li.classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks
function loadTasks() {
  const tasks = getTasks();
  tasks.forEach(task => renderTask(task));
}

// Clear completed tasks
function clearCompletedTasks() {
  document.querySelectorAll("#taskList .completed").forEach(li => li.remove());
  updateStorage();
}

// Reset all tasks
function resetTasks() {
  taskList.innerHTML = "";
  localStorage.removeItem("tasks");
}

// Remove single task
function removeTask(text) {
  let tasks = getTasks();
  tasks = tasks.filter(t => t.text !== text);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}