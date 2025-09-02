import { AvatarAIAgent } from "horizon/avatar_ai_agent";
import { CodeBlockEvents, Component, Player, PropTypes, Vec3 } from "horizon/core";


class AvatarNPCs_Entity extends Component<typeof AvatarNPCs_Entity> {
  static propsDefinition = {
    destination: { type: PropTypes.Entity },
  };

  destination = Vec3.zero;

  preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterWorld, (player) => { this.playerEnterWorld(player); });
  }

  start() {
    if (this.props.destination) {
      this.destination = this.props.destination.position.get();
    }
  }

  playerEnterWorld(player: Player) {
    if (this.entity === AvatarAIAgent.getGizmoFromPlayer(player)) {
      this.entity.as(AvatarAIAgent).locomotion.moveToPosition(this.destination);

      this.async.setInterval(() => { this.loop(player); }, 500);
    }
  }

  loop(npcPlayer: Player) {
    const distanceVec = this.destination.sub(npcPlayer.position.get());
    const distanceWithoutY = distanceVec.componentMul(new Vec3(1,0,1)).magnitude();

    if (distanceWithoutY < 1 && distanceWithoutY > 0.25) {
      this.entity.as(AvatarAIAgent).locomotion.jump();
    }
  }
}
Component.register(AvatarNPCs_Entity);