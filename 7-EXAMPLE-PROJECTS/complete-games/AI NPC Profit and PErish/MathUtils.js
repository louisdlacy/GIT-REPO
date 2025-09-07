"use strict";
// INTERPOLATION
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lerp = Lerp;
exports.RandomInt = RandomInt;
function Lerp(a, b, alpha) {
    return a + ((b - a) * alpha);
}
// RANDOM
function RandomInt(min, max) {
    return Math.floor(Math.random() * ((max - min) + 1) + min);
}
