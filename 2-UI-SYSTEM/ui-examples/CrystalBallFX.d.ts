import * as hz from 'horizon/core';
export declare class CrystalBallFX extends hz.Component<typeof CrystalBallFX> {
    static propsDefinition: {
        crystalBallMesh: {
            type: "Entity";
        };
        smokeVFX: {
            type: "Entity";
        };
        light: {
            type: "Entity";
        };
        glowFadeTime: {
            type: "number";
            default: number;
        };
        glowBrightness: {
            type: "number";
            default: number;
        };
        glowIntensity: {
            type: "number";
            default: number;
        };
    };
    private _ballMesh;
    private _smokeVFX;
    private _light;
    private _ballTintStrOld;
    private _ballTintStrNew;
    private _ballBrightnessOld;
    private _ballBrightnessNew;
    private _ballTimeElapsed;
    private _lightIntensityOld;
    private _lightIntensityNew;
    preStart(): void;
    start(): void;
    update(deltaTime: number): void;
    lerp(a: number, b: number, t: number): number;
    playCrystalFX(): void;
    stopCrystalFX(): void;
}
