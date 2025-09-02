import { CodeBlockEvents, Color, Component, MeshEntity, ParticleGizmo, Player, PropTypes, SpawnPointGizmo, TriggerGizmo } from "horizon/core";


class TrigOnOff_Entity extends Component<typeof TrigOnOff_Entity> {
  static propsDefinition = {
    triggerToEffect: { type: PropTypes.Entity },
    vfx: { type: PropTypes.Entity },
    tintAble: { type: PropTypes.Entity },
  };

  isOn = false;

  preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, (player) => { this.playerEnterTrigger(player); });
  }

  start() {

  }

  playerEnterTrigger(player: Player) {
    this.isOn = !this.isOn;

    this.props.triggerToEffect?.as(TriggerGizmo).enabled.set(this.isOn);

    if (this.isOn) {
      this.props.vfx?.as(ParticleGizmo).play();
      this.props.tintAble?.as(MeshEntity).style.tintColor.set(Color.green);
    }
    else {
      this.props.vfx?.as(ParticleGizmo).stop();
      this.props.tintAble?.as(MeshEntity).style.tintColor.set(Color.red);
    }
  }
}
Component.register(TrigOnOff_Entity);