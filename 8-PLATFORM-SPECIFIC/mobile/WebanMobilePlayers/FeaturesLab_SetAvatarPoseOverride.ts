import * as hz from 'horizon/core';
import { SetTextGizmoText } from 'sysUtils';

class FeaturesLab_SetAvatarPoseOverride extends hz.Component<typeof FeaturesLab_SetAvatarPoseOverride> {
  static propsDefinition = {
    setAvatarPoseOverrideText: { type: hz.PropTypes.Entity },
  };

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      player.setAvatarGripPoseOverride(hz.AvatarGripPose.Sword);
      SetTextGizmoText(this.props.setAvatarPoseOverrideText, "Avatar Pose Override set to Sword");
    });

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, () => {
      SetTextGizmoText(this.props.setAvatarPoseOverrideText, "Avatar Pose Override");
    });
  }
}
hz.Component.register(FeaturesLab_SetAvatarPoseOverride);
