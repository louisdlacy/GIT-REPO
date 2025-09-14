import * as hz from "horizon/core";
import { NPCAgent, NPCAgentEmote } from "NPCAgent";

enum NPCMonsterState {
  Idle,
  Taunting,
  Walking,
  Running,
  Hit,
  Dead,
}

export const StartAttackingPlayer: hz.NetworkEvent<{player: hz.Player}> = new hz.NetworkEvent<{player: hz.Player}>("StartAttackingPlayer");
export const StopAttackingPlayer: hz.NetworkEvent<{player: hz.Player}> = new hz.NetworkEvent<{player: hz.Player}>("StopAttackingPlayer");

class NPCMonster extends NPCAgent<typeof NPCMonster> {
  static propsDefinition = {
    ...NPCAgent.propsDefinition,
    trigger: {type: hz.PropTypes.Entity},
    maxVisionDistance: {type: hz.PropTypes.Number, default: 7},
    maxAttackDistance: {type: hz.PropTypes.Number, default: 5},
  };
  static tauntingAnimationDuration: number = 2.8;
  static attackAnimationDuration: number = 2;
  static hitAnimationDuration: number = 0.5;
  static deathDuration: number = 3;
  static maxHitPoints: number = 4;

  players: hz.Player[] = [];
  hitPoints: number = NPCMonster.maxHitPoints;
  targetPlayer: hz.Player | undefined = undefined;
  state: NPCMonsterState = NPCMonsterState.Idle;
  stateTimer: number = 0;
  attackTimer: number = 0;
  lastHitTime: number = 0;

  startLocation!: hz.Vec3;


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

    this.connectNetworkBroadcastEvent(StartAttackingPlayer, ({player}) => {
      this.onStartAttackingPlayer(player);
    });
    this.connectNetworkBroadcastEvent(StopAttackingPlayer, ({player}) => {
      this.onStopAttackingPlayer(player);
    });
  }

  update(deltaTime: number) {
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
      } else {
        this.setState(NPCMonsterState.Hit);
      }
    }
  }

  private onStartAttackingPlayer(player: hz.Player) {
    this.players.push(player);
  }

  private onStopAttackingPlayer(player: hz.Player) {
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

  private updateTarget() {
    if (this.targetPlayer === undefined) {
      let closestDistanceSq = this.props.maxVisionDistance*this.props.maxVisionDistance;
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

  private updateLookAt() {
    if (this.targetPlayer !== undefined) {
      this.lookAt = this.targetPlayer.position.get();
    }
  }

  private updateStateMachine(deltaTime: number) {
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
          } else {
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
          } else {
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

  private onEnterState(state: NPCMonsterState) {
    switch (state) {
      case NPCMonsterState.Idle:
        this.navMeshAgent?.isImmobile.set(true);
        this.navMeshAgent?.destination.set(this.entity.position.get());
        break;
      case NPCMonsterState.Taunting:
        this.stateTimer = NPCMonster.tauntingAnimationDuration;
        this.navMeshAgent?.isImmobile.set(true);
        this.triggerEmoteAnimation(NPCAgentEmote.Taunt);
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

  private onLeaveState(state: NPCMonsterState) {
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

  private setState(state: NPCMonsterState) {
    if (this.state != state) {
      this.onLeaveState(this.state);
      this.state = state;
      this.onEnterState(this.state);
    }
  }

  private updateWalkAndRunStates(deltaTime: number) {
    if (this.targetPlayer === undefined) {
      this.setState(NPCMonsterState.Idle);
    } else {
      this.navMeshAgent?.destination.set(this.targetPlayer.position.get());
      const distanceToPlayer = this.targetPlayer.position.get().distanceSquared(this.entity.position.get());
      if (distanceToPlayer < this.props.maxAttackDistance*this.props.maxAttackDistance) {
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
hz.Component.register(NPCMonster);
