//Источник: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/random
import {RenderPosition} from "./constants";
import Abstract from "./view/abstract";

export const getRandomNumber = function(min, max) {
    let minValue =  Math.ceil(min);
    let maxValue = Math.floor(max);
    if (min < 0 || max < 0) {
        return;
    }
    if (min === max) {
        return min;
    }
    if (min > max) {
        minValue = Math.ceil(max);
        maxValue = Math.floor(min);
    }
    return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
};

export const createElement = (template) => {
    const newElement = document.createElement('div'); // 1
    newElement.innerHTML = template; // 2

    return newElement.firstChild; // 3
};
// Единственный нюанс, что HTML в строке должен иметь общую обёртку,
// то есть быть чем-то вроде <nav><a>Link 1</a><a>Link 2</a></nav>,
// а не просто <a>Link 1</a><a>Link 2</a>

export const render = (container, element, place) => {
    switch (place) {
        case RenderPosition.AFTERBEGIN:
            container.prepend(element);
            break;
        case RenderPosition.BEFOREEND:
            container.append(element);
            break;
    }
};

export const remove = (component) => {
    if (component === null) {
        return;
    }

    component.getElement().remove();
    component.removeElement();
};

export const renderDraggedElement = (container, element, referenceElement) => {
    if (container instanceof Abstract) {
        container = container.getElement();
    }

    if (element instanceof Abstract) {
        element = element.getElement();
    }
    container.insertBefore(element, referenceElement);
}

export const replace = (newChild, oldChild) => {
    if (oldChild instanceof Abstract) {
        oldChild = oldChild.getElement();
    }

    if (newChild instanceof Abstract) {
        newChild = newChild.getElement();
    }

    const parent = oldChild.parentElement;

    if (parent === null || oldChild === null || newChild === null) {
        throw new Error('Can\'t replace unexisting elements');
    }

    parent.replaceChild(newChild, oldChild);
};