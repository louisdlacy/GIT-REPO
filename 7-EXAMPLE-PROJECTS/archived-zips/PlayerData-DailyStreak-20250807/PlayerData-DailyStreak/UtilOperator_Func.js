"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operatorUtils = void 0;
exports.operatorUtils = {
    getDaySinceEpoch,
    toLocaleString,
    getRandomNumberFromRange,
};
const msInADay = 1000 * 60 * 60 * 24;
function getDaySinceEpoch() {
    return Math.floor(Date.now() / msInADay);
}
function toLocaleString(separator, num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}
/**
 * @param isInteger when true, returns a whole value, not inclusive of the end number
 */
function getRandomNumberFromRange(start, end, isInteger) {
    const randomResult = start + (Math.random() * (end - start));
    if (isInteger) {
        return Math.floor(randomResult);
    }
    else {
        return randomResult;
    }
}
