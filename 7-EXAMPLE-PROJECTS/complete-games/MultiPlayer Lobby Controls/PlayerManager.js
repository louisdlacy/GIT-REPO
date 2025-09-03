"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const GameUtils_1 = require("GameUtils");
const hz = __importStar(require("horizon/core"));
/* This script must be added to a game object in order to run */
class PlayerManager extends hz.Component {
    constructor() {
        super(...arguments);
        /* We can use our helpful Utils class to easily manage players */
        this.matchPlayers = new GameUtils_1.MatchPlayers();
    }
    /* Using preStart for broadcast listeners helps make sure bindings are in place first */
    preStart() {
        this.connectLocalBroadcastEvent(GameUtils_1.Events.gameStateChanged, (data) => this.handleGameStateChanged(data.fromState, data.toState));
    }
    start() {
        /** Fires any time a user joins the world */
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player) => this.handleOnPlayerEnterWorld(player));
        /** Fires any time a user leaves the world */
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (player) => this.handleOnPlayerExitWorld(player));
    }
    /** When a player enters the world, add that player
     * and an initial player status to our Player Map
     */
    handleOnPlayerEnterWorld(player) {
        // TODO: when players enter, add them to our list of MatchPlayers
    }
    ;
    /** When a player leaves the world,
     * Remove that player from the PlayerMap.
     */
    handleOnPlayerExitWorld(player) {
        // TODO: when a player leaves, remove them from our list of MatchPlayers
    }
    ;
    handleGameStateChanged(fromState, toState) {
        switch (toState) {
            case GameUtils_1.GameState.Playing:
                // TODO: if "fromState" was "Starting", move all players to the match area
                break;
            case GameUtils_1.GameState.Finished:
                if (fromState === GameUtils_1.GameState.Ending) {
                    this.moveAllMatchPlayersToLobby();
                    // TODO: reset the world back to the original game state
                }
                break;
        }
    }
    ;
    moveAllLobbyPlayersToMatch() {
        /* Gets all Lobby players using our helper classes*/
        const lobbyPlayers = this.matchPlayers.getPlayersInLobby();
        lobbyPlayers.list.forEach((p) => {
            this.movePlayerFromLobbyToMatch(p);
        });
    }
    /* Physically move a player and keep our data sets updated*/
    movePlayerFromLobbyToMatch(player) {
        // TODO: respawn the player at the Match Spawn Point location
        // TODO: update lobby MatchPlayers
    }
    moveAllMatchPlayersToLobby() {
        /* Gets all Match players using our helper classes*/
        const matchPlayers = this.matchPlayers.getPlayersInMatch();
        matchPlayers.list.forEach((p) => {
            this.movePlayerFromMatchToLobby(p);
        });
    }
    movePlayerFromMatchToLobby(player) {
        // TODO: respawn the player at the Lobby Spawn Point location
        // TODO: update match MatchPlayers
    }
}
PlayerManager.propsDefinition = {
// TODO: create a prop for the Match Spawn Point
// TODO: create a prop for the Lobby Spawn Point
};
hz.Component.register(PlayerManager);
