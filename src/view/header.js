import Abstract from "./abstract";

export default class HeaderView extends Abstract {
    constructor(name) {
        super();
        this._name = name;
        this._element = null;
    }

    getTemplate() {
        return (
            `<header class="board-app__header">
                <div class="board-app__inner">
                    <h1>${this._name}</h1>
                </div>
            </header>`
        )
    }
}