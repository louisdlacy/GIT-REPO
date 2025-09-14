import { CameraMode } from 'horizon/camera';
import * as hz from 'horizon/core';
import { PlayerCameraEvents } from 'PlayerCamera';

class CameraTrigger extends hz.Component<typeof CameraTrigger> {
  static propsDefinition = {
    cameraMode: {type: hz.PropTypes.String},
    keepCameraOnExit: {type: hz.PropTypes.Boolean, default: false}
  };

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      this.sendNetworkEvent(player, PlayerCameraEvents.SetCameraMode, {mode: this.getCameraMode()});
    });

    if (!this.props.keepCameraOnExit) {
      this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, (player: hz.Player) => {
        this.sendNetworkEvent(player, PlayerCameraEvents.RevertPlayerCamera, {});
      });
    }
  }

  getCameraMode(): CameraMode{
    switch(this.props.cameraMode){
      case 'Follow':
        return CameraMode.Follow;
      case 'Pan':
        return CameraMode.Pan;
      case 'Attach':
        return CameraMode.Attach;
      case 'Orbit':
        return CameraMode.Orbit;
      case 'ThirdPerson':
        return CameraMode.ThirdPerson;
      case 'FirstPerson':
        return CameraMode.FirstPerson;
      default:
        return CameraMode.ThirdPerson;
    }
  }
}
hz.Component.register(CameraTrigger);
