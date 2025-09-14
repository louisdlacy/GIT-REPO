import * as hz from 'horizon/core';

export const JumpPadEvents = {
  playerLaunched: new hz.NetworkEvent<{player: hz.Player, launchVelocity: hz.Vec3}>('playerLaunched'),
  jumpPadActivated: new hz.LocalEvent<{jumpPad: hz.Entity, player: hz.Player}>('jumpPadActivated'),
};

type JumpPadState = {
  isActive: boolean,
  lastLaunchTime: number,
};

export class JumpPad extends hz.Component<typeof JumpPad> {
  static propsDefinition = {
    launchForce: {type: hz.PropTypes.Number, default: 15},
    launchAngle: {type: hz.PropTypes.Number, default: 45},
    cooldownTime: {type: hz.PropTypes.Number, default: 1000},
    triggerZone: {type: hz.PropTypes.Entity},
    launchVFX: {type: hz.PropTypes.Entity},
    launchSFX: {type: hz.PropTypes.Entity},
    idleVFX: {type: hz.PropTypes.Entity},
    idleSFX: {type: hz.PropTypes.Entity},
    debugMode: {type: hz.PropTypes.Boolean, default: false},
  };

  private triggerEnter?: hz.EventSubscription;
  private triggerExit?: hz.EventSubscription;
  private playerLaunched?: hz.EventSubscription;
  
  private launchVFX?: hz.ParticleGizmo;
  private launchSFX?: hz.AudioGizmo;
  private idleVFX?: hz.ParticleGizmo;
  private idleSFX?: hz.AudioGizmo;
  private triggerZone?: hz.TriggerGizmo;
  
  private isActive: boolean = true;
  private lastLaunchTime: number = 0;
  private playersInZone: Set<hz.Player> = new Set();

  preStart() {
    super.preStart();
    this.launchVFX = this.props.launchVFX?.as(hz.ParticleGizmo);
    this.launchSFX = this.props.launchSFX?.as(hz.AudioGizmo);
    this.idleVFX = this.props.idleVFX?.as(hz.ParticleGizmo);
    this.idleSFX = this.props.idleSFX?.as(hz.AudioGizmo);
    this.triggerZone = this.props.triggerZone?.as(hz.TriggerGizmo);
    if (this.props.debugMode) {
      console.log(`[JumpPad] Simple mode initialized`);
    }
  }

  start() {
    if (this.triggerZone) {
      this.triggerEnter = this.connectCodeBlockEvent(
        this.triggerZone, 
        hz.CodeBlockEvents.OnPlayerEnterTrigger, 
        this.onPlayerEnterTrigger.bind(this)
      );
      this.triggerExit = this.connectCodeBlockEvent(
        this.triggerZone, 
        hz.CodeBlockEvents.OnPlayerExitTrigger, 
        this.onPlayerExitTrigger.bind(this)
      );
    }
    this.playerLaunched = this.connectNetworkEvent(
      this.entity,
      JumpPadEvents.playerLaunched,
      this.onPlayerLaunched.bind(this)
    );
    this.startIdleEffects();
  }

  dispose() {
    this.triggerEnter?.disconnect();
    this.triggerExit?.disconnect();
    this.playerLaunched?.disconnect();
    this.stopIdleEffects();
    super.dispose();
  }

  onPlayerEnterTrigger(player: hz.Player) {
    this.playersInZone.add(player);
    if (this.props.debugMode) {
      console.log(`[JumpPad] Player ${player.name.get()} entered trigger zone`);
    }
    this.launchPlayer(player);
  }

  onPlayerExitTrigger(player: hz.Player) {
    this.playersInZone.delete(player);
    if (this.props.debugMode) {
      console.log(`[JumpPad] Player ${player.name.get()} exited trigger zone`);
    }
  }

  private launchPlayer(player: hz.Player) {
    if (!this.isActive) {
      if (this.props.debugMode) {
        console.log(`[JumpPad] Jump pad is not active`);
      }
      return;
    }
    const currentTime = Date.now();
    if (currentTime - this.lastLaunchTime < this.props.cooldownTime) {
      if (this.props.debugMode) {
        console.log(`[JumpPad] Jump pad is on cooldown`);
      }
      return;
    }
    // Calculate launch velocity based on pad's forward direction and angle
    const launchVelocity = this.calculateLaunchVelocity();
    player.velocity.set(launchVelocity);
    this.lastLaunchTime = currentTime;
    this.playLaunchEffects();
    this.sendNetworkEvent(this.entity, JumpPadEvents.playerLaunched, {
      player: player,
      launchVelocity: launchVelocity
    });
    this.sendLocalEvent(this.entity, JumpPadEvents.jumpPadActivated, {
      jumpPad: this.entity,
      player: player
    });
    if (this.props.debugMode) {
      console.log(`[JumpPad] Launched player ${player.name.get()} with velocity:`, launchVelocity);
    }
  }

  private calculateLaunchVelocity(): hz.Vec3 {
    // Get the pad's forward direction
    const forward = this.entity.forward.get().normalize();
    // Up direction
    const up = this.entity.up.get().normalize();
    // Calculate the launch direction by rotating forward by launchAngle towards up
    const angleRad = hz.degreesToRadians(this.props.launchAngle);
    // Interpolate between forward and up
    const launchDir = forward.mul(Math.cos(angleRad)).add(up.mul(Math.sin(angleRad))).normalize();
    return launchDir.mul(this.props.launchForce);
  }

  private playLaunchEffects() {
    this.stopIdleEffects();
    if (this.launchVFX) {
      this.launchVFX.play();
    }
    if (this.launchSFX) {
      this.launchSFX.play();
    }
    this.async.setTimeout(() => {
      this.startIdleEffects();
    }, 2000);
  }

  private startIdleEffects() {
    if (this.idleVFX) {
      this.idleVFX.play();
    }
    if (this.idleSFX) {
      this.idleSFX.play();
    }
  }

  private stopIdleEffects() {
    if (this.idleVFX) {
      this.idleVFX.stop();
    }
    if (this.idleSFX) {
      this.idleSFX.stop();
    }
  }

  onPlayerLaunched(data: {player: hz.Player, launchVelocity: hz.Vec3}) {
    if (this.props.debugMode) {
      console.log(`[JumpPad] Network event: Player ${data.player.name.get()} launched`);
    }
  }

  // Public methods for external control
  public activate() {
    this.isActive = true;
    this.startIdleEffects();
  }
  public deactivate() {
    this.isActive = false;
    this.stopIdleEffects();
  }
  public getIsActive(): boolean {
    return this.isActive;
  }
  public getPlayersInZone(): hz.Player[] {
    return Array.from(this.playersInZone);
  }
  receiveOwnership(state: JumpPadState | null, fromPlayer: hz.Player, toPlayer: hz.Player) {
    if (state) {
      this.isActive = state.isActive;
      this.lastLaunchTime = state.lastLaunchTime;
    }
  }
  transferOwnership(oldPlayer: hz.Player, newPlayer: hz.Player): JumpPadState {
    return {
      isActive: this.isActive,
      lastLaunchTime: this.lastLaunchTime,
    };
  }
}
hz.Component.register(JumpPad); 