import { Color, PropTypes, Entity, AudioGizmo, ParticleGizmo, Vec3, TextureAsset, Quaternion, TextGizmo, CodeBlockEvent } from "horizon/core";
import { LocalEvent, Player, InWorldPurchase, Asset } from "horizon/core";
import { UIComponent, Binding, UINode, View, Text, Pressable, ImageSource, Image } from "horizon/ui";

// Created by 13_Chris, modified for color puzzle
// https://bit.ly/ColorOrderPanel for step by step

class colorPanel extends UIComponent<typeof colorPanel> {
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

    // Instruction and Solutions (solutions as color codes, e.g., "1234")
    instructionText: { type: PropTypes.String, default: "Place in the correct order" },
    riddleCount: { type: PropTypes.Number, default: 1 }, // Updated to 1 riddle
    solution1: { type: PropTypes.String, default: "1234" }, // Red, Blue, Green, Yellow
    solution2: { type: PropTypes.String, default: "4321" },
    solution3: { type: PropTypes.String, default: "1356" },
    solution4: { type: PropTypes.String, default: "2465" },

    
    colorSlots: { type: PropTypes.Number, default: 4 },
    
color0Hex:  { type: PropTypes.Color,  default: "#808080" },
color0Name: { type: PropTypes.String, default: "GRAY" },

// IDs 1..7 (defaults match your current mapping)
color1Hex:  { type: PropTypes.Color,  default: "#FF0000" }, color1Name: { type: PropTypes.String, default: "RED" },
color2Hex:  { type: PropTypes.Color,  default: "#0000FF" }, color2Name: { type: PropTypes.String, default: "BLUE" },
color3Hex:  { type: PropTypes.Color,  default: "#00FF00" }, color3Name: { type: PropTypes.String, default: "GREEN" },
color4Hex:  { type: PropTypes.Color,  default: "#FFFF00" }, color4Name: { type: PropTypes.String, default: "YELLOW" },
color5Hex:  { type: PropTypes.Color,  default: "#800080" }, color5Name: { type: PropTypes.String, default: "PURPLE" },
color6Hex:  { type: PropTypes.Color,  default: "#FFA500" }, color6Name: { type: PropTypes.String, default: "ORANGE" },
color7Hex:  { type: PropTypes.Color,  default: "#00FFFF" }, color7Name: { type: PropTypes.String, default: "CYAN" },


    // External puzzle setting
    colorDisplays: { type: PropTypes.Boolean, default: true },
    paletteSize:  { type: PropTypes.Number, default: 7 }, // max 7 colors 

    // Color displays for sending SetColor events
    colorDisplay1: { type: PropTypes.Entity },
    colorDisplay2: { type: PropTypes.Entity },
    colorDisplay3: { type: PropTypes.Entity },
    colorDisplay4: { type: PropTypes.Entity },
    colorDisplay5: { type: PropTypes.Entity },
    colorDisplay6: { type: PropTypes.Entity },

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

    // New Hint Toggles and Props
    IWPHint: { type: PropTypes.Boolean, default: false },
    TokenHint: { type: PropTypes.Boolean, default: false },
    TokenHintAmount: { type: PropTypes.Number, default: 1000 },
    tokenVariableName: { type: PropTypes.String, default: "Tokens" },
    skuId: { type: PropTypes.String, default: "hint1" },
    riddleNumber: { type: PropTypes.Number, default: 1 },
    hintManager: { type: PropTypes.Entity },
    tokenVariableGroup: { type: PropTypes.String, default: "EscapeRoomRemix" },
    tokenKeyOverride:   { type: PropTypes.String, default: "" },


  };
  private evSetPuzzle = new LocalEvent<{ riddle: string; solution: string; index?: number }>("SetPuzzle");
  private isForward = true;
  private isForwardLabel = new Binding<string>("UP");
  private buttonsLocked = false;
  private colorIds: number[] = [];
  private colorBindings: Binding<string>[] = [];
  private textBindings: Binding<string>[] = []; // For displaying icons on win
  private activeRiddle = "";
  private activeSolution = "";
  private riddleTextBinding = new Binding<string>("");
  private hintPanelText = new Binding<string>("The solution is:");


  private mainOpacity = new Binding<number>(1);
  private confirmOpacity = new Binding<number>(0);
  private insufficientTokensOpacity = new Binding<number>(0);
  private hintOpacity = new Binding<number>(0);
  private static readonly HINT_CONFLICT_MSG = "ONLY ONE HINT IWP OR TOKENS CAN BE USED AT A TIME";
  private currentRiddleIndex: number = 1; // 1..riddleCount (matches solution1)
  

  private  colorOptions = [1, 2, 3, 4, 5, 6, 7]; 
  private colorHex: { [key: number]: string } = {
    0: "#808080", // Gray
    1: "#FF0000", // red
    2: "#0000FF", // blue
    3: "#00FF00", // green
    4: "#FFFF00", // yellow
    5: "#800080", // purple
    6: "#FFA500", // orange
    7: "#00FFFF", // Cyan
  };
  private colorNames: { [key: number]: string } = {
    0: "Gray",
    1: "RED",
    2: "BLUE",
    3: "GREEN",
    4: "YELLOW",
    5: "PURPLE",
    6: "ORANGE",
    7: "CYAN",
  };

  start() {
  // Build palette first so colorHex/colorNames are ready
  this.rebuildPaletteFromProps();

  // Ensure only one hint system is active
  if (this.props.IWPHint && this.props.TokenHint) {
    console.warn("[colorPanel] Both IWPHint and TokenHint are enabled. Prioritizing IWPHint.");
  }

  // Hint listener
  if (this.props.IWPHint) {
    this.connectLocalEvent(
      this.entity,
      new LocalEvent<{ riddle: number; player: Player }>("RevealHint"),
      ({ riddle, player }) => {
        const me = this.world.getLocalPlayer();
        if (player !== me) return;
        if (riddle !== this.currentRiddleIndex) return;
        this.showHint(me);
      }
    );
  }

  // Pick a random solution from solution1..solutionN (N=riddleCount up to 4) and sanitize it
  const pick = this.pickRandomSolutionFromProps();       // -> { solution, index }
  this.activeRiddle = this.props.instructionText;
  this.activeSolution = this.sanitizeSolution(pick.solution); // clamp IDs & length
  this.currentRiddleIndex = pick.index;
  this.riddleTextBinding.set(this.activeRiddle);

  // External color displays flow (only when enabled)
  if (this.props.colorDisplays) {
    // Initial push (small delay so receivers can subscribe)
    this.async.setTimeout(() => this.sendSolutionToDisplays(), 100);

    // Update displays whenever a new puzzle is set
    this.connectLocalEvent(
      this.entity,
      this.evSetPuzzle, // LocalEvent<{ riddle: string; solution: string; index?: number }>("SetPuzzle")
      (data) => {
        if (data.riddle) this.activeRiddle = data.riddle;
        if (data.solution) this.activeSolution = this.sanitizeSolution(data.solution);
        if (typeof data.index === "number") this.currentRiddleIndex = data.index;

        this.riddleTextBinding.set(this.activeRiddle);
        this.sendSolutionToDisplays();
      }
    );
  }

  // When colorDisplays is false, we do not send to external displays nor wire SetPuzzle.
}

private rebuildPaletteFromProps() {
  const size = Math.max(1, Math.min(7, Math.floor(this.props.paletteSize ?? 7)));

  // Build numeric IDs available to the puzzle (1..size)
  this.colorOptions = Array.from({ length: size }, (_, i) => i + 1);

  // Base (ID 0)
  this.colorHex[0]   = this.asHexString((this.props as any).color0Hex,  "#808080");
  this.colorNames[0] = ((this.props as any).color0Name as string) ?? "GRAY";

  const defaultHex = (id: number) =>
    ({1:"#FF0000",2:"#007AFF",3:"#34C759",4:"#FFCC00",5:"#AF52DE",6:"#FF9500",7:"#00FFFF"} as Record<number,string>)[id] || "#CCCCCC";
  const defaultName = (id: number) =>
    ({1:"RED",2:"BLUE",3:"GREEN",4:"YELLOW",5:"PURPLE",6:"ORANGE",7:"CYAN"} as Record<number,string>)[id] || `#${id}`;

  for (let id = 1; id <= size; id++) {
    const hexProp  = (this.props as any)[`color${id}Hex`];   // Color | string | undefined
    const nameProp = (this.props as any)[`color${id}Name`];  // string | undefined
    this.colorHex[id]   = this.asHexString(hexProp, defaultHex(id));
    this.colorNames[id] = (typeof nameProp === "string" && nameProp.length) ? nameProp : defaultName(id);
  }
}

private buildTokenKey(): string {
  const overrideRaw = (this.props as any).tokenKeyOverride as string | undefined;
  const override = (overrideRaw ?? "").trim();
  if (override.length > 0) {
    // If "Group:Name" provided, use it verbatim; if just "Name", prepend group.
    if (override.includes(":")) return override;
    const group = String((this.props as any).tokenVariableGroup ?? "EscapeRoomRemix").trim();
    return `${group}:${override}`;
  }
  const group = String((this.props as any).tokenVariableGroup ?? "EscapeRoomRemix").trim();
  const name  = String((this.props as any).tokenVariableName   ?? "Tokens").trim();
  return `${group}:${name}`;
} 

private asHexString(input: unknown, fallback: string): string {
  if (!input) return fallback;
  if (typeof input === "string") return input;

  // Best-effort conversion for Horizon Color-like objects
  try {
    const c: any = input;

    // If the object exposes a toHexString(), prefer that.
    if (typeof c.toHexString === "function") {
      return c.toHexString();
    }

    // Common r/g/b(/a) shapes; values could be 0..1 or 0..255
    const r = c.r ?? c.red;
    const g = c.g ?? c.green;
    const b = c.b ?? c.blue;

    if ([r, g, b].every((v) => typeof v === "number")) {
      const to255 = (v: number) => (v <= 1 ? Math.round(v * 255) : Math.round(v));
      const to2 = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0");
      return `#${to2(to255(r))}${to2(to255(g))}${to2(to255(b))}`;
    }
  } catch {
   
  }
  return String(input);
}
private switchToMain() {
  this.mainOpacity.set(1);
  this.confirmOpacity.set(0);
  this.hintOpacity.set(0);
  for (let i = 0; i < this.colorIds.length; i++) {
    this.colorIds[i] = 0;
    this.colorBindings[i].set(this.colorHex[0]);
    this.textBindings[i].set("");
  }
  this.paintDisplaysGray(); // <-- keep external boards neutral while solving
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
  const names = this.activeSolution
    .split("")
    .map((c) => this.colorNames[parseInt(c, 10)] ?? "?")
    .join(" ");
  this.hintPanelText.set(`The solution is: ${names}`);   // <-- panel text
  this.updateHintText(names);                             // <-- external TextGizmo, if linked
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

  private cycleColor(index: number) {
    if (this.buttonsLocked) return;
    const current = this.colorIds[index];
    let nextIndex = this.colorOptions.indexOf(current) + (this.isForward ? 1 : -1);
    if (nextIndex < 0) nextIndex = this.colorOptions.length - 1;
    if (nextIndex >= this.colorOptions.length) nextIndex = 0;
    const next = this.colorOptions[nextIndex];
    this.colorIds[index] = next;
    this.colorBindings[index].set(this.colorHex[next]);
    this.playSound(this.props.clickSound);
  }

  private handleWinSequence() {
    this.playSound(this.props.correctSound);
    if (this.props.UnlockTrigger && this.props.unlockPuzzle) {
      try {
        const evtName = (this.props as any).unlockEventName ?? "Unlock";
        this.sendCodeBlockEvent(this.props.unlockPuzzle, new CodeBlockEvent(evtName, []));
      } catch (e) {
        console.warn("[colorPanel] Failed to send unlock event:", e);
      }
    }
    this.async.setTimeout(() => {
      if (this.props.usePrizeItem && this.props.prizeItem) {
        const vfxPosition = this.props.solveEffect?.position.get();
        if (vfxPosition) {
          this.animatePositionOnly(this.props.prizeItem, vfxPosition, (this.props.animDurationSeconds ?? 2) * 1000);
        } else {
          console.warn("[colorPanel] No solveEffect position available for prize item movement");
        }
      }
      if (this.props.moveOnSolve && this.props.moveTargetPosition && this.props.moveTargetRotation) {
        this.animateEntity(this.entity, this.props.moveTargetPosition, this.props.moveTargetRotation);
      }
      if (this.props.openDoorOnSolve && this.props.doorEntity) {
        const door = this.props.doorEntity;
        const moveType = (this.props.doorMoveType || "rotate").toLowerCase();
        this.playSound(this.props.doorSound);
        switch (moveType) {
          case "rotate": this.onDoorRotateToTarget(door); break;
          case "moveup": this.onDoorMoveUp(door); break;
          case "movedown": this.onDoorMoveDown(door); break;
          case "moveleft": this.onDoorMoveLeft(door); break;
          case "moveright": this.onDoorMoveRight(door); break;
          case "moveforward": this.onDoorMoveForward(door); break;
          case "movebackward": this.onDoorMoveBackward(door); break;
          default: console.warn(`[colorPanel] Invalid doorMoveType: ${moveType}. Defaulting to no action.`); break;
        }
        this.async.setTimeout(() => { try { this.props.doorSound?.as(AudioGizmo)?.stop(); } catch {} }, (this.props.animDurationSeconds ?? 2) * 1000);
      }
    }, 1000);
  }

  private onDoorRotateToTarget(door: Entity) {
    if (!door) { console.warn("[colorPanel] rotate: missing door."); return; }
    const startRot = door.rotation.get();
    const angleRad = ((this.props.doorRotateAngle ?? 90) * Math.PI) / 180;
    const halfAngle = angleRad / 2;
    const sinHalf = Math.sin(halfAngle);
    const cosHalf = Math.cos(halfAngle);
    let axis: Vec3 = new Vec3(0, 1, 0);
    switch (this.props.doorRotateAxis?.toLowerCase()) {
      case "x": axis = new Vec3(1, 0, 0); break;
      case "y": axis = new Vec3(0, 1, 0); break;
      case "z": axis = new Vec3(0, 0, 1); break;
    }
    const deltaRot = new Quaternion(cosHalf, axis.x * sinHalf, axis.y * sinHalf, axis.z * sinHalf);
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
    if (!door) { console.warn("[colorPanel] moveUp: missing door."); return; }
    const startPos = door.position.get();
    const endPos = new Vec3(startPos.x, startPos.y + (this.props.doorRaiseAmount ?? 3), startPos.z);
    this.animatePositionOnly(door, endPos, (this.props.animDurationSeconds ?? 2) * 1000);
  }

  private onDoorMoveDown(door: Entity) {
    if (!door) { console.warn("[colorPanel] moveDown: missing door."); return; }
    const startPos = door.position.get();
    const endPos = new Vec3(startPos.x, startPos.y - (this.props.doorRaiseAmount ?? 3), startPos.z);
    this.animatePositionOnly(door, endPos, (this.props.animDurationSeconds ?? 2) * 1000);
  }

  private onDoorMoveLeft(door: Entity) {
    if (!door) { console.warn("[colorPanel] moveLeft: missing door."); return; }
    const startPos = door.position.get();
    const endPos = new Vec3(startPos.x, startPos.y, startPos.z - (this.props.doorRaiseAmount ?? 3));
    this.animatePositionOnly(door, endPos, (this.props.animDurationSeconds ?? 2) * 1000);
  }

  private onDoorMoveRight(door: Entity) {
    if (!door) { console.warn("[colorPanel] moveRight: missing door."); return; }
    const startPos = door.position.get();
    const endPos = new Vec3(startPos.x, startPos.y, startPos.z + (this.props.doorRaiseAmount ?? 3));
    this.animatePositionOnly(door, endPos, (this.props.animDurationSeconds ?? 2) * 1000);
  }

  private onDoorMoveForward(door: Entity) {
    if (!door) { console.warn("[colorPanel] moveForward: missing door."); return; }
    const startPos = door.position.get();
    const endPos = new Vec3(startPos.x + (this.props.doorRaiseAmount ?? 3), startPos.y, startPos.z);
    this.animatePositionOnly(door, endPos, (this.props.animDurationSeconds ?? 2) * 1000);
  }

  private onDoorMoveBackward(door: Entity) {
    if (!door) { console.warn("[colorPanel] moveBackward: missing door."); return; }
    const startPos = door.position.get();
    const endPos = new Vec3(startPos.x - (this.props.doorRaiseAmount ?? 3), startPos.y, startPos.z);
    this.animatePositionOnly(door, endPos, (this.props.animDurationSeconds ?? 2) * 1000);
  }

  private animateEntity(entity: Entity, targetPosition: Vec3, targetRotation: Quaternion) {
    const duration = (this.props.animDurationSeconds ?? 2) * 1000;
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
      console.warn("[colorPanel] Failed to set hinttextGizmo text:", e);
    }
  }
 private getDisplays(): Array<Entity | undefined> {
  return [
    this.props.colorDisplay1,
    this.props.colorDisplay2,
    this.props.colorDisplay3,
    this.props.colorDisplay4,
    this.props.colorDisplay5,
    this.props.colorDisplay6,
  ];
}

private paintDisplays(color: string) {
  if (!this.props.colorDisplays) return;
  for (const display of this.getDisplays()) {
    if (!display) continue;
    this.sendLocalEvent(display, new LocalEvent<{ color: string }>("SetColor"), { color });
  }
}

// Set all external displays to GRAY
private paintDisplaysGray() {
  this.paintDisplays(this.colorHex[0] || "#808080");
}

private sendSolutionToDisplays() {
  if (!this.props.colorDisplays) return;

  const displays = [
    this.props.colorDisplay1,
    this.props.colorDisplay2,
    this.props.colorDisplay3,
    this.props.colorDisplay4,
    this.props.colorDisplay5, // NEW
    this.props.colorDisplay6, // NEW
  ];

  const len = Math.min(this.activeSolution.length, displays.length);
  for (let i = 0; i < len; i++) {
    const display = displays[i];
    if (!display) continue;
    const digit = Number.parseInt(this.activeSolution.charAt(i), 10);
    const color = this.colorHex[digit] || "#FF0000";
    this.sendLocalEvent(display, new LocalEvent<{ color: string }>("SetColor"), { color });
  }
}



  initializeUI(): UINode {
    const riddles = [];
    for (let i = 1; i <= this.props.riddleCount!; i++) {
      const solution = (this.props as any)[`solution${i}`];
      if (solution) riddles.push({ riddle: this.props.instructionText, solution });
    }

    if (riddles.length === 0) {
      console.warn("[colorPanel] No riddles defined, using fallback");
      riddles.push({ riddle: this.props.instructionText, solution: "1234" });
    }

    const hasHint = this.props.IWPHint || this.props.TokenHint;
    if (!hasHint) {
      this.updateHintText(""); // Keep hint text invisible when no hint toggle is active
    } else {
      this.updateHintText(""); // Initialize as invisible for hint flows
    }

    const count = Math.max(4, Math.min(6, this.props.colorSlots!));
    this.colorIds = Array(count).fill(0);
   // ✅ paint gray on first render
this.colorBindings = Array(count)
  .fill(null)
  .map(() => new Binding(this.colorHex[0] || "#808080"));

    this.textBindings = Array(count).fill(null).map(() => new Binding(""));

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

    const mainChildren: UINode[] = [];
    if (bothHintsEnabled) {
      mainChildren.push(
        View({
          children: [
            Text({
              text: colorPanel.HINT_CONFLICT_MSG,
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
        children: [this.makeFlipButton(), ...this.colorBindings.map((binding, i) => this.makeColorButton(i, binding, this.textBindings[i]))],
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
            if (this.buttonsLocked) return;
            if (bothHintsEnabled) {
              this.riddleTextBinding.set("ONLY ONE HINT IWP OR TOKENS CAN BE USED AT A TIME");
              this.playSound(this.props.wrongSound);
              return;
            }
            if (this.props.IWPHint) {
              if (this.props.hintManager) {
                const evt = new LocalEvent<{ riddle: number; player: Player }>("Hint:Request");
                this.sendLocalEvent(this.props.hintManager, evt, { riddle: this.currentRiddleIndex, player });
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
    text: this.hintPanelText,
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
  // ⚠️ Warning under the button
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
  panelChildren.push(insufficientTokensView); // Add the popup view here
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
private grayOutColorButtons() {
  const gray = this.colorHex[0] || "#808080";
  for (let i = 0; i < this.colorIds.length; i++) {
    this.colorIds[i] = 0;               // reset ID
    this.colorBindings[i].set(gray);    // paint gray
  }
}

private checkAnswer() {
  if (this.buttonsLocked) return;
  const guess = this.colorIds.join("");
  const correct = this.activeSolution;

  if (guess === correct) {
    this.paintDisplaysGray();   // external tiles -> gray
  

    this.playSound(this.props.correctSound);
    this.buttonsLocked = true;

    const fx = this.props.solveEffect?.as(ParticleGizmo);
    if (fx) {
      fx.play();
      const fxStopMs = Math.max(0, (this.props.fxDurationSeconds ?? 30) * 1000);
      if (fxStopMs > 0) this.async.setTimeout(() => fx.stop(), fxStopMs);
    }

    this.handleWinSequence();

    this.async.setTimeout(() => {
      for (let i = 0; i < this.colorIds.length; i++) this.textBindings[i].set("⛔️");
      this.riddleTextBinding.set("✅ SOLVED");
      this.updateHintText("");
       this.grayOutColorButtons();
    }, (this.props.solvedDisplayDelaySeconds ?? 3) * 1000);
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

private makeColorButton(index: number, colorBinding: Binding<string>, textBinding: Binding<string>): UINode {
  return Pressable({
    children: Text({ text: textBinding, style: { fontSize: 22, color: "#FFFFFF" } }), // White text for visibility
    onClick: () => this.cycleColor(index),
    style: {
      backgroundColor: colorBinding,
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
private clampSlots(n: number): number {
  return Math.max(4, Math.min(6, Math.floor(n || 0)));
}

private pickRandomSolutionFromProps(): { solution: string; index: number } {
  const n = Math.max(1, Math.min(4, Math.floor(this.props.riddleCount ?? 1)));
  const pool: Array<{ solution: string; index: number }> = [];
  for (let i = 1; i <= n; i++) {
    const raw = String((this.props as any)[`solution${i}`] ?? "");
    const clean = raw.replace(/\D/g, ""); // "1,2,3,4" -> "1234"
    if (clean.length > 0) pool.push({ solution: clean, index: i });
  }
  if (pool.length === 0) return { solution: "1234", index: 1 };
  return pool[Math.floor(Math.random() * pool.length)];
}

private sanitizeSolution(raw: string): string {
  const maxId = Math.max(1, Math.min(7, Math.floor(this.props.paletteSize ?? 7)));
  const targetLen = this.clampSlots(this.props.colorSlots ?? 4);

  const digits = raw.split("").map((ch) => {
    const n = Number.parseInt(ch, 10);
    if (!Number.isFinite(n)) return 1;
    if (n < 1) return 1;
    if (n > maxId) return maxId;
    return n;
  });

  if (digits.length < targetLen) {
    const padVal = digits[0] ?? 1;
    while (digits.length < targetLen) digits.push(padVal);
  }
  return digits.slice(0, targetLen).join("");
}

}

UIComponent.register(colorPanel);