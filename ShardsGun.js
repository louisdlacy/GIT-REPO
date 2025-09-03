"use strict";
// Copyright (c) Richard Lee (Shards632). Released under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
const ShardsAmmoEvents_1 = require("ShardsAmmoEvents");
// binding shared between Gun and the AmmoUI
const ammoAmountBinding = new ui_1.Binding(0);
const ammoCapacityBinding = new ui_1.Binding(0);
/**
 * A gun that tracks remaining ammo as it is transfered between players.
 * Ammo can be replenished by picking up a matching ammo box.
 * Gun can be customized with various props for max capacity, damage,
 * VFX, SFX. Gun mesh is a separate child entity and can be replaced
 * at will.
 *
 * Shares bindings with the AmmoUI component in this module.
 */
class Gun extends core_1.Component {
    constructor() {
        super(...arguments);
        // remaining ammo in gun
        this.currentAmmo = 0;
    }
    preStart() {
        if (!this.props.launcher || !this.props.ammoUI) {
            console.error("Gun requires launcher and ammo UI to function");
            return;
        }
        const player = this.world.getLocalPlayer();
        if (player !== this.world.getServerPlayer()) {
            // listen for ammo pickup events by the player
            this.connectNetworkEvent(player, ShardsAmmoEvents_1.Events.pickupAmmo, ({ ammoType, amount }) => this.onAmmoPickup(ammoType, amount));
        }
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabEnd, () => this.onRelease());
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnIndexTriggerDown, (player) => this.onFire(player));
        this.connectCodeBlockEvent(this.props.launcher, core_1.CodeBlockEvents.OnProjectileHitPlayer, (playerHit, position) => this.onHit(playerHit, position));
        this.connectCodeBlockEvent(this.props.launcher, core_1.CodeBlockEvents.OnProjectileHitEntity, (entityHit, position) => this.onHit(entityHit, position));
        this.connectCodeBlockEvent(this.props.launcher, core_1.CodeBlockEvents.OnProjectileExpired, (position) => this.onMiss(position));
    }
    start() {
        // by default, reload gun to max capacity
        this.currentAmmo = this.props.ammoCapacity;
        ammoAmountBinding.set(this.currentAmmo);
        ammoCapacityBinding.set(this.props.ammoCapacity);
    }
    transferOwnership(oldPlayer, newPlayer) {
        // get all the sub-parts on their way transferring to the new player
        this.getEntityProps().forEach(entity => {
            entity.owner.set(newPlayer);
        });
        // send the current ammo count to the new owner
        return {
            currentAmmo: this.currentAmmo,
        };
    }
    receiveOwnership(state) {
        if (state) {
            // receive the current ammo count from the old owner
            this.currentAmmo = state.currentAmmo;
            ammoAmountBinding.set(this.currentAmmo);
        }
    }
    onAmmoPickup(ammoType, amount) {
        if (ammoType === this.props.ammoType) {
            this.currentAmmo = Math.min(this.currentAmmo + amount, this.props.ammoCapacity);
            ammoAmountBinding.set(this.currentAmmo);
            this.props.reloadSfx?.as(core_1.AudioGizmo).play();
        }
    }
    onRelease() {
        // revert ownership to the server
        this.entity.owner.set(this.world.getServerPlayer());
    }
    onFire(player) {
        if (this.currentAmmo <= 0) {
            // no more ammo
            this.props.emptySfx?.as(core_1.AudioGizmo).play();
            return;
        }
        player.playAvatarGripPoseAnimationByName(core_1.AvatarGripPoseAnimationNames.Fire);
        this.currentAmmo--;
        ammoAmountBinding.set(this.currentAmmo);
        this.props.launcher.as(core_1.ProjectileLauncherGizmo).launch({
            speed: this.props.muzzleVelocity,
            duration: this.props.range / this.props.muzzleVelocity,
        });
        this.props.muzzleVfx?.as(core_1.ParticleGizmo).play();
        this.props.fireSfx?.as(core_1.AudioGizmo).play();
    }
    // we do the same thing whether hitting a player or entity.
    onHit(target, position) {
        // send damage event to the target
        this.sendNetworkEvent(target, ShardsAmmoEvents_1.Events.ammoHit, { damage: this.props.ammoDamage });
        // play hit sound at target
        const hitSfx = this.props.hitSfx;
        if (hitSfx) {
            hitSfx.position.set(position);
            hitSfx.as(core_1.AudioGizmo).play();
        }
        // play hit animation at target
        const hitVfx = this.props.hitVfx;
        if (hitVfx) {
            hitVfx.position.set(position);
            hitVfx.as(core_1.ParticleGizmo).play();
        }
    }
    onMiss(position) {
        const missSfx = this.props.missSfx;
        if (missSfx) {
            missSfx.position.set(position);
            missSfx.as(core_1.AudioGizmo).play();
        }
    }
    getEntityProps() {
        // find all PropTypes.Entity values that are set on this component
        return Object.values(this.props).filter((value) => value instanceof core_1.Entity);
    }
}
Gun.propsDefinition = {
    // the type of ammo box that fits this gun
    ammoType: { type: core_1.PropTypes.String, default: "bullet" },
    // amount of health damage done by being hit by ammo
    ammoDamage: { type: core_1.PropTypes.Number, default: 1 },
    // max capacity of the gun.
    ammoCapacity: { type: core_1.PropTypes.Number, default: 10 },
    // muzzle velocity of the projectile
    muzzleVelocity: { type: core_1.PropTypes.Number, default: 100 }, // meters per second
    // max effective range of the gun
    range: { type: core_1.PropTypes.Number, default: 30 }, // meters
    // visual effect for firing the gun (optional)
    muzzleVfx: { type: core_1.PropTypes.Entity },
    // sound effect for firing the gun (optional)
    fireSfx: { type: core_1.PropTypes.Entity },
    // sound effect for firing when empty (optional)
    emptySfx: { type: core_1.PropTypes.Entity },
    // sound effect for reloading the gun (optional)
    reloadSfx: { type: core_1.PropTypes.Entity },
    // visual effect for hitting a target (optional)
    hitVfx: { type: core_1.PropTypes.Entity },
    // sound effect for hitting a target (optional)
    hitSfx: { type: core_1.PropTypes.Entity },
    // sound effect for missing target (optional)
    missSfx: { type: core_1.PropTypes.Entity },
    /* internal configuration */
    // the projectile launcher
    launcher: { type: core_1.PropTypes.Entity },
    // the ammo UI
    ammoUI: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(Gun);
/**
 * A very simple HUD that displays current ammo and capacity.
 *
 * Shares bindings with the Gun component in this module.
 */
class AmmoUI extends ui_1.UIComponent {
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Text)({
                    text: ui_1.Binding.derive([ammoAmountBinding, ammoCapacityBinding], (amount, capacity) => {
                        return `${amount} / ${capacity}`;
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
core_1.Component.register(AmmoUI);
