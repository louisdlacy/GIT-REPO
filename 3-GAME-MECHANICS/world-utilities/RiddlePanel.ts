import { Color, PropTypes, Entity, AudioGizmo, ParticleGizmo, Vec3, TextureAsset, Quaternion, TextGizmo, CodeBlockEvent } from "horizon/core";
import { LocalEvent, Player, InWorldPurchase, Asset } from "horizon/core";
import { UIComponent, Binding, UINode, View, Text, Pressable, ImageSource, Image } from "horizon/ui";
//Created by 13_Chris
class RiddlePanel extends UIComponent<typeof RiddlePanel> {
  static propsDefinition = {
    // Panel Appearance
    backgroundColor: { type: PropTypes.Color, default: "#FFFF00" },
    textColor: { type: PropTypes.Color, default: "#ffffffff" },
    panelWidth: { type: PropTypes.Number, default: 700 },
    panelHeight: { type: PropTypes.Number, default: 300 },
    buttonWidth: { type: PropTypes.Number, default: 60 },
    textSize: { type: PropTypes.Number, default: 18 },
    backgroundTexture1: { type: PropTypes.Asset },
    backgroundTexture2: { type: PropTypes.Asset },
    backgroundTexture3: { type: PropTypes.Asset },
    backgroundTexture4: { type: PropTypes.Asset },
    backgroundTexture5: { type: PropTypes.Asset },
    backgroundSelection: { type: PropTypes.Number, default: 1 },
    iconTexture: { type: PropTypes.Asset },

    // Riddles and Solutions
    riddleCount: { type: PropTypes.Number, default: 4 },
    riddle1: { type: PropTypes.String, default: "I’m shiny and sold in bars. What am I?" },
    solution1: { type: PropTypes.String, default: "GOLD" },
    riddle2: { type: PropTypes.String, default: "I fly without wings and cry without eyes." },
    solution2: { type: PropTypes.String, default: "CLOUD" },
    riddle3: { type: PropTypes.String, default: "You can catch me but not throw me." },
    solution3: { type: PropTypes.String, default: "COLD" },
    riddle4: { type: PropTypes.String, default: "The more you take, the more you leave behind." },
    solution4: { type: PropTypes.String, default: "STEPS" },

    // Audio Effects
    clickSound: { type: PropTypes.Entity },
    correctSound: { type: PropTypes.Entity },
    wrongSound: { type: PropTypes.Entity },
    switchSound: { type: PropTypes.Entity },

    // Visual Effects
    solveEffect: { type: PropTypes.Entity },
    fxDurationSeconds: { type: PropTypes.Number, default: 30 },

    // Prize Item
    prizeItem: { type: PropTypes.Entity },
    usePrizeItem: { type: PropTypes.Boolean, default: true },

    // Panel Movement
    moveOnSolve: { type: PropTypes.Boolean, default: false },
    moveTargetPosition: { type: PropTypes.Vec3 },
    moveTargetRotation: { type: PropTypes.Quaternion },

    // Door Mechanics
    openDoorOnSolve: { type: PropTypes.Boolean, default: false },
    doorEntity: { type: PropTypes.Entity },
    doorSound: { type: PropTypes.Entity },
    doorMoveType: { type: PropTypes.String, default: "rotate" },
    doorRotateAxis: { type: PropTypes.String, default: "y" },
    doorRotateAngle: { type: PropTypes.Number, default: 90 },
    doorRaiseAmount: { type: PropTypes.Number, default: 3 },

    // Animation Timing
    animDurationSeconds: { type: PropTypes.Number, default: 2 },
    solvedDisplayDelaySeconds: { type: PropTypes.Number, default: 3 },

    // Hint Text
    hinttextGizmo: { type: PropTypes.Entity },

    // Unlock Mechanics
    UnlockTrigger: { type: PropTypes.Boolean, default: false },
    unlockPuzzle: { type: PropTypes.Entity },
    unlockEventName: { type: PropTypes.String, default: "Unlock" },

    IWPHint: { type: PropTypes.Boolean, default: false },
    TokenHint: { type: PropTypes.Boolean, default: false },
    TokenHintAmount: { type: PropTypes.Number, default: 1000 },
    tokenVariableName: { type: PropTypes.String, default: "Tokens" }, // keep ONLY this one
    skuId: { type: PropTypes.String, default: "hint1" },
    riddleNumber: { type: PropTypes.Number, default: 1 },
    hintManager: { type: PropTypes.Entity },

    // Token storage (configurable namespace & key)
    // If tokenKeyOverride is non-empty, it will be used verbatim (e.g. "MyGroup:Gold")
    tokenVariableGroup: { type: PropTypes.String, default: "EscapeRoomRemix" },
    tokenKeyOverride:   { type: PropTypes.String, default: "" },


    
  };

  private isForward = true;
  private isForwardLabel = new Binding<string>("UP");
  private buttonsLocked = false;
  private letterValues: string[] = [];
  private letterBindings: Binding<string>[] = [];
  private activeRiddle = "";
  private activeSolution = "";
  private riddleTextBinding = new Binding<string>("");

  private mainOpacity = new Binding<number>(1);
  private confirmOpacity = new Binding<number>(0);
  private insufficientTokensOpacity = new Binding<number>(0);
  private hintOpacity = new Binding<number>(0);
  private static readonly HINT_CONFLICT_MSG =
  "ONLY ONE HINT IWP OR TOKENS CAN BE USED AT A TIME";
  private currentRiddleIndex: number = 1; // 1..riddleCount (matches riddle1..riddle4)



  start() {
    // Ensure only one hint system is active
    if (this.props.IWPHint && this.props.TokenHint) {
      console.warn("[RiddlePanel] Both IWPHint and TokenHint are enabled. Prioritizing IWPHint, disabling TokenHint logic.");
    }

  if (this.props.IWPHint) {
  this.connectLocalEvent(
    this.entity,
    new LocalEvent<{ riddle: number; player: Player }>("RevealHint"),
    ({ riddle, player }) => {
      const me = this.world.getLocalPlayer();
      if (player !== me) return;
      if (riddle !== this.currentRiddleIndex) return; // <-- use runtime-selected index
      this.showHint(me);
    }
  );
}

  }

private buildTokenKey(): string {
  const overrideRaw = (this.props as any).tokenKeyOverride as string | undefined;
  const override = (overrideRaw ?? "").trim();
  if (override.length > 0) {
    if (override.includes(":")) return override;
    const group = String((this.props as any).tokenVariableGroup ?? "EscapeRoomRemix").trim();
    return `${group}:${override}`;
  }
  const group = String((this.props as any).tokenVariableGroup ?? "EscapeRoomRemix").trim();
  const name  = String((this.props as any).tokenVariableName   ?? "Tokens").trim();
  return `${group}:${name}`;
}



  private switchToMain() {
    this.mainOpacity.set(1);
    this.confirmOpacity.set(0);
    this.hintOpacity.set(0);
    // Reset letter values to allow new input
    for (let i = 0; i < this.letterValues.length; i++) {
      this.letterValues[i] = "-";
      this.letterBindings[i].set("-");
    }
    // Reset riddleTextBinding to activeRiddle after hint flow
    this.riddleTextBinding.set(this.activeRiddle);
   
  }

  private switchToConfirm() {
    this.mainOpacity.set(0);
    this.confirmOpacity.set(1);
    this.hintOpacity.set(0);
  }

  private switchToHint() {
    this.mainOpacity.set(0);
    this.confirmOpacity.set(0);
    this.hintOpacity.set(1);
  }

  private showHint(player: Player) {
    this.updateHintText(this.activeSolution.toUpperCase());
   
  }

  private playSound(entity: Entity | undefined) {
    entity?.as(AudioGizmo)?.play();
  }

  private toggleDirection() {
    if (this.buttonsLocked) return;
    this.isForward = !this.isForward;
    this.isForwardLabel.set(this.isForward ? "UP" : "DOWN");
    this.playSound(this.props.switchSound);
  }

  private cycleLetter(index: number) {
    if (this.buttonsLocked) return;
    const current = this.letterValues[index];
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let nextLetter = "-";
    if (this.isForward) {
      if (current === "-") nextLetter = "A";
      else if (current === "Z") nextLetter = "-";
      else nextLetter = alphabet[alphabet.indexOf(current) + 1];
    } else {
      if (current === "-") nextLetter = "Z";
      else if (current === "A") nextLetter = "-";
      else nextLetter = alphabet[alphabet.indexOf(current) - 1];
    }
    this.letterValues[index] = nextLetter;
    this.letterBindings[index].set(nextLetter);
    this.playSound(this.props.clickSound);
  }

  private handleWinSequence() {
    this.playSound(this.props.correctSound);

    // 🔓 Optional: fire an unlock event to a target (like your padlock flow)
    if (this.props.UnlockTrigger && this.props.unlockPuzzle) {
      try {
        const evtName = (this.props as any).unlockEventName ?? "Unlock";
        this.sendCodeBlockEvent(this.props.unlockPuzzle, new CodeBlockEvent(evtName, []));
       
      } catch (e) {
        console.warn("[RiddlePanel] Failed to send unlock event:", e);
      }
    }

    this.async.setTimeout(() => {
      // Prize item → VFX position (if configured)
      if (this.props.usePrizeItem && this.props.prizeItem) {
        const vfxPosition = this.props.solveEffect?.position.get();
        if (vfxPosition) {
          this.animatePositionOnly(
            this.props.prizeItem,
            vfxPosition,
            (this.props.animDurationSeconds ?? 2) * 1000
          );
        } else {
          console.warn("[RiddlePanel] No solveEffect position available for prize item movement");
        }
      }

      // Move this panel/controller (optional)
      if (this.props.moveOnSolve && this.props.moveTargetPosition && this.props.moveTargetRotation) {
        this.animateEntity(this.entity, this.props.moveTargetPosition, this.props.moveTargetRotation);
      }

      // Door behavior (optional)
      if (this.props.openDoorOnSolve && this.props.doorEntity) {
        const door = this.props.doorEntity;
        const moveType = (this.props.doorMoveType || "rotate").toLowerCase();
        this.playSound(this.props.doorSound);

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
            console.warn(`[RiddlePanel] Invalid doorMoveType: ${moveType}. Defaulting to no action.`);
            break;
        }

        // Stop door sound after animation duration
        this.async.setTimeout(() => {
          try { this.props.doorSound?.as(AudioGizmo)?.stop(); } catch {}
        }, (this.props.animDurationSeconds ?? 2) * 1000);
      }
    }, 1000);
  }

  private onDoorRotateToTarget(door: Entity) {
    if (!door) {
      console.warn("[RiddlePanel] rotate: missing door.");
      return;
    }
    const startRot = door.rotation.get();
    const angleRad = ((this.props.doorRotateAngle ?? 90) * Math.PI) / 180;
    const halfAngle = angleRad / 2;
    const sinHalf = Math.sin(halfAngle);
    const cosHalf = Math.cos(halfAngle);
    let axis: Vec3;
    switch (this.props.doorRotateAxis?.toLowerCase()) {
      case "x":
        axis = new Vec3(1, 0, 0);
        break;
      case "y":
        axis = new Vec3(0, 1, 0);
        break;
      case "z":
        axis = new Vec3(0, 0, 1);
        break;
      default:
        axis = new Vec3(0, 1, 0);
    }
    const deltaRot = new Quaternion(
      cosHalf,
      axis.x * sinHalf,
      axis.y * sinHalf,
      axis.z * sinHalf
    );
    const q1 = startRot;
    const q2 = deltaRot;
    const targetRot = new Quaternion(
      q2.w * q1.w - q2.x * q1.x - q2.y * q1.y - q2.z * q1.z,
      q2.w * q1.x + q2.x * q1.w + q2.y * q1.z - q2.z * q1.y,
      q2.w * q1.y - q2.x * q1.z + q2.y * q1.w + q2.z * q1.x,
      q2.w * q1.z + q2.x * q1.y - q2.y * q1.x + q2.z * q1.w
    );
    this.animateEntity(door, door.position.get(), targetRot);
  }

  private onDoorMoveUp(door: Entity) {
    if (!door) {
      console.warn("[RiddlePanel] moveUp: missing door.");
      return;
    }
    const startPos = door.position.get();
    const endPos = new Vec3(startPos.x, startPos.y + (this.props.doorRaiseAmount ?? 3), startPos.z);
    this.animatePositionOnly(door, endPos, (this.props.animDurationSeconds ?? 2) * 1000);
  }

  private onDoorMoveDown(door: Entity) {
    if (!door) {
      console.warn("[RiddlePanel] moveDown: missing door.");
      return;
    }
    const startPos = door.position.get();
    const endPos = new Vec3(startPos.x, startPos.y - (this.props.doorRaiseAmount ?? 3), startPos.z);
    this.animatePositionOnly(door, endPos, (this.props.animDurationSeconds ?? 2) * 1000);
  }

  private onDoorMoveLeft(door: Entity) {
    if (!door) {
      console.warn("[RiddlePanel] moveLeft: missing door.");
      return;
    }
    const startPos = door.position.get();
    const endPos = new Vec3(startPos.x, startPos.y, startPos.z - (this.props.doorRaiseAmount ?? 3));
    this.animatePositionOnly(door, endPos, (this.props.animDurationSeconds ?? 2) * 1000);
  }

  private onDoorMoveRight(door: Entity) {
    if (!door) {
      console.warn("[RiddlePanel] moveRight: missing door.");
      return;
    }
    const startPos = door.position.get();
    const endPos = new Vec3(startPos.x, startPos.y, startPos.z + (this.props.doorRaiseAmount ?? 3));
    this.animatePositionOnly(door, endPos, (this.props.animDurationSeconds ?? 2) * 1000);
  }

  private onDoorMoveForward(door: Entity) {
    if (!door) {
      console.warn("[RiddlePanel] moveForward: missing door.");
      return;
    }
    const startPos = door.position.get();
    const endPos = new Vec3(startPos.x + (this.props.doorRaiseAmount ?? 3), startPos.y, startPos.z);
    this.animatePositionOnly(door, endPos, (this.props.animDurationSeconds ?? 2) * 1000);
  }

  private onDoorMoveBackward(door: Entity) {
    if (!door) {
      console.warn("[RiddlePanel] moveBackward: missing door.");
      return;
    }
    const startPos = door.position.get();
    const endPos = new Vec3(startPos.x - (this.props.doorRaiseAmount ?? 3), startPos.y, startPos.z);
    this.animatePositionOnly(door, endPos, (this.props.animDurationSeconds ?? 2) * 1000);
  }

  private animateEntity(entity: Entity, targetPosition: Vec3, targetRotation: Quaternion) {
    const duration = (this.props.animDurationSeconds ?? 2) * 1000; // Convert seconds to ms
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
        return;
      }
      step++;
      const t = step / steps;
      const newPos = Vec3.lerp(startPos, targetPosition, t);
      const newRot = Quaternion.slerp(startRot, targetRotation, t);
      entity.position.set(newPos);
      entity.rotation.set(newRot);
    }, interval);
  }

  private animatePositionOnly(entity: Entity, targetPosition: Vec3, durationMs: number) {
    const steps = 60;
    const interval = durationMs / steps;
    const startPos = entity.position.get();
    let step = 0;
    const intervalId = this.async.setInterval(() => {
      if (step >= steps) {
        entity.position.set(targetPosition);
        this.async.clearInterval(intervalId);
        return;
      }
      step++;
      const t = step / steps;
      const newPos = Vec3.lerp(startPos, targetPosition, t);
      entity.position.set(newPos);
    }, interval);
  }

  private updateHintText(text: string) {
    try {
      this.props.hinttextGizmo?.as(TextGizmo)?.text.set(text ?? "");
    
    } catch (e) {
      console.warn("[RiddlePanel] Failed to set hinttextGizmo text:", e);
    }
  }

initializeUI(): UINode {
  const riddles = [];
  for (let i = 1; i <= this.props.riddleCount!; i++) {
    const riddle = (this.props as any)[`riddle${i}`];
    const solution = (this.props as any)[`solution${i}`];
    if (riddle && solution) riddles.push({ riddle, solution });
  }

  if (riddles.length === 0) {
    console.warn("No riddles defined, using fallback");
    riddles.push({ riddle: "No riddle defined", solution: "NONE" });
  }

  const index = Math.floor(Math.random() * riddles.length);
  const selected = riddles[index];
  this.activeRiddle = selected.riddle;
  this.activeSolution = selected.solution;
  this.riddleTextBinding.set(this.activeRiddle);

  // IMPORTANT: remember which riddle we picked (1-based)
  this.currentRiddleIndex = index + 1;

  const hasHint = this.props.IWPHint || this.props.TokenHint;
  if (!hasHint) {
    this.updateHintText(""); // Keep hint text invisible when no hint toggle is active
  } else {
    this.updateHintText(""); // Initialize as invisible for hint flows
  }

  const count = Math.min(this.activeSolution.length, 13);
  this.letterValues = Array(count).fill("-");
  this.letterBindings = Array(count).fill(null).map(() => new Binding("-"));

  let selectedTexture: TextureAsset | undefined;
  switch (this.props.backgroundSelection) {
    case 1: selectedTexture = this.props.backgroundTexture1?.as(TextureAsset); break;
    case 2: selectedTexture = this.props.backgroundTexture2?.as(TextureAsset); break;
    case 3: selectedTexture = this.props.backgroundTexture3?.as(TextureAsset); break;
    case 4: selectedTexture = this.props.backgroundTexture4?.as(TextureAsset); break;
    case 5: selectedTexture = this.props.backgroundTexture5?.as(TextureAsset); break;
    default: selectedTexture = this.props.backgroundTexture1?.as(TextureAsset);
  }

  const backgroundImage = selectedTexture ? Image({
    source: ImageSource.fromTextureAsset(selectedTexture),
    style: {
      position: "absolute",
      width: this.props.panelWidth!,
      height: this.props.panelHeight!,
      borderRadius: 12,
      zIndex: 0,
    },
  }) : null;
  const bothHintsEnabled = !!(this.props.IWPHint && this.props.TokenHint);

  // Main View
  const mainChildren: UINode[] = [];

  // Visible banner if both hint toggles are enabled
  if (bothHintsEnabled) {
    mainChildren.push(
      View({
        children: [
          Text({
            text: RiddlePanel.HINT_CONFLICT_MSG,
            style: {
              fontSize: 16,
              fontWeight: "bold",
              color: "#000000",
              textAlign: "center",
            },
          }),
        ],
        style: {
          backgroundColor: "#FFD700",
          paddingVertical: 6,
          paddingHorizontal: 10,
          borderRadius: 6,
          borderColor: "black",
          borderWidth: 2,
          marginBottom: 10,
          zIndex: 2,
        },
      })
    );
  }
  mainChildren.push(
    Text({
      text: this.riddleTextBinding,
      style: {
        fontSize: this.props.textSize!,
        color: this.props.textColor!,
        textAlign: "center",
        marginBottom: 20,
        zIndex: 1,
      },
    })
  );
  mainChildren.push(
    View({
      children: [this.makeFlipButton(), ...this.letterBindings.map((binding, i) => this.makeLetterButton(i, binding))],
      style: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        marginBottom: 20,
        zIndex: 1,
      },
    })
  );
  mainChildren.push(this.makeSubmitButton());

  if (hasHint) {
    mainChildren.push(
      Pressable({
        children: Text({ text: "HINT", style: { color: "black", fontSize: 16, fontWeight: "bold" } }),
        onClick: (player: Player) => {
          if (this.buttonsLocked) return; // Lock out hint button when puzzle is solved
          if (bothHintsEnabled) {
            this.riddleTextBinding.set("ONLY ONE HINT IWP OR TOKENS CAN BE USED AT A TIME");
            this.playSound(this.props.wrongSound);
            return;
          }

          if (this.props.IWPHint) {
            if (this.props.hintManager) {
              const evt = new LocalEvent<{ riddle: number; player: Player }>("Hint:Request");
              this.sendLocalEvent(
                this.props.hintManager,
                evt,
                { riddle: this.currentRiddleIndex, player }
              );
            }
            InWorldPurchase.launchCheckoutFlow(player, this.props.skuId);
          } else if (this.props.TokenHint) {
            this.switchToConfirm();
          }
        },
        style: {
          backgroundColor: "#FFC107",
          paddingHorizontal: 12,
          height: 20,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
          borderColor: "black",
          borderWidth: 1,
          position: "absolute",
          left: 16,
          bottom: 16,
          zIndex: 1,
        },
      })
    );
  }

  if (this.props.iconTexture) {
    mainChildren.push(
      View({
        children: [
          Image({
            source: ImageSource.fromTextureAsset(this.props.iconTexture),
            style: { width: 20, height: 20 },
          }),
        ],
        style: {
          position: "absolute",
          bottom: 8,
          right: 8,
          zIndex: 2,
        },
      })
    );
  }

  const mainView = View({
    children: mainChildren,
    style: {
      width: this.props.panelWidth!,
      height: this.props.panelHeight!,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12,
      padding: 16,
      backgroundColor: selectedTexture ? "transparent" : this.props.backgroundColor!,
      position: "absolute",
      top: 0,
      left: 0,
      opacity: this.mainOpacity,
      zIndex: 1,
    },
  });

  const confirmChildren: UINode[] = [];
  confirmChildren.push(
    Text({
      text: `Confirm spend ${this.props.TokenHintAmount} tokens for hint?`,
      style: { fontSize: 18, color: this.props.textColor!, textAlign: "center", marginBottom: 20 },
    })
  );
  confirmChildren.push(
    View({
      children: [
Pressable({
  children: Text({ text: "Yes", style: { fontSize: 16, fontWeight: "bold", color: "black" } }),
  onClick: async (player: Player) => {
    if (!player || !player.id) { this.switchToMain(); return; }

    const tokenKey = this.buildTokenKey();
    await new Promise(r => this.async.setTimeout(r, 500));
    try {
      const tokens = Number(await this.world.persistentStorage.getPlayerVariable(player, tokenKey)) || 0;
      if (tokens < this.props.TokenHintAmount!) {
        this.confirmOpacity.set(0);
        this.insufficientTokensOpacity.set(1);
        this.playSound(this.props.wrongSound);
        this.async.setTimeout(() => {
          this.insufficientTokensOpacity.set(0);
          this.switchToMain();
        }, 2000);
      } else {
        await this.world.persistentStorage.setPlayerVariable(player, tokenKey, tokens - this.props.TokenHintAmount!);
        this.showHint(player);
        this.switchToHint();
      }
    } catch (e) {
      this.switchToMain();
    }
  },
  style: {
    backgroundColor: "#00FF00",
    paddingHorizontal: 24,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 2,
    marginRight: 10,
  },
}),
        Pressable({
          children: Text({ text: "No", style: { fontSize: 16, fontWeight: "bold", color: "black" } }),
          onClick: () => this.switchToMain(),
          style: {
            backgroundColor: "#FF0000",
            paddingHorizontal: 24,
            height: 40,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            borderColor: "black",
            borderWidth: 2,
          },
        }),
      ],
      style: { flexDirection: "row", justifyContent: "center" },
    })
  );
  const confirmView = View({
    children: confirmChildren,
    style: {
      width: this.props.panelWidth!,
      height: this.props.panelHeight!,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12,
      padding: 16,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      position: "absolute",
      top: 0,
      left: 0,
      opacity: this.confirmOpacity,
      zIndex: 1,
    },
  });

  // Insufficient Tokens Popup (without OK button)
  const insufficientTokensChildren: UINode[] = [
    Text({
      text: "Not enough tokens!",
      style: { fontSize: 20, color: "#FF0000", textAlign: "center", marginBottom: 20 },
    }),
  ];
  const insufficientTokensView = View({
    children: insufficientTokensChildren,
    style: {
      width: this.props.panelWidth! * 0.8,
      height: this.props.panelHeight! * 0.5,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12,
      padding: 16,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: [{ translateX: -(this.props.panelWidth! * 0.4) }, { translateY: -(this.props.panelHeight! * 0.25) }],
      opacity: this.insufficientTokensOpacity,
      zIndex: 2,
    },
  });

const hintChildren: UINode[] = [
  Text({
    text: `The solution is: ${this.activeSolution.toUpperCase()}`,
    style: { fontSize: 22, color: this.props.textColor!, textAlign: "center", marginBottom: 20 },
  }),
  Pressable({
    children: Text({ text: "Close", style: { color: "black", fontSize: 16, fontWeight: "bold" } }),
    onClick: () => this.switchToMain(),
    style: {
      backgroundColor: "#B22222",
      paddingHorizontal: 24,
      height: 40,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      borderColor: "black",
      borderWidth: 2,
    },
  }),
  // ⚠️ Warning under the Close button
  Text({
    text:
      "If you close this hint, you will need to repurchase to view it again.\nDo NOT forget this solution.",
    style: {
      fontSize: 14,
      color: "#FFD700",
      textAlign: "center",
      marginTop: 10,
      maxWidth: this.props.panelWidth! * 0.9,
    },
  }),
];

const hintView = View({
  children: hintChildren,
  style: {
    width: this.props.panelWidth!,
    height: this.props.panelHeight!,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    position: "absolute",
    top: 0,
    left: 0,
    opacity: this.hintOpacity,
    zIndex: 1,
  },
});

const panelChildren: UINode[] = [];
if (backgroundImage) {
  panelChildren.push(backgroundImage);
}
panelChildren.push(mainView);
if (hasHint) {
  panelChildren.push(confirmView);
  panelChildren.push(hintView);
  panelChildren.push(insufficientTokensView);
}

const panelNode = View({
  children: panelChildren,
  style: {
    width: this.props.panelWidth!,
    height: this.props.panelHeight!,
    position: "relative",
  },
});

  return View({
    children: [panelNode],
    style: {
      position: "absolute",
      top: 0, right: 0, bottom: 0, left: 0,
      alignItems: "center",
      justifyContent: "center",
    },
  });
}

private checkAnswer() {
  if (this.buttonsLocked) return;
  const guess = this.letterValues.join("");
  const correct = this.activeSolution.toUpperCase();
  if (guess === correct) {
    this.playSound(this.props.correctSound);
    this.buttonsLocked = true; // Locks both letter buttons and hint button
    const fx = this.props.solveEffect?.as(ParticleGizmo);
    if (fx) {
      fx.play();
      const fxStopMs = Math.max(0, (this.props.fxDurationSeconds ?? 30) * 1000);
      if (fxStopMs > 0) {
        this.async.setTimeout(() => {
          fx.stop();
        }, fxStopMs);
      }
    }
    this.handleWinSequence();
    this.async.setTimeout(() => {
      for (let i = 0; i < this.letterValues.length; i++) {
        this.letterValues[i] = "⛔️";
        this.letterBindings[i].set("⛔️");
      }
      this.riddleTextBinding.set("✅ SOLVED");
      this.updateHintText(""); // Hide hint after solve
    }, (this.props.solvedDisplayDelaySeconds ?? 3) * 1000); // Convert seconds to ms
  } else {
    this.playSound(this.props.wrongSound);
  }
}

private makeFlipButton(): UINode {
  return Pressable({
    children: Text({ text: this.isForwardLabel, style: { fontSize: 14, fontWeight: "bold", color: "black" } }),
    onClick: () => this.toggleDirection(),
    style: {
      backgroundColor: "#1e90ff",
      width: this.props.buttonWidth!,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "black",
      marginRight: 8,
      zIndex: 1,
    },
  });
}

private makeLetterButton(index: number, binding: Binding<string>): UINode {
  return Pressable({
    children: Text({ text: binding, style: { fontSize: 22, color: "black" } }),
    onClick: () => this.cycleLetter(index),
    style: {
      backgroundColor: "#CCCCCC",
      width: this.props.buttonWidth!,
      height: 36,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "black",
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 4,
      marginBottom: 6,
      zIndex: 1,
    },
  });
}

private makeSubmitButton(): UINode {
  return Pressable({
    children: Text({ text: "SUBMIT", style: { color: "black", fontSize: 16, fontWeight: "bold" } }),
    onClick: () => this.checkAnswer(),
    style: {
      backgroundColor: "#B22222",
      paddingHorizontal: 24,
      height: 40,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      borderColor: "black",
      borderWidth: 2,
      zIndex: 1,
    },
  });
}
}

UIComponent.register(RiddlePanel);
//Created by 13_Chris