"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const Behaviour_1 = require("Behaviour");
const Events_1 = require("Events");
const core_1 = require("horizon/core");
const PlayerManager_1 = require("PlayerManager");
/** This script must be added to a game object in order to run */
class GameManager extends Behaviour_1.Behaviour {
    constructor() {
        super(...arguments);
        this.timerID = 0;
        this.countdownTimeInMS = 3000;
    }
    Awake() {
        this.connectNetworkBroadcastEvent(Events_1.WaveManagerNetworkEvents.FightEnded, () => {
            this.handleGameOver();
        });
    }
    /* Displays a 3 second count down to all players */
    handleGameOver() {
        if (this.timerID === 0) {
            this.world.ui.showPopupForEveryone(`Game Over! \n Teleporting back to Lobby`, 3, { position: new core_1.Vec3(0, -0.25, 0) });
            this.timerID = this.async.setTimeout(() => {
                this.sendNetworkBroadcastEvent(Events_1.Events.gameReset, {});
                PlayerManager_1.PlayerManager.instance.resetAllPlayers();
                this.async.clearTimeout(this.timerID);
                this.timerID = 0;
            }, 3000);
        }
    }
}
GameManager.propsDefinition = {};
core_1.Component.register(GameManager);
