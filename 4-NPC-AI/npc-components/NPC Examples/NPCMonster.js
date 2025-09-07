"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.StopAttackingPlayer = exports.StartAttackingPlayer = void 0;
const hz = __importStar(require("horizon/core"));
const NPCAgent_1 = require("NPCAgent");
var NPCMonsterState;
(function (NPCMonsterState) {
    NPCMonsterState[NPCMonsterState["Idle"] = 0] = "Idle";
    NPCMonsterState[NPCMonsterState["Taunting"] = 1] = "Taunting";
    NPCMonsterState[NPCMonsterState["Walking"] = 2] = "Walking";
    NPCMonsterState[NPCMonsterState["Running"] = 3] = "Running";
    NPCMonsterState[NPCMonsterState["Hit"] = 4] = "Hit";
    NPCMonsterState[NPCMonsterState["Dead"] = 5] = "Dead";
})(NPCMonsterState || (NPCMonsterState = {}));
exports.StartAttackingPlayer = new hz.NetworkEvent("StartAttackingPlayer");
exports.StopAttackingPlayer = new hz.NetworkEvent("StopAttackingPlayer");
class NPCMonster extends NPCAgent_1.NPCAgent {
    constructor() {
        super(...arguments);
        this.players = [];
        this.hitPoints = NPCMonster.maxHitPoints;
        this.targetPlayer = undefined;
        this.state = NPCMonsterState.Idle;
        this.stateTimer = 0;
        this.attackTimer = 0;
        this.lastHitTime = 0;
    }
    start() {
        super.start();
        this.dead = false;
        this.setState(NPCMonsterState.Idle);
        this.startLocation = this.entity.position.get();
        if (this.props.trigger !== undefined && this.props.trigger !== null) {
            this.connectCodeBlockEvent(this.props.trigger, hz.CodeBlockEvents.OnEntityEnterTrigger, (enteredBy) => {
                if (enteredBy.owner.get() !== this.world.getServerPlayer()) {
                    this.hit();
                }
            });
        }
        this.connectNetworkBroadcastEvent(exports.StartAttackingPlayer, ({ player }) => {
            this.onStartAttackingPlayer(player);
        });
        this.connectNetworkBroadcastEvent(exports.StopAttackingPlayer, ({ player }) => {
            this.onStopAttackingPlayer(player);
        });
    }
    update(deltaTime) {
        super.update(deltaTime);
        this.updateTarget();
        this.updateStateMachine(deltaTime);
        this.updateLookAt();
    }
    hit() {
        const now = Date.now() / 1000.0;
        if (now >= this.lastHitTime + NPCMonster.hitAnimationDuration) {
            this.hitPoints--;
            this.lastHitTime = now;
            this.triggerHitAnimation();
            if (this.hitPoints <= 0) {
                this.setState(NPCMonsterState.Dead);
            }
            else {
                this.setState(NPCMonsterState.Hit);
            }
        }
    }
    onStartAttackingPlayer(player) {
        this.players.push(player);
    }
    onStopAttackingPlayer(player) {
        // Remove from the players list
        {
            const index = this.players.indexOf(player, 0);
            if (index > -1) {
                this.players.splice(index, 1);
            }
        }
        if (player === this.targetPlayer) {
            this.targetPlayer = undefined;
        }
    }
    updateTarget() {
        if (this.targetPlayer === undefined) {
            let closestDistanceSq = this.props.maxVisionDistance * this.props.maxVisionDistance;
            const monsterPosition = this.entity.position.get();
            this.players.forEach((player) => {
                const playerPosition = player.position.get();
                const distanceSq = monsterPosition.distanceSquared(playerPosition);
                if (distanceSq < closestDistanceSq) {
                    closestDistanceSq = distanceSq;
                    this.targetPlayer = player;
                }
            });
        }
    }
    updateLookAt() {
        if (this.targetPlayer !== undefined) {
            this.lookAt = this.targetPlayer.position.get();
        }
    }
    updateStateMachine(deltaTime) {
        switch (this.state) {
            case NPCMonsterState.Idle:
                if (this.targetPlayer !== undefined) {
                    // Taunt when a target is acquired
                    this.setState(NPCMonsterState.Taunting);
                }
                break;
            case NPCMonsterState.Taunting:
                this.stateTimer -= deltaTime;
                if (this.stateTimer <= 0) {
                    // 20% chances to run, 80% chances to run
                    if (Math.random() <= 0.8) {
                        this.setState(NPCMonsterState.Walking);
                    }
                    else {
                        this.setState(NPCMonsterState.Running);
                    }
                }
                break;
            case NPCMonsterState.Walking:
                this.updateWalkAndRunStates(deltaTime);
                break;
            case NPCMonsterState.Running:
                this.updateWalkAndRunStates(deltaTime);
                break;
            case NPCMonsterState.Hit:
                this.stateTimer -= deltaTime;
                if (this.stateTimer <= 0) {
                    if (Math.random() <= 0.8) {
                        this.setState(NPCMonsterState.Walking);
                    }
                    else {
                        this.setState(NPCMonsterState.Running);
                    }
                }
            case NPCMonsterState.Dead:
                this.stateTimer -= deltaTime;
                if (this.stateTimer <= 0) {
                    this.setState(NPCMonsterState.Idle);
                }
                break;
        }
    }
    onEnterState(state) {
        switch (state) {
            case NPCMonsterState.Idle:
                this.navMeshAgent?.isImmobile.set(true);
                this.navMeshAgent?.destination.set(this.entity.position.get());
                break;
            case NPCMonsterState.Taunting:
                this.stateTimer = NPCMonster.tauntingAnimationDuration;
                this.navMeshAgent?.isImmobile.set(true);
                this.triggerEmoteAnimation(NPCAgent_1.NPCAgentEmote.Taunt);
                break;
            case NPCMonsterState.Walking:
                this.navMeshAgent?.isImmobile.set(false);
                this.setMaxSpeedToWalkSpeed();
                break;
            case NPCMonsterState.Running:
                this.navMeshAgent?.isImmobile.set(false);
                this.setMaxSpeedToRunSpeed();
                break;
            case NPCMonsterState.Hit:
                this.stateTimer = NPCMonster.hitAnimationDuration;
                this.navMeshAgent?.destination.set(this.entity.position.get());
                this.navMeshAgent?.isImmobile.set(true);
                break;
            case NPCMonsterState.Dead:
                this.stateTimer = NPCMonster.deathDuration;
                this.dead = true;
                break;
        }
    }
    onLeaveState(state) {
        switch (state) {
            case NPCMonsterState.Idle:
                break;
            case NPCMonsterState.Taunting:
                break;
            case NPCMonsterState.Walking:
                break;
            case NPCMonsterState.Running:
                break;
            case NPCMonsterState.Hit:
                break;
            case NPCMonsterState.Dead:
                this.dead = false;
                this.targetPlayer = undefined;
                this.lookAt = undefined;
                this.entity.position.set(this.startLocation);
                this.hitPoints = NPCMonster.maxHitPoints;
                break;
        }
    }
    setState(state) {
        if (this.state != state) {
            this.onLeaveState(this.state);
            this.state = state;
            this.onEnterState(this.state);
        }
    }
    updateWalkAndRunStates(deltaTime) {
        if (this.targetPlayer === undefined) {
            this.setState(NPCMonsterState.Idle);
        }
        else {
            this.navMeshAgent?.destination.set(this.targetPlayer.position.get());
            const distanceToPlayer = this.targetPlayer.position.get().distanceSquared(this.entity.position.get());
            if (distanceToPlayer < this.props.maxAttackDistance * this.props.maxAttackDistance) {
                this.attackTimer -= deltaTime;
                if (this.attackTimer <= 0) {
                    this.attackTimer = NPCMonster.attackAnimationDuration;
                    console.log("Trigger attack animation");
                    this.triggerAttackAnimation();
                }
            }
        }
    }
}
NPCMonster.propsDefinition = {
    ...NPCAgent_1.NPCAgent.propsDefinition,
    trigger: { type: hz.PropTypes.Entity },
    maxVisionDistance: { type: hz.PropTypes.Number, default: 7 },
    maxAttackDistance: { type: hz.PropTypes.Number, default: 5 },
};
NPCMonster.tauntingAnimationDuration = 2.8;
NPCMonster.attackAnimationDuration = 2;
NPCMonster.hitAnimationDuration = 0.5;
NPCMonster.deathDuration = 3;
NPCMonster.maxHitPoints = 4;
hz.Component.register(NPCMonster);
