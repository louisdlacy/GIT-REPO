import { sysEvents } from 'sysEvents';
import * as hz from 'horizon/core'

class RoomC_CannonControl extends hz.Component<typeof RoomC_CannonControl> {
  static propsDefinition = {
    lever: { type: hz.PropTypes.Entity },
    cannon: { type: hz.PropTypes.Entity },
    motorSfx: { type: hz.PropTypes.Entity },

    isPitch: { type: hz.PropTypes.Boolean, default: true },
    maxLeverPitch: { type: hz.PropTypes.Number, default: 0.3 },
    minLeverPitch: { type: hz.PropTypes.Number, default: -0.3 }
  };

  private defaultPosition!: hz.Vec3;
  private isGrabbed: boolean = false;

  start() {
    if (this.props.lever === null || this.props.lever === undefined) {
      throw new Error('CannonControl requires a lever');
    }
    if (this.props.cannon === null || this.props.cannon === undefined) {
      throw new Error('CannonControl requires a cannon');
    }

    // Lever setup
    this.defaultPosition = this.entity.position.get();
    this.async.setInterval(() => {
      this.updateControl();
    }, 20);

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabStart, (isRightHand, player) => {
      this.isGrabbed = true;

      if (this.props.motorSfx === null || this.props.motorSfx === undefined) {
        throw new Error('CannonControl requires a motorSfx');
      }
      this.props.motorSfx.as(hz.AudioGizmo)?.play();
    });

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabEnd, (player) => {
      this.isGrabbed = false;
      this.entity.position.set(this.defaultPosition);
      if (this.props.motorSfx === null || this.props.motorSfx === undefined) {
        throw new Error('CannonControl requires a motorSfx');
      }
      this.props.motorSfx.as(hz.AudioGizmo)?.stop();
    });
  }

  private updateControl() {
    if (this.props.lever === null || this.props.lever === undefined) {
      throw new Error('CannonControl requires a lever');
    }
    if (this.props.cannon === null || this.props.cannon === undefined) {
      throw new Error('CannonControl requires a cannon');
    }

    let deltaZ = this.entity.position.get().z - this.defaultPosition.z;
    deltaZ = Math.min(Math.max(deltaZ, this.props.minLeverPitch), this.props.maxLeverPitch);
    const lookAtPosition = this.defaultPosition.add(hz.Vec3.forward.mul(deltaZ));
    this.props.lever.lookAt(lookAtPosition);

    if (this.isGrabbed) {
      this.sendLocalEvent(this.props.cannon, sysEvents.OnCannonLeverMoved, {delta: deltaZ, isPitch: this.props.isPitch});
    }
  }
}
hz.Component.register(RoomC_CannonControl);
