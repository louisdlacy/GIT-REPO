"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
Object.defineProperty(exports, "__esModule", { value: true });
const Behaviour_1 = require("Behaviour");
const Events_1 = require("Events");
const core_1 = require("horizon/core");
const PlayerManager_1 = require("PlayerManager");
const UiComponents_1 = require("UiComponents");
// Handle anything that needs to be done locally for a player
class PlayerProxy extends Behaviour_1.Behaviour {
    constructor() {
        super(...arguments);
        this.uiUpdateSub = null;
        this.ammoUi = undefined;
        this.hpUi = undefined;
    }
    Awake() {
        if (this.owner === this.world.getServerPlayer()) {
            this.entity.visible.set(false);
            this.entity.as(core_1.AttachableEntity)?.detach();
        }
    }
    Start() {
        this.addSelfToPool();
    }
    onUpdateHud(data) {
        var ammoColor = data.ammo <= this.props.lowAmmoThreshold ? this.props.lowResourceColor : core_1.Color.white;
        var hpColor = data.hp > PlayerManager_1.PlayerManager.instance.props.playerMaxHp ? this.props.superHealthColor :
            data.hp <= this.props.lowHpThreshold ? this.props.lowResourceColor :
                core_1.Color.white;
        this.ammoUi?.updateAmmo(data.ammo, ammoColor);
        this.hpUi?.updateHealth(data.hp, hpColor);
    }
    onAllocate(position, rotation, player) {
        this.ammoUi = UiComponents_1.UiComponentsRegistry.GetComponent(this.props.ammoUI);
        this.hpUi = UiComponents_1.UiComponentsRegistry.GetComponent(this.props.hpUI);
        const attachableEnt = this.entity.as(core_1.AttachableEntity);
        attachableEnt?.detach();
        attachableEnt?.visible.set(true);
        attachableEnt?.setVisibilityForPlayers([player], core_1.PlayerVisibilityMode.VisibleTo);
        attachableEnt?.attachToPlayer(player, core_1.AttachablePlayerAnchor.Head);
        this.uiUpdateSub = this.connectNetworkEvent(player, Events_1.Events.playerDataUpdate, this.onUpdateHud.bind(this));
    }
    onFree() {
        console.log("Freeing local player");
        this.entity.visible.set(false);
        // disconnect from all events
        this.uiUpdateSub?.disconnect();
        // reset subscriptions
        this.uiUpdateSub = null;
    }
    addSelfToPool() {
        var pool = Behaviour_1.BehaviourFinder.GetBehaviour(this.props.parentPool);
        pool?.addEntity(this.entity);
    }
}
PlayerProxy.propsDefinition = {
    ammoUI: { type: core_1.PropTypes.Entity },
    lowAmmoThreshold: { type: core_1.PropTypes.Number, default: 5 },
    hpUI: { type: core_1.PropTypes.Entity },
    lowHpThreshold: { type: core_1.PropTypes.Number, default: 15 },
    lowResourceColor: { type: core_1.PropTypes.Color, default: new core_1.Color(0.7, 0.1, 0.1) },
    superHealthColor: { type: core_1.PropTypes.Color, default: new core_1.Color(0.3, 0.3, 1.0) },
    parentPool: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(PlayerProxy);
