import * as hz from 'horizon/core';
import { PlayerCameraEvents } from 'PlayerCamera';

class FollowCameraTrigger extends hz.Component<typeof FollowCameraTrigger> {
  static propsDefinition = {
    activationDelay: {type: hz.PropTypes.Number, default: 0.5},
    cameraTurnSpeed: {type: hz.PropTypes.Number, default: 0.5},
    continuousRotation: {type: hz.PropTypes.Boolean, default: true},
    distance: {type: hz.PropTypes.Number, default: 12},
    horizonLevelling: {type: hz.PropTypes.Boolean, default: true},
    rotationSpeed: {type: hz.PropTypes.Number, default: 0.5},
    translationSpeed: {type: hz.PropTypes.Number, default: 4.0},
    verticalOffset: {type: hz.PropTypes.Number, default: 0.1},
    collisionsEnabled: {type: hz.PropTypes.Boolean, default: false},
    keepCameraOnExit: {type: hz.PropTypes.Boolean, default: false},
  };

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      this.sendNetworkEvent(player, PlayerCameraEvents.SetCameraCollisions, {collisionsEnabled: this.props.collisionsEnabled});
      if (this.props.verticalOffset !== undefined && this.props.verticalOffset !== null) {
        this.sendNetworkEvent(player, PlayerCameraEvents.SetCameraFollow, {activationDelay: this.props.activationDelay, cameraTurnSpeed: this.props.cameraTurnSpeed, continuousRotation: this.props.continuousRotation, distance: this.props.distance, horizonLevelling: this.props.horizonLevelling, rotationSpeed: this.props.rotationSpeed, translationSpeed: this.props.translationSpeed, verticalOffset: this.props.verticalOffset});
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
hz.Component.register(FollowCameraTrigger);
