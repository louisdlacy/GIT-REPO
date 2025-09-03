"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.GunCore = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
// Original code by SketeDavidson: https://horizon.meta.com/profile/10158917081718438
const AnimUtils_1 = require("AnimUtils");
const Behaviour_1 = require("Behaviour");
const Events_1 = require("Events");
const HapticFeedback_1 = require("HapticFeedback");
const core_1 = require("horizon/core");
const StageHand_1 = require("StageHand");
var AnimationState;
(function (AnimationState) {
    AnimationState["open"] = "open";
    AnimationState["closed"] = "closed";
})(AnimationState || (AnimationState = {}));
const pistolConfig = {
    fireRate: 100,
    fireSpeed: 500,
    maxAmmo: 10,
    burstCount: 1,
    reloadTime: 200,
    upwardsRecoilVel: 30,
    upwardsRecoilAcc: 350,
    backwardsRecoilVel: 0.5,
    backwardsRecoilAcc: 7,
};
const burstPistolConfig = {
    fireRate: 100,
    fireSpeed: 500,
    maxAmmo: 15,
    burstCount: 3,
    reloadTime: 200,
    upwardsRecoilVel: 30,
    upwardsRecoilAcc: 350,
    backwardsRecoilVel: 0.5,
    backwardsRecoilAcc: 7,
};
const machineGunConfig = {
    fireRate: 100,
    fireSpeed: 500,
    maxAmmo: 30,
    burstCount: 0,
    reloadTime: 200,
    upwardsRecoilVel: 30,
    upwardsRecoilAcc: 350,
    backwardsRecoilVel: 0.5,
    backwardsRecoilAcc: 7,
};
const gunMode = {
    semiAuto: 0,
    burst: 1,
    fullAuto: 2,
};
class GunCore extends Behaviour_1.Behaviour {
    constructor() {
        super(...arguments);
        this.AnimateTo = new AnimUtils_1.OverTimeLocal(this);
        this.currentAmmo = 0;
        this.slideOriginalPosition = core_1.Vec3.zero;
        this.clipOriginalPosition = core_1.Vec3.zero;
        this.triggerHeld = false;
        this.fireWait = false;
        this.fireQueue = false;
        this.isHeld = false;
        this.isReloading = false;
        this.inCooldown = false;
        this.reloadAvailable = true;
        this.isOnVr = false;
        this.state = { isAmmoOpen: false };
        this.upwardsRecoilDis = 0;
        this.backwardsRecoilDis = 0;
        this.upwardsRecoilVel = 0;
        this.backwardsRecoilVel = 0;
        this.upwardsRecoilAcc = 0;
        this.backwardsRecoilAcc = 0;
        this.slidePosition = AnimationState.closed;
        this.clipPositionState = AnimationState.closed;
        this.currentBurstCount = 0;
    }
    Awake() {
        super.Awake();
        this.initializeGunConfig();
        this.connectNetworkEvent(this.entity, Events_1.Events.gunRequestAmmoResponse, (data) => {
            this.refillAmmo(data.ammoCount);
        });
    }
    Start() {
        super.Start();
        if (this.entity.owner.get() === this.world.getServerPlayer()) {
            StageHand_1.StageHand.instance.addCuePosition(this.entity, this.entity.position.get(), this.entity.rotation.get());
        }
        this.slideOriginalPosition = this.props.slide?.transform.localPosition.get();
        this.clipOriginalPosition = this.props.clip?.transform.localPosition.get();
    }
    OnGrabStart(isRight, player) {
        this.reload();
        this.isHeld = true;
        this.entity.owner.set(player);
        this.props.projectileLauncher?.owner.set(player);
        this.triggerDownSubscription = this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnIndexTriggerDown, this.triggerDown.bind(this));
        this.triggerReleasedSubscription = this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnIndexTriggerUp, this.triggerReleased.bind(this));
        this.reloadSubscription = this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnButton1Down, this.reload.bind(this));
        if (player.deviceType.get() === 'VR') {
            this.reloadSubscription = this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnButton2Down, this.reload.bind(this));
        }
        this.playerHand = isRight ? HapticFeedback_1.HapticHand.Right : HapticFeedback_1.HapticHand.Left;
        HapticFeedback_1.HapticFeedback.playPattern(player, HapticFeedback_1.HapticType.pickup, this.playerHand, this);
        this.props.grabSFX?.as(core_1.AudioGizmo)?.play();
        this.updateAmmoDisplay();
    }
    OnGrabEnd(player) {
        this.entity.owner.set(this.world.getServerPlayer());
        this.props.projectileLauncher?.owner.set(this.world.getServerPlayer());
        this.isHeld = false;
        this.triggerDownSubscription?.disconnect();
        this.triggerReleasedSubscription?.disconnect();
        this.reloadSubscription?.disconnect();
        this.triggerHeld = false;
        this.fireQueue = false;
        this.isReloading = false;
        this.inCooldown = false;
        this.reloadAvailable = true;
        this.updateSlidePosition(AnimationState.closed);
        this.updateclipPosition(AnimationState.closed);
    }
    initializeGunConfig() {
        switch (this.props.mode) {
            case gunMode.semiAuto:
                this.gunConfig = pistolConfig;
                break;
            case gunMode.burst:
                this.gunConfig = burstPistolConfig;
                break;
            case gunMode.fullAuto:
                this.gunConfig = machineGunConfig;
                break;
        }
    }
    fireWeapon() {
        if (this.currentAmmo <= 0 || this.isReloading || this.inCooldown) {
            HapticFeedback_1.HapticFeedback.playPattern(this.entity.owner.get(), HapticFeedback_1.HapticType.empty, this.playerHand, this);
            this.props.dryFireSFX?.as(core_1.AudioGizmo)?.play();
            return;
        }
        const options = { speed: pistolConfig.fireSpeed || 200 };
        if (this.isOnVr) {
            this.async.setTimeout(() => {
                this.kickbackEffect();
            }, 50);
        }
        else {
            this.entity.owner.get().playAvatarGripPoseAnimationByName(core_1.AvatarGripPoseAnimationNames.Fire);
        }
        this.props.projectileLauncher.as(core_1.ProjectileLauncherGizmo)?.launch(options);
        this.inCooldown = true;
        this.triggerHeld = true;
        this.props.muzzleFlash?.visible.set(true);
        this.async.setTimeout(() => {
            this.props.muzzleFlash?.visible.set(false);
        }, 60);
        this.updateSlidePosition(AnimationState.open);
        this.props.fireSFX?.as(core_1.AudioGizmo)?.play();
        this.async.setTimeout(() => {
            this.props.dropShellSFX?.as(core_1.AudioGizmo)?.play();
        }, this.props.dropShellMinDelay + (Math.random() * this.props.dropShellRandomDelay));
        this.currentAmmo--;
        this.updateAmmoDisplay();
        HapticFeedback_1.HapticFeedback.playPattern(this.entity.owner.get(), HapticFeedback_1.HapticType.gunShot, this.playerHand, this);
        this.fireQueue = (this.shouldFireMore() && this.triggerHeld);
        this.async.setTimeout(() => this.endFireWait(), this.gunConfig.fireRate);
    }
    shouldFireMore() {
        if (this.gunConfig.burstCount > 0 && this.currentBurstCount >= this.gunConfig.burstCount) {
            return false;
        }
        return true;
    }
    Update(deltaTime) {
        if (!this.isHeld || !this.isOnVr)
            return;
        this.upwardsRecoilDis += this.upwardsRecoilVel * deltaTime;
        this.upwardsRecoilVel -= this.upwardsRecoilAcc * deltaTime;
        this.backwardsRecoilDis += this.backwardsRecoilVel * deltaTime;
        this.backwardsRecoilVel -= this.backwardsRecoilAcc * deltaTime;
        this.upwardsRecoilDis = Math.max(this.upwardsRecoilDis, 0);
        this.upwardsRecoilVel = this.upwardsRecoilDis > 0 ? this.upwardsRecoilVel : 0;
        this.backwardsRecoilDis = Math.max(this.backwardsRecoilDis, 0);
        this.backwardsRecoilVel = this.backwardsRecoilDis > 0 ? this.backwardsRecoilVel : 0;
        const forward = this.entity.forward.get();
        const up = this.entity.up.get();
        const upwardsRecoil = core_1.Quaternion.fromAxisAngle(core_1.Vec3.cross(forward, up), (0, core_1.degreesToRadians)(this.upwardsRecoilDis));
        const backwardsRecoil = core_1.Vec3.mul(forward, this.backwardsRecoilDis * -1);
        let pos = core_1.Vec3.zero;
        let rot = core_1.Quaternion.zero;
        if (this.isHeld && this.entity.owner.get()) {
            const hand = this.playerHand == HapticFeedback_1.HapticHand.Right ? this.entity.owner.get().rightHand : this.entity.owner.get().leftHand;
            pos = core_1.Vec3.add(hand.position.get(), backwardsRecoil);
            rot = hand.rotation.get();
            const rotationAxis = core_1.Vec3.cross(core_1.Quaternion.mulVec3(rot, core_1.Vec3.forward), core_1.Quaternion.mulVec3(rot, core_1.Vec3.up));
            rot = core_1.Quaternion.mul(core_1.Quaternion.fromAxisAngle(rotationAxis, (0, core_1.degreesToRadians)(0)), core_1.Quaternion.mul(upwardsRecoil, rot));
            this.entity.position.set(pos);
            this.entity.rotation.set(rot);
        }
    }
    endFireWait() {
        this.inCooldown = false;
        this.props.muzzleFlash?.visible.set(false);
        this.updateclipPosition(this.currentAmmo > 0 ? AnimationState.closed : AnimationState.open);
        this.async.setTimeout(() => {
            this.updateSlidePosition(this.currentAmmo > 0 ? AnimationState.closed : AnimationState.open);
        }, 50);
        if (this.fireQueue && this.triggerHeld) {
            this.currentBurstCount++;
            this.fireWeapon();
        }
    }
    reload() {
        if (this.isReloading || !this.reloadAvailable) {
            this.ammoOutFX();
            return;
        }
        if (this.clipPositionState === AnimationState.closed) {
            this.updateclipPosition(AnimationState.open);
        }
        this.isReloading = true;
        this.reloadAvailable = false;
        const reloadTime = this.gunConfig.reloadTime;
        const ammoNeeded = this.gunConfig.maxAmmo - this.currentAmmo;
        this.async.setTimeout(() => {
            this.sendNetworkEvent(this.props.playerManager, Events_1.Events.gunRequestAmmo, { player: this.entity.owner.get(), weapon: this.entity, ammoCount: ammoNeeded });
        }, reloadTime);
    }
    ammoOutFX() {
        this.props.dryFireSFX?.as(core_1.AudioGizmo)?.play();
    }
    refillAmmo(ammoToFill) {
        const ammoNeeded = this.gunConfig.maxAmmo - this.currentAmmo;
        const ammoToRefill = Math.min(ammoNeeded, ammoToFill);
        this.currentAmmo += ammoToRefill;
        this.isReloading = false;
        this.reloadAvailable = true;
        if (this.currentAmmo > 0) {
            if (this.isHeld) {
                HapticFeedback_1.HapticFeedback.playPattern(this.entity.owner.get(), HapticFeedback_1.HapticType.reload, this.playerHand, this);
            }
            this.updateSlidePosition(AnimationState.closed);
            this.updateclipPosition(AnimationState.closed);
            this.props.reloadSFX?.as(core_1.AudioGizmo)?.play();
        }
        else {
            this.ammoOutFX();
        }
        this.updateAmmoDisplay();
    }
    updateclipPosition(state) {
        if (!this.props.clip || this.clipPositionState === state)
            return;
        switch (state) {
            case AnimationState.open:
                this.props.clip.visible.set(false);
                break;
            case AnimationState.closed:
                this.props.clip.visible.set(true);
                break;
        }
        this.clipPositionState = state;
    }
    kickbackEffect() {
        this.upwardsRecoilVel = this.gunConfig.upwardsRecoilVel;
        this.backwardsRecoilVel = this.gunConfig.backwardsRecoilVel;
        this.upwardsRecoilAcc = this.gunConfig.upwardsRecoilAcc;
        this.backwardsRecoilAcc = this.gunConfig.backwardsRecoilAcc;
    }
    updateSlidePosition(state) {
        if (!this.props.slide)
            return;
        if (this.slidePosition === state)
            return;
        this.slidePosition = state;
        const animationParams = state === AnimationState.open
            ? {
                entity: this.props.slide,
                targetLocalPosition: this.props.slidePosition,
                targetLocalRotation: core_1.Quaternion.zero,
                durationMS: 40,
            }
            : {
                entity: this.props.slide,
                targetLocalPosition: this.slideOriginalPosition,
                durationMS: 90,
            };
        if (!animationParams.targetLocalPosition)
            return;
        this.AnimateTo.startAnimation(animationParams);
    }
    triggerDown(player) {
        this.triggerHeld = true;
        this.currentBurstCount = 0;
        if (!this.fireWait) {
            this.currentBurstCount++;
            this.fireWeapon();
        }
    }
    triggerReleased(player) {
        this.triggerHeld = false;
    }
    updateAmmoDisplay() {
        const ammoDisplay = this.props.ammoDisplay?.as(core_1.TextGizmo);
        if (ammoDisplay && ammoDisplay.text) {
            const color = this.currentAmmo > 0 ? core_1.Color.green : core_1.Color.red;
            ammoDisplay.color.set(color);
            ammoDisplay.text.set(this.currentAmmo.toString());
        }
        if (this.isHeld) {
            this.updateclipPosition(this.currentAmmo > 0 ? AnimationState.closed : AnimationState.open);
        }
    }
}
exports.GunCore = GunCore;
GunCore.propsDefinition = {
    projectileLauncher: { type: core_1.PropTypes.Entity },
    mode: { type: core_1.PropTypes.Number, default: 0 },
    slide: { type: core_1.PropTypes.Entity },
    slidePosition: { type: core_1.PropTypes.Vec3 },
    slideRotation: { type: core_1.PropTypes.Quaternion },
    ammoDisplay: { type: core_1.PropTypes.Entity },
    fireSFX: { type: core_1.PropTypes.Entity },
    reloadSFX: { type: core_1.PropTypes.Entity },
    grabSFX: { type: core_1.PropTypes.Entity },
    dryFireSFX: { type: core_1.PropTypes.Entity },
    dropShellSFX: { type: core_1.PropTypes.Entity },
    dropShellMinDelay: { type: core_1.PropTypes.Number, default: 200 },
    dropShellRandomDelay: { type: core_1.PropTypes.Number, default: 200 },
    clip: { type: core_1.PropTypes.Entity },
    muzzleFlash: { type: core_1.PropTypes.Entity },
    playerManager: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(GunCore);
