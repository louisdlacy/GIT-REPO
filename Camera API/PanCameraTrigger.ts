import * as hz from 'horizon/core';
import { PlayerCameraEvents } from 'PlayerCamera';

class PanCameraTrigger extends hz.Component<typeof PanCameraTrigger> {
  static propsDefinition = {
    cameraOffset: {type: hz.PropTypes.Vec3, default: new hz.Vec3(2, 0, 0)},
    translationSpeed: {type: hz.PropTypes.Number, default: 4.0},
    collisionsEnabled: {type: hz.PropTypes.Boolean, default: false},
    keepCameraOnExit: {type: hz.PropTypes.Boolean, default: false},
  };

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      this.sendNetworkEvent(player, PlayerCameraEvents.SetCameraCollisions, {collisionsEnabled: this.props.collisionsEnabled});
      if (this.props.cameraOffset !== undefined && this.props.cameraOffset !== null) {
        this.sendNetworkEvent(player, PlayerCameraEvents.SetCameraPan, { positionOffset: this.props.cameraOffset, translationSpeed: this.props.translationSpeed});
      } else {
        console.warn("Attempted to use FixedCameraTrigger without a camera position entity. Create an empty object and reference it in the props.")
      }
    });
    if (!this.props.keepCameraOnExit) {
      this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, (player: hz.Player) => {
        this.sendNetworkEvent(player, PlayerCameraEvents.RevertPlayerCamera, { translationSpeed: 0.0});
      });
    }
  }
}
hz.Component.register(PanCameraTrigger);
