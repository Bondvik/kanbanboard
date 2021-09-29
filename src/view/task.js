import Abstract from "./abstract";

export default class TaskView extends Abstract {
    constructor(task = {}) {
        super();
        this._task = task;
        this._element = null;

        this._taskDragstartHandler = this._taskDragstartHandler.bind(this);
        this._taskDragendHandler = this._taskDragendHandler.bind(this);
        this._editClickHandler = this._editClickHandler.bind(this);
    }

    getTemplate() {
        const {id, title, status} = this._task;
        return (
            `<div class="taskboard__item task" data-id="${id}" data-status="${status}" draggable="true">
                <div class="task__body">
                    <p class="task__view">${title}</p>
                    <input class="task__input" type="text" value="${title}">
                </div>
                <button class="task__edit" type="button" aria-label="Изменить"></button>
            </div>`
        )
    }

    _editClickHandler(evt) {
        evt.preventDefault();
        this._callback.editClick();
    }

    _taskDragendHandler(evt) {
        this._callback.taskDragend(evt);
    }

    _taskDragstartHandler() {
        this._callback.taskDragstart();
    }

    setTaskDragendHandler(callback) {
        this._callback.taskDragend = callback;
        this.getElement().addEventListener('dragend', this._taskDragendHandler);
    }

    setTaskDragstartHandler(callback) {
        this._callback.taskDragstart = callback;
        this.getElement().addEventListener('dragstart', this._taskDragstartHandler);
    }

    setEditClickHandler(callback) {
        this._callback.editClick = callback;
        this.getElement().querySelector('.task__edit').addEventListener('click', this._editClickHandler);
    }

}