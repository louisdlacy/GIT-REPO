/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * @format
 */
import * as hz from 'horizon/core';
import { Action } from 'horizon/analytics';
/** Retreives the Player Alias based on World with a fallback */
export declare function getPlayerName(player: hz.Player, world: hz.World): string;
/** Provides a set of common HTML strings used in UI display */
export declare const HTMLHelpers: {
    NewLine: string;
    Break: string;
    AlignLeft: string;
    AlignCenter: string;
    Red: string;
    Orange: string;
    Yellow: string;
    Green: string;
    Blue: string;
    Purple: string;
    Pink: string;
    White: string;
    Black: string;
    Gray: string;
    MetaLightBlue: string;
    EndColorTag: string;
};
export declare function exists(obj: hz.Entity | undefined): boolean;
/** Returns the string hexcode based on the Turbo Action for easier visual contrast */
export declare function getColorHexFromAction(turboTriggerAction: Action): string;
export declare function getStringWithBreaks(...items: Object[]): string;
/** Formats seconds into mm:ss format */
export declare function getTimeString(timeInSeconds: number): string;
/** Displays a color-formatted representation of a Turbo Timer (individual) for Debugging UIs and HUDs */
export declare function getTimerDisplay(timerKey: string, sessionSeconds: number, latestIntervalSeconds: number, showOnlyRunning?: boolean, isRunning?: boolean, showTimerKey?: boolean): string;
export declare function setText(txtGizmo: hz.Entity | hz.TextGizmo | undefined, str: string): void;
export declare function wrapColor(text: string, colorStartHex: string): string;
export declare function wrapParens(text: string): string;
