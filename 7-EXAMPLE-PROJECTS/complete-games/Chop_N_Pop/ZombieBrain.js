"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const core_1 = require("horizon/core");
const LootSystem_1 = require("LootSystem");
const NpcAgent_1 = require("NpcAgent");
const PlayerManager_1 = require("PlayerManager");
const StateMachine_1 = require("StateMachine");
var ZombieState;
(function (ZombieState) {
    ZombieState["Idle"] = "Idle";
    ZombieState["AcquireTarget"] = "AcquireTarget";
    ZombieState["Pointing"] = "Pointing";
    ZombieState["Taunting"] = "Taunting";
    ZombieState["Walking"] = "Walking";
    ZombieState["Running"] = "Running";
    ZombieState["Attacking"] = "Attacking";
    ZombieState["Hit"] = "Hit";
    ZombieState["Dead"] = "Dead";
})(ZombieState || (ZombieState = {}));
class ZombieBrain extends NpcAgent_1.NpcAgent {
    constructor() {
        super(...arguments);
        this.players = [];
        this.hitPoints = 1;
        this.targetPlayer = undefined;
        this.groans = [];
        // START State Machine Config *********************************************
        this.zombieConfig = [
            new StateMachine_1.StateConfigRecord(ZombieState.Idle, [
                new StateMachine_1.StateCallbackConfig(StateMachine_1.StateCallbacks.OnEnter, () => this.animate(NpcAgent_1.NpcAnimation.Idle)),
            ], [
                new StateMachine_1.NextStateEdges(() => this.stateMachine.timer >= 1, [[ZombieState.AcquireTarget, 1.0]]),
            ]),
            new StateMachine_1.StateConfigRecord(ZombieState.AcquireTarget, [
                new StateMachine_1.StateCallbackConfig(StateMachine_1.StateCallbacks.OnEnter, () => this.acquireTarget())
            ], [
                new StateMachine_1.NextStateEdges(() => this.targetPlayer !== undefined, [
                    [ZombieState.Taunting, 0.1],
                    [ZombieState.Running, 0.1],
                    [ZombieState.Walking, 0.8]
                ]),
                new StateMachine_1.NextStateEdges(() => true, [[ZombieState.Idle, 1.0]])
            ]),
            new StateMachine_1.StateConfigRecord(ZombieState.Taunting, [
                new StateMachine_1.StateCallbackConfig(StateMachine_1.StateCallbacks.OnEnter, () => {
                    this.animate(NpcAgent_1.NpcAnimation.Taunt);
                }),
            ], [
                new StateMachine_1.NextStateEdges(() => this.stateMachine.timer >= 2.0, [[ZombieState.Running, 1.0]]),
            ]),
            new StateMachine_1.StateConfigRecord(ZombieState.Walking, [
                new StateMachine_1.StateCallbackConfig(StateMachine_1.StateCallbacks.OnEnter, () => {
                    this.setMovementSpeed(NpcAgent_1.NpcMovementSpeed.Walk);
                }),
                new StateMachine_1.StateCallbackConfig(StateMachine_1.StateCallbacks.OnUpdate, (deltaTime) => this.updateWalkAndRunStates(deltaTime))
            ]),
            new StateMachine_1.StateConfigRecord(ZombieState.Running, [
                new StateMachine_1.StateCallbackConfig(StateMachine_1.StateCallbacks.OnEnter, () => {
                    this.setMovementSpeed(NpcAgent_1.NpcMovementSpeed.Run);
                }),
                new StateMachine_1.StateCallbackConfig(StateMachine_1.StateCallbacks.OnUpdate, (deltaTime) => this.updateWalkAndRunStates(deltaTime))
            ]),
            new StateMachine_1.StateConfigRecord(ZombieState.Attacking, [
                new StateMachine_1.StateCallbackConfig(StateMachine_1.StateCallbacks.OnEnter, () => {
                    this.animate(NpcAgent_1.NpcAnimation.Attack);
                    this.props.attackSfx?.as(core_1.AudioGizmo)?.play();
                    this.async.setTimeout(() => this.resolveAttackOnPlayer(this.targetPlayer), this.config.attackLandDelay);
                })
            ], [
                new StateMachine_1.NextStateEdges(() => this.stateMachine.timer >= this.config.attacksPerSecond, [[ZombieState.AcquireTarget, 1.0]]),
            ]),
            new StateMachine_1.StateConfigRecord(ZombieState.Hit, [
                new StateMachine_1.StateCallbackConfig(StateMachine_1.StateCallbacks.OnEnter, () => {
                    if (this.hitPoints > 1) {
                        this.props.hitSfx?.as(core_1.AudioGizmo)?.play();
                        this.animate(NpcAgent_1.NpcAnimation.Hit);
                    }
                })
            ], [
                new StateMachine_1.NextStateEdges(() => this.hitPoints <= 0, [[ZombieState.Dead, 1.0]]),
                new StateMachine_1.NextStateEdges(() => this.stateMachine.timer >= this.config.hitStaggerSeconds, [
                    [ZombieState.AcquireTarget, 1.0],
                ])
            ]),
            new StateMachine_1.StateConfigRecord(ZombieState.Dead, [
                new StateMachine_1.StateCallbackConfig(StateMachine_1.StateCallbacks.OnEnter, () => {
                    this.props.deathSfx?.as(core_1.AudioGizmo)?.play();
                    if (this.config.lootTable != undefined) {
                        LootSystem_1.LootSystem.instance?.dropLoot(this.config.lootTable, this.entity.position.get(), this.entity.rotation.get());
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
        this.stateMachine = new StateMachine_1.StateMachine(Object.values(ZombieState), this.zombieConfig);
        this.stateMachine.changeState(ZombieState.Idle);
        // Group groans for easy access
        if (this.props.groan1 != undefined)
            this.groans.push(this.props.groan1);
        if (this.props.groan2 != undefined)
            this.groans.push(this.props.groan2);
        if (this.props.groan3 != undefined)
            this.groans.push(this.props.groan3);
        if (this.props.groan4 != undefined)
            this.groans.push(this.props.groan4);
        this.groanMaybe();
    }
    OnEntityCollision(itemHit, position, normal, velocity) {
        console.log("Zombie hit by " + itemHit.name.get());
    }
    groanMaybe() {
        if (this.isDead)
            return;
        if (Math.random() < this.props.groanProbability) {
            this.playRandomGroan();
        }
        this.async.setTimeout(this.groanMaybe.bind(this), Math.random() * 5000);
    }
    npcHit(hitPos, hitNormal, damage) {
        if (this.isDead)
            return;
        this.hitPoints -= damage;
        super.npcHit(hitPos, hitNormal, damage);
        this.stateMachine?.changeState(ZombieState.Hit);
    }
    playRandomGroan() {
        if (this.groans.length > 0)
            this.groans[Math.floor(Math.random() * this.groans.length)].as(core_1.AudioGizmo).play();
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
        if (currentState != ZombieState.Running && currentState != ZombieState.Walking)
            return;
        if (this.targetPlayer === undefined) {
            this.stateMachine?.changeState(ZombieState.Idle);
        }
        else {
            this.goToTarget(this.targetPlayer.position.get());
            if (this.targetPlayer.position.get().distanceSquared(this.entity.position.get()) < Math.pow(this.config.maxAttackDistance, 2)) {
                this.stateMachine?.changeState(ZombieState.Attacking);
            }
        }
    }
    resolveAttackOnPlayer(player) {
        // If the player is still in range after the attack delay, apply damage
        if (player.position.get().distanceSquared(this.entity.position.get()) < Math.pow(this.config.maxAttachReach, 2)) {
            var damage = this.config.minAttackDamage + Math.floor((this.config.maxAttackDamage - this.config.minAttackDamage) * Math.random());
            this.props.attackHitSfx?.as(core_1.AudioGizmo)?.play();
            PlayerManager_1.PlayerManager.instance.hitPlayer(player, damage, this.entity.position.get());
        }
    }
}
ZombieBrain.propsDefinition = {
    ...NpcAgent_1.NpcAgent.propsDefinition,
    groanProbability: { type: core_1.PropTypes.Number, default: 10 },
    groan1: { type: core_1.PropTypes.Entity },
    groan2: { type: core_1.PropTypes.Entity },
    groan3: { type: core_1.PropTypes.Entity },
    groan4: { type: core_1.PropTypes.Entity },
    attackSfx: { type: core_1.PropTypes.Entity },
    attackHitSfx: { type: core_1.PropTypes.Entity },
    hitSfx: { type: core_1.PropTypes.Entity },
    deathSfx: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(ZombieBrain);
