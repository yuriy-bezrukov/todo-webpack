import '../styles/style.css';
import '../../node_modules/modern-normalize/modern-normalize.css';

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}

let tasks = getStorage();
let taskId = 0;
const TASK_LIST_STORAGE_KEY = 'task-list-storage';

renderTaskList(tasks);

const addTaskForm = document.querySelector('.add-task-form');
addTaskForm.addEventListener('submit', onAddTask);

function onAddTask(e) {
  e.preventDefault();
  const inputText = document.querySelector('.add-task-form__input');
  const newTask = { id: taskId++, title: inputText.value };
  inputText.value = '';
  tasks.push(newTask);
  saveStorage(tasks);
  renderTask(newTask);
}

function renderTask(task) {
  const itemList = document.querySelector('.task-list');
  const newTaskElement = document.createElement('div');
  newTaskElement.innerHTML = `
    <div class="task" data-task-id="${task.id}">
      <h1>${task.title}</h1>
      <button class="task__remove">X</button>
    </div>
  `;
  itemList.appendChild(newTaskElement);
}

function saveStorage(taskList) {
  localStorage.setItem(TASK_LIST_STORAGE_KEY, JSON.stringify(taskList));
}

function getStorage() {
  const dataStr = localStorage.getItem(TASK_LIST_STORAGE_KEY);
  if (dataStr === null) {
    return [];
  }
  return JSON.parse(dataStr);
}

function renderTaskList(taskList) {
  for (const task of taskList) {
    renderTask(task);
  }
}

const taskList = document.querySelector('.task-list');
taskList.addEventListener('click', onRemoveTask);

function onRemoveTask(e) {
  if (e.target.classList.contains('task__remove')) {
    e.target.parentElement.remove();
    const taskId = Number.parseInt(e.target.parentElement.dataset.taskId);

    tasks = tasks.filter(function (elementFromArray) {
      return elementFromArray.id !== taskId;
    });

    saveStorage(tasks);

  }
}