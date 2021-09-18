import Abstract from "./abstract";
import {StatusLabel} from "../constants";

export default class TaskBoardGroupView extends Abstract {
    constructor(status) {
        super();
        this._element = null;
        this._status = status;
    }

    getTemplate() {
        return (
            `<article class="taskboard__group taskboard__group--${this._status}" data-status="${this._status}">
                <h3 class="taskboard__group-heading taskboard__group-heading--${this._status}">${StatusLabel[this._status]}</h3>
                <div class="taskboard__list"></div>
            </article>`
        )
    }
}