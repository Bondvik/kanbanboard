import TaskBoardView from "../view/task-board";
import {render} from "../utils";
import FormView from "../view/form";
import {DEFAULT_TASK, RenderPosition, Status, UpdateType, UserAction} from "../constants";
import TaskPresenter from "./task";
import ListPresenter from "./list";
import TaskEmptyView from "../view/task-empty";
import BasketClearView from "../view/basket-clear";

export default class Board {
    constructor(boardContainer, tasksModel) {
        this._boardContainer = boardContainer;
        this._tasksModel = tasksModel;

        this._boardComponent = new TaskBoardView();
        this._formComponent = new FormView();
        this._basketClearView = new BasketClearView();
        this._listComponent = null;

        this._taskBoardGroupElements = null;
        this._taskNewPresenter = null;
        this._tasks = null;
        this._taskPresenter = {};

        this._handleViewAction = this._handleViewAction.bind(this);
        this._handleModelTask = this._handleModelTask.bind(this);
        this._handleClickDelete = this._handleClickDelete.bind(this);

    }

    init() {
        this._tasks = this._tasksModel.getTasks().slice();
        this._basketClearView.setCleanBasketHandler(this._handleClickDelete);

        this._tasksModel.addObserver(this._handleModelTask);

        render(this._boardContainer, this._boardComponent.getElement(), RenderPosition.BEFOREEND);
        render(this._boardContainer, this._formComponent.getElement(), RenderPosition.AFTERBEGIN);

        this._renderTaskList();
        this._renderBoard();
        this._renderNoTasks();
        this._renderButtonBasket();

        this._taskNewPresenter = new TaskPresenter(this._taskBoardGroupElements[0], this._handleViewAction);
    }

    createTask() {
        this._taskNewPresenter.init(DEFAULT_TASK);
    }

    _handleViewAction(actionType, updateType, update) {
        //console.log(actionType, updateType, update);
        // Здесь будем вызывать обновление модели.
        // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
        // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
        // update - обновленные данные
        switch (actionType) {
            case UserAction.ADD_TASK:
                this._tasksModel.addTask(updateType, update);
                break;
            case UserAction.UPDATE_TASK:
                this._tasksModel.updateTask(updateType, update);
                break;
            case UserAction.DELETE_TASKS:
                this._tasksModel.deleteTasks(updateType, update);
                break;
            case UserAction.DRAGGED_TASK:
                this._tasksModel.updatePosition(updateType, update, update.prevTaskId);
                break;
        }
    }

    _handleModelTask(updateType, data) {
        console.log(updateType, data);
        // В зависимости от типа изменений решаем, что делать:
        // - обновить часть списка (например, когда поменялось описание)
        // - обновить список (например, когда задача ушла в архив)
        // В зависимости от типа изменений решаем, что делать:
        switch (updateType) {
            case UpdateType.MINOR:
                this._clearTaskList();
                this._renderTasks();
                this._renderNoTasks();
                this._renderButtonBasket();
                break;
        }
    }

    _handleClickDelete() {
        const taskBoardGroupBasket = document.querySelector('.taskboard__group--basket .taskboard__list');
        let ids = [];
        for (const task of taskBoardGroupBasket.children) {
            ids.push(task.dataset.id);
        }
        this._handleViewAction (
            UserAction.DELETE_TASKS,
            UpdateType.MINOR,
            ids
        );
    }

    _renderTaskList() {
        const taskBoardElement = document.querySelector('.taskboard');
        Object.values(Status).forEach((status) => {
            this._listComponent = new ListPresenter(taskBoardElement, this._tasksModel);
            this._listComponent.init(status);
        })
    }

    _renderTasks() {
        this._tasks = this._tasksModel.getTasks().slice();
        this._taskBoardGroupElements = document.querySelectorAll('.taskboard__group');
        for (let i = 0; i < this._taskBoardGroupElements.length; i++) {
            for (let k = 0; k < this._tasks.length; k++) {
                if (this._taskBoardGroupElements[i].dataset.status === this._tasks[k].status) {
                    const taskBoardList = this._taskBoardGroupElements[i].querySelector('.taskboard__list');
                    this._renderTask(taskBoardList, this._tasks[k]);
                }
            }
        }
    }

    _renderTask(taskBoardGroup, task) {
        const taskPresenter = new TaskPresenter(taskBoardGroup, this._handleViewAction, this._tasksModel);
        taskPresenter.init(task);
        //чтобы сохранить задачи и в последующем идентифицировать конкретную задачу
        this._taskPresenter[task.id] = taskPresenter;
    }

    _renderNoTasks() {
        const boardListElements = document.querySelectorAll('.taskboard__list');
        boardListElements.forEach((listElement) => {
            if (listElement.children.length !== 0) {
                return
            }
            render(listElement, new TaskEmptyView().getElement(), RenderPosition.BEFOREEND);
        })
    }

    _renderButtonBasket() {
        const basketBoardContainer = document.querySelector(`.taskboard__group--basket`);
        const tasksInBasket = this._tasks.filter((task) => task.status === Status.BASKET);

        if (basketBoardContainer.querySelector('.button--clear')) {
            basketBoardContainer.querySelector('.button--clear').remove();
        }

        if (tasksInBasket.length !== 0) {
            render(basketBoardContainer, this._basketClearView.getElement(), RenderPosition.BEFOREEND);
        }
    }

    _renderBoard() {
        this._renderTasks();
    }

    _clearTaskList() {
        this._taskNewPresenter.destroy();
        Object
            .values(this._taskPresenter)
            .forEach((presenter) => presenter.destroy());
        this._taskPresenter = {};
    }
}