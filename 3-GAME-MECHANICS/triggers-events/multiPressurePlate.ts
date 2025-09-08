import * as hz from "horizon/core";

class PressurePlatePuzzle extends hz.Component<typeof PressurePlatePuzzle> {
  static propsDefinition = {
    // --- Door config ---
    doorEntity: { type: hz.PropTypes.Entity },
    doorRotateBy: {
      type: hz.PropTypes.Quaternion,
      default: hz.Quaternion.fromAxisAngle(new hz.Vec3(0, 1, 0), Math.PI / 2), // +90° Y
    },
    doorSound: { type: hz.PropTypes.Entity },
    openDoorOnSolve: { type: hz.PropTypes.Boolean, default: false },
    doorMoveType: {
      type: hz.PropTypes.String,
      default: "rotate", // rotate | moveUp | moveDown | moveLeft | moveRight | moveForward | moveBackward
    },
    doorMoveAmount: { type: hz.PropTypes.Number, default: 3 },

    // --- Prize item config ---
    prizeItem: { type: hz.PropTypes.Entity },
    usePrizeItem: { type: hz.PropTypes.Boolean, default: true },

    // --- Visual effects ---
    solveEffect: { type: hz.PropTypes.Entity },
    fxDurationSeconds: { type: hz.PropTypes.Number, default: 30 },
    grabVfx: { type: hz.PropTypes.Entity },
    grabFxDurationSeconds: { type: hz.PropTypes.Number, default: 4 },

    // --- Audio effects ---
    winAudio: { type: hz.PropTypes.Entity },
    grabSound: { type: hz.PropTypes.Entity },

    // --- Animation durations ---
    animDurationMs: { type: hz.PropTypes.Number, default: 2000 },
    doorCloseDurationMs: { type: hz.PropTypes.Number, default: 3000 }, // For slow close

    // --- Unlock gating ---
    requiresUnlock: { type: hz.PropTypes.Boolean, default: false },
    unlockEvent: { type: hz.PropTypes.String, default: "Unlock" },

    // --- Item holding mechanics ---
    itemToHold: { type: hz.PropTypes.Entity },
    lightCube: { type: hz.PropTypes.Entity },

    // --- Unlock trigger for other puzzles ---
    unlockTrigger: { type: hz.PropTypes.Boolean, default: false },
    unlockPuzzle: { type: hz.PropTypes.Entity },
    unlockEventName: { type: hz.PropTypes.String, default: "Unlock" },

    // --- Behavior toggles ---
    useBasicMode: { type: hz.PropTypes.Boolean, default: true }, // Basic pressure plate
    useHoldItemMode: { type: hz.PropTypes.Boolean, default: false }, // Must hold item
    useSlowCloseMode: { type: hz.PropTypes.Boolean, default: false }, // Slow close when no occupants
  };

  private solved: boolean = false;
  private triggerActivated: boolean = false;
  private isLocked: boolean = false;
  private occupants: number = 0;
  private currentHolder: hz.Player | null = null;
  private playersInTrigger: hz.Player[] = [];
  private doorStartPos: hz.Vec3 | null = null;
  private doorStartRot: hz.Quaternion | null = null;
  private doorAnimId: any = null;

  constructor() {
    super();
  }

  start() {
    // Validate props
    if (this.props.openDoorOnSolve && !this.props.doorEntity) {
      console.warn("[PressurePlatePuzzle] openDoorOnSolve is true, but doorEntity is not assigned.");
    }
    if (this.props.usePrizeItem && !this.props.prizeItem) {
      console.warn("[PressurePlatePuzzle] usePrizeItem is true, but prizeItem is not assigned.");
    }
    if (this.props.useHoldItemMode && !this.props.itemToHold) {
      console.warn("[PressurePlatePuzzle] useHoldItemMode is true, but itemToHold is not assigned.");
    }
    if (this.props.useHoldItemMode && !this.props.lightCube) {
      console.warn("[PressurePlatePuzzle] useHoldItemMode is true, but lightCube is not assigned.");
    }
    if (this.props.useHoldItemMode && !this.props.grabSound) {
      console.warn("[PressurePlatePuzzle] useHoldItemMode is true, but grabSound is not assigned.");
 
    }
    if (this.props.useHoldItemMode && !this.props.grabVfx) {
      console.warn("[PressurePlatePuzzle] useHoldItemMode is true, but grabVfx is not assigned.");
    }
    if (this.props.unlockTrigger && !this.props.unlockPuzzle) {
      console.warn("[PressurePlatePuzzle] unlockTrigge is true, but unlockPuzzle is not assigned.");
    }

    // Cache door starting pose for slow close
    if (this.props.doorEntity && this.props.useSlowCloseMode) {
      this.doorStartPos = this.props.doorEntity.position.get();
      this.doorStartRot = this.props.doorEntity.rotation.get();
    }

    // Hide lightCube on start if using hold item mode
    if (this.props.useHoldItemMode && this.props.lightCube) {
      this.props.lightCube.visible.set(false);
    }

    // Lock at start if required
    this.isLocked = !!this.props.requiresUnlock;
    if (this.isLocked) {
      try {
        const tg = this.entity.as(hz.TriggerGizmo);
        tg?.enabled.set(false);
        console.log("[PressurePlatePuzzle] Locked at start; waiting for unlock event:", this.props.unlockEvent);
      } catch (error) {
        console.error("[PressurePlatePuzzle] Failed to disable TriggerGizmo at start:", error);
      }
    }

    // Listen for unlock event
    try {
      this.connectCodeBlockEvent(
        this.entity,
        new hz.CodeBlockEvent(this.props.unlockEvent ?? "Unlock", []),
        () => this.onUnlockEvent()
      );
    } catch (e) {
      console.warn("[PressurePlatePuzzle] Failed to connect unlock event listener:", e);
    }

    this.setupTrigger();
    if (this.props.useHoldItemMode) {
      this.setupItemEvents();
    }
  }

  private setupTrigger() {
    // Player enters trigger
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
      if (this.isLocked) return;

      this.playersInTrigger.push(player);
      this.occupants = Math.max(0, this.occupants) + 1;

      if (this.props.useHoldItemMode) {
        if (this.solved || this.currentHolder !== player || !this.props.lightCube?.visible.get()) {
          return;
        }
        this.triggerActivated = true;
        this.handleSolve();
      } else if (this.props.useBasicMode) {
        this.triggerActivated = true;
        if (this.props.useSlowCloseMode && this.occupants === 1 && this.props.openDoorOnSolve && this.props.doorEntity) {
          this.openDoor(this.props.doorEntity);
        }
        if (!this.solved) {
          this.handleSolve();
        }
      }
    });

    // Player exits trigger
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, (player) => {
      if (this.isLocked) return;
      this.playersInTrigger = this.playersInTrigger.filter(p => p !== player);
      this.occupants = Math.max(0, this.occupants - 1);

      if (this.props.useSlowCloseMode && this.occupants === 0 && this.props.openDoorOnSolve && this.props.doorEntity) {
        this.closeDoor(this.props.doorEntity);
      }
    });
  }

  private setupItemEvents() {
    if (!this.props.itemToHold) return;

    this.connectCodeBlockEvent(this.props.itemToHold, hz.CodeBlockEvents.OnGrabStart, (isRightHand: boolean, player: hz.Player) => {
      if (!player || !(player instanceof hz.Player) || this.solved) {
        console.warn("[PressurePlatePuzzle] Invalid player or puzzle already solved in OnGrabStart:", player);
        return;
      }
      this.currentHolder = player;
      this.triggerActivated = true;

      // Show lightCube when item is grabbed
      if (this.props.lightCube) {
        this.props.lightCube.visible.set(true);
      }

      // Play grab sound and VFX
      this.playAudio(this.props.grabSound, this.props.grabFxDurationSeconds * 1000);
      const vfx = this.props.grabVfx?.as(hz.ParticleGizmo);
      if (vfx) {
        vfx.play();
        const vfxStopMs = Math.max(0, (this.props.grabFxDurationSeconds ?? 4) * 1000);
        if (vfxStopMs > 0) {
          this.async.setTimeout(() => {
            try { vfx.stop(); } catch {}
          }, vfxStopMs);
        }
      }

      // Check if player is in trigger
      if (this.playersInTrigger.includes(player)) {
        this.handleSolve();
      }
    });

    this.connectCodeBlockEvent(this.props.itemToHold, hz.CodeBlockEvents.OnGrabEnd, (player: hz.Player) => {
      if (!player || !(player instanceof hz.Player)) {
        console.warn("[PressurePlatePuzzle] Invalid player in OnGrabEnd:", player);
        return;
      }
      this.currentHolder = null;
      this.triggerActivated = false;

      // Hide lightCube when item is released
      if (this.props.lightCube) {
        this.props.lightCube.visible.set(false);
      }
    });
  }

  private onUnlockEvent(): void {
    if (!this.isLocked) return;
    this.isLocked = false;
    this.occupants = 0;
    console.log("[PressurePlatePuzzle] Received unlock event; enabling trigger.");

    try {
      const tg = this.entity.as(hz.TriggerGizmo);
      tg?.enabled.set(true);
    } catch (error) {
      console.error("[PressurePlatePuzzle] Failed to enable TriggerGizmo on unlock:", error);
    }
  }

  private handleSolve() {
    if (this.solved) return;
    this.solved = true;

    // Play win audio
    this.playAudio(this.props.winAudio);

    // Trigger unlock event for other puzzles
    if (this.props.unlockTrigger && this.props.unlockPuzzle) {
      try {
        const evtName = this.props.unlockEventName ?? "Unlock";
        this.sendCodeBlockEvent(this.props.unlockPuzzle, new hz.CodeBlockEvent(evtName, []));
      } catch (e) {
        console.warn("[PressurePlatePuzzle] Failed to send unlock event:", e);
      }
    }

    // Play solve effect
    const fx = this.props.solveEffect?.as(hz.ParticleGizmo);
    if (fx) {
      fx.play();
      const fxStopMs = Math.max(0, (this.props.fxDurationSeconds ?? 30) * 1000);
      if (fxStopMs > 0) {
        this.async.setTimeout(() => {
          try { fx.stop(); } catch {}
        }, fxStopMs);
      }
    }

    // Move prize item
    if (this.props.usePrizeItem && this.props.prizeItem) {
      let prizePos = this.props.solveEffect?.position.get();
      if (!prizePos || (prizePos.x === 0 && prizePos.y === 0 && prizePos.z === 0)) {
        prizePos = this.props.doorEntity?.position.get() ?? this.props.prizeItem.position.get();
        console.warn("[PressurePlatePuzzle] solveEffect position invalid/zero; using fallback:", prizePos);
      }
      this.animatePositionOnly(this.props.prizeItem, prizePos, this.props.animDurationMs);
    } else if (this.props.usePrizeItem) {
      console.warn("[PressurePlatePuzzle] Prize item not assigned, skipping movement.");
    }

    // Handle door movement
    if (this.props.openDoorOnSolve && this.props.doorEntity && (!this.props.useSlowCloseMode || this.props.useHoldItemMode)) {
      this.openDoor(this.props.doorEntity);
    }
  }

  private openDoor(door: hz.Entity) {
    const moveType = (this.props.doorMoveType || "rotate").toLowerCase();
    this.playAudio(this.props.doorSound);

    switch (moveType) {
      case "rotate":
        this.rotateDoor(door);
        break;
      case "moveup":
        this.moveDoorTo(door, v => new hz.Vec3(v.x, v.y + (this.props.doorMoveAmount ?? 3), v.z), this.props.animDurationMs);
        break;
      case "movedown":
        this.moveDoorTo(door, v => new hz.Vec3(v.x, v.y - (this.props.doorMoveAmount ?? 3), v.z), this.props.animDurationMs);
        break;
      case "moveleft":
        this.moveDoorTo(door, v => new hz.Vec3(v.x, v.y, v.z + (this.props.doorMoveAmount ?? 3)), this.props.animDurationMs);
        break;
      case "moveright":
        this.moveDoorTo(door, v => new hz.Vec3(v.x, v.y, v.z - (this.props.doorMoveAmount ?? 3)), this.props.animDurationMs);
        break;
      case "moveforward":
        this.moveDoorTo(door, v => new hz.Vec3(v.x - (this.props.doorMoveAmount ?? 3), v.y, v.z), this.props.animDurationMs);
        break;
      case "movebackward":
        this.moveDoorTo(door, v => new hz.Vec3(v.x + (this.props.doorMoveAmount ?? 3), v.y, v.z), this.props.animDurationMs);
        break;
      default:
        console.warn(`[PressurePlatePuzzle] Invalid doorMoveType: ${moveType}. Defaulting to no action.`);
    }
  }

  private closeDoor(door: hz.Entity) {
    if (!this.doorStartPos || !this.doorStartRot) return;
    this.playAudio(this.props.doorSound);

    const moveType = (this.props.doorMoveType || "rotate").toLowerCase();
    this.clearDoorAnim();

    if (moveType === "rotate") {
      this.doorAnimId = this.animatePose(door, this.doorStartPos, this.doorStartRot, this.props.doorCloseDurationMs);
    } else {
      this.doorAnimId = this.animatePositionOnly(door, this.doorStartPos, this.props.doorCloseDurationMs);
    }
  }

  private rotateDoor(door: hz.Entity) {
    const startPos = door.position.get();
    const startRot = door.rotation.get();
    const deltaRot = this.props.doorRotateBy ?? hz.Quaternion.fromAxisAngle(new hz.Vec3(0, 1, 0), Math.PI / 2);
    const targetRot = deltaRot.mul(startRot);

    this.clearDoorAnim();
    this.doorAnimId = this.animatePose(door, startPos, targetRot, this.props.animDurationMs);
  }

  private moveDoorTo(door: hz.Entity, computeEnd: (start: hz.Vec3) => hz.Vec3, duration: number) {
    const start = door.position.get();
    const end = computeEnd(start);

    this.clearDoorAnim();
    this.doorAnimId = this.animatePositionOnly(door, end, duration);
  }

  private animatePose(entity: hz.Entity, targetPos: hz.Vec3, targetRot: hz.Quaternion, durationMs: number) {
    const steps = 60;
    const interval = durationMs / steps;
    const startPos = entity.position.get();
    const startRot = entity.rotation.get();
    let step = 0;

    const timer = this.async.setInterval(() => {
      if (step >= steps) {
        entity.position.set(targetPos);
        entity.rotation.set(targetRot);
        this.async.clearInterval(timer);
        return;
      }
      step++;
      const t = step / steps;
      entity.position.set(hz.Vec3.lerp(startPos, targetPos, t));
      entity.rotation.set(hz.Quaternion.slerp(startRot, targetRot, t));
    }, interval);

    return timer;
  }

  private animatePositionOnly(entity: hz.Entity, targetPos: hz.Vec3, durationMs: number) {
    const steps = 60;
    const interval = durationMs / steps;
    const startPos = entity.position.get();
    let step = 0;

    const timer = this.async.setInterval(() => {
      if (step >= steps) {
        entity.position.set(targetPos);
        this.async.clearInterval(timer);
        return;
      }
      step++;
      const t = step / steps;
      entity.position.set(hz.Vec3.lerp(startPos, targetPos, t));
    }, interval);

    return timer;
  }

  private clearDoorAnim() {
    if (this.doorAnimId != null) {
      this.async.clearInterval(this.doorAnimId);
      this.doorAnimId = null;
    }
  }

  private playAudio(entity?: hz.Entity, durationMs?: number) {
    if (!entity) return;
    const audio = entity.as(hz.AudioGizmo);
    if (!audio) {
      console.warn("[PressurePlatePuzzle] Failed to play audio: not an AudioGizmo:", entity.id);
      return;
    }
    audio.play();
    const stopMs = durationMs ?? this.props.animDurationMs ?? 2000;
    this.async.setTimeout(() => {
      try { audio.stop(); } catch {}
    }, stopMs);
  }
}

hz.Component.register(PressurePlatePuzzle);