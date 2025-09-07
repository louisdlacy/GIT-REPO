import * as hz from 'horizon/core';
export declare enum GameState {
    'Ready' = 0,// Ready to start a match
    'Starting' = 1,// Starting the match, counting down
    'Playing' = 2,// Currently in a match
    'Ending' = 3,// Ending the match, counting down
    'Finished' = 4
}
export declare const Events: {
    gameStateChanged: hz.LocalEvent<{
        fromState: GameState;
        toState: GameState;
    }>;
    registerNewMatch: hz.LocalEvent<{}>;
    gameOver: hz.LocalEvent<{}>;
    setGameState: hz.LocalEvent<{
        newState: GameState;
    }>;
};
export declare function playersEqual(a: hz.Player, b: hz.Player): boolean;
export declare class PlayerList {
    list: hz.Player[];
    size(): number;
    add(p: hz.Player): void;
    includes(p: hz.Player): boolean;
    indexOf(p: hz.Player): number;
    remove(p: hz.Player): void;
}
export declare class MatchPlayers {
    all: PlayerList;
    inLobby: PlayerList;
    inMatch: PlayerList;
    isInLobby(p: hz.Player): boolean;
    isInMatch(p: hz.Player): boolean;
    playersInLobby(): number;
    playersInMatch(): number;
    playersInWorld(): number;
    getPlayersInLobby(): PlayerList;
    getPlayersInMatch(): PlayerList;
    moveToLobby(p: hz.Player): void;
    moveToMatch(p: hz.Player): void;
    addNewPlayer(p: hz.Player): void;
    removePlayer(p: hz.Player): void;
}
export default Events;
