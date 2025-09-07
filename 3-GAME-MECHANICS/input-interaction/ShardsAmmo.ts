// Copyright (c) Richard Lee (Shards632). Released under the MIT License.

import { AudioGizmo, CodeBlockEvents, Component, Player, PropTypes } from "horizon/core";
import { Events } from "ShardsAmmoEvents";

/**
 * Provides an ammo box that players can pick up to reload their guns.
 * Ammo boxes have ammoType, which may need to match the gun's ammoType.
 */
class AmmoBox extends Component<typeof AmmoBox> {
  static propsDefinition = {
    // type of ammo in this box
    ammoType: { type: PropTypes.String, default: "bullet" },
    // amount of ammo in this box
    ammoAmount: { type: PropTypes.Number, default: 10 },
    // respawn delay after being picked up
    respawnDelay: { type: PropTypes.Number, default: 10 }, // seconds
    // pickup sound effect (optional)
    pickupSfx: { type: PropTypes.Entity },
    // respawn sound effect (optional)
    respawnSfx: { type: PropTypes.Entity },

    /* internal configuration */
    // the trigger area for picking up the ammo box
    trigger: { type: PropTypes.Entity },
  };

  private inCooldown = false;

  override preStart() {
    if (!this.props.trigger) {
      console.error("AmmoBox component requires a trigger entity to function.");
      return;
    }
    this.connectCodeBlockEvent(this.props.trigger, CodeBlockEvents.OnPlayerEnterTrigger, (player) => this.onPickup(player));
  }

  override start() { }
  
  private onPickup(player: Player) {
    // prevent multiple triggers
    if (this.inCooldown) {
      return;
    }
    this.inCooldown = true;

    // hide ammo box
    this.entity.visible.set(false);
    this.props.pickupSfx?.as(AudioGizmo).play();

    // respawn after delay
    this.async.setTimeout(() => {
      this.inCooldown = false;
      this.entity.visible.set(true);
      this.props.respawnSfx?.as(AudioGizmo).play();
    }, this.props.respawnDelay * 1000);

    // send a pickup event to the player
    this.sendNetworkEvent(player, Events.pickupAmmo, { ammoType: this.props.ammoType, amount: this.props.ammoAmount });
  }
} 

Component.register(AmmoBox);