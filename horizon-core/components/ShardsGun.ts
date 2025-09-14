// Copyright (c) Richard Lee (Shards632). Released under the MIT License.

import { AudioGizmo, AvatarGripPoseAnimationNames, CodeBlockEvents, Component, Entity, ParticleGizmo, Player, ProjectileLauncherGizmo, PropTypes, Vec3 } from "horizon/core";
import { Binding, Text, UIComponent, View } from "horizon/ui";
import { Events } from "ShardsAmmoEvents";

/**
 * The state transferred between owners of the gun
 */
type GunState = {
  currentAmmo: number;
}

// binding shared between Gun and the AmmoUI
const ammoAmountBinding = new Binding(0);
const ammoCapacityBinding = new Binding(0);

/**
 * A gun that tracks remaining ammo as it is transfered between players.
 * Ammo can be replenished by picking up a matching ammo box.
 * Gun can be customized with various props for max capacity, damage,
 * VFX, SFX. Gun mesh is a separate child entity and can be replaced 
 * at will.
 * 
 * Shares bindings with the AmmoUI component in this module.
 */
class Gun extends Component<typeof Gun, GunState> {
  static propsDefinition = {
    // the type of ammo box that fits this gun
    ammoType: { type: PropTypes.String, default: "bullet" },
    // amount of health damage done by being hit by ammo
    ammoDamage: { type: PropTypes.Number, default: 1 },
    // max capacity of the gun.
    ammoCapacity: { type: PropTypes.Number, default: 10 },
    // muzzle velocity of the projectile
    muzzleVelocity: { type: PropTypes.Number, default: 100 }, // meters per second
    // max effective range of the gun
    range: { type: PropTypes.Number, default: 30 }, // meters
    // visual effect for firing the gun (optional)
    muzzleVfx: { type: PropTypes.Entity },
    // sound effect for firing the gun (optional)
    fireSfx: { type: PropTypes.Entity },
    // sound effect for firing when empty (optional)
    emptySfx: { type: PropTypes.Entity },
    // sound effect for reloading the gun (optional)
    reloadSfx: { type: PropTypes.Entity },
    // visual effect for hitting a target (optional)
    hitVfx: { type: PropTypes.Entity },
    // sound effect for hitting a target (optional)
    hitSfx: { type: PropTypes.Entity },
    // sound effect for missing target (optional)
    missSfx: { type: PropTypes.Entity },

    /* internal configuration */
    // the projectile launcher
    launcher: { type: PropTypes.Entity },
    // the ammo UI
    ammoUI: { type: PropTypes.Entity },
  };

  // remaining ammo in gun
  private currentAmmo = 0;

  override preStart() {
    if (!this.props.launcher || !this.props.ammoUI) {
      console.error("Gun requires launcher and ammo UI to function");
      return;
    }
    const player = this.world.getLocalPlayer();
    if (player !== this.world.getServerPlayer()) {
      // listen for ammo pickup events by the player
      this.connectNetworkEvent(player, Events.pickupAmmo,
        ({ ammoType, amount }) => this.onAmmoPickup(ammoType, amount));
    }
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnGrabEnd,
      () => this.onRelease());
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnIndexTriggerDown,
      (player) => this.onFire(player));
    this.connectCodeBlockEvent(this.props.launcher, CodeBlockEvents.OnProjectileHitPlayer,
      (playerHit, position) => this.onHit(playerHit, position));
    this.connectCodeBlockEvent(this.props.launcher, CodeBlockEvents.OnProjectileHitEntity,
      (entityHit, position) => this.onHit(entityHit, position));
    this.connectCodeBlockEvent(this.props.launcher, CodeBlockEvents.OnProjectileExpired,
      (position) => this.onMiss(position));
  }

  override start() {
    // by default, reload gun to max capacity
    this.currentAmmo = this.props.ammoCapacity;
    ammoAmountBinding.set(this.currentAmmo);
    ammoCapacityBinding.set(this.props.ammoCapacity);
  }

  override transferOwnership(oldPlayer: Player, newPlayer: Player): GunState {
    // get all the sub-parts on their way transferring to the new player
    this.getEntityProps().forEach(entity => {
      entity.owner.set(newPlayer);
    })
    // send the current ammo count to the new owner
    return {
      currentAmmo: this.currentAmmo,
    };
  }

  override receiveOwnership(state: GunState | null) {
    if (state) {
      // receive the current ammo count from the old owner
      this.currentAmmo = state.currentAmmo;
      ammoAmountBinding.set(this.currentAmmo);
    }
  }

  private onAmmoPickup(ammoType: string, amount: number) {
    if (ammoType === this.props.ammoType) {
      this.currentAmmo = Math.min(this.currentAmmo + amount, this.props.ammoCapacity);
      ammoAmountBinding.set(this.currentAmmo);
      this.props.reloadSfx?.as(AudioGizmo).play();
    }
  }

  private onRelease() {
    // revert ownership to the server
    this.entity.owner.set(this.world.getServerPlayer());
  }

  private onFire(player: Player) {
    if (this.currentAmmo <= 0) {
      // no more ammo
      this.props.emptySfx?.as(AudioGizmo).play();
      return;
    }
    player.playAvatarGripPoseAnimationByName(AvatarGripPoseAnimationNames.Fire);
    this.currentAmmo--;
    ammoAmountBinding.set(this.currentAmmo);
    this.props.launcher!.as(ProjectileLauncherGizmo).launch({
      speed: this.props.muzzleVelocity,
      duration: this.props.range / this.props.muzzleVelocity,
    });
    this.props.muzzleVfx?.as(ParticleGizmo).play();
    this.props.fireSfx?.as(AudioGizmo).play();
  }

  // we do the same thing whether hitting a player or entity.
  private onHit(target: Player | Entity, position: Vec3) {
    // send damage event to the target
    this.sendNetworkEvent(target, Events.ammoHit, { damage: this.props.ammoDamage });
    // play hit sound at target
    const hitSfx = this.props.hitSfx;
    if (hitSfx) {
      hitSfx.position.set(position);
      hitSfx.as(AudioGizmo).play();
    }
    // play hit animation at target
    const hitVfx = this.props.hitVfx;
    if (hitVfx) {
      hitVfx.position.set(position);
      hitVfx.as(ParticleGizmo).play();
    }
  }

  private onMiss(position: Vec3) {
    const missSfx = this.props.missSfx;
    if (missSfx) {
      missSfx.position.set(position);
      missSfx.as(AudioGizmo).play();
    }
  }

  private getEntityProps() {
    // find all PropTypes.Entity values that are set on this component
    return Object.values(this.props).filter((value): value is Entity => value instanceof Entity);
  }
}

Component.register(Gun);

/**
 * A very simple HUD that displays current ammo and capacity.
 * 
 * Shares bindings with the Gun component in this module.
 */
class AmmoUI extends UIComponent<typeof AmmoUI> {

  override initializeUI() {
    return View({
      children: [
        Text({
          text: Binding.derive([ammoAmountBinding, ammoCapacityBinding], (amount, capacity) => {
            return `${amount} / ${capacity}`
          }),
          style: {
            fontFamily: 'Bangers',
            fontSize: 64,
            color: 'black',
            backgroundColor: 'white',
            top: 150,
            left: 50,
          }
        })
      ],
      style: {
        width: '100%',
        height: '100%',
        alignItems: 'flex-start',
      }
    });
  }
}

Component.register(AmmoUI);