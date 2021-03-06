import TaskBoardGroupView from "../view/taskboard-group";
import {render, renderDraggedElement} from '../utils';
import {RenderPosition} from "../constants";

export default class ListPresenter {
    constructor(boardComponent, tasksModel) {
        this._boardComponent = boardComponent;
        this._tasksModel = tasksModel;
        this._listComponent = null;
        this._taskBoardListContainer = null;

        this._handleListDragover = this._handleListDragover.bind(this);
    }

    init(status) {
        this._listComponent = new TaskBoardGroupView(status);
        this._listComponent.setListDragoverHandler(this._handleListDragover);
        render(this._boardComponent, this._listComponent.getElement(), RenderPosition.BEFOREEND);
        this._taskBoardListContainer = this._listComponent.getElement().querySelector('.taskboard__list');
    }

    _handleListDragover(evt) {
        //перетаскиваемый элемент
        const draggedElement = this._tasksModel.getDraggedElement();

        //тот элемент на который падает draggedElement (перетаскиваемый элемент)
        const droppedItem = evt.target;

        //если событие произошло на том элементе, который мы перемещаем
        if (droppedItem === draggedElement) {
            return;
        }

        //находим referenceElement - элемент, ПЕРЕД которым будет вставлен
        //перемещаемый элемент draggedElement
        const referenceElement = (droppedItem === draggedElement.nextElementSibling) ?
           droppedItem.nextElementSibling : droppedItem;

        //смена статуса задачи
        const oldTaskStatus = `task--${draggedElement.dataset.status}`;
        const newTaskStatus = `task--${this._listComponent.getElement().dataset.status}`;
        draggedElement.classList.remove(oldTaskStatus);
        draggedElement.classList.add(newTaskStatus);
        draggedElement.dataset.status = this._listComponent.getElement().dataset.status;

        if (this._taskBoardListContainer.querySelector('.button--clear')) {
            this._taskBoardListContainer.querySelector('.button--clear').remove();
        }

        if (droppedItem.classList.contains('task')) {
            renderDraggedElement(this._taskBoardListContainer, draggedElement, referenceElement);
        }

        //если в родительском листе нет ни одного целевого элемента (droppedItem)
        if (this._taskBoardListContainer.children.length === 0) {
            render(this._taskBoardListContainer, draggedElement, RenderPosition.BEFOREEND);
        }
    }
}