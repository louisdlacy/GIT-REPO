import * as hz from 'horizon/core';
import { SetTextGizmoText } from 'sysUtils';

class FeaturesLab_SetAimAssist extends hz.Component<typeof FeaturesLab_SetAimAssist> {
  static propsDefinition = {
    playerId: { type: hz.PropTypes.Number },
    aimAssistTarget: { type: hz.PropTypes.Entity },
    aimAssistText: { type: hz.PropTypes.Entity },
  };

  start() {
    const aimAssistTargetEntity: hz.Entity | undefined = this.props.aimAssistTarget;
    if (aimAssistTargetEntity === undefined) return;

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player: hz.Player) => {
      if (player.id !== this.props.playerId) return;

      this.entity.owner.set(player);
    });

    if (this.entity.owner.get() !== this.world.getServerPlayer()) {
      this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
        SetTextGizmoText(this.props.aimAssistText, "Aim Assist Target Set");
        player.setAimAssistTarget(aimAssistTargetEntity, { assistanceStrength: 20, targetSize: 1, noInputGracePeriod: 0 });
      });

      this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, (player: hz.Player) => {
        SetTextGizmoText(this.props.aimAssistText, "Aim Assist Target Cleared");
        player.clearAimAssistTarget();
      });
    }
  }
}
hz.Component.register(FeaturesLab_SetAimAssist);
