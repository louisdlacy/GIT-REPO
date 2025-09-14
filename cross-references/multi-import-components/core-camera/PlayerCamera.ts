import * as hz from 'horizon/core';
import LocalCamera, { AttachCameraOptions, CameraTransitionOptions, PanCameraOptions } from 'horizon/camera';

export const CameraEvents = {
  firstPerson: new hz.NetworkEvent<{}>('firstPerson'),
  thirdPerson: new hz.NetworkEvent<{}>('thirdPerson'),
  attachPerson: new hz.NetworkEvent<{target: hz.Entity}>('attachPerson'),
  panPerson: new hz.NetworkEvent<{}>('panPerson'),
}

class PlayerCamera extends hz.Component<typeof PlayerCamera> {
  static propsDefinition = {};

  private owner!: hz.Player;

  preStart() {
    this.owner = this.entity.owner.get()

    if(this.owner === this.world.getServerPlayer()) {
      return
    }

    this.connectNetworkEvent(this.owner, CameraEvents.firstPerson, () => this.firstPerson())
    this.connectNetworkEvent(this.owner, CameraEvents.thirdPerson, () => this.thirdPerson())
    this.connectNetworkEvent(this.owner, CameraEvents.attachPerson, (data) => this.attachPerson(data.target))
    this.connectNetworkEvent(this.owner, CameraEvents.panPerson, () => this.panPerson())
  }

  start() {

  }

  firstPerson() {
    // Logic to switch to first person camera
    console.log('Switching to first person camera');
    const options: CameraTransitionOptions = {delay: 1, duration: 3}
    LocalCamera.setCameraModeFirstPerson(options)
  }

  thirdPerson() {
    // Logic to switch to third person camera
    console.log('Switching to third person camera');
    const options: CameraTransitionOptions = {delay: 1, duration: 3}
    LocalCamera.setCameraModeThirdPerson(options)
  }

  attachPerson(target: hz.Entity) {
    // Logic to switch to attach person camera
    console.log('Switching to attach person camera');
    const options: CameraTransitionOptions = {delay: 1, duration: 3}
    const attachOption: AttachCameraOptions = {translationSpeed: 10, rotationSpeed: 1}
    LocalCamera.setCameraModeAttach(target, attachOption && options)
  }

  panPerson() {
    // Logic to switch to pan camera
    console.log('Switching to pan camera');
    const panOption: PanCameraOptions = {positionOffset: new hz.Vec3(0, 10, 0), translationSpeed: .25, }
    LocalCamera.setCameraModePan(panOption)
  }
}
hz.Component.register(PlayerCamera);