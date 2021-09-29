import {Text} from "../constants";
import Abstract from "./abstract";

export default class FormView extends Abstract {
    constructor() {
        super();
    }

    getTemplate() {
        return (
            `<section class="add-task">
                <h2 class="visually-hidden">Добавить задачу</h2>
                <form class="add-task__form" aria-label="Форма добавления задачи" autocomplete="off">
                  <div class="add-task__input-wrapper">
                      <label for="add-task">${Text.NEW_TASK}</label>
                        <input
                            autocomplete="off" 
                            type="text" 
                            name="task-name" 
                            id="add-task" placeholder="Название задачи..." required>
                  </div>
                  <button class="add-task__button button" type="submit">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="10.0833" y="3.66663" width="1.83333" height="14.6667" fill="white" />
                      <rect x="18.3333" y="10.0833" width="1.83333" height="14.6667" transform="rotate(90 18.3333 10.0833)"
                        fill="white" />
                    </svg>
                    <span>Добавить</span>
                  </button>
                </form>
            </section>`
        )
    }
}