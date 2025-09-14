// Meant to be used in conjunction with an Asset Pool Gizmo
// This is a basic player manager component that can be used to handle events sent to the player.

import * as hz from 'horizon/core';
import LocalCamera, { AttachCameraOptions, CameraMode, CameraTarget, CameraTransitionOptions, Easing, FixedCameraOptions, FollowCameraOptions, OrbitCameraOptions, PanCameraOptions } from 'horizon/camera';

// Define the network events that this player manager will handle
export const PMCameraEvents = {
  setFirstPerson: new hz.NetworkEvent<{ options?: CameraTransitionOptions }>('setFirstPerson'),
  setThirdPerson: new hz.NetworkEvent<{ options?: CameraTransitionOptions }>('setThirdPerson'),
  setAttached: new hz.NetworkEvent<{ target: CameraTarget; options?: AttachCameraOptions & CameraTransitionOptions }>('setAttached'),
  setFixed: new hz.NetworkEvent<{ options?: FixedCameraOptions & CameraTransitionOptions }>('setFixed'),
  setOrbit: new hz.NetworkEvent<{ options?: OrbitCameraOptions & CameraTransitionOptions }>('setOrbit'),
  setPan: new hz.NetworkEvent<{ options?: PanCameraOptions & CameraTransitionOptions }>('setPan'),
  setFollow: new hz.NetworkEvent<{ options?: FollowCameraOptions & CameraTransitionOptions }>('setFollow'),
}

class PlayerManager_Camera extends hz.Component<typeof PlayerManager_Camera> {
  static propsDefinition = {};

  // A private variable to hold the owner of this player manager
  owner: hz.Player | undefined;
  originalCameraMode: CameraMode | undefined = CameraMode.FirstPerson

  start() {
    //set the owner of this entity
    this.owner = this.entity.owner.get();

    //confirm the owner is a player, exit if not
    if (this.owner === this.world.getServerPlayer()) {
      return;
    }

    //looks like we have a real player, lets connect to the network events
    console.log('PlayerManager_Basic: Player manager', this.entity.id, ' started for', this.owner.name.get());
    this.connectNetworkEvent(this.owner, PMCameraEvents.setFirstPerson, (data) => this.setFirstPerson(data.options));
    this.connectNetworkEvent(this.owner, PMCameraEvents.setThirdPerson, (data) => this.setThirdPerson(data.options));
    this.connectNetworkEvent(this.owner, PMCameraEvents.setAttached, (data) => this.setAttached(data.target, data.options));
    this.connectNetworkEvent(this.owner, PMCameraEvents.setFixed, (data) => this.setFixed(data.options));
    this.connectNetworkEvent(this.owner, PMCameraEvents.setOrbit, (data) => this.setOrbit(data.options));
    this.connectNetworkEvent(this.owner, PMCameraEvents.setPan, (data) => this.setPan(data.options));
    this.connectNetworkEvent(this.owner, PMCameraEvents.setFollow, (data) => this.setFollow(data.options));
  }

  lastCameraOptions: CameraTransitionOptions | undefined;
  setFirstPerson(options?: CameraTransitionOptions) {

    if (options) {
      this.lastCameraOptions = options;
      LocalCamera.setCameraModeFirstPerson(options);
    } else {
      LocalCamera.setCameraModeFirstPerson();
    }
  }

  setThirdPerson(options?: CameraTransitionOptions) {
    if (options) {
      this.lastCameraOptions = options;
      LocalCamera.setCameraModeThirdPerson(options);
    } else {
      LocalCamera.setCameraModeThirdPerson();
    }
  }

  lastCameraTarget: CameraTarget | undefined;
  lastAttachOptions: AttachCameraOptions & CameraTransitionOptions | undefined;
  setAttached(target: CameraTarget, options?: AttachCameraOptions & CameraTransitionOptions) {
    this.originalCameraMode = LocalCamera.currentMode.get();
    if (options) {
      this.lastAttachOptions = options;
      this.lastCameraTarget = target;
      LocalCamera.setCameraModeAttach(target, options);
    } else {
      LocalCamera.setCameraModeAttach(target);
    }
    this.async.setTimeout(() => {
      this.revertCameraMode();
    }, 3000);
  }

  lastFixedOptions: FixedCameraOptions & CameraTransitionOptions | undefined;
  setFixed(options?: FixedCameraOptions & CameraTransitionOptions) {
    if (options) {
      this.lastFixedOptions = options;
      LocalCamera.setCameraModeFixed(options);
    } else {
      LocalCamera.setCameraModeFixed();
    }
    this.async.setTimeout(() => {
      this.revertCameraMode();
    }, 3000);
  }

  lastOrbitOptions: OrbitCameraOptions & CameraTransitionOptions | undefined;
  setOrbit(options?: OrbitCameraOptions & CameraTransitionOptions) {
    if (options) {
      this.lastOrbitOptions = options;
      LocalCamera.setCameraModeOrbit(options);
    } else {
      LocalCamera.setCameraModeOrbit();
    }
  }

  lastPanOptions: PanCameraOptions & CameraTransitionOptions | undefined;
  setPan(options?: PanCameraOptions & CameraTransitionOptions) {
    if (options) {
      this.lastPanOptions = options;
      LocalCamera.setCameraModePan(options);
    } else {
      LocalCamera.setCameraModePan();
    }
  }

  lastFollowOptions: FollowCameraOptions & CameraTransitionOptions | undefined;
  setFollow(options?: FollowCameraOptions & CameraTransitionOptions) {
    if (options) {
      this.lastFollowOptions = options;
      LocalCamera.setCameraModeFollow(options);
    } else {
      LocalCamera.setCameraModeFollow();
    }
  }

  revertCameraMode() {
    if (this.originalCameraMode !== undefined) {
      switch (this.originalCameraMode) {
        case CameraMode.FirstPerson:
          this.setFirstPerson(this.lastCameraOptions);
          break;
        case CameraMode.ThirdPerson:
          this.setThirdPerson(this.lastCameraOptions);
          break;
        case CameraMode.Attach:
          this.setAttached(this.lastCameraTarget ? this.lastCameraTarget : this.entity, this.lastAttachOptions);
          break;
        case CameraMode.Fixed:
          this.setFixed(this.lastFixedOptions);
          break;
        case CameraMode.Orbit:
          this.setOrbit(this.lastOrbitOptions);
          break;
        case CameraMode.Pan:
          this.setPan(this.lastPanOptions);
          break;
        case CameraMode.Follow:
          this.setFollow(this.lastFollowOptions);
          break;
        default:
          console.warn('PlayerManager_Camera: Unknown camera mode', this.originalCameraMode);
      }
    } else {
      console.warn('PlayerManager_Camera: No original camera mode set');
    }
  }

}
hz.Component.register(PlayerManager_Camera);



/***********************************************************************************************
****************************You can have more than 1 script per file.***************************
******Below is just a test script for the trigger to prove the Player Manager script works******
***********************************************************************************************/

class cameraTrigger extends hz.Component<typeof cameraTrigger> {
  static propsDefinition = {
    mode: {
      type: hz.PropTypes.Number,
      default: 0,
    },
  };

  preStart() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
      console.log('Player entered trigger', player.name.get());
      switch (this.props.mode) {
        case CameraMode.FirstPerson:
          this.sendNetworkEvent(player, PMCameraEvents.setFirstPerson, {});
          break;
        case CameraMode.ThirdPerson:
          this.sendNetworkEvent(player, PMCameraEvents.setThirdPerson, {});
          break;
        case CameraMode.Attach:
          this.sendNetworkEvent(player, PMCameraEvents.setAttached, { target: this.entity });
          break;
        case CameraMode.Fixed:
          const fixedOptions: FixedCameraOptions = {
            position: this.entity.position.get(),
            rotation: this.entity.rotation.get(),
          }
          const transOptions: CameraTransitionOptions = {
            delay: 0,
            duration: 0.5,
            easing: Easing.Linear,
          }
          const options = { ...fixedOptions, ...transOptions };
          this.sendNetworkEvent(player, PMCameraEvents.setFixed, { options: options });
          break;
        case CameraMode.Orbit:
          this.sendNetworkEvent(player, PMCameraEvents.setOrbit, {});
          break;
        case CameraMode.Pan:
          this.sendNetworkEvent(player, PMCameraEvents.setPan, {});
          break;
        case CameraMode.Follow:
          this.sendNetworkEvent(player, PMCameraEvents.setFollow, {});
          break;
        default:
          break;
      }
    });
  }



  start() { }
}
hz.Component.register(cameraTrigger); 