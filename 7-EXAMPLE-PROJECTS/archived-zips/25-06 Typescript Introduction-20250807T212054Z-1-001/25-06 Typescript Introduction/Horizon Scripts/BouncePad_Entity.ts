import { CodeBlockEvents, Component, Player, PropTypes, Vec3 } from "horizon/core";


class BouncePad_Entity extends Component<typeof BouncePad_Entity> {
  static propsDefinition = {
    trigger: { type: PropTypes.Entity },
    bounceVelocityMultiplier: { type: PropTypes.Number, default: 10 },
    isUsingPlayerForward: { type: PropTypes.Boolean, default: false },
  };

  preStart() {
    if (this.props.trigger) {
      this.connectCodeBlockEvent(this.props.trigger, CodeBlockEvents.OnPlayerEnterTrigger, (player) => { this.playerEnterTrigger(player); });
    }
  }

  start() {

  }

  playerEnterTrigger(player: Player) {
    const direction = (Vec3.lerp(this.entity.up.get(), player.torso.forward.get(), 0.5)).normalize();

    player.velocity.set(direction.mul(this.props.bounceVelocityMultiplier));
  }
}
Component.register(BouncePad_Entity);