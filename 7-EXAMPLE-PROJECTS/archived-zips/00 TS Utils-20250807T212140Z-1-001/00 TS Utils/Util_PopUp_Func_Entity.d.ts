import { Player, PopupOptions } from "horizon/core";
export declare const popUp_Func: {
    popUp: typeof popUp;
    playPopUpAfterDelay: typeof playPopUpAfterDelay;
};
/**
 * Plays a popup.
 * @param players Can be a single player in square brackets, ie. `[player]`, or an array of players. If you pass in `undefined`, it plays the popup to all players.
 * @param message The message to be shown.
 * @param isXS Should be `true` if the player is not on VR.
 * @param lengthSeconds Time for the popup in seconds to be active.
 * @param font The desired font, or `undefined` if you want no font changes.
 * @param popUpOptions Options to customize a specific popup, ie. changing the font and background color : `{ fontColor: new Color.red, backgroundColor: Color.black }`.
 */
declare function popUp(players: Player[] | undefined, message: string, isXS: boolean, lengthSeconds: number, font: PopUpFonts | undefined, popUpOptions: Partial<PopupOptions>): void;
/**
 * Plays a popup after a delay.
 * @param delayInMs The amount of time to wait before playing the popup in ms.
 * @param players Can be a single player in square brackets, ie. `[player]`, or an array of players. If you pass in `undefined`, it plays the popup to all players.
 * @param message The message to be shown.
 * @param isXS Should be `true` if the player is not on VR.
 * @param lengthSeconds Time for the popup in seconds to be active.
 * @param font The desired font, or `undefined` if you want no font changes.
 * @param popUpOptions Options to customize a specific popup, ie. changing the font and background color : `{ fontColor: new Color.red, backgroundColor: Color.black }`.
 */
declare function playPopUpAfterDelay(delayInMs: number, players: Player[], message: string, isXS: boolean, lengthSeconds: number, font: PopUpFonts | undefined, popUpOptions: Partial<PopupOptions>): void;
export type PopUpFonts = 'Bangers SDF' | 'Anton SDF' | 'Roboto-Bold SDF' | 'Oswald Bold SDF' | 'Electronic Highway Sign SDF';
export {};
