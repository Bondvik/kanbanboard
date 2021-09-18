import Abstract from "./abstract";
import {STATE_EMPTY, Text} from "../constants";

export default class TaskEmptyView extends Abstract {
    getTemplate() {
        return (
            `<div class="taskboard__item task task--${STATE_EMPTY}">
                <p>${Text.EMPTY_TASK}</p>
            </div>`
        );
    }
}