import '../styles/style.css';
import '../../node_modules/modern-normalize/modern-normalize.css';

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}

let tasks = getStorage();
let taskId = 0;

renderTasks(tasks);

document.querySelector('.go').addEventListener('click', onAddTaskButton);

function onAddTaskButton() {
  const inputText = document.querySelector('.doItem');
  const taskText = inputText.value;
  inputText.value = '';
  const newTask = { id: taskId++, title: taskText };
  tasks.push(newTask);
  saveStorage(tasks);
  renderTask(newTask.title, newTask.id);
}

function renderTask(taskTitle, id) {
  const itemList = document.querySelector('.itemList');
  const newTaskElement = document.createElement('div');
  newTaskElement.innerHTML = `
    <div class="task" data-task-id="${id}">
      <h1>${taskTitle}</h1>
      <button class="taskRemove">X</button>
    </div>
  `;
  itemList.appendChild(newTaskElement);
}

function saveStorage(taskList) {
  localStorage.setItem('task-list', JSON.stringify(taskList));
}

function getStorage() {
  const dataStr = localStorage.getItem('task-list');
  if (dataStr === null) {
    return [];
  }
  return JSON.parse(dataStr);
}

function renderTasks(taskList) {
  for (const task of taskList) {
    renderTask(task.title, task.id);
  }
}

document.querySelector('.itemList').addEventListener('click', onRemoveTaskClick);

function onRemoveTaskClick(e) {
  if (e.target.classList.contains('taskRemove')) {
    e.target.parentElement.remove();
    const taskId = Number.parseInt(e.target.parentElement.dataset.taskId);

    tasks = tasks.filter(function (elementFromArray) {
      return elementFromArray.id !== taskId;
    });

    saveStorage(tasks);

  }
}