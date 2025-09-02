import { WelcomeTriggerBox } from "WelcomeTriggerBox";
import * as hz from "horizon/core";
import { NPCAgent, NPCAgentEmote } from "NPCAgent";

class NPCWelcomeRobot extends NPCAgent<typeof NPCWelcomeRobot> {
  static propsDefinition = {
    ...NPCAgent.propsDefinition,
  };
  static greetAnimationDuration: number = 3;
  static pointAnimationDuration: number = 2;
  static idleDuration: number = 1;

  players: hz.Player[] = [];
  playersToGreet: hz.Player[] = [];
  playerToLookAt: hz.Player | undefined;
  nextStateTimer: number = 0;
  initialRotaiton: hz.Quaternion = hz.Quaternion.one;

  start() {
    super.start();
    this.connectLocalBroadcastEvent(
      WelcomeTriggerBox.welcomeTriggerZoneEvent,
      (data) => {
        if (data.entered) {
          this.onPlayerEnterWelcomeZone(data.player);
        } else {
          this.onPlayerExitWelcomeZone(data.player);
        }
      }
    );

    this.initialRotaiton = this.entity.rotation.get();
  }

  update(deltaTime: number) {
    super.update(deltaTime);
    this.nextStateTimer -= deltaTime;

    if (this.nextStateTimer <= 0) {
      if (this.playersToGreet.length > 0) {
        this.greetPlayer(this.playersToGreet.shift()!);
        this.nextStateTimer = NPCWelcomeRobot.greetAnimationDuration;
      } else {
        // 20 percent chance to point at a random player.
        if (Math.random() < 0.2) {
          if (this.players.length > 0) {
            const randomIndex = Math.floor(Math.random() * this.players.length);
            this.playerToLookAt = this.players[randomIndex];
            this.triggerEmoteAnimation(NPCAgentEmote.Point);
          }
          this.nextStateTimer = NPCWelcomeRobot.pointAnimationDuration;
        } else {
          this.nextStateTimer = NPCWelcomeRobot.idleDuration;
        }
      }
    }

    if (this.playerToLookAt != undefined) {
      const delta = this.playerToLookAt.head.position
        .get()
        .sub(this.entity.position.get());
      const lookRotation = hz.Quaternion.lookRotation(delta, hz.Vec3.up);
      const newRotation = hz.Quaternion.slerp(
        this.entity.rotation.get(),
        lookRotation,
        0.2
      );
      this.entity.rotation.set(newRotation);

      this.lookAt = this.playerToLookAt.head.position.get();
    } else {
      const newRotation = hz.Quaternion.slerp(
        this.entity.rotation.get(),
        this.initialRotaiton,
        0.2
      );
      this.entity.rotation.set(newRotation);

      this.lookAt = undefined;
    }
  }

  onPlayerEnterWelcomeZone(player: hz.Player) {
    this.players.push(player);
    this.playersToGreet.push(player);
  }

  onPlayerExitWelcomeZone(player: hz.Player) {
    // Remove from the players list
    {
      const index = this.players.indexOf(player, 0);
      if (index > -1) {
        this.players.splice(index, 1);
      }
    }

    // Remove from the players to greet list
    {
      const index = this.playersToGreet.indexOf(player, 0);
      if (index > -1) {
        this.playersToGreet.splice(index, 1);
      }
    }

    if (player == this.playerToLookAt) {
      this.playerToLookAt = undefined;
    }
  }

  greetPlayer(player: hz.Player) {
    this.playerToLookAt = player;
    this.navMeshAgent?.destination.set(player.head.position.get());
    this.triggerEmoteAnimation(NPCAgentEmote.Celebration);
  }
}
hz.Component.register(NPCWelcomeRobot);
