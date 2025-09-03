"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const Events_1 = require("Events");
const core_1 = require("horizon/core");
const LootSystem_1 = require("LootSystem");
const NpcAgent_1 = require("NpcAgent");
const PlayerManager_1 = require("PlayerManager");
const StateMachine_1 = require("StateMachine");
var SkeletonState;
(function (SkeletonState) {
    SkeletonState["Idle"] = "Idle";
    SkeletonState["AcquireTarget"] = "AcquireTarget";
    SkeletonState["Taunting"] = "Taunting";
    SkeletonState["Walking"] = "Walking";
    SkeletonState["Running"] = "Running";
    SkeletonState["Attacking"] = "Attacking";
    SkeletonState["Hit"] = "Hit";
    SkeletonState["Dead"] = "Dead";
})(SkeletonState || (SkeletonState = {}));
class SkeletonBrain extends NpcAgent_1.NpcAgent {
    constructor() {
        super(...arguments);
        this.players = [];
        this.hitPoints = 1;
        this.targetPlayer = undefined;
        // START State Machine Config *********************************************
        this.skeletonConfig = [
            new StateMachine_1.StateConfigRecord(SkeletonState.Idle, [
                new StateMachine_1.StateCallbackConfig(StateMachine_1.StateCallbacks.OnEnter, () => this.animate(NpcAgent_1.NpcAnimation.Idle)),
            ], [
                new StateMachine_1.NextStateEdges(() => this.stateMachine.timer >= 1, [[SkeletonState.AcquireTarget, 1.0]]),
            ]),
            new StateMachine_1.StateConfigRecord(SkeletonState.AcquireTarget, [
                new StateMachine_1.StateCallbackConfig(StateMachine_1.StateCallbacks.OnEnter, () => this.acquireTarget())
            ], [
                new StateMachine_1.NextStateEdges(() => this.targetPlayer !== undefined, [
                    [SkeletonState.Taunting, 0.1],
                    [SkeletonState.Running, 0.1],
                    [SkeletonState.Walking, 0.8]
                ]),
                new StateMachine_1.NextStateEdges(() => true, [[SkeletonState.Idle, 1.0]])
            ]),
            new StateMachine_1.StateConfigRecord(SkeletonState.Taunting, [
                new StateMachine_1.StateCallbackConfig(StateMachine_1.StateCallbacks.OnEnter, () => {
                    this.props.tauntSfx?.as(core_1.AudioGizmo)?.play();
                    this.animate(NpcAgent_1.NpcAnimation.Taunt);
                }),
            ], [
                new StateMachine_1.NextStateEdges(() => this.stateMachine.timer >= 2.0, [[SkeletonState.Running, 1.0]]),
            ]),
            new StateMachine_1.StateConfigRecord(SkeletonState.Walking, [
                new StateMachine_1.StateCallbackConfig(StateMachine_1.StateCallbacks.OnEnter, () => {
                    this.setMovementSpeed(NpcAgent_1.NpcMovementSpeed.Walk);
                }),
                new StateMachine_1.StateCallbackConfig(StateMachine_1.StateCallbacks.OnUpdate, (deltaTime) => this.updateWalkAndRunStates(deltaTime))
            ]),
            new StateMachine_1.StateConfigRecord(SkeletonState.Running, [
                new StateMachine_1.StateCallbackConfig(StateMachine_1.StateCallbacks.OnEnter, () => {
                    this.setMovementSpeed(NpcAgent_1.NpcMovementSpeed.Run);
                }),
                new StateMachine_1.StateCallbackConfig(StateMachine_1.StateCallbacks.OnUpdate, (deltaTime) => this.updateWalkAndRunStates(deltaTime))
            ]),
            new StateMachine_1.StateConfigRecord(SkeletonState.Attacking, [
                new StateMachine_1.StateCallbackConfig(StateMachine_1.StateCallbacks.OnEnter, () => {
                    this.animate(NpcAgent_1.NpcAnimation.Attack);
                    this.props.attackSfx?.as(core_1.AudioGizmo)?.play();
                    this.async.setTimeout(() => this.resolveAttackOnPlayer(this.targetPlayer), this.config.attackLandDelay);
                }),
            ], [
                new StateMachine_1.NextStateEdges(() => this.stateMachine.timer >= 1 / this.config.attacksPerSecond, [[SkeletonState.AcquireTarget, 1.0]]),
            ]),
            new StateMachine_1.StateConfigRecord(SkeletonState.Hit, [
                new StateMachine_1.StateCallbackConfig(StateMachine_1.StateCallbacks.OnEnter, () => {
                    if (this.hitPoints > 1) {
                        this.props.hitSfx?.as(core_1.AudioGizmo)?.play();
                        this.animate(NpcAgent_1.NpcAnimation.Hit);
                    }
                })
            ], [
                new StateMachine_1.NextStateEdges(() => this.hitPoints <= 0, [[SkeletonState.Dead, 1.0]]),
                new StateMachine_1.NextStateEdges(() => this.stateMachine.timer >= this.config.hitStaggerSeconds, [
                    [SkeletonState.AcquireTarget, 1.0],
                ])
            ]),
            new StateMachine_1.StateConfigRecord(SkeletonState.Dead, [
                new StateMachine_1.StateCallbackConfig(StateMachine_1.StateCallbacks.OnEnter, () => {
                    if (this.config.lootTable != undefined) {
                        LootSystem_1.LootSystem.instance?.dropLoot(this.config.lootTable, this.entity.position.get(), this.entity.rotation.get());
                        this.props.deathSfx?.as(core_1.AudioGizmo)?.play();
                        this.animate(NpcAgent_1.NpcAnimation.Death);
                        this.async.setTimeout(() => {
                            this.world.deleteAsset(this.entity);
                        }, 5000);
                    }
                })
            ]),
        ];
    }
    // END State Machine Config ***********************************************
    Start() {
        super.Start();
        this.hitPoints = this.config.minHp + Math.floor((this.config.maxHp - this.config.minHp) * Math.random());
        this.startLocation = this.entity.position.get();
        this.stateMachine = new StateMachine_1.StateMachine(Object.values(SkeletonState), this.skeletonConfig);
        this.stateMachine.changeState(SkeletonState.Idle);
    }
    OnEntityCollision(itemHit, position, normal, velocity) {
        console.log("Skeleton hit by " + itemHit.name.get());
    }
    npcHit(hitPos, hitNormal, damage) {
        if (this.isDead)
            return;
        this.hitPoints -= damage;
        super.npcHit(hitPos, hitNormal, damage);
        this.stateMachine?.changeState(SkeletonState.Hit);
    }
    acquireTarget() {
        let closestDistanceSq = Math.pow(this.config.maxVisionDistance, 2);
        const monsterPosition = this.entity.position.get();
        this.world.getPlayers().forEach((player) => {
            const playerPosition = player.position.get();
            const distanceSq = monsterPosition.distanceSquared(playerPosition);
            if (distanceSq < closestDistanceSq) {
                closestDistanceSq = distanceSq;
                this.targetPlayer = player;
                return;
            }
        });
    }
    updateWalkAndRunStates(deltaTime) {
        var currentState = this.stateMachine?.currentState?.name;
        if (currentState != SkeletonState.Running && currentState != SkeletonState.Walking)
            return;
        if (this.targetPlayer === undefined) {
            this.stateMachine?.changeState(SkeletonState.Idle);
        }
        else {
            this.goToTarget(this.targetPlayer.position.get());
            if (this.targetPlayer.position.get().distanceSquared(this.entity.position.get()) < Math.pow(this.config.maxAttackDistance, 2)) {
                this.stateMachine?.changeState(SkeletonState.Attacking);
            }
        }
    }
    resolveAttackOnPlayer(player) {
        // If the player is still in range after the attack delay, apply damage
        if (player.position.get().distanceSquared(this.entity.position.get()) < Math.pow(this.config.maxAttachReach, 2)) {
            var damage = this.config.minAttackDamage + Math.floor((this.config.maxAttackDamage - this.config.minAttackDamage) * Math.random());
            this.props.attackHitSfx?.as(core_1.AudioGizmo)?.play();
            PlayerManager_1.PlayerManager.instance.hitPlayer(player, damage, this.entity.position.get());
            this.sendNetworkEvent(player, Events_1.Events.playerHit, { player: player, damage: damage, damageOrigin: this.entity.position.get() });
        }
    }
}
SkeletonBrain.propsDefinition = {
    ...NpcAgent_1.NpcAgent.propsDefinition,
    tauntSfx: { type: core_1.PropTypes.Entity },
    attackSfx: { type: core_1.PropTypes.Entity },
    attackHitSfx: { type: core_1.PropTypes.Entity },
    hitSfx: { type: core_1.PropTypes.Entity },
    deathSfx: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(SkeletonBrain);
