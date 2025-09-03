import { Vec3 } from "horizon/core";
import { TextStyle } from "horizon/ui";
export declare const spawnTag = "rapidSpawn";
export declare enum MapTypes {
    TRAVEL = 0,
    PLAYER = 1
}
export type PlayerPinData = {
    name: string;
    position: Vec3;
};
export declare const mapColors: {
    mainPanel: string;
    travelMapWindow: string;
    playerMapWindow: string;
    pinPrimary: string;
    pinSecondary: string;
    utilityButtons: string;
};
export declare const pinLabelTextFormatting: TextStyle;
