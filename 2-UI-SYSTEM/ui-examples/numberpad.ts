import {
  Entity,
  PropTypes,
  CodeBlockEvent,
  AudioGizmo,
  ParticleGizmo,
  Vec3,
  Quaternion,
  TextGizmo,
} from "horizon/core";
import * as hz from "horizon/core";
import {
  UIComponent,
  View,
  Text,
  Pressable,
  UINode,
  ViewStyle,
  Binding,
  Image,
  ImageSource,
} from "horizon/ui";

class KeypadWithSolutionPanel extends UIComponent<typeof KeypadWithSolutionPanel> {
  static propsDefinition = {
    // --- Look & layout ---
    backgroundColor: { type: PropTypes.Color, default: "#000000" },
    textColor:        { type: PropTypes.Color, default: "#00ffff" },
    panelWidth:       { type: PropTypes.Number, default: 360 },
    panelHeight:      { type: PropTypes.Number, default: 520 },

    // --- Code length (used when not using fixed solution) ---
    codeLength:       { type: PropTypes.Number, default: 6 },

    // --- Button textures (1..9, C, 0, ✓) ---
    texture1:         { type: hz.PropTypes.Asset, default: null },
    texture2:         { type: hz.PropTypes.Asset, default: null },
    texture3:         { type: hz.PropTypes.Asset, default: null },
    texture4:         { type: hz.PropTypes.Asset, default: null },
    texture5:         { type: hz.PropTypes.Asset, default: null },
    texture6:         { type: hz.PropTypes.Asset, default: null },
    texture7:         { type: hz.PropTypes.Asset, default: null },
    texture8:         { type: hz.PropTypes.Asset, default: null },
    texture9:         { type: hz.PropTypes.Asset, default: null },
    textureClear:     { type: hz.PropTypes.Asset, default: null },
    texture0:         { type: hz.PropTypes.Asset, default: null },
    textureSubmit:    { type: hz.PropTypes.Asset, default: null },

    // --- Sounds & VFX ---
    buttonClickSound: { type: hz.PropTypes.Entity, default: null },  // was clickSound
    correctDing:      { type: hz.PropTypes.Entity, default: null },  // was correctSound
    incorrectBuzz:    { type: hz.PropTypes.Entity, default: null },  // was wrongSound
    winParticles:     { type: hz.PropTypes.Entity, default: null },  // was solveEffect
    winParticlesSeconds: { type: PropTypes.Number, default: 30 },    // seconds

    // --- Prize/VFX move ---
    givePrize:        { type: PropTypes.Boolean, default: true },     // was usePrizeItem
    prize:            { type: hz.PropTypes.Entity, default: null },   // was prizeItem

    // --- Move this panel when solved ---
    movePanelOnSolved:{ type: PropTypes.Boolean, default: false },    // was moveOnSolve
    panelTargetPos:   { type: PropTypes.Vec3, default: new Vec3(0,0,0) },
    panelTargetRot:   { type: PropTypes.Quaternion, default: new Quaternion(0,0,0,1) },

    // --- Door control on solve ---
    openDoorOnSolved: { type: PropTypes.Boolean, default: false },    // was openDoorOnSolve
    door:             { type: hz.PropTypes.Entity, default: null },   // was doorEntity
    doorMoveStyle:    { type: PropTypes.String, default: "rotate" },  // rotate|moveUp|moveDown|moveLeft|moveRight|moveForward|moveBackward
    doorRotateAxis:   { type: hz.PropTypes.String, default: "y" },    // x|y|z
    doorRotateAngle:  { type: hz.PropTypes.Number, default: 90 },     // Degrees
    doorMoveAmount:   { type: hz.PropTypes.Number, default: 3 },      // was doorRaiseAmount
    doorSound:        { type: hz.PropTypes.Entity, default: null },

    // --- Animation timing (seconds) ---
    animSeconds:      { type: hz.PropTypes.Number, default: 2 },      // was animDurationMs (ms)

    // --- RNG-driven behavior (ignored in fixed mode) ---
    requireAllDigitsSet: { type: PropTypes.Boolean, default: true },  // was requireAllSolutionDigits

    // --- Fixed solution options ---
    useFixedSolution: { type: PropTypes.Boolean, default: false },
    fixedSolution:    { type: PropTypes.String, default: "" },        // e.g. "123567"

    // --- Random solution toggle ---
    useRandomSolution: { type: PropTypes.Boolean, default: false },

    // --- Text gizmos for displaying solution digits ---
    textGizmo1:       { type: hz.PropTypes.Entity, default: null },
    textGizmo2:       { type: hz.PropTypes.Entity, default: null },
    textGizmo3:       { type: hz.PropTypes.Entity, default: null },
    textGizmo4:       { type: hz.PropTypes.Entity, default: null },
    textGizmo5:       { type: hz.PropTypes.Entity, default: null },
    textGizmo6:       { type: hz.PropTypes.Entity, default: null },

    // --- UX timing (seconds) ---
    incorrectFlashSeconds: { type: PropTypes.Number, default: 0.8 },  // was incorrectFlashMs (ms)

    // --- Beginner toggle: hide panel after solve ---
    hidePanelOnSolved: { type: PropTypes.Boolean, default: true },
  };

  // Event (only used in RNG mode)
  setSolutionEvent = new CodeBlockEvent<[number, number]>("SetSolution", [PropTypes.Number, PropTypes.Number]);

  // UI state
  private inputBinding = new Binding<string>("");

  // Internal state
  private inputDigits: number[] = [];
  private solutionDigits: number[] = [];
  private locked = false; // disables buttons; also used to keep panel inactive after solve

  // ---------- Lifecycle ----------
  start() {
    // Fixed solution path (use if useRandomSolution is false and fixedSolution string has digits)
    const raw = typeof this.props.fixedSolution === "string"
      ? this.props.fixedSolution.replace(/\D/g, "").trim()
      : "";
    const fixedMode = !this.props.useRandomSolution && (!!this.props.useFixedSolution || raw.length > 0);

    if (fixedMode && raw.length > 0) {
      this.solutionDigits = Array.from(raw).map(c => c.charCodeAt(0) - 48);
      this.inputDigits = [];
      this.locked = false;
      this.refreshBindings();
      this.updateTextGizmos();
      return; // no event hookup in fixed mode
    }

    // Random or event-driven path
    const n = Math.max(1, Math.floor(this.props.codeLength ?? 6));
    this.solutionDigits = new Array(n).fill(-1); // -1 = unset by RNG/event

    // Generate random solution if useRandomSolution is true
    if (this.props.useRandomSolution) {
      this.solutionDigits = new Array(n).fill(0).map(() => Math.floor(Math.random() * 10)); // Random 0-9
    }

    this.inputDigits = [];
    this.locked = false;
    this.refreshBindings();
    this.updateTextGizmos();

    // Listen for SetSolution(pos, digit) addressed to THIS entity (only in non-random, non-fixed mode)
    if (!this.props.useRandomSolution) {
      this.connectCodeBlockEvent(this.entity, this.setSolutionEvent, (pos: number, digit: number) => {
        const n2 = this.solutionDigits.length;
        const p = Math.min(Math.max(1, Math.floor(pos)), n2);
        const d = Math.min(Math.max(0, Math.floor(digit)), 9);
        const i = n2 - p; // 1=ones (rightmost) → left index
        this.solutionDigits[i] = d;
        this.refreshBindings();
        this.updateTextGizmos();
      });
    }
  }

  // Update text gizmos to display solution digits
  private updateTextGizmos() {
    const gizmos = [
      this.props.textGizmo1,
      this.props.textGizmo2,
      this.props.textGizmo3,
      this.props.textGizmo4,
      this.props.textGizmo5,
      this.props.textGizmo6,
    ];
    this.solutionDigits.forEach((digit, index) => {
      const gizmo = gizmos[index] as hz.Entity | null;
      if (gizmo) {
        const textGizmo = gizmo.as(TextGizmo);
        if (textGizmo) {
          textGizmo.text.set(digit >= 0 ? digit.toString() : "-");
        }
      }
    });
  }

  // ---------- Handlers ----------
  private onNumber(num: number) {
    if (this.locked) return;
    if (this.inputDigits.length >= this.solutionDigits.length) return;
    this.inputDigits.push(num);
    this.refreshBindings();
    this.play(this.props.buttonClickSound as hz.Entity | null);
  }

  private onClear() {
    if (this.locked) return;
    this.resetInputToDashes();
    this.play(this.props.buttonClickSound as hz.Entity | null);
  }

  private onSubmit() {
    if (this.locked) return;

    // If RNG path is used, ensure all digits set (unless beginner toggle disabled)
    const usingRng = this.solutionDigits.some(d => d < 0);
    if (usingRng && this.props.requireAllDigitsSet) {
      this.onIncorrect();
      return;
    }

    const n = this.solutionDigits.length;
    if (this.inputDigits.length !== n) {
      this.onIncorrect();
      return;
    }

    // Compare (-1 treated as 0 when requirement disabled)
    const ok = this.inputDigits.every((d, i) => d === (this.solutionDigits[i] < 0 ? 0 : this.solutionDigits[i]));
    if (ok) {
      this.lockPanelSolved();
    } else {
      this.onIncorrect();
    }
  }

  private onIncorrect() {
    this.play(this.props.incorrectBuzz as hz.Entity | null);
    this.inputBinding.set("❌ INCORRECT");
    const delayMs = Math.max(0, (this.props.incorrectFlashSeconds ?? 0.8) * 1000);
    this.async.setTimeout(() => this.resetInputToDashes(), delayMs);
  }

  private lockPanelSolved() {
    // Lock out UI forever (won't re-enable unless you reset it manually)
    this.locked = true;
    this.inputBinding.set("✅ SOLVED");
    this.play(this.props.correctDing as hz.Entity | null);

    const fx = (this.props.winParticles as hz.Entity | null)?.as(ParticleGizmo);
    if (fx) fx.play();

    this.handleWinSequence();

    // Stop particles later
    const fxStopMs = Math.max(0, (this.props.winParticlesSeconds ?? 30) * 1000);
    this.async.setTimeout(() => {
      if (fx) fx.stop();
    }, fxStopMs);

    // Optional: hide/disable the whole panel so it’s not interactable/visible anymore
    if (this.props.hidePanelOnSolved) {
      this.hideSelfPanel();
    }
  }

  // ---------- Helpers ----------
  private play(ent?: Entity | null) {
    ent?.as(AudioGizmo)?.play();
  }

  private resetInputToDashes() {
    this.inputDigits = [];
    this.refreshBindings();
  }

  private animateEntity(entity: Entity, targetPosition: Vec3, targetRotation: Quaternion) {
    const durationMs = (this.props.animSeconds ?? 2) * 1000;
    const steps = 60;
    const interval = durationMs / steps;
    const startPos = entity.position.get();
    const startRot = entity.rotation.get();
    let step = 0;
    const id = this.async.setInterval(() => {
      if (step >= steps) {
        entity.position.set(targetPosition);
        entity.rotation.set(targetRotation);
        this.async.clearInterval(id);
        return;
      }
      step++;
      const t = step / steps;
      entity.position.set(Vec3.lerp(startPos, targetPosition, t));
      entity.rotation.set(Quaternion.slerp(startRot, targetRotation, t));
    }, interval);
  }

  private animatePosition(entity: Entity, targetPosition: Vec3) {
    const durationMs = (this.props.animSeconds ?? 2) * 1000;
    const steps = 60;
    const interval = durationMs / steps;
    const startPos = entity.position.get();
    let step = 0;
    const id = this.async.setInterval(() => {
      if (step >= steps) {
        entity.position.set(targetPosition);
        this.async.clearInterval(id);
        return;
      }
      step++;
      const t = step / steps;
      entity.position.set(Vec3.lerp(startPos, targetPosition, t));
    }, interval);
  }

  private hideSelfPanel() {
    // Keep UI inert via this.locked.
    // Additionally try to hide/disable the panel entity for good measure.
    try { (this as any).enabled?.set?.(false); } catch {}
    try { (this.entity as any).enabled?.set?.(false); } catch {}
    try { (this.entity as any).visible?.set?.(false); } catch {}
  }

  private handleWinSequence() {
    this.async.setTimeout(() => {
      // Prize item → move to VFX position
      const prize = this.props.prize as hz.Entity | null;
      const fxEnt = this.props.winParticles as hz.Entity | null;
      if (this.props.givePrize && prize && fxEnt) {
        const vfxPos = fxEnt.position.get();
        if (vfxPos) this.animatePosition(prize, vfxPos);
      }

      // Move the panel (optional)
      if (this.props.movePanelOnSolved) {
        this.animateEntity(
          this.entity as hz.Entity,
          this.props.panelTargetPos as Vec3,
          this.props.panelTargetRot as Quaternion
        );
      }

      // Door logic
      const door = this.props.door as hz.Entity | null;
      if (this.props.openDoorOnSolved && door) {
        this.play(this.props.doorSound as hz.Entity | null);
        const moveType = (this.props.doorMoveStyle || "rotate").toLowerCase();

        switch (moveType) {
          case "rotate": {
            const startRot = door.rotation.get();
            const angleRad = ((this.props.doorRotateAngle ?? 90) * Math.PI) / 180;
            const half = angleRad / 2;
            const s = Math.sin(half), c = Math.cos(half);
            let axis: hz.Vec3;
            switch (this.props.doorRotateAxis?.toLowerCase()) {
              case "x": axis = new hz.Vec3(1, 0, 0); break;
              case "y": axis = new hz.Vec3(0, 1, 0); break;
              case "z": axis = new hz.Vec3(0, 0, 1); break;
              default:  axis = new hz.Vec3(0, 1, 0);
            }
            const delta = new hz.Quaternion(c, axis.x * s, axis.y * s, axis.z * s);
            const q1 = startRot, q2 = delta;
            const targetRot = new hz.Quaternion(
              q2.w*q1.w - q2.x*q1.x - q2.y*q1.y - q2.z*q1.z,
              q2.w*q1.x + q2.x*q1.w + q2.y*q1.z - q2.z*q1.y,
              q2.w*q1.y - q2.x*q1.z + q2.y*q1.w + q2.z*q1.x,
              q2.w*q1.z + q2.x*q1.y - q2.y*q1.x + q2.z*q1.w
            );
            this.animateEntity(door, door.position.get(), targetRot);
            break;
          }
          case "moveup": {
            const p0 = door.position.get();
            const p1 = new Vec3(p0.x, p0.y + (this.props.doorMoveAmount ?? 3), p0.z);
            this.animatePosition(door, p1);
            break;
          }
          case "movedown": {
            const p0 = door.position.get();
            const p1 = new Vec3(p0.x, p0.y - (this.props.doorMoveAmount ?? 3), p0.z);
            this.animatePosition(door, p1);
            break;
          }
          case "moveleft": {
            const p0 = door.position.get();
            const p1 = new Vec3(p0.x - (this.props.doorMoveAmount ?? 3), p0.y, p0.z);
            this.animatePosition(door, p1);
            break;
          }
          case "moveright": {
            const p0 = door.position.get();
            const p1 = new Vec3(p0.x + (this.props.doorMoveAmount ?? 3), p0.y, p0.z);
            this.animatePosition(door, p1);
            break;
          }
          case "moveforward": {
            const p0 = door.position.get();
            const p1 = new Vec3(p0.x, p0.y, p0.z + (this.props.doorMoveAmount ?? 3));
            this.animatePosition(door, p1);
            break;
          }
          case "movebackward": {
            const p0 = door.position.get();
            const p1 = new Vec3(p0.x, p0.y, p0.z - (this.props.doorMoveAmount ?? 3));
            this.animatePosition(door, p1);
            break;
          }
          default:
            console.warn(`[KeypadWithSolutionPanel] Invalid doorMoveStyle: ${moveType}.`);
            break;
        }

        // Stop door sound after animation duration
        const doorStopMs = (this.props.animSeconds ?? 2) * 1000;
        this.async.setTimeout(() => {
          const doorSound = this.props.doorSound as hz.Entity | null;
          const audio = doorSound?.as?.(hz.AudioGizmo);
          if (audio) audio.stop();
        }, doorStopMs);
      }
    }, 1000);
  }

  private refreshBindings() {
    const n = this.solutionDigits.length;
    const shown = this.inputDigits.map(d => d.toString());
    while (shown.length < n) shown.push("-");
    this.inputBinding.set(`INPUT: ${shown.join(" ")}`);
  }

  // ---------- UI ----------
initializeUI(): UINode {
  const textures = [
    this.props.texture1, this.props.texture2, this.props.texture3,
    this.props.texture4, this.props.texture5, this.props.texture6,
    this.props.texture7, this.props.texture8, this.props.texture9,
    this.props.textureClear, this.props.texture0, this.props.textureSubmit,
  ];
  const labels = ["1","2","3","4","5","6","7","8","9","C","0","✓"];

  const padding = 16;
  const vGap = 10;
  const columns = 3, rows = 4;
  const keypadHeight = this.props.panelHeight * 0.72;
  const buttonWidth  = (this.props.panelWidth - padding * 2 - (columns - 1) * vGap) / columns;
  const buttonHeight = (keypadHeight - padding * 2 - (rows - 1) * vGap) / rows;

  const grid: UINode[] = [];
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    const tex   = textures[i];
    const onClick = () => {
      if (label === "C") this.onClear();
      else if (label === "✓") this.onSubmit();
      else this.onNumber(parseInt(label, 10));
    };
    grid.push(
      NeonTextureButton({
        texture: tex,
        onClick,
        style: { width: buttonWidth, height: buttonHeight, borderRadius: buttonWidth * 0.18 },
        isDisabled: () => this.locked,
      })
    );
  }

  const rowsView: UINode[] = [];
  for (let r = 0; r < rows; r++) {
    rowsView.push(
      View({
        children: grid.slice(r * columns, (r + 1) * columns),
        style: {
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: r < rows - 1 ? vGap : 0,
        },
      })
    );
  }

  const keypad = View({
    children: rowsView,
    style: {
      width: this.props.panelWidth,
      height: keypadHeight,
      padding,
      justifyContent: "center",
    },
  });

  const lines = View({
    children: [
      Text({
        text: this.inputBinding,
        style: { color: this.props.textColor, fontSize: 20, marginTop: 8, marginBottom: 4 },
      }),
    ],
    style: { alignItems: "center", justifyContent: "center", paddingBottom: 10 },
  });

  // Center the entire panel within the UI gizmo bounds
  const panel = View({
    children: [keypad, lines],
    style: {
      width: this.props.panelWidth,
      height: this.props.panelHeight,
      backgroundColor: this.props.backgroundColor,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "space-between",
    },
  });

  // NEW wrapper that fills the gizmo and centers the panel
  return View({
    children: [panel],
    style: {
      width: "100%",
      height: "100%",
      alignItems: "center",      // horizontal center
      justifyContent: "center",  // vertical center
    },
  });
}

}

// ---- Button with disable support ----
type NeonTextureButtonProps = {
  texture: hz.Asset | null;
  onClick: () => void;
  style: ViewStyle;
  isDisabled?: () => boolean;
};

function NeonTextureButton(props: NeonTextureButtonProps): UINode {
  const DEFAULT = "rgba(0,255,255,0.18)";
  const HOVER   = "rgba(0,255,255,0.45)";
  const DOWN    = "rgba(0,255,255,0.65)";
  const DISABLED_BG = "rgba(0,255,255,0.12)";
  const bg = new Binding<string>(DEFAULT);

  const width  = (props.style.width  as number) ?? 80;
  const height = (props.style.height as number) ?? 80;
  const radius = (props.style.borderRadius as number) ?? 12;
  const disabled = () => (props.isDisabled ? props.isDisabled() : false);

  return Pressable({
    children: [
      View({
        style: {
          backgroundColor: bg,
          borderRadius: radius,
          height,
          width,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 2,
          borderColor: "cyan",
          opacity: disabled() ? 0.6 : 1,
        },
      }),
      props.texture
        ? Image({
            source: ImageSource.fromTextureAsset(props.texture as any),
            style: { height: "78%", width: "78%", position: "absolute", opacity: disabled() ? 0.7 : 1 },
          })
        : null,
    ],
    style: { width, height, borderRadius: radius, alignItems: "center", justifyContent: "center" },
    onEnter:   () => { bg.set(disabled() ? DISABLED_BG : HOVER); },
    onExit:    () => { bg.set(disabled() ? DISABLED_BG : DEFAULT); },
    // Fire immediately on press for snappy input
    onPress:   () => {
      if (disabled()) { bg.set(DISABLED_BG); return; }
      bg.set(DOWN);
      props.onClick(); // <— moved here from onRelease to remove click latency
    },
    onRelease: () => {
      if (disabled()) { bg.set(DISABLED_BG); return; }
      bg.set(HOVER);
      // (no action here now)
    },
  });
}

UIComponent.register(KeypadWithSolutionPanel);