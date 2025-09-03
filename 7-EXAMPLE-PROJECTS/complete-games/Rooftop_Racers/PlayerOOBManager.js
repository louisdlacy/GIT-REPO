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
exports.PlayerOOBManager = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
/**
 * Manages the player local OOB controllers, initializing them and controlling ownership
 */
const hz = __importStar(require("horizon/core"));
const GameUtils_1 = require("GameUtils");
const Events_1 = require("Events");
class PlayerOOBManager extends hz.Component {
    static getInstance() {
        return PlayerOOBManager.s_instance;
    }
    constructor() {
        super();
        this.asyncIntervalID = 0;
        this.localRespawnerPool = new GameUtils_1.Pool();
        this.playerMap = new Map();
        this.respawnVecBuffer = null;
        this.lastKnownGameState = GameUtils_1.GameState.ReadyForMatch;
        this.lobbyStartRespawnGizmo = null;
        if (PlayerOOBManager.s_instance === undefined) {
            PlayerOOBManager.s_instance = this;
        }
        else {
            console.error(`There are two ${this.constructor.name} in the world!`);
            return;
        }
    }
    preStart() {
        //Potential for players to stand really close to edge and fall off easily when respawning,
        //to counteract that we respawn slightly higher that the ground position
        this.respawnVecBuffer = new hz.Vec3(0, this.props.bufferRespawnYHeight, 0);
        this.lobbyStartRespawnGizmo = this.props.lobbyStartRespawnGizmo.as(hz.SpawnPointGizmo);
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player) => {
            this.handleOnPlayerEnterWorld(player, this.localRespawnerPool, this.playerMap);
        });
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (player) => {
            this.handleOnPlayerExitWorld(player, this.localRespawnerPool, this.playerMap);
        });
        this.connectLocalBroadcastEvent(Events_1.Events.onRegisterOOBRespawner, (data) => {
            this.localRespawnerPool.addToPool(data.caller);
        });
        this.connectLocalBroadcastEvent(Events_1.Events.onGameStateChanged, (data) => {
            this.lastKnownGameState = data.toState;
        });
        this.asyncIntervalID = this.async.setInterval(() => {
            this.playerMap.forEach((value) => {
                let owner = value.player;
                let pairedRespawnGizmo = value.spawner;
                const ownerPos = owner.position.get();
                const ownerRot = owner.rotation.get();
                if (ownerPos.y < this.props.OOBWorldYHeight) {
                    pairedRespawnGizmo.teleportPlayer(owner);
                }
                //follow owner around and save their last known ground position
                else if (owner.isGrounded.get()) {
                    pairedRespawnGizmo.position.set(ownerPos.addInPlace(this.respawnVecBuffer));
                    pairedRespawnGizmo.rotation.set(ownerRot);
                }
            });
        }, this.props.recordIntervalMS);
    }
    start() { }
    handleOnPlayerEnterWorld(player, objPool, playerMap) {
        const playerRespawner = objPool.getNextAvailable();
        if (playerRespawner) {
            const spawnGiz = playerRespawner.as(hz.SpawnPointGizmo);
            console.log(`${this.constructor.name} Attached Respawner to ${player.name.get()}`);
            const sub = this.connectNetworkEvent(player, Events_1.Events.onPlayerOutOfBounds, () => {
                //The player should only respawn on the last known ground spot if the game is in progress
                //If they happens to fall out of bounds when the game is over/starting,
                //we want to respawn them in the lobby, not where they fell, otherwise they are stuck out of match
                if (this.lastKnownGameState === GameUtils_1.GameState.PlayingMatch || this.lastKnownGameState === GameUtils_1.GameState.EndingMatch) {
                    spawnGiz.teleportPlayer(player);
                }
                else {
                    this.lobbyStartRespawnGizmo.teleportPlayer(player);
                }
            });
            playerMap.set(player.id, { player: player, spawner: spawnGiz, eventSub: sub });
        }
    }
    ;
    handleOnPlayerExitWorld(player, objPool, playerMap) {
        const playerRespawner = playerMap.get(player.id)?.spawner;
        if (playerRespawner) {
            console.log(`${this.constructor.name} Removed Respawner from ${player.name.get()}`);
            objPool.addToPool(playerRespawner);
            playerMap.get(player.id).eventSub.disconnect();
            playerMap.delete(player.id);
        }
    }
    ;
    dispose() {
        this.async.clearInterval(this.asyncIntervalID);
    }
}
exports.PlayerOOBManager = PlayerOOBManager;
PlayerOOBManager.propsDefinition = {
    recordIntervalMS: { type: hz.PropTypes.Number, default: 500 },
    OOBWorldYHeight: { type: hz.PropTypes.Number, default: 50 },
    bufferRespawnYHeight: { type: hz.PropTypes.Number, default: 3 },
    lobbyStartRespawnGizmo: { type: hz.PropTypes.Entity },
};
hz.Component.register(PlayerOOBManager);
