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
exports.HUDManager = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
/**
 * Initializes the player local HUDs and passes information to each player about the state of the race
 */
const hz = __importStar(require("horizon/core"));
const GameUtils_1 = require("GameUtils");
const Events_1 = require("Events");
class HUDManager extends hz.Component {
    static getInstance() {
        return HUDManager.s_instance;
    }
    constructor() {
        super();
        this.HUDPool = new GameUtils_1.Pool();
        this.playerHUDCtrlMap = new Map();
        if (HUDManager.s_instance === undefined) {
            HUDManager.s_instance = this;
        }
        else {
            console.error(`There are two ${this.constructor.name} in the world!`);
            return;
        }
    }
    preStart() {
        this.connectLocalBroadcastEvent(Events_1.Events.onRegisterRaceHUD, (data) => {
            this.HUDPool.addToPool(data.caller);
        });
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player) => {
            this.handleOnPlayerEnterWorld(player);
        });
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (player) => {
            this.handleOnPlayerExitWorld(player);
        });
    }
    start() { }
    handleOnPlayerExitWorld(player) {
        const playerHC = this.playerHUDCtrlMap.get(player.id);
        if (playerHC) {
            playerHC.owner.set(this.world.getServerPlayer());
            this.HUDPool.addToPool(playerHC);
        }
        this.playerHUDCtrlMap.delete(player.id);
    }
    handleOnPlayerEnterWorld(player) {
        const availableHC = this.HUDPool.getNextAvailable();
        if (availableHC) {
            console.log(`${this.constructor.name} Attached HUD Local to ${player.name.get()}`);
            availableHC.owner.set(player);
            this.playerHUDCtrlMap.set(player.id, availableHC);
        }
    }
}
exports.HUDManager = HUDManager;
HUDManager.propsDefinition = {};
hz.Component.register(HUDManager);
