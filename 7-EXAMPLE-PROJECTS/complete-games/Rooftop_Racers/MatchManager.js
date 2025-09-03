"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
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
exports.MatchManager = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
/**
 * Moves players between match states, based on that match state, teleports them around as needed
 */
const hz = __importStar(require("horizon/core"));
const GameUtils_1 = require("GameUtils");
const Events_1 = require("Events");
class MatchManager extends hz.Component {
    static getInstance() {
        return MatchManager.s_instance;
    }
    constructor() {
        super();
        this.lastKnownGameState = GameUtils_1.GameState.ReadyForMatch;
        this.playerMap = new Map();
        this.subscriptions = [];
        if (MatchManager.s_instance === undefined) {
            MatchManager.s_instance = this;
        }
        else {
            console.error(`There are two ${this.constructor.name} in the world!`);
            return;
        }
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player) => {
            this.handleOnPlayerEnterWorld(player);
        });
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (player) => {
            this.handleOnPlayerExitWorld(player);
        });
        this.connectLocalBroadcastEvent(Events_1.Events.onGameStateChanged, (data) => {
            this.handleGameStateTransit(data.fromState, data.toState);
        });
        this.connectLocalBroadcastEvent(Events_1.Events.onRegisterPlayerForMatch, (data) => {
            this.handlePlayerRegisterStandby(data.player);
        });
        this.connectLocalBroadcastEvent(Events_1.Events.onDeregisterPlayerForMatch, (data) => {
            this.handlePlayerDeregisterStandby(data.player);
        });
        this.connectNetworkBroadcastEvent(Events_1.Events.onResetWorld, (data) => {
            this.reset();
            this.playerMap.forEach((pd) => {
                this.sendNetworkEvent(pd.player, Events_1.Events.onResetLocalObjects, {});
            });
        });
    }
    start() { }
    getPlayersWithStatus(playerGameStatus) {
        return Array.from(this.playerMap.values()).filter(value => value.playerGameStatus === playerGameStatus).map(value => value.player);
    }
    handleGameStateTransit(fromState, toState) {
        this.lastKnownGameState = toState;
        //Game is starting
        if (fromState === GameUtils_1.GameState.StartingMatch && toState === GameUtils_1.GameState.PlayingMatch) {
            const matchSpawnPointGiz = this.props.matchSpawnPoint.as(hz.SpawnPointGizmo);
            if (matchSpawnPointGiz) {
                //players in standby already should not be teleported.
                this.teleportPlayersWithStatusToSpawnPoint(GameUtils_1.PlayerGameStatus.Lobby, matchSpawnPointGiz);
                this.transferAllPlayersWithStatus(GameUtils_1.PlayerGameStatus.Standby, GameUtils_1.PlayerGameStatus.Playing);
                this.transferAllPlayersWithStatus(GameUtils_1.PlayerGameStatus.Lobby, GameUtils_1.PlayerGameStatus.Playing);
            }
        }
        //Game has ended
        else if (toState === GameUtils_1.GameState.CompletedMatch) {
            const lobbySpawnPointGiz = this.props.lobbySpawnPoint.as(hz.SpawnPointGizmo);
            if (lobbySpawnPointGiz) {
                this.playerMap.forEach((playerD) => {
                    lobbySpawnPointGiz.teleportPlayer(playerD.player);
                    playerD.playerGameStatus = GameUtils_1.PlayerGameStatus.Lobby;
                });
            }
        }
        else if (toState === GameUtils_1.GameState.ReadyForMatch) {
            this.playerMap.forEach((pd) => {
                this.sendNetworkEvent(pd.player, Events_1.Events.onResetLocalObjects, {});
            });
        }
    }
    handleOnPlayerExitWorld(player) {
        const playerData = this.playerMap.get(player.id);
        if (!playerData) {
            console.error(`player ${player.name.get()} not found in playerMap`);
            return;
        }
        this.playerMap.delete(player.id);
        switch (playerData.playerGameStatus) {
            case GameUtils_1.PlayerGameStatus.Standby:
                this.sendLocalBroadcastEvent(Events_1.Events.onPlayerLeftStandby, { player });
                break;
            case GameUtils_1.PlayerGameStatus.Playing:
                this.sendLocalBroadcastEvent(Events_1.Events.onPlayerLeftMatch, { player });
                break;
            case GameUtils_1.PlayerGameStatus.Lobby:
                break;
        }
    }
    ;
    handleOnPlayerEnterWorld(player) {
        this.playerMap.set(player.id, {
            player,
            playerGameStatus: GameUtils_1.PlayerGameStatus.Lobby,
        });
    }
    ;
    handlePlayerRegisterStandby(player) {
        if (this.lastKnownGameState === GameUtils_1.GameState.StartingMatch || this.lastKnownGameState === GameUtils_1.GameState.ReadyForMatch) {
            this.transferPlayerWithStatus(player, GameUtils_1.PlayerGameStatus.Lobby, GameUtils_1.PlayerGameStatus.Standby);
            this.sendLocalBroadcastEvent(Events_1.Events.onPlayerJoinedStandby, { player });
        }
    }
    handlePlayerDeregisterStandby(player) {
        if (this.lastKnownGameState === GameUtils_1.GameState.StartingMatch || this.lastKnownGameState === GameUtils_1.GameState.ReadyForMatch) {
            this.transferPlayerWithStatus(player, GameUtils_1.PlayerGameStatus.Standby, GameUtils_1.PlayerGameStatus.Lobby);
        }
    }
    transferAllPlayersWithStatus(fromState, toState) {
        this.playerMap.forEach((playerData) => {
            if (playerData.playerGameStatus === fromState) {
                playerData.playerGameStatus = toState;
            }
        });
    }
    transferPlayerWithStatus(player, fromState, toState) {
        if (fromState === toState) {
            console.warn(`You are trying to move player ${player.name.get()} into the same state ${GameUtils_1.PlayerGameStatus[fromState]}. Skipping`);
            return;
        }
        const playerData = this.playerMap.get(player.id);
        if (!playerData) {
            console.error(`player ${player.name.get()} not found in playerMap`);
            return;
        }
        if (playerData.playerGameStatus !== fromState) {
            console.warn(`You are trying to move player ${player.name.get()} into the same state ${fromState}. Skipping`);
        }
        playerData.playerGameStatus = toState;
    }
    //While you can move players by moving their location, it is better to move them using spawnpoint as it provides
    //+ Fading in and out on VR
    //+ Solves having multiple players spawn in the same location
    teleportPlayersWithStatusToSpawnPoint(status, spawnPoint) {
        this.playerMap.forEach((playerD) => {
            if (playerD.playerGameStatus === status) {
                spawnPoint.teleportPlayer(playerD.player);
            }
        });
    }
    reset() {
        this.lastKnownGameState = GameUtils_1.GameState.ReadyForMatch;
        this.playerMap.clear();
    }
    dispose() { this.reset(); }
}
exports.MatchManager = MatchManager;
MatchManager.propsDefinition = {
    lobbySpawnPoint: { type: hz.PropTypes.Entity },
    matchSpawnPoint: { type: hz.PropTypes.Entity },
};
hz.Component.register(MatchManager);
