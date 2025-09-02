import { Camera, CameraMode } from 'horizon/camera';
import * as hz from 'horizon/core';
import { PlayerCameraEvents } from 'PlayerCamera';

// This weapon class can be extended to create different types of weapons (see Gun.ts for an example)
// Grabbing this weapon will set the camera mode to the specified mode.
// Dropping the weapon will set the camera mode back to third person.
export class Weapon<T> extends hz.Component<typeof Weapon & T> {
  static propsDefinition = {
    cameraMode: {type: hz.PropTypes.String},
    fireCooldown: {type: hz.PropTypes.Number, default: 0.1},
  };

  private fireCooldown: number = 0.1;
  private lastFired = -1;

  preStart() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabStart, (isRightHand, player) => { this.onGrab(player); });
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabEnd, (player) => { this.onRelease(); });
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnIndexTriggerDown, (player) => { this.onIndexTriggerDown(player); });
  }

  start(){
    this.fireCooldown = this.props.fireCooldown * 1000;
  }

  onGrab(player: hz.Player) {
    console.log("Weapon: onGrab");
    this.entity.owner.set(player);
    this.sendNetworkEvent(player, PlayerCameraEvents.SetCameraMode, {mode: this.getCameraMode()});
  }

  onRelease(){
    const player = this.entity.owner.get();
    this.entity.owner.set(this.world.getServerPlayer());
    this.sendNetworkEvent(player, PlayerCameraEvents.SetCameraMode, {mode: CameraMode.ThirdPerson});
  }

  // This is called when the index trigger is pressed.
  // Plays the fire animation and returns true if the weapon was fired.
  // fireCooldown is the minimum time between shots, so use this to prevent spamming, and adjust the timer to take into account the character's animation time.
  // You can override this function to add custom behavior. See Gun::onIndexTriggerDown() for an example.
  onIndexTriggerDown(player: hz.Player): boolean {
    if (player === this.entity.owner.get()) {
      if (this.lastFired === -1 || Date.now() - this.lastFired > this.fireCooldown) {
        this.lastFired = Date.now();
        player.playAvatarGripPoseAnimationByName(hz.AvatarGripPoseAnimationNames.Fire);
        return true;
      }
    }
    return false;
  }

  getCameraMode(): CameraMode{
    switch(this.props.cameraMode){
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
hz.Component.register(Weapon);
