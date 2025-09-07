"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayUtils = void 0;
exports.arrayUtils = {
    removeItemFromArray,
    removeItemAtIndexFromArray,
    getRandomItemFromArray,
    removeItemsFromArray,
    shuffleArray,
    shuffleArrayInPlace,
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
/**
 * Randomly shuffle items from a given array, returned in a new array. Code courtesy of WaffleCopters, via "Fisher-Yates (Knuth) Shuffle Algorithm"
 * @param array to shuffle
 * @returns a new shuffled array
 */
function shuffleArray(array) {
    return shuffleArrayInPlace([...array]);
}
/**
 * Randomly shuffle items inside a given array. Code courtesy of WaffleCopters, via "Fisher-Yates (Knuth) Shuffle Algorithm"
 * @param array to shuffle
 * @returns the original array
 */
function shuffleArrayInPlace(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
