import TaskView from "../view/task";
import {remove, render} from "../utils";
import {RenderPosition, UpdateType, UserAction, Mode, DEFAULT_TASK} from "../constants";
import {nanoid} from "nanoid";

export default class TaskPresenter {
    constructor(taskBoardGroup, handleViewAction, tasksModel) {
        this._taskBoardGroup = taskBoardGroup;
        this._handleViewAction = handleViewAction;
        this._tasksModel = tasksModel;

        this._task = null;
        this._taskComponent = null;

        this._handleTaskDragstart = this._handleTaskDragstart.bind(this);
        this._handleTaskDragend = this._handleTaskDragend.bind(this);
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
        this._taskComponent.setTaskDragstartHandler(this._handleTaskDragstart);
        this._taskComponent.setTaskDragendHandler(this._handleTaskDragend);
        this._taskComponent.getElement().classList.add(`task--${task.status}`);
        render(this._taskBoardGroup, this._taskComponent.getElement(), RenderPosition.BEFOREEND);
    }

    destroy() {
        remove(this._taskComponent);
    }

    _handleTaskDragstart() {
        this._taskComponent.getElement().setAttribute('draggable', true);
        this._taskComponent.getElement().classList.add('task--dragged');
        const draggedElement = this._taskComponent.getElement();
        this._tasksModel.setDraggedElement(draggedElement);
    }

    _handleTaskDragend() {
        const draggedElement = this._tasksModel.getDraggedElement();
        //для обновления позиции в массиве задач
        const prevTaskId = this._taskComponent.getElement().previousElementSibling ?
            this._taskComponent.getElement().previousElementSibling.dataset.id : undefined;
        if (draggedElement.dataset.status) {
            this._task.status = draggedElement.dataset.status;
            this._handleViewAction(
                UserAction.DRAGGED_TASK,
                UpdateType.MINOR,
                Object.assign({}, this._task, {prevTaskId})
            )
        }
        this._tasksModel.setDraggedElement(null);
        draggedElement.classList.remove('task--dragged');
        delete this._task.prevTaskId;
    }
}