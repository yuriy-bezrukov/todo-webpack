import '../styles/style.scss';
import '../../node_modules/modern-normalize/modern-normalize.css';

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}

let taskId = 0;
const TASK_LIST_STORAGE_KEY = 'task-list-storage';

let tasks = getStorage();
renderTaskList(tasks);

const addTaskForm = document.querySelector('.add-task-form');
addTaskForm.addEventListener('submit', onAddTask);

function onAddTask(e) {
  e.preventDefault();
  const inputText = document.querySelector('.add-task-form__input');
  if (!inputText.value) {
    return;
  }
  const newTask = { id: taskId++, title: inputText.value };
  inputText.value = '';
  tasks.push(newTask);
  saveStorage(tasks);
  renderTask(newTask);
}

function renderTask(task) {
  const itemList = document.querySelector('.task-list');
  const newTaskElement = document.createElement('div');
  const taskClass = task.isClose ? 'task--closed' : '';
  newTaskElement.innerHTML = `
    <div class="task ${taskClass}" data-task-id="${task.id}">
      <input type="checkbox"${task.isClose ? 'checked' : ''} class="task__state-toggle" id="task__state-toggle-${task.id}">
      <label class="task__title" for="task__state-toggle-${task.id}">${task.title}</label>
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
taskList.addEventListener('change', onToggleTaskState);

function onToggleTaskState(e) {
  if (e.target.classList.contains('task__state-toggle')) {
    const taskId = Number.parseInt(e.target.parentElement.dataset.taskId);
    const isCloseTask = e.target.checked;
    let task = tasks.find(_task => _task.id === taskId);
    task.isClose = isCloseTask;
    saveStorage(tasks);

    if (isCloseTask) {
      e.target.parentElement.classList.add('task--closed');
    } else {
      e.target.parentElement.classList.remove('task--closed');
    }

  }
}

const inputTextElement = document.querySelector('.add-task-form__input');
inputTextElement.addEventListener('input', onInputTextNewTask);

function onInputTextNewTask(e) {
  const isActive = e.target.value;
  const addTaskButton = document.querySelector('.add-task-form__submit');
  if (isActive) {
    addTaskButton.classList.add('add-task-form__submit--active');
  } else {
    addTaskButton.classList.remove('add-task-form__submit--active');
  }
}