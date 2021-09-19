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
}