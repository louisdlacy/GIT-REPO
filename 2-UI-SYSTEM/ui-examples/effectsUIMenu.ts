import { UIComponent, View, Text, Pressable, Binding } from "horizon/ui";
import { Entity, ParticleGizmo, PropTypes } from "horizon/core";

class EffectsUIMenu extends UIComponent<typeof EffectsUIMenu> {
  static propsDefinition = {
    vfx1: { type: PropTypes.Entity },
    vfx2: { type: PropTypes.Entity },
    vfx3: { type: PropTypes.Entity },
    targetEntity: { type: PropTypes.Entity },
  };

  private vfx1?: ParticleGizmo;
  private vfx2?: ParticleGizmo;
  private vfx3?: ParticleGizmo;
  private targetEntity?: Entity;

  private vfx1Active = new Binding(false);
  private vfx2Active = new Binding(false);
  private vfx3Active = new Binding(false);
  private visible = new Binding(false);
  private _visible = false;
  private visibilityButtonText = new Binding("Show Entity");
  private visibilityActive = new Binding(false);
  private vfx1ButtonText = new Binding("Start");
  private vfx2ButtonText = new Binding("Start");
  private vfx3ButtonText = new Binding("Start");

  preStart() {
    this.vfx1 = this.props.vfx1?.as(ParticleGizmo);
    this.vfx2 = this.props.vfx2?.as(ParticleGizmo);
    this.vfx3 = this.props.vfx3?.as(ParticleGizmo);
    this.targetEntity = this.props.targetEntity;
    // Ensure all VFX are stopped and entity is invisible by default
    this.vfx1?.stop();
    this.vfx2?.stop();
    this.vfx3?.stop();
    this.targetEntity?.visible.set(false);
  }

  renderButton(
    label: string | Binding<string>,
    onPress: () => void,
    isActive?: Binding<boolean>
  ) {
    // Create a derived binding for background color based on active state
    const bgColor = isActive
      ? isActive.derive((active) => (active ? "#2ecc40" : "#555"))
      : "#555";

    return Pressable({
      children: Text({
        text: label,
        style: { color: "white", textAlign: "center" },
      }),
      style: {
        backgroundColor: bgColor,
        width: 120,
        height: 40,
        margin: 6,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
      },
      onPress: onPress,
    });
  }

  renderStartButton(label: string | Binding<string>, onPress: () => void) {
    return Pressable({
      children: Text({
        text: label,
        style: { color: "white", textAlign: "center" },
      }),
      style: {
        backgroundColor: "#2ecc40", // Always green for start buttons
        width: 120,
        height: 40,
        margin: 6,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
      },
      onPress: onPress,
    });
  }

  renderStopButton(label: string, onPress: () => void) {
    return Pressable({
      children: Text({
        text: label,
        style: { color: "white", textAlign: "center" },
      }),
      style: {
        backgroundColor: "#e74c3c", // Always red for stop buttons
        width: 120,
        height: 40,
        margin: 6,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
      },
      onPress: onPress,
    });
  }

  initializeUI() {
    return View({
      style: {
        flexDirection: "column",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#222C",
      },
      children: [
        Text({
          text: "Effects UI Menu",
          style: { color: "white", fontSize: 20, marginBottom: 12 },
        }),
        // VFX 1
        Text({ text: "VFX 1", style: { color: "white", marginTop: 8 } }),
        View({
          style: { flexDirection: "row" },
          children: [
            this.renderStartButton(this.vfx1ButtonText, () => {
              console.log("VFX1 Start button pressed, vfx1:", this.vfx1);
              if (this.vfx1) {
                this.vfx1.play();
                this.vfx1Active.set(true);
                this.vfx1ButtonText.set("Playing");
              }
            }),
            this.renderStopButton("Stop", () => {
              console.log("VFX1 Stop button pressed, vfx1:", this.vfx1);
              if (this.vfx1) {
                this.vfx1.stop();
                this.vfx1Active.set(false);
                this.vfx1ButtonText.set("Start");
              }
            }),
          ],
        }),
        // VFX 2
        Text({ text: "VFX 2", style: { color: "white", marginTop: 8 } }),
        View({
          style: { flexDirection: "row" },
          children: [
            this.renderStartButton(this.vfx2ButtonText, () => {
              console.log("VFX2 Start button pressed, vfx2:", this.vfx2);
              if (this.vfx2) {
                this.vfx2.play();
                this.vfx2Active.set(true);
                this.vfx2ButtonText.set("Playing");
              }
            }),
            this.renderStopButton("Stop", () => {
              console.log("VFX2 Stop button pressed, vfx2:", this.vfx2);
              if (this.vfx2) {
                this.vfx2.stop();
                this.vfx2Active.set(false);
                this.vfx2ButtonText.set("Start");
              }
            }),
          ],
        }),
        // VFX 3
        Text({ text: "VFX 3", style: { color: "white", marginTop: 8 } }),
        View({
          style: { flexDirection: "row" },
          children: [
            this.renderStartButton(this.vfx3ButtonText, () => {
              console.log("VFX3 Start button pressed, vfx3:", this.vfx3);
              if (this.vfx3) {
                this.vfx3.play();
                this.vfx3Active.set(true);
                this.vfx3ButtonText.set("Playing");
              }
            }),
            this.renderStopButton("Stop", () => {
              console.log("VFX3 Stop button pressed, vfx3:", this.vfx3);
              if (this.vfx3) {
                this.vfx3.stop();
                this.vfx3Active.set(false);
                this.vfx3ButtonText.set("Start");
              }
            }),
          ],
        }),
        // Visibility Toggle
        Text({
          text: "Target Entity",
          style: { color: "white", marginTop: 12 },
        }),
        this.renderButton(
          this.visibilityButtonText,
          () => {
            console.log(
              "Visibility toggle pressed, current state:",
              this._visible,
              "targetEntity:",
              this.targetEntity
            );
            this._visible = !this._visible;
            this.visible.set(this._visible);
            this.visibilityActive.set(this._visible);
            this.visibilityButtonText.set(
              this._visible ? "Hide Entity" : "Show Entity"
            );
            if (this.targetEntity) {
              this.targetEntity.visible.set(this._visible);
            }
          },
          this.visibilityActive
        ),
      ],
    });
  }
}

UIComponent.register(EffectsUIMenu);
