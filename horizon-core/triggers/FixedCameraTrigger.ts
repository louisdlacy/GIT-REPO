import { Easing } from 'horizon/camera';
import * as hz from 'horizon/core';
import { PlayerCameraEvents } from 'PlayerCamera';

class FixedCameraTrigger extends hz.Component<typeof FixedCameraTrigger> {
  static propsDefinition = {
    cameraPositionEntity: {type: hz.PropTypes.Entity},
  };

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      if (this.props.cameraPositionEntity !== undefined && this.props.cameraPositionEntity !== null) {
        this.sendNetworkEvent(player, PlayerCameraEvents.SetCameraFixedPositionWithEntity, { entity: this.props.cameraPositionEntity, duration: 0.4, easing: Easing.EaseInOut});
      } else {
        console.warn("Attempted to use FixedCameraTrigger without a camera position entity. Create an empty object and reference it in the props.")
      }
    });
  }
}
hz.Component.register(FixedCameraTrigger);
