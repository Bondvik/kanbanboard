import Observer from "../observer";

export default class TasksModel extends Observer {
    constructor() {
        super();
        this._tasks = [];
    }

    setTasks(tasks) {
        this._tasks = tasks.slice();
    }


    getTasks() {
        return this._tasks;
    }

    addTask(updateType, update) {
        this._tasks = [
            update,
            ...this._tasks,
        ];

        this._notify(updateType, update);
    }

    deleteTasks(updatedType, ids) {
        this._tasks = this._tasks.filter((task) => !ids.includes(task.id));

        this._notify(updatedType);
    }

    updatePosition(updateType, update, prevTaskId) {
        const taskIndex = this._getTaskIndexByID(update.id);

        this._tasks.splice(taskIndex, 1);
        if (prevTaskId !== undefined) {
            const prevTaskIndex = this._tasks.findIndex((el) => el.id === prevTaskId);
            this._tasks.splice(prevTaskIndex + 1, 0, update);
        } else {
            this._tasks.unshift(update);
        }

        this._notify(updateType, update);
    }

    _getTaskIndexByID(id) {
        return this._tasks.findIndex((el) => el.id === id);
    }

    setDraggedElement(taskElement) {
        this._draggedElement = taskElement;
    }

    getDraggedElement() {
        return this._draggedElement;
    }
}