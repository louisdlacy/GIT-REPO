import * as hz from 'horizon/core';
export declare const gameStateChanged: hz.LocalEvent<{
    state: GameState;
}>;
export declare const setGameState: hz.LocalEvent<{
    state: GameState;
}>;
export declare const moveGemToCourse: hz.LocalEvent<{}>;
export declare const collectGem: hz.LocalEvent<{
    gem: hz.Entity;
}>;
export declare enum GameState {
    'Ready' = 0,
    'Playing' = 1,
    'Finished' = 2
}
