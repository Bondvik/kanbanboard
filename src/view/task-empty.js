import {STATE_EMPTY, Text} from "../constants";
import Abstract from "./abstract";

export default class TaskEmptyView extends Abstract {
    constructor(title = Text.EMPTY_TASK) {
        super();
        this._title = title;
    }
    getTemplate() {
        return (
            `<div class="taskboard__item task task--${STATE_EMPTY}">
                <p>${this._title}</p>
            </div>`
        );
    }
}