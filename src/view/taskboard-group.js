import Abstract from "./abstract";
import {StatusLabel} from "../constants";

export default class TaskBoardGroupView extends Abstract {
    constructor(status) {
        super();
        this._element = null;
        this._status = status;

        this._listDragoverHandler = this._listDragoverHandler.bind(this);
    }

    getTemplate() {
        return (
            `<article class="taskboard__group taskboard__group--${this._status}" data-status="${this._status}">
                <h3 class="taskboard__group-heading taskboard__group-heading--${this._status}">${StatusLabel[this._status]}</h3>
                <div class="taskboard__list"></div>
            </article>`
        )
    }

    _listDragoverHandler(evt) {
        evt.preventDefault();
        this._callback.listDragover(evt);
    }

    setListDragoverHandler(callback) {
        this._callback.listDragover = callback;
        this.getElement().addEventListener('dragover', this._listDragoverHandler);
    }
}