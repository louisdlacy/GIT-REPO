/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */
/**
  This script manages the basic gameflow and the events that trigger changes to gamestate. The events are defined in
  this file and exported. This file contains listeners for these events, as well as handlers that are triggered when
  the listener receives the specified event.

  As properties of the GameManager class, you specify the 5 gems that are to be found in the world.
 */
import * as hz from 'horizon/core';
export declare const gameStateChanged: hz.LocalEvent<{
    state: GameState;
}>;
export declare const setGameState: hz.LocalEvent<{
    state: GameState;
}>;
export declare const moveGemToCourse: hz.LocalEvent<{
    gem: hz.Entity;
}>;
export declare const collectGem: hz.LocalEvent<{
    gem: hz.Entity;
    collector: hz.Player;
}>;
export declare const resetGemCounter: hz.LocalEvent<{
    collector: hz.Player;
}>;
export declare const merchantTakesGem: hz.LocalEvent<{
    gem: hz.Entity;
    player: hz.Player;
}>;
export declare let gems: hz.Entity[];
export declare let totalGemsCollected: Map<bigint, hz.Entity>;
export declare enum GameState {
    'Ready' = 0,
    'Playing' = 1,
    'Finished' = 2
}
