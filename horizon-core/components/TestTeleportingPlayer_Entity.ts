import { AvatarAIAgent } from "horizon/avatar_ai_agent";
import { CodeBlockEvents, Component, Player } from "horizon/core";
import { teleportPlayer_Func } from "TeleportPlayer_Func";


class TestTeleportingPlayer_Entity extends Component<typeof TestTeleportingPlayer_Entity> {
  static propsDefinition = {};

  preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterWorld, (player) => { this.playerEnterWorld(player); });
  }

  start() {

  }

  playerEnterWorld(player: Player) {
    if (AvatarAIAgent.getGizmoFromPlayer(player) === undefined) {
      this.async.setTimeout(() => {
        teleportPlayer_Func.randomLocation(player);
      }, 500);
    }
  }
}
Component.register(TestTeleportingPlayer_Entity);