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