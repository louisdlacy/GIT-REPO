/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * @format
 */
import * as hz from 'horizon/core';
export { HTMLHelpers, exists, getPlayerName, getStringWithBreaks, getTimerDisplay, getTimeString, setText, wrapColor, wrapParens } from 'DebugTurbo';
export declare function setPos(obj: hz.Entity | undefined, pos: hz.Vec3): void;
export declare function setPosAndRot(obj: hz.Entity | undefined, pos: hz.Vec3, rot: hz.Quaternion): void;
export declare function respawnPlayer(spawnPoint: hz.SpawnPointGizmo | undefined, player: hz.Player): void;
export declare function playSFX(sfx: hz.AudioGizmo | undefined): void;
export declare function stopSFX(sfx: hz.AudioGizmo | undefined): void;
