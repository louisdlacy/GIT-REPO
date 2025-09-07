"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayUtils = void 0;
exports.arrayUtils = {
    removeItemFromArray,
    removeItemAtIndexFromArray,
    getRandomItemFromArray,
    removeItemsFromArray,
};
function removeItemFromArray(array, item) {
    const itemIndex = array.indexOf(item);
    if (itemIndex >= 0) {
        array.splice(itemIndex, 1);
    }
}
function removeItemAtIndexFromArray(array, index) {
    if (index >= 0 && index < array.length) {
        array.splice(index, 1);
    }
}
function getRandomItemFromArray(array) {
    if (array.length > 0) {
        const randomIndex = Math.floor(array.length * Math.random());
        return array[randomIndex];
    }
    else {
        return undefined;
    }
}
function removeItemsFromArray(arrayToRemoveFrom, arrayOfItemsToRemove) {
    arrayOfItemsToRemove.forEach((item) => {
        removeItemFromArray(arrayToRemoveFrom, item);
    });
}
