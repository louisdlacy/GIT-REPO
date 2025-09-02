import * as hz from 'horizon/core';
import { SetTextGizmoText } from 'sysUtils';

class FeaturesLab_SetAvatarPoseOverride extends hz.Component<typeof FeaturesLab_SetAvatarPoseOverride> {
  static propsDefinition = {
    clearAvatarPoseOverrideText: { type: hz.PropTypes.Entity },
  };

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      player.clearAvatarGripPoseOverride();
      SetTextGizmoText(this.props.clearAvatarPoseOverrideText, "Avatar Pose Override cleared");
    });

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, () => {
      SetTextGizmoText(this.props.clearAvatarPoseOverrideText, "Clear Avatar Pose Override");
    });
  }
}
hz.Component.register(FeaturesLab_SetAvatarPoseOverride);
