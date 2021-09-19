import {nanoid} from "nanoid";

export const STATE_EMPTY = `empty`;

export const Status = {
    BACKLOG: 'backlog',
    PROCESSING: 'processing',
    DONE: 'done',
    BASKET: 'basket',
};

export const StatusLabel = {
    [Status.BACKLOG]: 'Бэклог',
    [Status.PROCESSING]: 'В процессе',
    [Status.DONE]: 'Готово',
    [Status.BASKET]: 'Корзина',
};

export const Text = {
    EMPTY_TASK: 'Перетащите карточку',
    EMPTY_BASKET: 'Корзина пуста',
    NEW_TASK: 'Новая задача',
};

export const RenderPosition = {
    AFTERBEGIN: 'afterbegin',
    BEFOREEND: 'beforeend',
};

export const UserAction = {
    UPDATE_TASK: 'UPDATE_TASK',
    ADD_TASK: 'ADD_TASK',
    DELETE_TASK: 'DELETE_TASK',
    DRAGGED_TASK: 'DRAGGED_TASK'
};

export const UpdateType = {
    PATCH: 'PATCH',
    MINOR: 'MINOR',
};

export const Mode = {
    DEFAULT: 'DEFAULT',
    EDITING: 'EDITING',
    ADD: 'ADD'
}

export const DEFAULT_TASK = {
    id: nanoid(),
    title: '',
    status: 'backlog'
}