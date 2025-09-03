"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const Behaviour_1 = require("Behaviour");
const Events_1 = require("Events");
const core_1 = require("horizon/core");
const PlayerManager_1 = require("PlayerManager");
class StartCombat extends Behaviour_1.Behaviour {
    start() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            var managerName = Behaviour_1.BehaviourFinder.GetBehaviour(this.props.waveManager).name;
            this.sendNetworkEvent(this.props.waveManager, Events_1.WaveManagerNetworkEvents.StartWaveGroup, { waveGroupName: managerName });
            PlayerManager_1.PlayerManager.instance.gamePlayers.moveToMatch(player);
            Behaviour_1.BehaviourFinder.GetBehaviour(this.props.fogWall)?.hide();
        });
        this.connectNetworkBroadcastEvent(Events_1.Events.gameReset, (data) => {
            Behaviour_1.BehaviourFinder.GetBehaviour(this.props.fogWall)?.show();
        });
    }
}
StartCombat.propsDefinition = {
    waveManager: { type: core_1.PropTypes.Entity },
    fogWall: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(StartCombat);
