/**
 * Manages the local player control inputs, initializing them and managing ownership
 */
import * as hz from 'horizon/core';
export interface PlayerControllerManagerProps {
    doubleJumpAmount: number;
    boostJumpAmount: number;
    boostJumpAngle: number;
}
export declare class PlayerControllerManager extends hz.Component<typeof PlayerControllerManager> {
    static propsDefinition: {
        doubleJumpAmount: {
            type: "number";
            default: number;
        };
        boostJumpAmount: {
            type: "number";
            default: number;
        };
        boostJumpAngle: {
            type: "number";
            default: number;
        };
    };
    private ctrlPool;
    private playerCtrlMap;
    private static s_instance;
    static getInstance(): PlayerControllerManager;
    constructor();
    preStart(): void;
    start(): void;
    private handleOnPlayerExitWorld;
    private handleOnPlayerEnterWorld;
}
