import TaskBoardView from "../view/task-board";
import {render} from "../utils";
import FormView from "../view/form";
import {DEFAULT_TASK, Mode, RenderPosition, Status, UpdateType, UserAction} from "../constants";
import TaskBoardGroupView from "../view/taskboard-group";
import TaskPresenter from "./task";

export default class Board {
    constructor(boardContainer, tasksModel) {
        this._boardContainer = boardContainer;
        this._tasksModel = tasksModel;

        this._boardComponent = new TaskBoardView();
        this._formComponent = new FormView();

        this._taskBoardGroupElements = null;
        this._taskNewPresenter = null;
        this._tasks = null;
        this._taskPresenter = {};

        this._handleViewAction = this._handleViewAction.bind(this);
        this._handleModelTask = this._handleModelTask.bind(this);

    }

    init() {
        this._tasks = this._tasksModel.getTasks().slice();

        this._tasksModel.addObserver(this._handleModelTask);

        render(this._boardContainer, this._boardComponent.getElement(), RenderPosition.BEFOREEND);
        render(this._boardContainer, this._formComponent.getElement(), RenderPosition.AFTERBEGIN);

        this._renderTaskBoardGroup();
        this._renderBoard();

        this._taskNewPresenter = new TaskPresenter(this._taskBoardGroupElements[0], this._handleViewAction);
    }

    createTask() {
        this._taskNewPresenter.init(DEFAULT_TASK);
    }

    _handleViewAction(actionType, updateType, update) {
        // console.log(actionType, updateType, update);
        // Здесь будем вызывать обновление модели.
        // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
        // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
        // update - обновленные данные
        switch (actionType) {
            case UserAction.ADD_TASK:
                this._tasksModel.addTask(updateType, update);
                break;
        }
    }

    _handleModelTask(updateType, data) {
        // console.log(updateType, data);
        // В зависимости от типа изменений решаем, что делать:
        // - обновить часть списка (например, когда поменялось описание)
        // - обновить список (например, когда задача ушла в архив)
        // В зависимости от типа изменений решаем, что делать:
        switch (updateType) {
            case UpdateType.MINOR:
                this._clearTaskList();
                this._renderTasks();
                break;
        }
    }

    _renderTaskBoardGroup() {
        const taskBoardElement = document.querySelector('.taskboard');
        Object.values(Status).forEach((status) => {
            render(taskBoardElement, new TaskBoardGroupView(status).getElement(), RenderPosition.BEFOREEND);
        });
    }

    _renderTasks() {
        // Метод для рендеринга задач
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
        const taskPresenter = new TaskPresenter(taskBoardGroup, this._handleViewAction);
        taskPresenter.init(task);
        //чтобы сохранить задачи и в последующем идентифицировать конкретную задачу
        this._taskPresenter[task.id] = taskPresenter;
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