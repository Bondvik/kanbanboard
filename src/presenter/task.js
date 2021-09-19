import TaskView from "../view/task";
import {remove, render} from "../utils";
import {RenderPosition, UpdateType, UserAction, Mode, DEFAULT_TASK} from "../constants";
import {nanoid} from "nanoid";

export default class TaskPresenter {
    constructor(taskBoardGroup, handleViewAction) {
        this._taskBoardGroup = taskBoardGroup;
        this._handleViewAction = handleViewAction;

        this._task = null;
        this._mode = Mode.DEFAULT;
        this._taskComponent = null;
    }

    init(task) {
        if (task.id === DEFAULT_TASK.id) {
            const titleElement = document.querySelector('#add-task');
            if (titleElement.value.trim() === '') {
                return
            }
            this._task = Object.assign({}, task, {
                id: nanoid(),
                title: titleElement.value
            })
            this._handleViewAction(
                UserAction.ADD_TASK,
                UpdateType.MINOR,
                this._task
            );
            titleElement.value = '';
            titleElement.focus();
            return;
        }
        this._task = task;
        this._taskComponent = new TaskView(this._task);
        render(this._taskBoardGroup, this._taskComponent.getElement(), RenderPosition.BEFOREEND);
    }

    destroy() {
        remove(this._taskComponent);
    }
}