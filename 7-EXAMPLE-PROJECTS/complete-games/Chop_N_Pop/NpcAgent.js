"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.NpcAgent = exports.NpcMovementSpeed = exports.NpcAnimation = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const Behaviour_1 = require("Behaviour");
const Events_1 = require("Events");
const FloatingTextManager_1 = require("FloatingTextManager");
const core_1 = require("horizon/core");
const navmesh_1 = require("horizon/navmesh");
const unity_asset_bundles_1 = require("horizon/unity_asset_bundles");
const NpcConfigStore_1 = require("NpcConfigStore");
var NpcAnimation;
(function (NpcAnimation) {
    NpcAnimation["Idle"] = "Idle";
    NpcAnimation["Attack"] = "Attack";
    NpcAnimation["Hit"] = "Hit";
    NpcAnimation["Death"] = "Death";
    NpcAnimation["Wave"] = "EmoteWave";
    NpcAnimation["Celebration"] = "EmoteCelebration";
    NpcAnimation["Taunt"] = "EmoteTaunt";
    NpcAnimation["Yes"] = "EmoteYes";
    NpcAnimation["No"] = "EmoteNo";
    NpcAnimation["Point"] = "EmotePoint";
})(NpcAnimation || (exports.NpcAnimation = NpcAnimation = {}));
var NpcMovementSpeed;
(function (NpcMovementSpeed) {
    NpcMovementSpeed[NpcMovementSpeed["Walk"] = 0] = "Walk";
    NpcMovementSpeed[NpcMovementSpeed["Run"] = 1] = "Run";
})(NpcMovementSpeed || (exports.NpcMovementSpeed = NpcMovementSpeed = {}));
class NpcAgent extends Behaviour_1.Behaviour {
    constructor() {
        super(...arguments);
        this.navMesh = null;
        this.navAgent = null;
        this.frameTimer = 0.0;
        this.currentLookAt = new core_1.Vec3(0, 0, 0);
        this.animMoving = false;
        this.animSpeed = 0.0;
        this.isDead = false;
        this.stateMachine = null;
        this.config = null;
    }
    Start() {
        this.assetRef = this.entity.as(unity_asset_bundles_1.AssetBundleGizmo)?.getRoot();
        this.resetAllAnimationParameters();
        this.config = NpcConfigStore_1.NpcConfigStore.instance.getNpcConfig(this.props.configName);
        if (this.config === undefined) {
            console.error("NpcAgent::Start() Attempted to load config for undefined config name: " + this.props.configName);
        }
        this.navAgent = this.entity.as(navmesh_1.NavMeshAgent);
        this.navAgent.maxSpeed.set(this.config.runSpeed);
        // Get the navmesh reference so we can use it later
        this.navAgent.getNavMesh().then(mesh => { this.navMesh = mesh; });
        // The starting position is a good position to fallback to
        this.lastKnownGood = this.entity.position.get();
        this.connectNetworkEvent(this.props.collider, Events_1.Events.projectileHit, this.bulletHit.bind(this));
        this.connectNetworkEvent(this.entity, Events_1.Events.projectileHit, this.bulletHit.bind(this));
        this.connectNetworkEvent(this.props.collider, Events_1.Events.axeHit, this.axeHit.bind(this));
        this.connectNetworkEvent(this.entity, Events_1.Events.axeHit, this.axeHit.bind(this));
    }
    Update(deltaTime) {
        this.frameTimer += deltaTime;
        // Update animation every frame
        this.updateSpeedAnimationParameters(deltaTime);
        this.updateLookAtAnimationParameters(deltaTime);
        // Only update destination at FPS rate
        if (this.frameTimer >= 1.0 / this.props.agentFPS) {
            if (this.nextTarget != undefined) {
                var targetPos = this.navMesh?.getNearestPoint(this.nextTarget, 100);
                this.lastKnownGood = targetPos ?? this.lastKnownGood;
                this.navAgent.destination.set(targetPos || this.entity.position.get());
            }
            this.frameTimer -= 1.0 / this.props.agentFPS;
        }
        // Update the state machine
        this.stateMachine?.update(deltaTime);
    }
    // public functionality
    setMovementSpeed(speed) {
        switch (speed) {
            case NpcMovementSpeed.Walk:
                this.navAgent?.maxSpeed.set(this.config.walkSpeed);
                break;
            case NpcMovementSpeed.Run:
                this.navAgent?.maxSpeed.set(this.config.runSpeed);
                break;
        }
    }
    goToTarget(target) {
        if (this.isDead)
            return;
        this.navAgent?.isImmobile.set(false);
        this.nextTarget = target;
    }
    animate(animation) {
        if (this.isDead)
            return;
        switch (animation) {
            case NpcAnimation.Idle:
                this.navAgent?.isImmobile.set(true);
                this.nextTarget = this.entity.position.get();
                break;
            case NpcAnimation.Death:
                this.assetRef?.setAnimationParameterBool("Death", true);
                this.navAgent?.isImmobile.set(true);
                this.nextTarget = undefined;
                this.isDead = true;
                this.props.collider?.collidable.set(false);
                break;
            case NpcAnimation.Hit:
                this.assetRef?.setAnimationParameterTrigger("Hit");
                break;
            case NpcAnimation.Attack:
                this.navAgent?.isImmobile.set(true);
                this.assetRef?.setAnimationParameterTrigger("Attack");
                break;
            default:
                this.assetRef?.setAnimationParameterTrigger(animation);
        }
    }
    bulletHit(data) {
        var bulletDamage = this.config.minBulletDamage + Math.floor((this.config.maxBulletDamage - this.config.minBulletDamage) * Math.random());
        this.npcHit(data.hitPos, data.hitNormal, bulletDamage);
        this.sendNetworkBroadcastEvent(Events_1.Events.playerScoredHit, { player: data.fromPlayer, entity: this.entity });
    }
    axeHit(data) {
        var axeDamage = this.config.minAxeDamage + Math.floor((this.config.maxAxeDamage - this.config.minAxeDamage) * Math.random());
        this.npcHit(data.hitPos, data.hitNormal, axeDamage);
        this.sendNetworkBroadcastEvent(Events_1.Events.playerScoredHit, { player: data.fromPlayer, entity: this.entity });
    }
    npcHit(hitPos, hitNormal, damage) {
        if (this.isDead)
            return;
        FloatingTextManager_1.FloatingTextManager.instance?.createFloatingText(damage.toString(), hitPos, core_1.Color.red);
        if (damage >= this.config.knockbackMinDamage) {
            // Push the NPC back opposite to the direction of the hit
            var hitDirection = hitNormal.mul(-1);
            hitDirection.y = 0;
            hitDirection.normalize();
            var startPosition = this.entity.position.get();
            var moveInterval = this.async.setInterval(() => {
                if (this.entity.position.get().sub(startPosition).magnitude() > damage * this.config.knockbackMultiplier) {
                    this.async.clearInterval(moveInterval);
                }
                else {
                    this.entity.position.set(this.entity.position.get().add(hitDirection));
                }
            }, 10);
        }
    }
    // Private methods
    resetAllAnimationParameters() {
        if (this.assetRef === undefined || this.assetRef === null) {
            console.warn("NpcAgent::resetAllAnimationParameters() Attempted to reset all animation triggers on an undefined assetRef");
        }
        // Can also use this.assetRef?.resetAnimationParameterTrigger("Death"); but we're specifying values here so that they can be easily overriden for default state
        this.assetRef?.setAnimationParameterBool("Death", false);
        this.assetRef?.setAnimationParameterBool("Moving", false);
        this.assetRef?.setAnimationParameterBool("Falling", false);
        this.assetRef?.setAnimationParameterFloat("LookX", 0);
        this.assetRef?.setAnimationParameterFloat("LookY", 0);
        this.assetRef?.setAnimationParameterFloat("Speed", 0);
        this.assetRef?.setAnimationParameterFloat("RotateSpeed", 0);
        this.assetRef?.setAnimationParameterFloat("Random", 0);
    }
    updateSpeedAnimationParameters(deltaTime) {
        var speed = this.navAgent?.currentSpeed.get() || 0.0;
        var speedAnimationValue = this.calculateSpeedAnimationValue(speed);
        speedAnimationValue = (speedAnimationValue + this.animSpeed) * 0.5;
        if (speedAnimationValue <= 0.1) {
            speedAnimationValue = 0.0;
        }
        if (speedAnimationValue != this.animSpeed) {
            this.animSpeed = speedAnimationValue;
            this.assetRef?.setAnimationParameterFloat("Speed", speedAnimationValue);
        }
        var movingAnimationValue = speedAnimationValue > 0.0;
        if (movingAnimationValue != this.animMoving) {
            this.animMoving = movingAnimationValue;
            this.assetRef?.setAnimationParameterBool("Moving", movingAnimationValue);
        }
    }
    calculateSpeedAnimationValue(speed) {
        // Animation value is between 0 and 1 for walking, and between 1 and 4 for running.
        // 0-1 for walking
        var animSpeed = Math.min(speed / this.config.walkSpeed, 1);
        // Add run portion
        return animSpeed + Math.max(3 * (speed - this.config.walkSpeed) / (this.config.runSpeed - this.config.walkSpeed), 0);
    }
    updateLookAtAnimationParameters(deltaTime) {
        if (this.nextTarget == undefined)
            return;
        var targetLookAt = this.currentLookAt;
        // Head position
        const headPosition = this.entity.position.get();
        headPosition.y += this.props.headHeight;
        // Vector from head to look at position
        const delta = this.nextTarget.sub(headPosition);
        // Make sure the head is not overstretching the neck (180 degrees forward range)
        const dotForward = core_1.Vec3.dot(this.entity.forward.get(), delta);
        if (dotForward > 0) {
            // Calculate the look at vector in the head's local space
            const dotRight = core_1.Vec3.dot(this.entity.right.get(), delta);
            const dotUp = core_1.Vec3.dot(this.entity.up.get(), delta);
            targetLookAt = new core_1.Vec3(Math.atan2(dotRight, dotForward), Math.atan2(dotUp, dotForward), 0);
            // bring the values between -1 and 1
            targetLookAt.divInPlace(Math.PI * 2);
        }
        if (this.currentLookAt != targetLookAt) {
            this.currentLookAt = targetLookAt;
        }
        this.assetRef?.setAnimationParameterFloat("LookX", this.currentLookAt.x);
        this.assetRef?.setAnimationParameterFloat("LookY", this.currentLookAt.y);
    }
}
exports.NpcAgent = NpcAgent;
// Editable Properties
NpcAgent.propsDefinition = {
    agentFPS: { type: core_1.PropTypes.Number, default: 4 },
    headHeight: { type: core_1.PropTypes.Number, default: 1.8 },
    collider: { type: core_1.PropTypes.Entity },
    configName: { type: core_1.PropTypes.String, default: "default" }
};
core_1.Component.register(NpcAgent);
