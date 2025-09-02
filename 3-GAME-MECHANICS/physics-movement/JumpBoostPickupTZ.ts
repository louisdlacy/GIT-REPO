import { Entity, World } from 'horizon/core';
import * as hz from 'horizon/core';

export const JumpBoostPickupEvents = {
  OnPickupJumpBoost: new hz.NetworkEvent<{player: hz.Player, jumpBoostAmount: number, duration: number}>('OnPickupJumpBoost'),
  OnApplyJumpBoost: new hz.NetworkEvent<{jumpBoostAmount: number, duration: number}>('OnApplyJumpBoost'),
}

class JumpBoostPickupTz extends hz.Component<typeof JumpBoostPickupTz> {
  static propsDefinition = {
    active: {type: hz.PropTypes.Boolean, default: true},

    mesh: {type: hz.PropTypes.Entity},
    pfx: {type: hz.PropTypes.Entity},
    light: {type: hz.PropTypes.Entity},

    animRotationFrequency: {type: hz.PropTypes.Number, default: 0.5},
    animBobFrequency: {type: hz.PropTypes.Number, default: 0.5},
    animBobAmplitude: {type: hz.PropTypes.Number, default: 0.1},

    jumpBoostDuration: { type: hz.PropTypes.Number, default: 30 }, // duration of jump boost in seconds
    jumpBoostAmount: { type: hz.PropTypes.Number, default: 15 }, // amount of jump boost to apply

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
    this.active = this.props.active! || false;
    if (this.active){
      // Set the update method to point to the animateMesh method
      this.update = this.animateMesh;
    }

    // Repeatedly call this.update every this.updateDelayS seconds (0.1s by default)
    this.updateIntervalId = this.async.setInterval(() => {
      this.update(this.updateDelayS)
    }, this.updateDelayS * 1000);
  }

  private activate() {
    this.active = true;
    this.props.mesh!.visible.set(true);
    this.update = this.animateMesh;
  }

  private deactivate() {
    this.active = false;
    this.props.mesh!.visible.set(false);
    this.update = (deltaTime: number) => {};
    if (this.props.respawnEnabled!) {
      this.respawnRemaining = this.props.respawnDelay!;
      this.update = this.awaitRespawn;
    }
  }

  awaitRespawn(deltaTime: number) {
    this.respawnRemaining -= deltaTime;
    if (this.respawnRemaining <= 0) {
      this.activate();
    }
  }

  animateMesh(deltaTime: number) {
    if (this.props.mesh! === undefined || this.props.mesh! === null) {
      return;
    }

    this.elapsed += deltaTime;

    // Rotation
    const animRotationTheta = this.elapsed * this.props.animRotationFrequency! * Math.PI * 2;
    this.props.mesh!.rotateRelativeTo(this.entity, hz.Quaternion.fromAxisAngle(this.props.mesh!.up.get(), animRotationTheta), hz.Space.World);

    // Position
    const animPositionDelta = Math.sin(this.elapsed * this.props.animBobFrequency!) * this.props.animBobAmplitude!;
    this.props.mesh!.moveRelativeTo(this.entity, this.props.mesh!.up.get().mul(animPositionDelta), hz.Space.Local);
  }

  onTriggerEnter(player: hz.Player) {
    if (this.active) {
      this.applyJumpBoost(player);
      this.sendNetworkBroadcastEvent(JumpBoostPickupEvents.OnPickupJumpBoost, {
        player, 
        jumpBoostAmount: this.props.jumpBoostAmount!, 
        duration: this.props.jumpBoostDuration!
      });
      this.deactivate();
    }
  }

  applyJumpBoost(player: hz.Player) {
    // Apply jump boost to player - try to set jump speed directly like speed boost
    try {
      (player as any).jumpSpeed.set(this.props.jumpBoostAmount!);
      this.async.setTimeout(() => {
        // Reset player's jump speed after duration
        (player as any).jumpSpeed.set(8.0); // default jump speed
      }, this.props.jumpBoostDuration! * 1000);
    } catch (error) {
      console.log("Jump boost failed to apply from server, using network approach");
      // Fallback to network approach if direct setting fails
    }
  }
}

hz.Component.register(JumpBoostPickupTz);
