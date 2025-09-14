import * as hz from "horizon/core";
import { CodeBlockEvent } from "horizon/core";

class ToggleablePuzzleBehavior extends hz.Component<typeof ToggleablePuzzleBehavior> {
  static propsDefinition = {
    // Items & Triggers (up to 6)
    item1: { type: hz.PropTypes.Entity }, trigger1: { type: hz.PropTypes.Entity },
    item2: { type: hz.PropTypes.Entity }, trigger2: { type: hz.PropTypes.Entity },
    item3: { type: hz.PropTypes.Entity }, trigger3: { type: hz.PropTypes.Entity },
    item4: { type: hz.PropTypes.Entity }, trigger4: { type: hz.PropTypes.Entity },
    item5: { type: hz.PropTypes.Entity }, trigger5: { type: hz.PropTypes.Entity },
    item6: { type: hz.PropTypes.Entity }, trigger6: { type: hz.PropTypes.Entity },

    // Pedestals
    pedestal1: { type: hz.PropTypes.Entity },
    pedestal2: { type: hz.PropTypes.Entity },
    pedestal3: { type: hz.PropTypes.Entity },
    pedestal4: { type: hz.PropTypes.Entity },
    pedestal5: { type: hz.PropTypes.Entity },
    pedestal6: { type: hz.PropTypes.Entity },
    moveDropAmount: { type: hz.PropTypes.Number, default: 5 }, // Units to drop if moving

    // Object Behavior Mode
    behaviorMode: { type: hz.PropTypes.String, default: "lockToTrigger" }, // "lockToTrigger" | "moveDown" | "noMovement"

    // Specific item count required to solve
    solvedItem: { type: hz.PropTypes.Number, default: 1 },

    // Door Mechanics
    doorEntity: { type: hz.PropTypes.Entity },
    openDoorOnSolve: { type: hz.PropTypes.Boolean, default: false },
    doorMoveType: { type: hz.PropTypes.String, default: "rotate" }, // 'rotate' | 'moveup' | 'movedown' | 'moveleft' | 'moveright' | 'moveforward' | 'movebackward'
    doorRotateAxis: { type: hz.PropTypes.String, default: "y" }, // 'x' | 'y' | 'z'
    doorRotateAngle: { type: hz.PropTypes.Number, default: 90 }, // degrees
    doorRotateBy: { 
      type: hz.PropTypes.Quaternion, 
      default: hz.Quaternion.fromAxisAngle(new hz.Vec3(0, 1, 0), Math.PI / 2) 
    }, // Fallback quaternion
    doorMoveAmount: { type: hz.PropTypes.Number, default: 3 },
    doorSound: { type: hz.PropTypes.Entity },

    // Prize Item
    prizeItem: { type: hz.PropTypes.Entity },
    usePrizeItem: { type: hz.PropTypes.Boolean, default: true },

    // Visual Effects
    solveEffect: { type: hz.PropTypes.Entity },
    fxDurationSeconds: { type: hz.PropTypes.Number, default: 30 },

    // Audio Effects
    winAudio: { type: hz.PropTypes.Entity },

    // Animation Timing
    animDurationSeconds: { type: hz.PropTypes.Number, default: 2 },

    // Unlock Mechanics
    UnlockTrigger: { type: hz.PropTypes.Boolean, default: false },
    unlockPuzzle: { type: hz.PropTypes.Entity },
    unlockEventName: { type: hz.PropTypes.String, default: "Unlock" },
  };

  private solved = false;
  private entered: boolean[] = [false, false, false, false, false, false];
  private lockedItemPositions: Array<{ item: hz.Entity; position: hz.Vec3; rotation?: hz.Quaternion }> = [];
  private animating: Set<hz.Entity> = new Set();

  start() {
    // Validate required props
    if (this.props.openDoorOnSolve && !this.props.doorEntity) {
      console.warn('[ToggleablePuzzleBehavior] openDoorOnSolve is true, but doorEntity is not assigned.');
    }
    if (this.props.usePrizeItem && !this.props.prizeItem) {
      console.warn('[ToggleablePuzzleBehavior] usePrizeItem is true, but prizeItem is not assigned.');
    }
    if (this.props.UnlockTrigger && !this.props.unlockPuzzle) {
      console.warn('[ToggleablePuzzleBehavior] UnlockTrigger is true, but unlockPuzzle is not assigned.');
    }

    // Wire every (trigger, item) pair that exists
    for (let i = 0; i < 6; i++) {
      const item = this.getItemByIndex(i);
      const trigger = this.getTriggerByIndex(i);
      if (item && trigger) this.setupTrigger(i, trigger, item);
    }
  }

  update() {
    // Keep locked items at their fixed positions/rotations only if not animating
    if (this.solved) {
      for (const { item, position, rotation } of this.lockedItemPositions) {
        if (!this.animating.has(item)) {
          item.position.set(position);
          if (rotation) item.rotation.set(rotation);
        }
      }
    }
  }

  private getItemByIndex(i: number): hz.Entity | undefined {
    switch (i) {
      case 0: return this.props.item1;
      case 1: return this.props.item2;
      case 2: return this.props.item3;
      case 3: return this.props.item4;
      case 4: return this.props.item5;
      case 5: return this.props.item6;
      default: return undefined;
    }
  }

  private getTriggerByIndex(i: number): hz.Entity | undefined {
    switch (i) {
      case 0: return this.props.trigger1;
      case 1: return this.props.trigger2;
      case 2: return this.props.trigger3;
      case 3: return this.props.trigger4;
      case 4: return this.props.trigger5;
      case 5: return this.props.trigger6;
      default: return undefined;
    }
  }

  private getPedestalByIndex(i: number): hz.Entity | undefined {
    switch (i) {
      case 0: return this.props.pedestal1;
      case 1: return this.props.pedestal2;
      case 2: return this.props.pedestal3;
      case 3: return this.props.pedestal4;
      case 4: return this.props.pedestal5;
      case 5: return this.props.pedestal6;
      default: return undefined;
    }
  }

  private setupTrigger(index: number, trigger: hz.Entity, item: hz.Entity) {
    this.connectCodeBlockEvent(trigger, hz.CodeBlockEvents.OnEntityEnterTrigger, (entered: hz.Entity) => {
      if (this.solved) return;
      if (this.entered[index]) return;
      if (entered.id !== item.id) return;

      this.entered[index] = true;
      console.log(`[ToggleablePuzzleBehavior] Matched item ${index + 1} entered its trigger.`);

      // Check if the item is grabbable and release it
      try {
        const grabbable = item.as(hz.GrabbableEntity);
        if (grabbable) {
          grabbable.forceRelease();
          console.log(`[ToggleablePuzzleBehavior] Item ${index + 1} released from grasp.`);
        } else {
          console.warn(`[ToggleablePuzzleBehavior] Item ${index + 1} is not a GrabbableEntity. Ensure item has Grabbable component. Falling back to collision disable.`);
        }
      } catch (e) {
        console.warn(`[ToggleablePuzzleBehavior] Failed to release item ${index + 1} from grasp:`, e);
      }

      // Disable collisions if available
      if ('collidable' in item && (item as any).collidable?.set) {
        (item as any).collidable.set(false);
      }

      if (this.props.behaviorMode === "lockToTrigger") {
        // Animate to trigger pose
        const triggerPos = trigger.position.get();
        const triggerRot = trigger.rotation.get();
        if (triggerPos && triggerRot) {
          this.animating.add(item);
          this.animateEntity(item, triggerPos, triggerRot, () => {
            this.animating.delete(item);
            this.lockedItemPositions.push({ item, position: triggerPos, rotation: triggerRot });
          });
        } else {
          console.error(`[ToggleablePuzzleBehavior] Invalid trigger pose for item ${index + 1}.`);
        }
      }

      // Check if puzzle is solved
      if (this.areAllItemsPlaced(this.props.solvedItem)) {
        console.log(`[ToggleablePuzzleBehavior] Puzzle solved with ${this.props.solvedItem} items placed.`);
        this.handleWinSequence();
      }
    });
  }

  private areAllItemsPlaced(requiredCount: number): boolean {
    let placedCount = 0;
    for (let i = 0; i < 6; i++) {
      if (this.getItemByIndex(i) && this.entered[i]) placedCount++;
    }
    return this.props.behaviorMode === "lockToTrigger" ? placedCount >= requiredCount : placedCount === requiredCount;
  }

  private handleWinSequence() {
    if (this.solved) return;
    this.solved = true;

    // Play win audio
    this.playAudio(this.props.winAudio);

    // Trigger unlock event
    if (this.props.UnlockTrigger && this.props.unlockPuzzle) {
      try {
        const evtName = this.props.unlockEventName ?? "Unlock";
        this.sendCodeBlockEvent(this.props.unlockPuzzle, new CodeBlockEvent(evtName, []));
      } catch (e) {
        console.warn('[ToggleablePuzzleBehavior] Failed to send unlock event:', e);
      }
    }

    // Delay to align with timing
    this.async.setTimeout(() => {
      // Play solve effect
      const fx = this.props.solveEffect?.as(hz.ParticleGizmo);
      if (fx) {
        fx.play();
        const fxStopMs = Math.max(0, (this.props.fxDurationSeconds ?? 30) * 1000);
        if (fxStopMs > 0) {
          this.async.setTimeout(() => {
            fx.stop();
          }, fxStopMs);
        }
      }

      if (this.props.behaviorMode === "moveDown") {
        const durationMs = (this.props.animDurationSeconds ?? 2) * 1000;
        this.animating.clear(); // Reset animating set for new animations
        const drop = this.props.moveDropAmount ?? 5;

        // Helper: keep only linked entities
        const linked = (arr: Array<hz.Entity | undefined>) =>
          arr.filter((e): e is hz.Entity => !!e);

        const moveDown = (ent: hz.Entity) => {
          const p0 = ent.position.get();
          const p1 = new hz.Vec3(p0.x, p0.y - drop, p0.z);
          this.animating.add(ent);
          this.animatePositionOnly(ent, p1, durationMs, () => this.animating.delete(ent));
        };

        // Move any that are linked (items 1..6 + pedestals 1..6)
        const itemsToMove = [
          this.props.item1, this.props.item2, this.props.item3,
          this.props.item4, this.props.item5, this.props.item6
        ];
        const pedestalsToMove = [
          this.props.pedestal1, this.props.pedestal2, this.props.pedestal3,
          this.props.pedestal4, this.props.pedestal5, this.props.pedestal6
        ];

        linked([...itemsToMove, ...pedestalsToMove]).forEach(moveDown);

        // Lock placed items after animation
        this.async.setTimeout(() => {
          for (let i = 0; i < 6; i++) {
            const item = this.getItemByIndex(i);
            if (item && this.entered[i]) {
              this.lockedItemPositions.push({ item, position: item.position.get() });
              (item as any)?.collidable?.set(false);
            }
          }
        }, durationMs);
      } else if (this.props.behaviorMode === "noMovement") {
        // Lock placed items immediately without movement
        for (let i = 0; i < 6; i++) {
          const item = this.getItemByIndex(i);
          if (item && this.entered[i]) {
            this.lockedItemPositions.push({ item, position: item.position.get() });
            (item as any)?.collidable?.set(false);
          }
        }
      }

      // Move prize item
      if (this.props.usePrizeItem && this.props.prizeItem) {
        const vfxPosition = this.props.solveEffect?.position.get() ?? 
                           this.props.doorEntity?.position.get() ?? 
                           this.props.prizeItem.position.get();
        if (vfxPosition.x === 0 && vfxPosition.y === 0 && vfxPosition.z === 0) {
          console.warn('[ToggleablePuzzleBehavior] Invalid solveEffect/door position, using prizeItem position:', vfxPosition);
        }
        this.animatePositionOnly(this.props.prizeItem, vfxPosition, (this.props.animDurationSeconds ?? 2) * 1000);
      }

      // Handle door movement
      if (this.props.openDoorOnSolve && this.props.doorEntity) {
        const door = this.props.doorEntity;
        const moveType = (this.props.doorMoveType || "rotate").toLowerCase();
        this.playAudio(this.props.doorSound);

        switch (moveType) {
          case "rotate":
            this.onDoorRotateToTarget();
            break;
          case "moveup":
            this.onDoorMoveUp();
            break;
          case "movedown":
            this.onDoorMoveDown();
            break;
          case "moveleft":
            this.onDoorMoveLeft();
            break;
          case "moveright":
            this.onDoorMoveRight();
            break;
          case "moveforward":
            this.onDoorMoveForward();
            break;
          case "movebackward":
            this.onDoorMoveBackward();
            break;
          default:
            console.warn(`[ToggleablePuzzleBehavior] Invalid doorMoveType: ${moveType}. Defaulting to no action.`);
            break;
        }

        // Stop door sound after animation duration
        this.async.setTimeout(() => {
          try { this.props.doorSound?.as(hz.AudioGizmo)?.stop(); } catch {}
        }, (this.props.animDurationSeconds ?? 2) * 1000);
      }
    }, 1000);
  }

  private onDoorRotateToTarget() {
    const door = this.props.doorEntity;
    if (!door) {
      console.warn('[ToggleablePuzzleBehavior] rotate: missing door.');
      return;
    }
    const startRot = door.rotation.get();
    let deltaRot: hz.Quaternion;

    const axisStr = (this.props.doorRotateAxis || "y").toLowerCase();
    const angleDeg = this.props.doorRotateAngle ?? 90;
    const angleRad = (angleDeg * Math.PI) / 180;
    const axis =
      axisStr === "x" ? new hz.Vec3(1, 0, 0) :
      axisStr === "z" ? new hz.Vec3(0, 0, 1) :
                        new hz.Vec3(0, 1, 0); // default Y
    if (Math.abs(angleRad) > 1e-6) {
      deltaRot = hz.Quaternion.fromAxisAngle(axis, angleRad);
    } else {
      deltaRot = this.props.doorRotateBy ?? hz.Quaternion.fromAxisAngle(new hz.Vec3(0, 1, 0), Math.PI / 2);
    }

    const targetRot = deltaRot.mul(startRot);
    this.animateEntity(door, door.position.get(), targetRot);
  }

  private onDoorMoveUp() {
    const door = this.props.doorEntity;
    if (!door) {
      console.warn('[ToggleablePuzzleBehavior] moveUp: missing door.');
      return;
    }
    const startPos = door.position.get();
    const endPos = new hz.Vec3(startPos.x, startPos.y + (this.props.doorMoveAmount ?? 3), startPos.z);
    this.animatePositionOnly(door, endPos, (this.props.animDurationSeconds ?? 2) * 1000);
  }

  private onDoorMoveDown() {
    const door = this.props.doorEntity;
    if (!door) {
      console.warn('[ToggleablePuzzleBehavior] moveDown: missing door.');
      return;
    }
    const startPos = door.position.get();
    const endPos = new hz.Vec3(startPos.x, startPos.y - (this.props.doorMoveAmount ?? 3), startPos.z);
    this.animatePositionOnly(door, endPos, (this.props.animDurationSeconds ?? 2) * 1000);
  }

  private onDoorMoveLeft() {
    const door = this.props.doorEntity;
    if (!door) {
      console.warn('[ToggleablePuzzleBehavior] moveLeft: missing door.');
      return;
    }
    const startPos = door.position.get();
    const endPos = new hz.Vec3(startPos.x, startPos.y, startPos.z - (this.props.doorMoveAmount ?? 3));
    this.animatePositionOnly(door, endPos, (this.props.animDurationSeconds ?? 2) * 1000);
  }

  private onDoorMoveRight() {
    const door = this.props.doorEntity;
    if (!door) {
      console.warn('[ToggleablePuzzleBehavior] moveRight: missing door.');
      return;
    }
    const startPos = door.position.get();
    const endPos = new hz.Vec3(startPos.x, startPos.y, startPos.z + (this.props.doorMoveAmount ?? 3));
    this.animatePositionOnly(door, endPos, (this.props.animDurationSeconds ?? 2) * 1000);
  }

  private onDoorMoveForward() {
    const door = this.props.doorEntity;
    if (!door) {
      console.warn('[ToggleablePuzzleBehavior] moveForward: missing door.');
      return;
    }
    const startPos = door.position.get();
    const endPos = new hz.Vec3(startPos.x + (this.props.doorMoveAmount ?? 3), startPos.y, startPos.z);
    this.animatePositionOnly(door, endPos, (this.props.animDurationSeconds ?? 2) * 1000);
  }

  private onDoorMoveBackward() {
    const door = this.props.doorEntity;
    if (!door) {
      console.warn('[ToggleablePuzzleBehavior] moveBackward: missing door.');
      return;
    }
    const startPos = door.position.get();
    const endPos = new hz.Vec3(startPos.x - (this.props.doorMoveAmount ?? 3), startPos.y, startPos.z);
    this.animatePositionOnly(door, endPos, (this.props.animDurationSeconds ?? 2) * 1000);
  }

  private animateEntity(entity: hz.Entity, targetPosition: hz.Vec3, targetRotation: hz.Quaternion, onComplete?: () => void) {
    const durationMs = (this.props.animDurationSeconds ?? 2) * 1000;
    const steps = 60;
    const interval = durationMs / steps;
    const startPos = entity.position.get();
    const startRot = entity.rotation.get();
    let step = 0;
    const intervalId = this.async.setInterval(() => {
      if (step >= steps) {
        entity.position.set(targetPosition);
        entity.rotation.set(targetRotation);
        this.async.clearInterval(intervalId);
        if (onComplete) onComplete();
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

  private animatePositionOnly(entity: hz.Entity, targetPosition: hz.Vec3, durationMs: number, onComplete?: () => void) {
    const steps = 60;
    const interval = durationMs / steps;
    const startPos = entity.position.get();
    let step = 0;
    const intervalId = this.async.setInterval(() => {
      if (step >= steps) {
        entity.position.set(targetPosition);
        this.async.clearInterval(intervalId);
        if (onComplete) onComplete();
        return;
      }
      step++;
      const t = step / steps;
      const newPos = hz.Vec3.lerp(startPos, targetPosition, t);
      entity.position.set(newPos);
    }, interval);
  }

  private playAudio(entity?: hz.Entity) {
    entity?.as(hz.AudioGizmo)?.play();
  }
}

hz.Component.register(ToggleablePuzzleBehavior);