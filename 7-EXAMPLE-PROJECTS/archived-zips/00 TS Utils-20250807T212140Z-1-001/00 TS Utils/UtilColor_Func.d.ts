import { Color, MeshEntity } from "horizon/core";
export declare const colorUtils: {
    lerpColor: typeof lerpColor;
    tintMesh: typeof tintMesh;
    areColorsEqual: typeof areColorsEqual;
    isColorInArray: typeof isColorInArray;
    indexOfColorInArray: typeof indexOfColorInArray;
    clampColorDecimalPlaces: typeof clampColorDecimalPlaces;
};
/**
* Lerp from the start color to the end color by some percent
* @param percent Number from 0 to 1
*/
declare function lerpColor(startColor: Color, endColor: Color, percent: number): Color;
/**
* Change the color of a MeshEntity
* @param color The color to apply
* @param meshEntity The entity to change
* @param tintStrength How saturated the color should be (number from 0 to 1, default of 1)
* @param brightness How bright the color should be (number from 0 to 1, default of 1)
*/
declare function tintMesh(color: Color, meshEntity: MeshEntity | undefined | null, tintStrength?: number, brightness?: number): void;
declare function areColorsEqual(colorA: Color, colorB: Color): boolean;
declare function isColorInArray(color: Color, colors: Color[]): boolean;
declare function indexOfColorInArray(color: Color, colors: Color[]): number | undefined;
declare function clampColorDecimalPlaces(color: Color): Color;
export {};
