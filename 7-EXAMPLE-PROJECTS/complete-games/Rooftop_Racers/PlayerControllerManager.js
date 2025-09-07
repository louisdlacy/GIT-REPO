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
exports.PlayerControllerManager = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
/**
 * Manages the local player control inputs, initializing them and managing ownership
 */
const hz = __importStar(require("horizon/core"));
const GameUtils_1 = require("GameUtils");
const Events_1 = require("Events");
class PlayerControllerManager extends hz.Component {
    static getInstance() {
        return PlayerControllerManager.s_instance;
    }
    constructor() {
        super();
        this.ctrlPool = new GameUtils_1.Pool();
        this.playerCtrlMap = new Map();
        if (PlayerControllerManager.s_instance === undefined) {
            PlayerControllerManager.s_instance = this;
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
        this.connectLocalBroadcastEvent(Events_1.Events.onRegisterPlyrCtrl, (data) => { this.ctrlPool.addToPool(data.caller); });
        this.connectNetworkBroadcastEvent(Events_1.Events.onGetPlyrCtrlData, (data) => {
            this.sendNetworkEvent(data.caller, Events_1.Events.onSetPlyrCtrlData, {
                doubleJumpAmount: this.props.doubleJumpAmount,
                boostJumpAmount: this.props.boostJumpAmount,
                boostJumpAngle: this.props.boostJumpAngle,
            });
        });
    }
    start() { }
    ;
    handleOnPlayerExitWorld(player) {
        const playerCtrl = this.playerCtrlMap.get(player.id);
        if (playerCtrl) {
            console.log(`${this.constructor.name} Removed Local Controller from ${player.name.get()}`);
            playerCtrl.owner.set(this.world.getServerPlayer());
            this.ctrlPool.addToPool(playerCtrl);
        }
        this.playerCtrlMap.delete(player.id);
    }
    ;
    handleOnPlayerEnterWorld(player) {
        const availableCtrl = this.ctrlPool.getNextAvailable();
        if (availableCtrl) {
            console.log(`${this.constructor.name} Attached Local Controller to ${player.name.get()}`);
            availableCtrl.owner.set(player);
            this.playerCtrlMap.set(player.id, availableCtrl);
        }
    }
    ;
}
exports.PlayerControllerManager = PlayerControllerManager;
PlayerControllerManager.propsDefinition = {
    doubleJumpAmount: { type: hz.PropTypes.Number, default: 5 },
    boostJumpAmount: { type: hz.PropTypes.Number, default: 12 },
    boostJumpAngle: { type: hz.PropTypes.Number, default: 90 }
};
hz.Component.register(PlayerControllerManager);
