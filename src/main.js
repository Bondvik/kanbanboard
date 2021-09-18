import {nanoid} from "nanoid";
import {RenderPosition, Status} from "./constants";
import {createTask} from "./data";
import {render} from "./utils";
import HeaderView from "./view/header";
import FormView from "./view/form";
import TaskBoardView from "./view/task-board";
import TaskBoardGroupView from "./view/taskboard-group";
import TaskView from "./view/task";

const TASK_COUNT = 3;

const tasks = new Array(TASK_COUNT).fill().map(createTask);

const boardElement = document.querySelector('.board-app');
const boardInnerElement = boardElement.querySelector('.board-app__inner');
let taskBoardGroupElements = null;

render(boardElement, new HeaderView('Канбан-доска').getElement(), RenderPosition.AFTERBEGIN);
const formComponent = new FormView();
render(boardInnerElement, formComponent.getElement(), RenderPosition.AFTERBEGIN);

const renderTask = (taskBoardGroup, task, status) => {
    const taskComponent = new TaskView(task);
    taskComponent.getElement().classList.add(`task--${status}`);
    render(taskBoardGroup, taskComponent.getElement(), RenderPosition.BEFOREEND);
}

const renderBoard = (boardContainer, tasks) => {
    const boardComponent = new TaskBoardView();
    render(boardContainer, boardComponent.getElement(), RenderPosition.BEFOREEND);

    const taskBoardElement = boardInnerElement.querySelector('.taskboard');
    Object.values(Status).forEach((status) => {
        render(taskBoardElement, new TaskBoardGroupView(status).getElement(), RenderPosition.BEFOREEND);
    });

    taskBoardGroupElements = taskBoardElement.querySelectorAll('.taskboard__group');

    for (let i = 0; i < taskBoardGroupElements.length; i++) {
        for (let k = 0; k < tasks.length; k++) {
            if (taskBoardGroupElements[i].dataset.status === tasks[k].status) {
                const taskBoardList = taskBoardGroupElements[i].querySelector('.taskboard__list');
                renderTask(taskBoardGroupElements[i], tasks[k], tasks[k].status);
            }
        }
    }
}

renderBoard(boardInnerElement, tasks);

const addNewTask = (title) => (tasks.unshift({
    id: nanoid(),
    title,
    status: 'backlog',
}));

const formElement = document.querySelector('form');

formElement.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const titleElement = document.querySelector('#add-task');
    if (titleElement.value.trim() === '') {
        return
    }
    addNewTask(titleElement.value);
    const task = tasks.find((item) => item.title === titleElement.value);
    const taskComponent = new TaskView(task);

    if (taskBoardGroupElements[0].dataset.status === 'backlog') {
        const taskBoardList = taskBoardGroupElements[0].querySelector('.taskboard__list');
        render(taskBoardList, taskComponent.getElement(), RenderPosition.AFTERBEGIN);
    }

    titleElement.value = '';
    titleElement.focus();
});
