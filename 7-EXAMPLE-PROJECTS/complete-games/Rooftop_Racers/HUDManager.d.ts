/**
 * Initializes the player local HUDs and passes information to each player about the state of the race
 */
import * as hz from "horizon/core";
export declare class HUDManager extends hz.Component {
    static propsDefinition: {};
    private HUDPool;
    private playerHUDCtrlMap;
    private static s_instance;
    static getInstance(): HUDManager;
    constructor();
    preStart(): void;
    start(): void;
    private handleOnPlayerExitWorld;
    private handleOnPlayerEnterWorld;
}
