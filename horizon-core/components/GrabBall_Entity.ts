import { AudioGizmo, CodeBlockEvents, Component, HapticSharpness, HapticStrength, ParticleGizmo, Player, PropTypes } from "horizon/core";


class GrabBall_Entity extends Component<typeof GrabBall_Entity> {
  static propsDefinition = {
    sfx: { type: PropTypes.Entity },
    vfx: { type: PropTypes.Entity },
  };

  preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnGrabStart, (isRightHand, player) => { this.grabStart(isRightHand, player); });
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnGrabEnd, (player) => { this.grabEnd(player); });
  }

  start() {

  }

  grabStart(isRightHand: boolean, player: Player) {
    const fxPos = this.entity.position.get();
    this.props.sfx?.position.set(fxPos);
    this.props.vfx?.position.set(fxPos);

    this.async.setTimeout(() => {
      this.props.sfx?.as(AudioGizmo).play();
      this.props.vfx?.as(ParticleGizmo).play();
    }, 100);

    if (isRightHand) {
      player.rightHand.playHaptics(350, HapticStrength.Medium, HapticSharpness.Soft);
    }
    else {
      player.leftHand.playHaptics(350, HapticStrength.Medium, HapticSharpness.Soft);
    }
  }

  grabEnd(player: Player) {
    //Return
  }
}
Component.register(GrabBall_Entity);