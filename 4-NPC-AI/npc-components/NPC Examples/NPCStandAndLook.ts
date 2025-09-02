import * as hz from "horizon/core";
import { NPCAgent, NPCAgentEmote } from "NPCAgent";

export const LookAtPlayer: hz.LocalEvent<{player: hz.Player}> = new hz.LocalEvent<{player: hz.Player}>('LookAtPlayer');
export const StopLookingAtPlayer: hz.LocalEvent<{player: hz.Player}> = new hz.LocalEvent<{player: hz.Player}>('StopLookingAtPlayer');
export const PlayAnimation: hz.LocalEvent<{animation: string, player: hz.Player | undefined}> = new hz.LocalEvent<{animation: string, player: hz.Player | undefined}>('PlayAnimation');

export class NPCStandAndLook extends NPCAgent<typeof NPCStandAndLook> {
  static propsDefinition = {
    ...NPCAgent.propsDefinition,
    lookAtAllPlayers: {type: hz.PropTypes.Boolean, default: true},
    changeTargetDelayMin: {type: hz.PropTypes.Number, default: 1},
    changeTargetDelayMax: {type: hz.PropTypes.Number, default: 5},
  };
  static dummy: number = 0;

  players: hz.Player[] = [];
  playerToLookAt: hz.Player | undefined;
  reevaluateTimer: number = 0;

  start() {
    super.start();

    if (this.props.lookAtAllPlayers) {
      this.connectCodeBlockEvent(
        this.entity,
        hz.CodeBlockEvents.OnPlayerEnterWorld,
        (player: hz.Player) => {
          this.onLookAtPlayer(player);
        }
      );

      this.connectCodeBlockEvent(
        this.entity,
        hz.CodeBlockEvents.OnPlayerExitWorld,
        (player: hz.Player) => {
          this.onStopLookingAtPlayer(player);
        }
      );
    }

    this.connectLocalEvent(this.entity, LookAtPlayer, ({player}) => {
      this.onLookAtPlayer(player);
    });

    this.connectLocalEvent(this.entity, StopLookingAtPlayer, ({player}) => {
      this.onStopLookingAtPlayer(player);
    });

    this.connectLocalEvent(this.entity, PlayAnimation, ({animation, player}) => {
      console.log("Playing emote");
      if (player !== undefined) {
        this.playerToLookAt = player;
        this.reevaluateTimer = this.getReevaluateDelay();
      }
      this.triggerAnimation(animation);
    });

  }

  onLookAtPlayer(player: hz.Player) {
    this.players.push(player);
  }

  onStopLookingAtPlayer(player: hz.Player) {
    const index = this.players.indexOf(player, 0);
    if (index > -1) {
      this.players.splice(index, 1);
    }

    if (player == this.playerToLookAt) {
      this.playerToLookAt = undefined;
    }
  }

  update(deltaTime: number): void {
    super.update(deltaTime);

    this.reevaluateTimer -= deltaTime;
    if (this.reevaluateTimer <= 0 || this.playerToLookAt == undefined) {
      this.playerToLookAt = this.selectRandomPlayerToLookAt();

      // Wait 1-5s before changing who to look at.
      this.reevaluateTimer = this.getReevaluateDelay();
    }

    if (this.playerToLookAt != undefined) {
      this.lookAt = this.playerToLookAt.head.position.get();
    }
  }

  selectRandomPlayerToLookAt(): hz.Player | undefined {
    const candidates: hz.Player[] = [];
    const forward = this.entity.forward.get();
    this.players.forEach((player) => {
      if (hz.Vec3.dot(forward, player.head.position.get()) > 0) {
        candidates.push(player);
      }
    });

    if (candidates.length == 0) {
      return undefined;
    } else {
      const index = Math.floor(Math.random() * candidates.length);
      return candidates[index];
    }
  }

  getReevaluateDelay(): number {
    return this.props.changeTargetDelayMin + Math.random() * (this.props.changeTargetDelayMax - this.props.changeTargetDelayMin);
  }
}
hz.Component.register(NPCStandAndLook);
