import * as hz from 'horizon/core';

export const SpeedBoostPickupEvents = {
  OnPickupSpeedBoost: new hz.NetworkEvent<{player: hz.Player, speedBoostAmount: number, duration: number}>('OnPickupSpeedBoost'),
}

class SpeedBoostPickupTz extends hz.Component<typeof SpeedBoostPickupTz> {
  static propsDefinition = {
    active: {type: hz.PropTypes.Boolean, default: true},

    mesh: {type: hz.PropTypes.Entity},
    pfx: {type: hz.PropTypes.Entity},
    light: {type: hz.PropTypes.Entity},

    animRotationFrequency: {type: hz.PropTypes.Number, default: 0.5},
    animBobFrequency: {type: hz.PropTypes.Number, default: 0.5},
    animBobAmplitude: {type: hz.PropTypes.Number, default: 0.1},

    speedBoostDuration: { type: hz.PropTypes.Number, default: 30 }, // duration of speed boost in seconds
    speedBoostAmount: { type: hz.PropTypes.Number, default: 10 }, // amount of speed boost to apply

    respawnEnabled: {type: hz.PropTypes.Boolean, default: true},
    respawnDelay: {type: hz.PropTypes.Number, default: 15}, // respawn time in seconds
  };

  private updateIntervalId: number = -1;
  private updateDelayS: number = 0.1;
  private update: (deltaTime: number)=>void = (deltaTime)=>{};

  private elapsed: number = 0;
  private active: boolean = true;

  private respawnRemaining: number = -1;

  preStart(): void {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (enteredBy: hz.Player) => {
      this.onTriggerEnter(enteredBy);
    })
  }

  start() {
    this.active = this.props.active || false;
    if (this.active){
      // Set the update method to point to the animateMesh method
      this.update = this.animateMesh;
    }

    // Repeatedly call this.update every this.updateDelayS seconds (0.1s by default)
    this.updateIntervalId = this.async.setInterval(() => {
      this.update(this.updateDelayS)
    }, this.updateDelayS * 1000);
  }

  awaitRespawn(deltaTime: number) {
    this.respawnRemaining -= deltaTime;
    if (this.respawnRemaining <= 0) {
      this.activate();
    }
  }

  animateMesh(deltaTime: number) {
    if (this.props.mesh === undefined || this.props.mesh === null) {
      return;
    }

    this.elapsed += deltaTime;

    // Rotation
    const animRotationTheta = this.elapsed * this.props.animRotationFrequency * Math.PI * 2;
    this.props.mesh.rotateRelativeTo(this.entity, hz.Quaternion.fromAxisAngle(this.props.mesh.up.get(), animRotationTheta), hz.Space.World);

    // Position
    const animPositionDelta = Math.sin(this.elapsed * this.props.animBobFrequency) * this.props.animBobAmplitude;
    this.props.mesh.moveRelativeTo(this.entity, this.props.mesh.up.get().mul(animPositionDelta), hz.Space.Local);
  }

  onTriggerEnter(player: hz.Player) {
    if (this.active) {
      this.applySpeedBoost(player);
      this.sendNetworkBroadcastEvent(SpeedBoostPickupEvents.OnPickupSpeedBoost, {
        player, 
        speedBoostAmount: this.props.speedBoostAmount!, 
        duration: this.props.speedBoostDuration!
      });
      this.deactivate();
    }
  }

  applySpeedBoost(player: hz.Player) {
    // Apply speed boost to player
    player.locomotionSpeed.set(this.props.speedBoostAmount!);
    this.async.setTimeout(() => {
      // Reset player's speed after duration
      player.locomotionSpeed.set(4.5); // default speed
    }, this.props.speedBoostDuration! * 1000);
  }

  activate(){
    this.active = true;
    this.entity.as(hz.TriggerGizmo).enabled.set(true);
    this.props.mesh?.visible.set(true);
    this.props.pfx?.as(hz.ParticleGizmo).play();
    this.props.light?.as(hz.DynamicLightGizmo).enabled.set(true);
    this.update = this.animateMesh;
  }

  deactivate(){
    this.active = false;
    this.entity.as(hz.TriggerGizmo).enabled.set(false);
    this.props.mesh?.visible.set(false);
    this.props.pfx?.as(hz.ParticleGizmo).stop();
    this.props.light?.as(hz.DynamicLightGizmo).enabled.set(false);

    // If respawn is enabled, start the timer to delay the respawn
    if (this.props.respawnEnabled) {
      this.respawnRemaining = this.props.respawnDelay;
      this.update = this.awaitRespawn;
    } else {
      this.async.clearInterval(this.updateIntervalId);
      this.updateIntervalId = -1;
    }
  }
}

hz.Component.register(SpeedBoostPickupTz);