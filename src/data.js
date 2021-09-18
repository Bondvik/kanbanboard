import {getRandomNumber} from './utils.js';
import {Status} from './constants.js';
import {nanoid} from 'nanoid';

const titles = [
    'Купить корм',
    'Сделать домашку',
    'Защитить проект',
    'Погладить кота',
    'Выучить JS',
    'Выпить смузи',
    'Выучить Angular',
    'Сделать канбан-доску',
    'Позвонить бабушке'
];

export const createTask = () => {
    const statuses = Object.values(Status);
    return {
        id: nanoid(),
        title: titles[getRandomNumber(0, titles.length - 1)],
        status: statuses[getRandomNumber(0, statuses.length - 1)]
    };
}