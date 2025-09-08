import * as hz from 'horizon/core';

class LeverPullWinTrigger extends hz.Component<typeof LeverPullWinTrigger> {
  static propsDefinition = {
    // Lever
    leverHandle:            { type: hz.PropTypes.Entity },
    leverRotateAxis:        { type: hz.PropTypes.String,  default: "z" },
    leverRotateDegrees:     { type: hz.PropTypes.Number,  default: 45 },
    leverReverseDirection:  { type: hz.PropTypes.Boolean, default: false },
    leverAnimSeconds:       { type: hz.PropTypes.Number,  default: 2 },
    leverSound:             { type: hz.PropTypes.Entity },

    // Win FX / Prize
    winParticles:           { type: hz.PropTypes.Entity },
    winParticlesSeconds:    { type: hz.PropTypes.Number,  default: 30 },
    givePrize:              { type: hz.PropTypes.Boolean, default: true },
    prize:                  { type: hz.PropTypes.Entity },

    // After-solve display + event
    solvedDelaySeconds:     { type: hz.PropTypes.Number,  default: 3 },
    afterSolvedEvent:       { type: hz.PropTypes.String,  default: "OnSolved" },
    disableSelfTriggerOnSolved: { type: hz.PropTypes.Boolean, default: true },

    // Door options
    openDoorOnSolved:       { type: hz.PropTypes.Boolean, default: false },
    door:                   { type: hz.PropTypes.Entity },
    doorSound:              { type: hz.PropTypes.Entity },
    doorMoveStyle:          { type: hz.PropTypes.String,  default: "rotate" }, // rotate | moveup | movedown | moveleft | moveright | moveforward | movebackward
    doorRotateAxis:         { type: hz.PropTypes.String,  default: "y" },
    doorRotateDegrees:      { type: hz.PropTypes.Number,  default: 90 },
    doorMoveAmount:         { type: hz.PropTypes.Number,  default: 3 },

    // Locking
    lockLeverAfterSolved:   { type: hz.PropTypes.Boolean, default: false },

    // Gate usage until event arrives
    requiresUnlock:         { type: hz.PropTypes.Boolean, default: false },
    unlockEvent:            { type: hz.PropTypes.String,  default: "Unlock" },
  };

  private solved = false;
  private startRot!: hz.Quaternion;
  private solvedState = false;
  private activePlayer?: hz.Player;
  private isLocked = false;

  start(): void {
    // Cache lever's starting rotation (unchanged)
    if (this.props.leverHandle) {
      this.startRot = this.props.leverHandle.rotation.get();
    }

    // Main trigger (player enters) — unchanged
    try {
      this.connectCodeBlockEvent(
        this.entity,
        hz.CodeBlockEvents.OnPlayerEnterTrigger,
        (player: hz.Player) => this.onPlayerEnterTrigger(player)
      );
    } catch (e) {
      console.warn(`[LeverPullWinTrigger] Failed to connect OnPlayerEnterTrigger: ${e}`);
    }

    // Lock at start? -> disable the self trigger via TriggerGizmo.enabled
    this.isLocked = !!this.props.requiresUnlock;
    if (this.isLocked) {
      try {
        const triggerGizmo = this.entity.as(hz.TriggerGizmo);
        if (triggerGizmo) {
          triggerGizmo.enabled.set(false);
        }
      } catch (error) {
        console.error(error);
      }
    }

    // Listen for the unlock event name (default "Unlock")
    try {
      this.connectCodeBlockEvent(
        this.entity,
        new hz.CodeBlockEvent(this.props.unlockEvent ?? "Unlock", []),
        () => this.onUnlockEvent()
      );
    } catch (e) {
      console.warn(`[LeverPullWinTrigger] Failed to connect unlock event listener: ${e}`);
    }
  }

  private onUnlockEvent(): void {
    if (!this.isLocked) return;
    this.isLocked = false;

    try {
      const triggerGizmo = this.entity.as(hz.TriggerGizmo);
      if (triggerGizmo) {
        triggerGizmo.enabled.set(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  private onPlayerEnterTrigger(player: hz.Player) {
    if (this.isLocked) return;
    if (this.solved && this.props.lockLeverAfterSolved) return;

    this.activePlayer = player;

    const lever = this.props.leverHandle;
    if (this.solved || !lever) return;

    const sign = this.props.leverReverseDirection ? -1 : 1;
    const radians = (this.props.leverRotateDegrees! * Math.PI) / 180 * sign;

    // Axis
    let axis: hz.Vec3;
    switch (this.props.leverRotateAxis!.toLowerCase()) {
      case "x": axis = new hz.Vec3(1, 0, 0); break;
      case "y": axis = new hz.Vec3(0, 1, 0); break;
      case "z": default: axis = new hz.Vec3(0, 0, 1); break;
    }

    // Local rotation delta * start (avoids twist)
    const deltaRot = hz.Quaternion.fromAxisAngle(axis, radians);
    const startRot = lever.rotation.get();
    const targetRot = deltaRot.mul(startRot);

    // Play lever sound during motion
    this.playAudio(this.props.leverSound);

    this.animateEntity(lever, lever.position.get(), targetRot, () => {
      this.stopAudio(this.props.leverSound);
      this.solved = true;
      this.handleWinSequence();
    });
  }

  private handleWinSequence() {
    // Particles
    const fx = this.props.winParticles?.as(hz.ParticleGizmo);
    if (fx) {
      fx.play();
      const fxStopMs = Math.max(0, (this.props.winParticlesSeconds ?? 30) * 1000);
      if (fxStopMs > 0) {
        this.async.setTimeout(() => fx.stop(), fxStopMs);
      }
    }

    // Prize
    if (this.props.givePrize && this.props.prize) {
      const vfxPosition = this.props.winParticles?.position.get();
      if (vfxPosition) {
        this.animatePositionOnly(this.props.prize, vfxPosition, (this.props.leverAnimSeconds ?? 2) * 1000);
      } else {
        console.warn(`[LeverPullWinTrigger] No winParticles position available for prize item movement`);
      }
    }

    // Door
    if (this.props.openDoorOnSolved && this.props.door) {
      const moveType = (this.props.doorMoveStyle || "rotate").toLowerCase();
      this.playAudio(this.props.doorSound);

      switch (moveType) {
        case "rotate":       this.onDoorRotateToTarget(this.props.door); break;
        case "moveup":       this.onDoorMoveUp(this.props.door); break;
        case "movedown":     this.onDoorMoveDown(this.props.door); break;
        case "moveleft":     this.onDoorMoveLeft(this.props.door); break;
        case "moveright":    this.onDoorMoveRight(this.props.door); break;
        case "moveforward":  this.onDoorMoveForward(this.props.door); break;
        case "movebackward": this.onDoorMoveBackward(this.props.door); break;
        default:
          console.warn(`[LeverPullWinTrigger] Invalid doorMoveStyle: ${moveType}.`);
          break;
      }

      this.async.setTimeout(
        () => this.stopAudio(this.props.doorSound),
        (this.props.leverAnimSeconds ?? 2) * 1000
      );
    }

    // 🔒 Disable the SELF trigger after solving (prevents re-trigger)
    if (this.props.disableSelfTriggerOnSolved) {
      this.setSelfTriggerEnabled(false);
    }

    // After-solve event
    this.async.setTimeout(() => {
      this.solvedState = true;
      try {
        this.sendCodeBlockEvent(this.entity, new hz.CodeBlockEvent(this.props.afterSolvedEvent!, []));
      } catch (e) {
        console.warn(`[LeverPullWinTrigger] Failed to dispatch event ${this.props.afterSolvedEvent!}: ${e}`);
      }
    }, (this.props.solvedDelaySeconds ?? 3) * 1000);
  }

  private setSelfTriggerEnabled(enabled: boolean) {
    try {
      const trig = this.entity.as(hz.TriggerGizmo);
      if (trig && trig.enabled && typeof trig.enabled.set === "function") {
        trig.enabled.set(enabled);
      }
    } catch (e) {
      console.warn("[LeverPullWinTrigger] setSelfTriggerEnabled failed:", e);
    }
  }

  private onDoorRotateToTarget(door: hz.Entity) {
    if (!door) { console.warn("[LeverPullWinTrigger] rotate: missing door."); return; }
    const angleRad = ((this.props.doorRotateDegrees ?? 90) * Math.PI) / 180;
    const half = angleRad / 2, s = Math.sin(half), c = Math.cos(half);

    let axis: hz.Vec3;
    switch (this.props.doorRotateAxis?.toLowerCase()) {
      case "x": axis = new hz.Vec3(1, 0, 0); break;
      case "y": axis = new hz.Vec3(0, 1, 0); break;
      case "z": default: axis = new hz.Vec3(0, 0, 1); break;
    }

    const startRot = door.rotation.get();
    const deltaRot = new hz.Quaternion(c, axis.x * s, axis.y * s, axis.z * s);
    const q1 = startRot, q2 = deltaRot;
    const targetRot = new hz.Quaternion(
      q2.w*q1.w - q2.x*q1.x - q2.y*q1.y - q2.z*q1.z,
      q2.w*q1.x + q2.x*q1.w + q2.y*q1.z - q2.z*q1.y,
      q2.w*q1.y - q2.x*q1.z + q2.y*q1.w + q2.z*q1.x,
      q2.w*q1.z + q2.x*q1.y - q2.y*q1.x + q2.z*q1.w
    );

    this.animateEntity(door, door.position.get(), targetRot);
  }

  private onDoorMoveUp(door: hz.Entity) {
    const p0 = door.position.get();
    this.animatePositionOnly(door, new hz.Vec3(p0.x, p0.y + (this.props.doorMoveAmount ?? 3), p0.z),
      (this.props.leverAnimSeconds ?? 2) * 1000);
  }
  private onDoorMoveDown(door: hz.Entity) {
    const p0 = door.position.get();
    this.animatePositionOnly(door, new hz.Vec3(p0.x, p0.y - (this.props.doorMoveAmount ?? 3), p0.z),
      (this.props.leverAnimSeconds ?? 2) * 1000);
  }
  private onDoorMoveLeft(door: hz.Entity) {
    const p0 = door.position.get();
    this.animatePositionOnly(door, new hz.Vec3(p0.x, p0.y, p0.z - (this.props.doorMoveAmount ?? 3)),
      (this.props.leverAnimSeconds ?? 2) * 1000);
  }
  private onDoorMoveRight(door: hz.Entity) {
    const p0 = door.position.get();
    this.animatePositionOnly(door, new hz.Vec3(p0.x, p0.y, p0.z + (this.props.doorMoveAmount ?? 3)),
      (this.props.leverAnimSeconds ?? 2) * 1000);
  }
  private onDoorMoveForward(door: hz.Entity) {
    const p0 = door.position.get();
    this.animatePositionOnly(door, new hz.Vec3(p0.x + (this.props.doorMoveAmount ?? 3), p0.y, p0.z),
      (this.props.leverAnimSeconds ?? 2) * 1000);
  }
  private onDoorMoveBackward(door: hz.Entity) {
    const p0 = door.position.get();
    this.animatePositionOnly(door, new hz.Vec3(p0.x - (this.props.doorMoveAmount ?? 3), p0.y, p0.z),
      (this.props.leverAnimSeconds ?? 2) * 1000);
  }

  // --- Anim utils ---
  private animateEntity(entity: hz.Entity, targetPosition: hz.Vec3, targetRotation: hz.Quaternion, done?: () => void) {
    const duration = (this.props.leverAnimSeconds ?? 2) * 1000;
    const steps = 60;
    const interval = duration / steps;
    const startPos = entity.position.get();
    const startRot = entity.rotation.get();
    let step = 0;
    const intervalId = this.async.setInterval(() => {
      if (step >= steps) {
        entity.position.set(targetPosition);
        entity.rotation.set(targetRotation);
        this.async.clearInterval(intervalId);
        if (done) done();
        return;
      }
      step++;
      const t = step / steps;
      const newPos = hz.Vec3.lerp(startPos, targetPosition, t);
      const newRot = hz.Quaternion.slerp(startRot, targetRotation, t);
      entity.position.set(newPos);
      entity.rotation.set(newRot);
    }, interval);
  }

  private animatePositionOnly(entity: hz.Entity, targetPosition: hz.Vec3, durationMs: number, done?: () => void) {
    const steps = 60;
    const interval = durationMs / steps;
    const startPos = entity.position.get();
    let step = 0;
    const intervalId = this.async.setInterval(() => {
      if (step >= steps) {
        entity.position.set(targetPosition);
        this.async.clearInterval(intervalId);
        if (done) done();
        return;
      }
      step++;
      const t = step / steps;
      const newPos = hz.Vec3.lerp(startPos, targetPosition, t);
      entity.position.set(newPos);
    }, interval);
  }

  private playAudio(entity?: hz.Entity) {
    if (!entity) { console.warn(`[LeverPullWinTrigger] No audio entity provided.`); return; }
    const audio = entity.as(hz.AudioGizmo);
    if (audio) audio.play(); else console.warn(`[LeverPullWinTrigger] Entity is not an AudioGizmo:`, (entity as any)?.id);
  }

  private stopAudio(entity?: hz.Entity) {
    if (!entity) { console.warn(`[LeverPullWinTrigger] No audio entity provided.`); return; }
    const audio = entity.as(hz.AudioGizmo);
    if (audio) audio.stop(); else console.warn(`[LeverPullWinTrigger] Entity is not an AudioGizmo:`, (entity as any)?.id);
  }
}

hz.Component.register(LeverPullWinTrigger);