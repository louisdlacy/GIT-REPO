import * as hz from 'horizon/core';
import { PlayerCameraEvents } from 'PlayerCamera';

class AttachCameraTrigger extends hz.Component<typeof AttachCameraTrigger>{
  static propsDefinition = {
    target: {type: hz.PropTypes.Entity},
  };

  preStart() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, this.OnPlayerEnterTrigger.bind(this));
  }

  start() {

  }

  OnPlayerEnterTrigger(player: hz.Player) {
    if (this.props.target !== undefined && this.props.target !== null) {
      this.sendNetworkEvent(player, PlayerCameraEvents.SetCameraAttachWithTarget, {target: this.props.target});
    } else {
      console.warn("AttachCameraTrigger: target is undefined or null. Did you forget to set the target?");
    }
  }
}
hz.Component.register(AttachCameraTrigger);
