import { Easing } from 'horizon/camera';
import * as hz from 'horizon/core';
import * as uab from 'horizon/unity_asset_bundles'
import { PlayerCameraEvents } from 'PlayerCamera';

export const CutsceneEvents = {
  OnStartCutscene: new hz.LocalEvent<{player: hz.Player, doorButton: hz.Entity}>('OnStartCutscene'),
  OnCutsceneComplete: new hz.LocalEvent<{}>('OnCutsceneComplete'),
}

interface PlayerTimerId {
  [playerName: string]: number;
}

class DoorCutscene extends hz.Component<typeof DoorCutscene> {
  static propsDefinition = {
    door: {type: hz.PropTypes.Entity},
    cameraStart: {type: hz.PropTypes.Entity},
    cameraEnd: {type: hz.PropTypes.Entity},
    moveDuration: {type: hz.PropTypes.Number, default: 5},
    robot: {type: hz.PropTypes.Entity},
  };

  static readonly MoveToStartDuration: number = 0.4;
  private static readonly MoveToStartEasing: Easing = Easing.Linear;
  private static readonly DollyEasing: Easing = Easing.EaseOut;
  static readonly DoorOpenDelay: number = 0.5;
  static readonly RobotAnimationLength: number = 1.8;

  private cameraDollyTimeoutId: PlayerTimerId = {};
  private cameraResetTimeoutId: PlayerTimerId = {};
  private environmentalAnimationIsPlaying: boolean = false;
  private doorButton: hz.Entity | undefined = undefined;

  start() {
    this.connectLocalEvent(this.entity, CutsceneEvents.OnStartCutscene, ({player, doorButton}) => {
        this.doorButton = doorButton;
        // Play the camera aniations. You can add / edit / remove for your own camera animations here.
        this.playCameraAnimation(player);
        // Play environmental animations. You can add / edit / remove for your own environmental animations here.
        this.playEnvironmentalAnimation();
        this.connectNetworkEvent(player, PlayerCameraEvents.OnCameraResetPressed, () => {
          this.quitCameraAnimationForPlayer(player);
        })
    });

  }

  playCameraAnimation(player: hz.Player){
    const playerName = player.name.get();
    if (this.props.cameraStart !== undefined && this.props.cameraStart !== null) {
      // Move camera to the start position
      this.sendNetworkEvent(player, PlayerCameraEvents.SetCameraFixedPositionWithEntity, {entity: this.props.cameraStart, duration: DoorCutscene.MoveToStartDuration, easing: DoorCutscene.MoveToStartEasing});

      // Move the camera to the end position over time and after a delay. The delay should be long enough to allow the camera to move to the start position (at least the duration of the first camera move).
      this.cameraDollyTimeoutId[playerName] = this.async.setTimeout(() => {
        if (this.props.cameraEnd !== undefined && this.props.cameraEnd !== null) {
          this.sendNetworkEvent(player, PlayerCameraEvents.SetCameraFixedPositionWithEntity, {entity: this.props.cameraEnd, duration: this.props.moveDuration, easing: DoorCutscene.DollyEasing});
        } else {
          console.warn("No cameraEnd was set in DoorCutscene props. Reverting to previous camera.")
          this.sendNetworkEvent(player, PlayerCameraEvents.RevertPlayerCamera, {});
        }
        this.cameraDollyTimeoutId[playerName] = -1;
      }, DoorCutscene.MoveToStartDuration * 1000); // * 1000 to convert from seconds to milliseconds

      // Camera movement completed. Reset the player camera.
      this.cameraResetTimeoutId[playerName] = this.async.setTimeout(() => {
        this.sendNetworkEvent(player, PlayerCameraEvents.RevertPlayerCamera, {});
        this.cameraResetTimeoutId[playerName] = -1;
      }, (DoorCutscene.MoveToStartDuration + this.props.moveDuration + DoorCutscene.RobotAnimationLength + 0.2) * 1000);
    }
  }

  quitCameraAnimationForPlayer(player: hz.Player) {
    const playerName = player.name.get();
    if (this.cameraDollyTimeoutId[playerName] !== -1) {
      this.async.clearTimeout(this.cameraDollyTimeoutId[playerName]);
      this.cameraDollyTimeoutId[playerName] = -1;
    }
    console.log("Clearing camera reset timer started for player " + playerName + " id: " + this.cameraResetTimeoutId[playerName]);
    if (this.cameraResetTimeoutId[playerName] !== -1) {
      this.async.clearTimeout(this.cameraResetTimeoutId[playerName]);
      this.cameraResetTimeoutId[playerName] = -1;
    }
  }

  playEnvironmentalAnimation(){

    if (this.environmentalAnimationIsPlaying) {
      console.warn("Triggered another environmental animation while one is already playing. Ignoring additional animation call.");
      return;
    }
    this.environmentalAnimationIsPlaying = true;

    // Open the door after a delay.
    this.async.setTimeout(() => {
      if (this.props.door !== undefined && this.props.door !== null) {
        this.props.door.as(hz.AnimatedEntity).play();
      } else {
        console.warn("DoorButton pressed, but no door was set in the props.")
      }
    }, (DoorCutscene.MoveToStartDuration + DoorCutscene.DoorOpenDelay) * 1000);

    // Play the robot waving animation. Delete this function if you want to remove the robot animation.
    const robot: undefined | uab.AssetBundleInstanceReference = this.props.robot?.as(uab.AssetBundleGizmo).getRoot();
    this.async.setTimeout(() => {
      if (robot !== undefined && robot !== null) {
        robot.setAnimationParameterTrigger("EmoteYes");
      }else {
        console.warn("Attempted robot animation, but no robot was set in the props.")
      }
    }, this.props.moveDuration * 1000);

    // Shut the door again. Delete this function if you want to keep the door open.
    this.async.setTimeout(() => {
      if (this.props.door !== undefined && this.props.door !== null) {
        this.props.door.as(hz.AnimatedEntity).stop();
        this.environmentalAnimationIsPlaying = false;
        if (this.doorButton !== undefined) {
          this.sendNetworkEvent(this.doorButton, CutsceneEvents.OnCutsceneComplete, {});
        } else {
          console.warn("DoorButton pressed, but no door button was found. Did the Cutscene end without starting?")
        }
      }
    }, (DoorCutscene.MoveToStartDuration + this.props.moveDuration + DoorCutscene.RobotAnimationLength) * 1000);
  }

}
hz.Component.register(DoorCutscene);
