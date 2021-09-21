import TaskView from "../view/task";
import {remove, render, replace} from "../utils";
import {RenderPosition, UpdateType, UserAction, Mode, DEFAULT_TASK} from "../constants";
import {nanoid} from "nanoid";
import TaskEditView from "../view/task-edit";

export default class TaskPresenter {
    constructor(taskBoardGroup, handleViewAction, tasksModel, handleModeChange) {
        this._taskBoardGroup = taskBoardGroup;
        this._handleViewAction = handleViewAction;
        this._tasksModel = tasksModel;
        this._handleModeChange = handleModeChange;

        this._mode = Mode.DEFAULT;

        this._task = null;
        this._updateTask = null;
        this._taskComponent = null;
        this._taskEditComponent = null;

        this._handleTaskDragstart = this._handleTaskDragstart.bind(this);
        this._handleTaskDragend = this._handleTaskDragend.bind(this);
        this._handleButtonClick = this._handleButtonClick.bind(this);
        this._handleInput = this._handleInput.bind(this);
        this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
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
        const prevTaskComponent = this._taskComponent;
        const prevTaskEditComponent = this._taskEditComponent;

        this._taskComponent = new TaskView(this._task);
        this._taskEditComponent = new TaskEditView(this._task);

        this._taskComponent.setTaskDragstartHandler(this._handleTaskDragstart);
        this._taskComponent.setTaskDragendHandler(this._handleTaskDragend);
        this._taskComponent.setEditClickHandler(this._handleButtonClick);
        this._taskEditComponent.setInputHandler(this._handleInput);

        this._taskComponent.getElement().classList.add(`task--${task.status}`);

        if (this._taskBoardGroup.querySelector('.task--empty')) {
            this._taskBoardGroup.querySelector('.task--empty').remove();
        }

        if (prevTaskComponent === null || prevTaskEditComponent === null) {
            render(this._taskBoardGroup,  this._taskComponent.getElement(), RenderPosition.BEFOREEND);
            return;
        }
        if (this._taskBoardGroup.contains(prevTaskComponent.getElement())) {
            replace(this._taskComponent, prevTaskComponent);
        }

        if (this._taskBoardGroup.contains(prevTaskEditComponent.getElement())) {
            replace(this._taskEditComponent, prevTaskEditComponent);
        }

        remove(prevTaskComponent);
        remove(prevTaskEditComponent);
    }

    destroy() {
        remove(this._taskComponent);
    }

    resetView() {
        if (this._mode !== Mode.DEFAULT) {
            this._replaceFormToCard();
        }
    }

    _replaceCardToForm() {
        replace(this._taskEditComponent, this._taskComponent);
        document.addEventListener('keydown', this._escKeyDownHandler);
        this._handleModeChange();
        this._mode = Mode.EDITING;
    }

    _replaceFormToCard() {
        replace(this._taskComponent, this._taskEditComponent);
        document.removeEventListener('keydown', this._escKeyDownHandler);
        this._mode = Mode.DEFAULT;
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

    _escKeyDownHandler(evt) {
        if (['Escape', 'Esc'].includes(evt.key)) {
            evt.preventDefault();
            this._replaceFormToCard();
            this._handleViewAction(
                UserAction.UPDATE_TASK,
                UpdateType.MINOR,
                Object.assign({}, this._task));
            document.removeEventListener('keydown', this._escKeyDownHandler);
        }
        if (['Enter'].includes(evt.key)) {
            evt.preventDefault();
            this._taskEditComponent.getElement().classList.remove('task--active');
            this._replaceFormToCard();
            if (!this._updateTask) {
                this._handleViewAction(
                    UserAction.UPDATE_TASK,
                    UpdateType.MINOR,
                    Object.assign({}, this._task));
            } else {
                this._handleViewAction(
                    UserAction.UPDATE_TASK,
                    UpdateType.MINOR,
                    Object.assign({}, this._task, {
                        title: this._updateTask
                    })
                )
            }
            document.removeEventListener('keydown', this._escKeyDownHandler);
        }
    }

    _handleButtonClick() {
        this._taskEditComponent.getElement().classList.add('task--active');
        this._replaceCardToForm();
        document.addEventListener('keydown', this._escKeyDownHandler);
    }

    _handleInput(task) {
        this._updateTask = task;
        document.addEventListener('keydown', this._escKeyDownHandler);
    }
}