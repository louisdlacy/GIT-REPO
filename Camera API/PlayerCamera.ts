import * as hz from 'horizon/core';
import LocalCamera, { AttachCameraMode, CameraMode, Easing, FixedCameraMode, FollowCameraMode } from 'horizon/camera';
import { CameraManagerEvents } from 'PlayerCameraManager';

// See PlayerCameraManager.ts for step-by-step instructions on how to use this class.

export const PlayerCameraEvents = {
  SetCameraMode: new hz.NetworkEvent<{ mode: CameraMode}>('SetCameraMode'),
  SetCameraFixedPosition: new hz.NetworkEvent<{position: hz.Vec3, rotation?: hz.Quaternion, duration?: number, easing: Easing}>('SetCameraFixedPosition'),
  SetCameraFixedPositionWithEntity: new hz.NetworkEvent<{entity: hz.Entity, duration?: number, easing?: Easing}>('SetCameraFixedPositionWithEntity'),
  SetCameraAttachWithTarget: new hz.NetworkEvent<{target: hz.Entity | hz.Player, positionOffset?: hz.Vec3, rotationOffset?: hz.Vec3 | hz.Quaternion}>('SetCameraAttachWithPlayer'),
  SetCameraPan: new hz.NetworkEvent<{positionOffset: hz.Vec3, translationSpeed: number}>('SetCameraPan'),
  SetCameraFollow: new hz.NetworkEvent<{activationDelay: number, cameraTurnSpeed: number, continuousRotation: boolean, distance: number, horizonLevelling: boolean, rotationSpeed:number, translationSpeed: number, verticalOffset: number}>('SetCameraFollow'),
  SetCameraCollisions: new hz.NetworkEvent<{collisionsEnabled: boolean}>('SetCameraCollisions'),
  RevertPlayerCamera: new hz.NetworkEvent<{}>('RevertPlayerCamera'),
  OnCameraResetPressed: new hz.NetworkEvent<{player: hz.Player}>('OnCameraResetPressed'),
}

// Definitions of default camera options.
// cameraOptions is the base options that will be applied to all camera modes.
const cameraOptions = {
  duration: 0.4, // time to transition to the new camera mode in seconds
  easing: Easing.EaseOut, // easing function to use for the transition
}

const cameraOptionsThirdPerson = {
}

const cameraOptionsFirstPerson = {
}

// cameraOptionsOrbit, cameraOptionsFirstPerson, and cameraOptionsThirdPerson are the options that will be applied to the specific camera modes.
const cameraOptionsOrbit = {
  distance: 12, // distance from the player to the camera
}

// cameraOptionsPan can be implemented for side scrolling and top-down view functionality.
const cameraOptionsPan = {
  positionOffset: new hz.Vec3(2, 0, 0), // position of the camera
  translationSpeed: 4.0, // translation speed
}

// cameraOptionsFollow can be implemented for a camera that follows the player.
const cameraOptionsFollow = {
    activationDelay: 0.5,
    cameraTurnSpeed: 0.5,
    continuousRotation: Boolean(true),
    distance: 12,
    horizonLevelling: Boolean(true),
    rotationSpeed: 0.5,
    translationSpeed: 4.0,
    verticalOffset: 0.5,
}

export class PlayerCamera extends hz.Component<typeof PlayerCamera> {
  static propsDefinition = {};
  private player: hz.Player | undefined = undefined;
  private previousCameraMode: number = -1;
  private cameraResetInput: hz.PlayerInput | undefined = undefined;
  private cameraResetHasRegisteredCallback: boolean = false;
  private defaultLocomotionSpeed: number = 4.5; // TODO: Change this if you alter the player's default speed.
  private defaultCameraCollisionsEnabled: boolean | undefined = undefined;

  start() {
    // Self register this PlayerCamera to the PlayerManager using a broadcast event.
    // We are using a broadcast event because it is easier to add / remove cameras as you adjust the number of max players for your world.
    // For more performance at world startup you may want to make this a non-broadcast network event and use the propsDefinition
    //  to specify a reference to the PlayerManager, then just use a sendNetworkEvent directly.
    this.sendNetworkBroadcastEvent(CameraManagerEvents.OnRegisterPlayerCamera, {ObjectId: "PlayerCamera", Object: this.entity});
  }

  initCameraListeners(player: hz.Player){
    // Listen for an event on the player to set the camera mode.
      // This event could be sent by an object (e.g. on a grab event) or a trigger (e.g. on enter event).
      this.connectNetworkEvent(player, PlayerCameraEvents.SetCameraMode, ({mode}) => {
        this.setCameraMode(mode);
      });
      this.connectNetworkEvent(player, PlayerCameraEvents.SetCameraFixedPosition, ({position, rotation, duration, easing}) => {
        this.setCameraFixedPosition(position, rotation, duration, easing);
      });
      this.connectNetworkEvent(player, PlayerCameraEvents.SetCameraFixedPositionWithEntity, ({entity, duration, easing}) => {
        this.setCameraFixedPositionWithEntity(entity, duration, easing);
      });
      this.connectNetworkEvent(player, PlayerCameraEvents.SetCameraPan, ({positionOffset, translationSpeed}) => {
        this.setCameraPan(positionOffset, translationSpeed);
      });
      this.connectNetworkEvent(player, PlayerCameraEvents.SetCameraFollow, ({activationDelay, cameraTurnSpeed, continuousRotation, distance, horizonLevelling, rotationSpeed, translationSpeed, verticalOffset}) => {
        this.setCameraFollow(activationDelay, cameraTurnSpeed, continuousRotation, distance, horizonLevelling, rotationSpeed, translationSpeed, verticalOffset);
      });
      this.connectNetworkEvent(player, PlayerCameraEvents.SetCameraCollisions, ({collisionsEnabled}) => {
        this.setCameraCollisions(collisionsEnabled);
      });
      this.connectNetworkEvent(player, PlayerCameraEvents.RevertPlayerCamera, ()=> {
        this.revertPlayerCamera();
      });
      this.connectNetworkEvent(player, PlayerCameraEvents.SetCameraAttachWithTarget, ({target}) => {
        this.setCameraAttachedToTarget(target);
      });
  }

  receiveOwnership(_serializableState: hz.SerializableState, _oldOwner: hz.Player, _newOwner: hz.Player): void {
    if (_newOwner !== this.world.getServerPlayer()) {
      this.player = _newOwner;
      this.initCameraListeners(_newOwner);
    }
  }

  setCameraMode(mode: CameraMode) {
    if (mode === CameraMode.Fixed){
      console.warn("Used SetCameraMode with a fixed camera. Use SetFixedCameraPosition instead.");
      return;
    }
    // If we're switching to a new camera mode, save the previous camera mode so we can switch back to it.
    if (mode !== this.getCurrentCameraMode()) {
      this.setPreviousCameraMode();
    }
    // If we are switching away from a fixed camera, remove the camera reset button and allow player to move.
    if (this.getPreviousCameraMode() === CameraMode.Fixed || this.getPreviousCameraMode() === CameraMode.Attach) {
      this.displayCameraResetButton(false);
      if (this.player !== undefined && this.player !== null){
        this.player.locomotionSpeed.set(this.defaultLocomotionSpeed);
      }
    }
    switch (mode) {
      case CameraMode.Orbit:
        LocalCamera.setCameraModeOrbit({...cameraOptions, ...cameraOptionsOrbit});
        break;
      case CameraMode.FirstPerson:
        LocalCamera.setCameraModeFirstPerson({...cameraOptions, ...cameraOptionsFirstPerson});
        break;
      case CameraMode.ThirdPerson:
        LocalCamera.setCameraModeThirdPerson({...cameraOptions, ...cameraOptionsThirdPerson});
        break;
      case CameraMode.Pan:
        LocalCamera.setCameraModePan({...cameraOptions, ...cameraOptionsPan});
        break;
      case CameraMode.Follow:
        LocalCamera.setCameraModeFollow({...cameraOptions, ...cameraOptionsFollow});
        break;
      default:
        console.warn("Unknown camera mode: " + mode);
        break;
    }
  }

  // Set the camera to a fixed position and rotation.
  setCameraFixedPosition(position: hz.Vec3, rotation: hz.Quaternion | undefined, duration: number | undefined, easing: Easing | undefined){
    // If we're switching to a new camera mode, save the previous camera mode so we can switch back to it.
    if (this.getCurrentCameraMode() !== CameraMode.Fixed) {
      this.setPreviousCameraMode();
    }
    this.displayCameraResetButton(true);
    // Stop player from moving when in fixed camera mode.
    if (this.player !== undefined && this.player !== null){
      this.player.locomotionSpeed.set(0); // Delete this line to allow the player to move while in fixed camera mode.
    }
    LocalCamera.setCameraModeFixed({
      position,
      rotation,
      duration,
      easing
    });
  }

  // Use an entity's position and rotation to set the camera to a fixed position and rotation.
  // Pass this function an empty object from the world to use it's position and rotation - helpful for avoiding the use of hardcoded values.
  setCameraFixedPositionWithEntity(entity: hz.Entity, duration: number | undefined, easing: Easing | undefined) {
    const position = entity.position.get();
    const rotation = entity.rotation.get();
    this.setCameraFixedPosition(position, rotation, duration, easing);
  }

  // Set the camera with a custom position and/or translation speed
  // Use undefined for positionOffset if you only want to set translationSpeed
  setCameraPan(positionOffset: hz.Vec3, translationSpeed: number) {

    if(this.getCurrentCameraMode() !== CameraMode.Pan) {
      this.setPreviousCameraMode();
    }
    if (positionOffset === undefined) {
      positionOffset = cameraOptionsPan.positionOffset;
    }
    if (translationSpeed === undefined) {
      translationSpeed = cameraOptionsPan.translationSpeed;
    }
    LocalCamera.setCameraModePan({...cameraOptions, positionOffset, translationSpeed});
  }

  // Configure the camera to follow the player with custom settings.
  setCameraFollow(activationDelay: number, cameraTurnSpeed: number, continuousRotation: boolean, distance: number, horizonLevelling: boolean, rotationSpeed: number, translationSpeed: number, verticalOffset: number ) {

    if(this.getCurrentCameraMode() !== CameraMode.Follow) {
      this.setPreviousCameraMode();
    }
    if (activationDelay === undefined) {
      activationDelay = cameraOptionsFollow.activationDelay;
    }
    if (cameraTurnSpeed === undefined) {
      cameraTurnSpeed = cameraOptionsFollow.cameraTurnSpeed;
    }
    if (continuousRotation === undefined) {
      continuousRotation = cameraOptionsFollow.continuousRotation;
    }
    if (distance === undefined) {
      distance = cameraOptionsFollow.distance;
    }
    if (horizonLevelling === undefined) {
      horizonLevelling = cameraOptionsFollow.horizonLevelling;
    }
    if (rotationSpeed === undefined) {
      rotationSpeed = cameraOptionsFollow.rotationSpeed;
    }
    if (translationSpeed === undefined) {
      translationSpeed = cameraOptionsFollow.translationSpeed;
    }
    if (verticalOffset === undefined) {
      verticalOffset = cameraOptionsFollow.verticalOffset;
    }
    LocalCamera.setCameraModeFollow({...cameraOptions, activationDelay, cameraTurnSpeed, continuousRotation, distance, horizonLevelling, rotationSpeed, translationSpeed, verticalOffset});
  }

  setCameraAttachedToTarget(target: hz.Entity | hz.Player){
    if(this.getCurrentCameraMode() !== CameraMode.Attach){
      this.setPreviousCameraMode();
    }

    this.displayCameraResetButton(true);
    // Stop player from moving when in fixed camera mode.
    if (this.player !== undefined && this.player !== null){
      this.player.locomotionSpeed.set(0); // Delete this line to allow the player to move while in fixed camera mode.
    }

    LocalCamera.setCameraModeAttach(target, {
      ...cameraOptions,
    })
  }

  // Adds a custom input button to enable players to reset their camera to the previous camera mode.
  // We use this when the camera mode is set to Fixed to avoid players getting stuck in a fixed camera mode, but you can use it for any camera mode.
  displayCameraResetButton(on: boolean) {
    if (on) {
      if (!this.cameraResetHasRegisteredCallback) {
        this.cameraResetInput = hz.PlayerControls.connectLocalInput(hz.PlayerInputAction.LeftGrip, hz.ButtonIcon.Door, this, {preferredButtonPlacement: hz.ButtonPlacement.Center});
        this.cameraResetInput.registerCallback((action, pressed) => {
          if(pressed) {
            this.onCameraResetButtonPressed();
          }
        });
        this.cameraResetHasRegisteredCallback = true;
      }
    } else if (this.cameraResetInput !== undefined) {
      this.cameraResetInput?.disconnect();
      this.cameraResetHasRegisteredCallback = false;
    }
  }

  // Handler for when the reset button is pressed. Reverts the camera to the previous camera mode.
  onCameraResetButtonPressed() {
    if (this.player !== undefined && this.player !== null) {
      // Check we have a previous camera mode, otherwise default to third person.
      this.sendNetworkEvent(this.player, PlayerCameraEvents.OnCameraResetPressed, {player: this.player}); // You can remove this if you are not using the cutscene system or don't care about the player's camera resetting.
      this.revertPlayerCamera();
    }
  }

  revertPlayerCamera() {
    if (this.player !== undefined && this.player !== null) {
      const previousCameraMode = this.getPreviousCameraMode();
      console.log("Revert player camera: " + previousCameraMode);
      this.sendNetworkEvent(this.player, PlayerCameraEvents.SetCameraMode, {mode: previousCameraMode});
      if (this.defaultCameraCollisionsEnabled !== undefined) {
        this.sendNetworkEvent(this.player, PlayerCameraEvents.SetCameraCollisions, {collisionsEnabled: this.defaultCameraCollisionsEnabled});
      }
    } else {
      console.warn("PlayerCamera: revertPlayerCamera called with no player set.");
    }
  }

  setPreviousCameraMode(){
    this.previousCameraMode = this.getCurrentCameraMode();
  }

  getPreviousCameraMode(): number {
    let previousCameraMode = CameraMode.ThirdPerson;
    if (this.previousCameraMode !== -1) {
      previousCameraMode = this.previousCameraMode;
    }
    return previousCameraMode;
  }

  getCurrentCameraMode(): number {
    let currentMode: number = LocalCamera.currentMode.get();
    if (currentMode === 7) currentMode = CameraMode.Orbit;
    return currentMode;
  }

  // Toggle camera collisions. If set to true, the camera will collide with the world, preferring to move closer to the player if collision is detected.
  setCameraCollisions(collisionsEnabled: boolean) {
    if (this.defaultCameraCollisionsEnabled === undefined) {
      this.defaultCameraCollisionsEnabled = LocalCamera.collisionEnabled.get();
      LocalCamera.collisionEnabled.set(collisionsEnabled);
    }
  }
}
hz.Component.register(PlayerCamera);
