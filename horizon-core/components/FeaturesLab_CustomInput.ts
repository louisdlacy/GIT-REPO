import * as hz from 'horizon/core';
import { SetTextGizmoText } from 'sysUtils';

class FeaturesLab_CustomInput extends hz.Component<typeof FeaturesLab_CustomInput> {
  static propsDefinition = {
    playerId: { type: hz.PropTypes.Number },
    CustomInputText: {type: hz.PropTypes.Entity},
  };

  private fireInput?: hz.PlayerInput;
  private aimInput?: hz.PlayerInput;

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player: hz.Player) => {
      if (player.id !== this.props.playerId) return;

      this.entity.owner.set(player);
    });

    if (this.entity.owner.get() !== this.world.getServerPlayer()) {
      this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {

        SetTextGizmoText(this.props.CustomInputText, "Press left click / fire button<br>or<br>right click / aim button");

        if (hz.PlayerControls.isInputActionSupported(hz.PlayerInputAction.RightTrigger)) {
          this.fireInput = hz.PlayerControls.connectLocalInput(hz.PlayerInputAction.RightTrigger, hz.ButtonIcon.Fire, this, {preferredButtonPlacement: hz.ButtonPlacement.Default});
          this.fireInput.registerCallback((action, pressed) => {
            SetTextGizmoText(this.props.CustomInputText, `Left click / fire button pressed: ${pressed}`);
          });
        }

        if (hz.PlayerControls.isInputActionSupported(hz.PlayerInputAction.LeftTrigger)) {
          this.aimInput = hz.PlayerControls.connectLocalInput(hz.PlayerInputAction.LeftTrigger, hz.ButtonIcon.Aim, this, {preferredButtonPlacement: hz.ButtonPlacement.Default});
          this.aimInput.registerCallback((action, pressed) => {
            SetTextGizmoText(this.props.CustomInputText, `Right click / aim button pressed: ${pressed}`);
          });
        }
      });

      this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, (player: hz.Player) => {
        SetTextGizmoText(this.props.CustomInputText, "Custom Input");
        this.fireInput?.disconnect();
        this.aimInput?.disconnect();
      });
    }
  }
}
hz.Component.register(FeaturesLab_CustomInput);
