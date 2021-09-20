import {RenderPosition, Status} from "./constants";
import {createTask} from "./data";
import {render} from "./utils";
import TasksModel from "./model/tasks";
import HeaderView from "./view/header";
import Board from "./presenter/board";

const TASK_COUNT = 3;

const tasks = new Array(TASK_COUNT).fill().map(createTask);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const boardElement = document.querySelector('.board-app');
const boardInnerElement = boardElement.querySelector('.board-app__inner');

const headerComponent = new HeaderView('Канбан-доска');

render(boardElement, headerComponent.getElement(), RenderPosition.AFTERBEGIN);

const boardPresenter = new Board(boardInnerElement, tasksModel);
boardPresenter.init();

const formElement = document.querySelector('form');
formElement.addEventListener('submit', (evt) => {
    evt.preventDefault();
    boardPresenter.createTask();
});