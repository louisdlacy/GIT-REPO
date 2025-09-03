import { CameraMode } from 'horizon/camera';
import * as hz from 'horizon/core';
export declare class Weapon<T> extends hz.Component<typeof Weapon & T> {
    static propsDefinition: {
        cameraMode: {
            type: "string";
        };
        fireCooldown: {
            type: "number";
            default: number;
        };
    };
    private fireCooldown;
    private lastFired;
    preStart(): void;
    start(): void;
    onGrab(player: hz.Player): void;
    onRelease(): void;
    onIndexTriggerDown(player: hz.Player): boolean;
    getCameraMode(): CameraMode;
}
