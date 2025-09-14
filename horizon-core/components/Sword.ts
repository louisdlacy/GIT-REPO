import { StartAttackingPlayer, StopAttackingPlayer } from 'NPCMonster';
import LocalCamera from 'horizon/camera';
import * as hz from 'horizon/core';
import { PlayerDeviceType } from 'horizon/core';

class Sword extends hz.Component<typeof Sword> {
  static propsDefinition = {
    returnSwordDelay: {type: hz.PropTypes.Number, default: 1},
    swingCooldown: {type: hz.PropTypes.Number, default: 200}
  };

  private startPosition: hz.Vec3 = hz.Vec3.zero;
  private startRotation: hz.Quaternion = hz.Quaternion.zero;
  private returnSwordTimerId: number = -1;
  private lastSwingTs: number = -1;


  start() {
    this.startPosition = this.entity.position.get();
    this.startRotation = this.entity.rotation.get();
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabStart, (isRightHand, player) => {
      if (this.returnSwordTimerId > -1) {
        this.async.clearTimeout(this.returnSwordTimerId);
        this.returnSwordTimerId = -1;
      }
      this.entity.owner.set(player);
      this.async.setTimeout(() => {
        LocalCamera.setCameraModeThirdPerson();
      }, 500);
      this.sendNetworkBroadcastEvent(StartAttackingPlayer, {player});
    })
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnIndexTriggerDown, (triggerPlayer) => {
      if (triggerPlayer.deviceType.get() !== PlayerDeviceType.VR && triggerPlayer === this.entity.owner.get()) {
        if (this.lastSwingTs === -1 || Date.now() - this.lastSwingTs > this.props.swingCooldown) {
          this.lastSwingTs = Date.now();
          this.entity.owner.get().playAvatarGripPoseAnimationByName(hz.AvatarGripPoseAnimationNames.Fire);
        }
      }
    })
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabEnd, (player) => {
      LocalCamera.setCameraModeFirstPerson();
      this.async.setTimeout(() => {
        this.entity.owner.set(this.world.getServerPlayer());
      }, 300);

      this.returnSwordTimerId = this.async.setTimeout(() => {
        this.entity.position.set(this.startPosition);
        this.entity.rotation.set(this.startRotation);
        this.returnSwordTimerId = -1;
      }, this.props.returnSwordDelay);

      this.sendNetworkBroadcastEvent(StopAttackingPlayer, {player});
    })
  }
}
hz.Component.register(Sword);
