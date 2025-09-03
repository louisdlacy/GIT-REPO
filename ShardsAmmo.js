"use strict";
// Copyright (c) Richard Lee (Shards632). Released under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const ShardsAmmoEvents_1 = require("ShardsAmmoEvents");
/**
 * Provides an ammo box that players can pick up to reload their guns.
 * Ammo boxes have ammoType, which may need to match the gun's ammoType.
 */
class AmmoBox extends core_1.Component {
    constructor() {
        super(...arguments);
        this.inCooldown = false;
    }
    preStart() {
        if (!this.props.trigger) {
            console.error("AmmoBox component requires a trigger entity to function.");
            return;
        }
        this.connectCodeBlockEvent(this.props.trigger, core_1.CodeBlockEvents.OnPlayerEnterTrigger, (player) => this.onPickup(player));
    }
    start() { }
    onPickup(player) {
        // prevent multiple triggers
        if (this.inCooldown) {
            return;
        }
        this.inCooldown = true;
        // hide ammo box
        this.entity.visible.set(false);
        this.props.pickupSfx?.as(core_1.AudioGizmo).play();
        // respawn after delay
        this.async.setTimeout(() => {
            this.inCooldown = false;
            this.entity.visible.set(true);
            this.props.respawnSfx?.as(core_1.AudioGizmo).play();
        }, this.props.respawnDelay * 1000);
        // send a pickup event to the player
        this.sendNetworkEvent(player, ShardsAmmoEvents_1.Events.pickupAmmo, { ammoType: this.props.ammoType, amount: this.props.ammoAmount });
    }
}
AmmoBox.propsDefinition = {
    // type of ammo in this box
    ammoType: { type: core_1.PropTypes.String, default: "bullet" },
    // amount of ammo in this box
    ammoAmount: { type: core_1.PropTypes.Number, default: 10 },
    // respawn delay after being picked up
    respawnDelay: { type: core_1.PropTypes.Number, default: 10 }, // seconds
    // pickup sound effect (optional)
    pickupSfx: { type: core_1.PropTypes.Entity },
    // respawn sound effect (optional)
    respawnSfx: { type: core_1.PropTypes.Entity },
    /* internal configuration */
    // the trigger area for picking up the ammo box
    trigger: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(AmmoBox);
