import { sysEvents } from 'sysEvents';
import * as hz from 'horizon/core';

class RoomC_Cannon extends hz.Component<typeof RoomC_Cannon> {
  static propsDefinition = {
    deadZone: {type: hz.PropTypes.Number, default: 0.01},
    barrel: {type: hz.PropTypes.Entity},
    maxPitch: {type: hz.PropTypes.Number, default: 10},
    minPitch: {type: hz.PropTypes.Number, default: -60},
    maxYaw: {type: hz.PropTypes.Number, default: 55},
    minYaw: {type: hz.PropTypes.Number, default: -55},

    buttonTrigger: {type: hz.PropTypes.Entity},
    barrelEnd: {type: hz.PropTypes.Entity},
    shotPower: {type: hz.PropTypes.Number, default: 1000},
    shotFx: { type: hz.PropTypes.Entity},
    shotSfx: {type: hz.PropTypes.Entity},
  };

  private balls: hz.Entity[] = [];
  private ballIndex: number = 0;

  start() {
    this.connectNetworkBroadcastEvent(sysEvents.OnRegisterBall, (data) => {
      if (this.balls === undefined) {
        this.balls = [];
      }
      this.balls.push(data.ball);
    });

    // Movement
    this.connectLocalEvent(this.entity, sysEvents.OnCannonLeverMoved, (data) => {
      if (this.props.barrel === null || this.props.barrel === undefined) {
        throw new Error('Cannon requires a barrel');
      }

      if (data.isPitch) {
        let rotationEuler = this.props.barrel.transform.localRotation.get().toEuler();
        rotationEuler.x -= data.delta;
        rotationEuler.x = Math.max(this.props.minPitch, Math.min(this.props.maxPitch, rotationEuler.x));
        this.props.barrel.transform.localRotation.set(hz.Quaternion.fromEuler(rotationEuler));

      } else {
        let rotationEuler = this.entity.transform.localRotation.get().toEuler();
        rotationEuler.y += data.delta;
        this.entity.transform.localRotation.set(hz.Quaternion.fromEuler(rotationEuler));
        rotationEuler.y = Math.max(this.props.minYaw, Math.min(this.props.maxYaw, rotationEuler.y));
      }
    })

    // Firing
    if (this.props.buttonTrigger === null || this.props.buttonTrigger === undefined) {
      throw new Error('Cannon requires a buttonTrigger');
    }

    this.connectCodeBlockEvent(this.props.buttonTrigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
      if (this.props.barrelEnd === null || this.props.barrelEnd === undefined) {
        throw new Error('Cannon requires a barrel end');
      }
      const ball = this.getBall();
      ball.as(hz.PhysicalEntity)?.zeroVelocity();
      ball.position.set(this.props.barrelEnd.position.get());
      ball.as(hz.PhysicalEntity)?.applyForce(this.props.barrelEnd.forward.get().mul(this.props.shotPower), hz.PhysicsForceMode.Force);

      if (this.props.shotFx === null || this.props.shotFx === undefined) {
        throw new Error('Cannon requires a shotFx');
      }
      this.props.shotFx.as(hz.ParticleGizmo)?.play();

      if (this.props.shotSfx === null || this.props.shotSfx === undefined) {
        throw new Error('Cannon requires a shotSfx');
      }
      this.props.shotSfx.as(hz.AudioGizmo)?.play();
    });
  }

  private getBall(): hz.Entity {
    if (this.balls === undefined || this.balls.length === 0) {
      throw new Error('No balls to fire');
    }
    let ball = this.balls[this.ballIndex];
    this.ballIndex = (this.ballIndex + 1) % this.balls.length;
    return ball;
  }
}
hz.Component.register(RoomC_Cannon);
