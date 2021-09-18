import Abstract from "./abstract";

export default class TaskBoardView extends Abstract {
    getTemplate() {
        return (
            `<section class="taskboard">
                <h2 class="visually-hidden">Ваши задачи:</h2>
            </section>`
        )
    }
}