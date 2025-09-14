import * as hz from 'horizon/core';
import {
  UIComponent,
  UINode,
  View,
  Text,
  Image,
  ImageSource,
  Binding,
} from 'horizon/ui';

// Define a local event for internal use
const ItemEnteredEvent = new hz.LocalEvent<{ itemIndex: number }>('ItemEnteredEvent');

class BatteryManagerPanel extends UIComponent<typeof BatteryManagerPanel> {
  static propsDefinition = {
    numItems: { type: hz.PropTypes.Number, default: 1 },
    item1: { type: hz.PropTypes.Entity },
    item2: { type: hz.PropTypes.Entity },
    item3: { type: hz.PropTypes.Entity },
    item4: { type: hz.PropTypes.Entity },
    item5: { type: hz.PropTypes.Entity },
    item6: { type: hz.PropTypes.Entity },
    item1Image: { type: hz.PropTypes.Asset },
    item2Image: { type: hz.PropTypes.Asset },
    item3Image: { type: hz.PropTypes.Asset },
    item4Image: { type: hz.PropTypes.Asset },
    item5Image: { type: hz.PropTypes.Asset },
    item6Image: { type: hz.PropTypes.Asset },
    trigger1: { type: hz.PropTypes.Entity },
    trigger2: { type: hz.PropTypes.Entity },
    trigger3: { type: hz.PropTypes.Entity },
    trigger4: { type: hz.PropTypes.Entity },
    trigger5: { type: hz.PropTypes.Entity },
    trigger6: { type: hz.PropTypes.Entity },
    // Door config
    doorEntity: { type: hz.PropTypes.Entity },
    doorMoveTargetPosition: { type: hz.PropTypes.Vec3 },
    doorMoveTargetRotation: { type: hz.PropTypes.Quaternion },
    doorSound: { type: hz.PropTypes.Entity },
    openDoorOnSolve: { type: hz.PropTypes.Boolean, default: false },
    doorMoveType: { type: hz.PropTypes.String, default: "rotate" }, // "rotate" | "moveUp" | "moveDown" | "moveLeft" | "moveRight" | "moveForward" | "moveBackward"
    doorRotateAxis: { type: hz.PropTypes.String, default: "y" }, // "x" | "y" | "z"
    doorRotateAngle: { type: hz.PropTypes.Number, default: 90 }, // Degrees
    doorRotateBy: { 
      type: hz.PropTypes.Quaternion, 
      default: hz.Quaternion.fromAxisAngle(new hz.Vec3(0, 1, 0), Math.PI / 2) 
    }, // Fallback quaternion
    doorMoveAmount: { type: hz.PropTypes.Number, default: 3 }, // Movement distance
    // Prize item config
    prizeItem: { type: hz.PropTypes.Entity },
    usePrizeItem: { type: hz.PropTypes.Boolean, default: true },
    // FX and audio
    solveEffect: { type: hz.PropTypes.Entity },
    fxDurationSeconds: { type: hz.PropTypes.Number, default: 30 },
    winAudio: { type: hz.PropTypes.Entity },
    // Number of items needed to solve
    solvedItem: { type: hz.PropTypes.Number, default: 1 }, // 1 to 6
    // Animation timing (standardized in seconds)
    animDurationSeconds: { type: hz.PropTypes.Number, default: 2 },
    // Unlock mechanics (aligned with RiddlePanel and PlaceItemMoveItems)
    UnlockTrigger: { type: hz.PropTypes.Boolean, default: false },
    unlockPuzzle: { type: hz.PropTypes.Entity },
    unlockEventName: { type: hz.PropTypes.String, default: "Unlock" },
  };

  private itemsEntered: boolean[];
  private itemCollectedBinding: Binding<boolean[]>;
  private lockedItemPositions: Array<{ item: hz.Entity; position: hz.Vec3; rotation: hz.Quaternion }> = [];
  private solved: boolean = false;

  constructor() {
    super();
    this.itemsEntered = new Array(6).fill(false);
    this.itemCollectedBinding = new Binding<boolean[]>(new Array(6).fill(false));
  }

  start() {
    const numItems = Math.min(Math.max(this.props.numItems ?? 1, 1), 6);
    this.itemsEntered = new Array(numItems).fill(false);
    this.itemCollectedBinding.set(new Array(numItems).fill(false));

    // Validate required props
    if (this.props.openDoorOnSolve && !this.props.doorEntity) {
      console.warn('[BatteryManagerPanel] openDoorOnSolve is true, but doorEntity is not assigned.');
    }
    if (this.props.usePrizeItem && !this.props.prizeItem) {
      console.warn('[BatteryManagerPanel] usePrizeItem is true, but prizeItem is not assigned.');
    }
    if (this.props.UnlockTrigger && !this.props.unlockPuzzle) {
      console.warn('[BatteryManagerPanel] UnlockTrigger is true, but unlockPuzzle is not assigned.');
    }

    this.connectLocalEvent(
      this.entity,
      ItemEnteredEvent,
      (data: { itemIndex: number }) => {
        const index = data.itemIndex;
        if (index >= 0 && index < this.itemsEntered.length) {
          if (!this.itemsEntered[index]) {
            this.itemsEntered[index] = true;
            this.itemCollectedBinding.set([...this.itemsEntered]);
          }
        } else {
          console.warn(`[BatteryManagerPanel] Received invalid item index: ${index}`);
        }
      }
    );

    for (let i = 0; i < numItems; i++) {
      const item = this.getItemByIndex(i);
      const trigger = this.getTriggerByIndex(i);
      if (item && trigger) {
        this.setupTrigger(i, trigger, item);
      } else {
        console.warn(`[BatteryManagerPanel] Skipping trigger ${i}: Item or Trigger not assigned`);
      }
    }
  }

  update() {
    // Keep locked items at their fixed positions/rotations to prevent shaking
    for (const { item, position, rotation } of this.lockedItemPositions) {
      item.position.set(position);
      item.rotation.set(rotation);
    }
  }

  private setupTrigger(index: number, trigger: hz.Entity, item: hz.Entity) {
    this.connectCodeBlockEvent(trigger, hz.CodeBlockEvents.OnEntityEnterTrigger, (entered: hz.Entity) => {
      if (this.itemsEntered[index]) return;
      if (entered.id !== item.id) return;

      this.itemsEntered[index] = true;

      // Update the binding so the icon’s border switches to green immediately
      this.itemCollectedBinding.set([...this.itemsEntered]);

      // Force release from player's grab
      try {
        item.position.set(trigger.position.get());
      } catch (e) {
        console.warn(`[BatteryManagerPanel] Failed to force-release item ${index} from grab: ${e}. Using direct position set as fallback.`);
      }

      // Disable collisions to prevent shaking
      if ('collidable' in item) {
        item.collidable.set(false);
      } else {
        console.warn(`[BatteryManagerPanel] Cannot disable collisions for item ${index}. 'collidable' property not found.`);
      }

      // Move/rotate to trigger's exact position and rotation
      const triggerPos = trigger.position.get();
      const triggerRot = trigger.rotation.get();
      if (triggerPos && triggerRot) {
        this.animateEntity(item, triggerPos, triggerRot);
        this.lockedItemPositions.push({ item, position: triggerPos, rotation: triggerRot });
      } else {
        console.error(`[BatteryManagerPanel] Invalid trigger position or rotation for item ${index}. Position: ${triggerPos}, Rotation: ${triggerRot}`);
      }

      // Fire the event for other listeners
      this.sendLocalEvent(this.entity, ItemEnteredEvent, { itemIndex: index });

      // Check if the required number of items are placed
      if (this.areAllItemsPlaced(this.props.solvedItem)) {
        this.handleWinSequence();
      }
    });
  }

  private areAllItemsPlaced(requiredCount: number): boolean {
    let placedCount = 0;
    for (let i = 0; i < this.itemsEntered.length; i++) {
      if (this.getItemByIndex(i) && this.itemsEntered[i]) {
        placedCount++;
      }
    }
    return placedCount >= requiredCount;
  }

  private handleWinSequence() {
    if (this.solved) return;
    this.solved = true;

    // Play one-shot win audio
    this.playAudio(this.props.winAudio);

    // Trigger unlock event (aligned with RiddlePanel and PlaceItemMoveItems)
    if (this.props.UnlockTrigger && this.props.unlockPuzzle) {
      try {
        const evtName = this.props.unlockEventName ?? "Unlock";
        this.sendCodeBlockEvent(this.props.unlockPuzzle, new hz.CodeBlockEvent(evtName, []));
      } catch (e) {
        console.warn('[BatteryManagerPanel] Failed to send unlock event:', e);
      }
    }

    // Delay prize item and door actions by 1 second (aligned with RiddlePanel and PlaceItemMoveItems)
    this.async.setTimeout(() => {
      // Start particles and stop after fxDurationSeconds
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

      // Prize item logic
      if (this.props.usePrizeItem && this.props.prizeItem) {
        const prizePos = this.props.solveEffect?.position.get() ?? 
                         this.props.doorEntity?.position.get() ?? 
                         this.props.prizeItem.position.get();
        if (prizePos.x === 0 && prizePos.y === 0 && prizePos.z === 0) {
          console.warn('[BatteryManagerPanel] Invalid solveEffect/door position, using prizeItem position:', prizePos);
        }
        this.animatePositionOnly(this.props.prizeItem, prizePos, (this.props.animDurationSeconds ?? 2) * 1000);
      }

      // Door logic
      if (this.props.openDoorOnSolve && this.props.doorEntity) {
        const door = this.props.doorEntity;
        const moveType = (this.props.doorMoveType || "rotate").toLowerCase();
        this.playAudio(this.props.doorSound);

        switch (moveType) {
          case "rotate":
            this.onDoorRotateToTarget(door);
            break;
          case "moveup":
            this.onDoorMoveUp(door);
            break;
          case "movedown":
            this.onDoorMoveDown(door);
            break;
          case "moveleft":
            this.onDoorMoveLeft(door);
            break;
          case "moveright":
            this.onDoorMoveRight(door);
            break;
          case "moveforward":
            this.onDoorMoveForward(door);
            break;
          case "movebackward":
            this.onDoorMoveBackward(door);
            break;
          default:
            console.warn(`[BatteryManagerPanel] Invalid doorMoveType: ${moveType}. Defaulting to no action.`);
            break;
        }

        // Stop door sound after animation duration
        this.async.setTimeout(() => {
          try { this.props.doorSound?.as(hz.AudioGizmo)?.stop(); } catch {}
        }, (this.props.animDurationSeconds ?? 2) * 1000);
      }
    }, 1000);
  }

  private onDoorRotateToTarget(door: hz.Entity) {
    if (!door) {
      console.warn("[BatteryManagerPanel] rotate: missing door.");
      return;
    }

    const startRot = door.rotation.get();
    let deltaRot: hz.Quaternion;

    // Use doorMoveTargetRotation if provided
    if (this.props.doorMoveTargetRotation) {
      deltaRot = this.props.doorMoveTargetRotation;
    } else {
      // Fallback to axis + angle or doorRotateBy
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
    }

    const targetRot = deltaRot.mul(startRot);
    this.animateEntity(door, door.position.get(), targetRot);
  }

  private onDoorMoveUp(door: hz.Entity) {
    if (!door) {
      console.warn("[BatteryManagerPanel] moveUp: missing door.");
      return;
    }
    const startPos = door.position.get();
    const endPos = this.props.doorMoveTargetPosition ?? 
                   new hz.Vec3(startPos.x, startPos.y + (this.props.doorMoveAmount ?? 3), startPos.z);
    this.animatePositionOnly(door, endPos, (this.props.animDurationSeconds ?? 2) * 1000);
  }

  private onDoorMoveDown(door: hz.Entity) {
    if (!door) {
      console.warn("[BatteryManagerPanel] moveDown: missing door.");
      return;
    }
    const startPos = door.position.get();
    const endPos = this.props.doorMoveTargetPosition ?? 
                   new hz.Vec3(startPos.x, startPos.y - (this.props.doorMoveAmount ?? 3), startPos.z);
    this.animatePositionOnly(door, endPos, (this.props.animDurationSeconds ?? 2) * 1000);
  }

  private onDoorMoveLeft(door: hz.Entity) {
    if (!door) {
      console.warn("[BatteryManagerPanel] moveLeft: missing door.");
      return;
    }
    const startPos = door.position.get();
    const endPos = this.props.doorMoveTargetPosition ?? 
                   new hz.Vec3(startPos.x, startPos.y, startPos.z - (this.props.doorMoveAmount ?? 3));
    this.animatePositionOnly(door, endPos, (this.props.animDurationSeconds ?? 2) * 1000);
  }

  private onDoorMoveRight(door: hz.Entity) {
    if (!door) {
      console.warn("[BatteryManagerPanel] moveRight: missing door.");
      return;
    }
    const startPos = door.position.get();
    const endPos = this.props.doorMoveTargetPosition ?? 
                   new hz.Vec3(startPos.x, startPos.y, startPos.z + (this.props.doorMoveAmount ?? 3));
    this.animatePositionOnly(door, endPos, (this.props.animDurationSeconds ?? 2) * 1000);
  }

  private onDoorMoveForward(door: hz.Entity) {
    if (!door) {
      console.warn("[BatteryManagerPanel] moveForward: missing door.");
      return;
    }
    const startPos = door.position.get();
    const endPos = this.props.doorMoveTargetPosition ?? 
                   new hz.Vec3(startPos.x + (this.props.doorMoveAmount ?? 3), startPos.y, startPos.z);
    this.animatePositionOnly(door, endPos, (this.props.animDurationSeconds ?? 2) * 1000);
  }

  private onDoorMoveBackward(door: hz.Entity) {
    if (!door) {
      console.warn("[BatteryManagerPanel] moveBackward: missing door.");
      return;
    }
    const startPos = door.position.get();
    const endPos = this.props.doorMoveTargetPosition ?? 
                   new hz.Vec3(startPos.x - (this.props.doorMoveAmount ?? 3), startPos.y, startPos.z);
    this.animatePositionOnly(door, endPos, (this.props.animDurationSeconds ?? 2) * 1000);
  }

  private animateEntity(entity: hz.Entity, targetPosition: hz.Vec3, targetRotation: hz.Quaternion) {
    const durationMs = (this.props.animDurationSeconds ?? 2) * 1000;
    const steps = 60;
    const interval = durationMs / steps;
    const startPos = entity.position.get();
    const startRot = entity.rotation.get();
    let step = 0;

    const timer = this.async.setInterval(() => {
      if (step >= steps) {
        entity.position.set(targetPosition);
        entity.rotation.set(targetRotation);
        this.async.clearInterval(timer);
        return;
      }
      step++;
      const t = step / steps;
      const p = hz.Vec3.lerp(startPos, targetPosition, t);
      const r = hz.Quaternion.slerp(startRot, targetRotation, t);
      entity.position.set(p);
      entity.rotation.set(r);
    }, interval);
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
      const p = hz.Vec3.lerp(startPos, targetPos, t);
      entity.position.set(p);
    }, interval);
  }

  private playAudio(entity?: hz.Entity) {
    entity?.as(hz.AudioGizmo)?.play();
  }

  private getItemByIndex(index: number): hz.Entity | undefined {
    switch (index) {
      case 0: return this.props.item1;
      case 1: return this.props.item2;
      case 2: return this.props.item3;
      case 3: return this.props.item4;
      case 4: return this.props.item5;
      case 5: return this.props.item6;
      default: return undefined;
    }
  }

  private getTriggerByIndex(index: number): hz.Entity | undefined {
    switch (index) {
      case 0: return this.props.trigger1;
      case 1: return this.props.trigger2;
      case 2: return this.props.trigger3;
      case 3: return this.props.trigger4;
      case 4: return this.props.trigger5;
      case 5: return this.props.trigger6;
      default: return undefined;
    }
  }

  private getImageByIndex(index: number): hz.Asset | undefined {
    switch (index) {
      case 0: return this.props.item1Image;
      case 1: return this.props.item2Image;
      case 2: return this.props.item3Image;
      case 3: return this.props.item4Image;
      case 4: return this.props.item5Image;
      case 5: return this.props.item6Image;
      default: return undefined;
    }
  }

  initializeUI(): UINode {
    const numItems = Math.min(Math.max(this.props.numItems ?? 1, 1), 6);
    const images = Array.from({ length: numItems }, (_, i) => this.getImageByIndex(i));

    const validIndices = Array.from({ length: numItems }, (_, i) => i).filter(
      i => this.getItemByIndex(i) && this.getImageByIndex(i)
    );

    const rows: number[][] = [];
    for (let i = 0; i < validIndices.length; i += 4) {
      rows.push(validIndices.slice(i, i + 4));
    }

    return View({
      children: [
        View({
          children: [
            Text({
              text: "Lost Items",
              style: {
                fontSize: 24,
                fontWeight: "bold",
                color: "#FFFFFF",
                textAlign: "center",
              },
            }),
          ],
          style: {
            padding: 8,
            marginBottom: 16,
            borderWidth: 2,
            borderColor: "#39FF14",
            backgroundColor: "rgba(0,0,0,0.4)",
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            width: 160,
          },
        }),
        ...rows.map(indices => this.buildRow(images, indices)),
      ],
      style: {
        padding: 8,
        width: 500,
        height: 500,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "flex-start",
      },
    });
  }

  private buildRow(images: (hz.Asset | undefined)[], indices: number[]): UINode {
    return View({
      children: indices.map((index, i) =>
        View({
          children: [this.renderItem(images[index], index)],
          style: {
            marginRight: i < indices.length - 1 ? 16 : 0,
          },
        })
      ),
      style: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginBottom: 16,
      },
    });
  }

  private renderItem(asset: hz.Asset | undefined, index: number): UINode {
    return View({
      children: [
        Image({
          source: asset ? ImageSource.fromTextureAsset(asset) : undefined,
          style: {
            width: 100,
            height: 100,
            marginBottom: 4,
            borderColor: this.itemCollectedBinding.derive(state =>
              state[index] ? new hz.Color(0, 1, 0) : new hz.Color(0.5, 0.5, 0.5)
            ),
            borderWidth: 2,
            borderRadius: 6,
          },
        }),
        Text({
          text: this.itemCollectedBinding.derive(state =>
            state[index] ? "✔ Collected" : "Pending"
          ),
          style: {
            fontSize: 14,
            color: this.itemCollectedBinding.derive(state =>
              state[index] ? new hz.Color(0.23, 1, 0.09) : new hz.Color(0.53, 0.53, 0.53)
            ),
          },
        }),
      ],
      style: { alignItems: "center" },
    });
  }
}

hz.Component.register(BatteryManagerPanel);