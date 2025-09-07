"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorUtils = void 0;
const core_1 = require("horizon/core");
exports.colorUtils = {
    lerpColor,
    tintMesh,
    areColorsEqual,
    isColorInArray,
    indexOfColorInArray,
    clampColorDecimalPlaces,
};
/**
* Lerp from the start color to the end color by some percent
* @param percent Number from 0 to 1
*/
function lerpColor(startColor, endColor, percent) {
    const colorVec = core_1.Vec3.lerp(startColor.toVec3(), endColor.toVec3(), percent);
    return new core_1.Color(colorVec.x, colorVec.y, colorVec.z);
}
/**
* Change the color of a MeshEntity
* @param color The color to apply
* @param meshEntity The entity to change
* @param tintStrength How saturated the color should be (number from 0 to 1, default of 1)
* @param brightness How bright the color should be (number from 0 to 1, default of 1)
*/
function tintMesh(color, meshEntity, tintStrength = 1, brightness = 1) {
    if (meshEntity) {
        meshEntity.style.tintColor.set(clampColor(color));
        meshEntity.style.tintStrength.set(Math.max(Math.min(tintStrength, 1), 0));
        meshEntity.style.brightness.set(Math.max(Math.min(brightness, 1), 0));
    }
}
function clampColor(color) {
    return new core_1.Color(Math.max(Math.min(color.r, 1), 0), Math.max(Math.min(color.g, 1), 0), Math.max(Math.min(color.b, 1), 0));
}
function areColorsEqual(colorA, colorB) {
    return (colorA.r === colorB.r && colorA.g === colorB.g && colorA.b === colorB.b); // || (colorA.toString() === colorB.toString())
}
function isColorInArray(color, colors) {
    return indexOfColorInArray(color, colors) !== undefined;
}
function indexOfColorInArray(color, colors) {
    const colorIndex = colors.findIndex((colorB) => exports.colorUtils.areColorsEqual(color, colorB));
    if (colorIndex >= 0) {
        return colorIndex;
    }
    else {
        return undefined;
    }
}
function clampColorDecimalPlaces(color) {
    const newColor = color.clone();
    newColor.r = parseFloat((newColor.r + 0.004).toFixed(2));
    newColor.g = parseFloat((newColor.g + 0.004).toFixed(2));
    newColor.b = parseFloat((newColor.b + 0.004).toFixed(2));
    return newColor;
}
