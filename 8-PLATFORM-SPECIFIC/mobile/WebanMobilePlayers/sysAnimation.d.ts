import * as hz from 'horizon/core';
declare enum ValueType {
    UNKNOWN = 0,
    NUMBER = 1,
    VEC3 = 2,
    QUATERNION = 3,
    COLOR = 4
}
type validTypes = number | hz.Vec3 | hz.Color | hz.Quaternion;
declare class AnimationInfo {
    fromValue: validTypes;
    toValue: validTypes;
    overMs: number;
    valueType: ValueType;
    startTime: number;
    endTime: number;
    complete: boolean;
    easing: (t: number) => number;
    callback: (value: validTypes, pctComplete: number) => void;
    constructor(_from: validTypes, _to: validTypes, _overMs: number, callback: (value: validTypes, pctComplete: number) => void, easing?: (t: number) => number);
}
export declare class sysAnimation {
    private moveTos;
    private scaleTos;
    private rotateTos;
    private colorTos;
    animations: Record<string, AnimationInfo>;
    private updateEvent;
    private parentComponent;
    constructor(_parentComponent: hz.Component);
    animateTo(fromValue: validTypes, toValue: validTypes, overMs: number, callback: (value: validTypes, pctComplete: number) => void, easing?: (t: number) => number): string;
    colorBy(entity: hz.Entity, relativeColor: hz.Color, overMs: number, onComplete?: () => void, easing?: (t: number) => number): void;
    colorTo(entity: hz.Entity, toColor: hz.Color, overMs: number, onComplete?: () => void, easing?: (t: number) => number): void;
    rotateBy(entity: hz.Entity, relativeRotation: hz.Quaternion, overMs: number, onComplete?: () => void, easing?: (t: number) => number): void;
    rotateTo(entity: hz.Entity, toRotation: hz.Quaternion, overMs: number, onComplete?: () => void, easing?: (t: number) => number): void;
    moveBy(entity: hz.Entity, relativePosition: hz.Vec3, overMs: number, onComplete?: () => void, easing?: (t: number) => number): void;
    moveTo(entity: hz.Entity, toPosition: hz.Vec3, overMs: number, onComplete?: () => void, easing?: (t: number) => number): void;
    scaleTo(entity: hz.Entity, toScale: hz.Vec3, overMs: number, onComplete?: () => void, easing?: (t: number) => number): void;
    private cancel;
    update(): void;
    private calcNumber;
    private calcVec3;
    private calcColor;
    private calcQuaternion;
    private dot;
    private negate;
    private makeid;
}
export declare const Easing: {
    linear: (t: number) => number;
    quadratic: (t: number) => number;
    cubic: (t: number) => number;
    elastic: (t: number) => number;
    inQuad: (t: number) => number;
    outQuad: (t: number) => number;
    inOutQuad: (t: number) => number;
    inCubic: (t: number) => number;
    outCubic: (t: number) => number;
    inOutCubic: (t: number) => number;
    inQuart: (t: number) => number;
    outQuart: (t: number) => number;
    inOutQuart: (t: number) => number;
    inQuint: (t: number) => number;
    outQuint: (t: number) => number;
    inOutQuint: (t: number) => number;
    inSine: (t: number) => number;
    outSine: (t: number) => number;
    inOutSine: (t: number) => number;
    inExpo: (t: number) => number;
    outExpo: (t: number) => number;
    inOutExpo: (t: number) => number;
    inCirc: (t: number) => number;
    outCirc: (t: number) => number;
    inOutCirc: (t: number) => number;
    inBack: (t: number) => number;
    outBack: (t: number) => number;
    inOutBack: (t: number) => number;
};
export {};
