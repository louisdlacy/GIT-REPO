import { AvatarAIAgent } from "horizon/avatar_ai_agent";
import { CodeBlockEvents, Component, Player, PropTypes } from "horizon/core";


class AvatarNPCs_Entity extends Component<typeof AvatarNPCs_Entity> {
  static propsDefinition = {
    destination: { type: PropTypes.Entity },
  };

  preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterWorld, (player) => { this.playerEnterWorld(player); });
  }

  start() {
  }
  
  playerEnterWorld(player: Player) {
    if (this.entity === AvatarAIAgent.getGizmoFromPlayer(player)) {
      if (this.props.destination) {
        this.entity.as(AvatarAIAgent).locomotion.moveToPosition(this.props.destination.position.get());
      }
    }
  }
}
Component.register(AvatarNPCs_Entity);