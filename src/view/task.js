import Abstract from "./abstract";

export default class TaskView extends Abstract {
    constructor(task = {}) {
        super();
        this._task = task;
        this._element = null;
    }

    getTemplate() {
        const {id, title, status} = this._task;
        return (
            `<div class="taskboard__item task" data-id="${id}" data-status="${status}">
                <div class="task__body">
                    <p class="task__view">${title}</p>
                    <input class="task__input" type="text" value="${title}">
                </div>
                <button class="task__edit" type="button" aria-label="Изменить"></button>
            </div>`
        )
    }
}