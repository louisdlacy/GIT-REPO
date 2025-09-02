import * as hz from 'horizon/core';

class FeaturesLab_PlayAnimation extends hz.Component<typeof FeaturesLab_PlayAnimation> {
  static propsDefinition = {};

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      player.playAvatarGripPoseAnimationByName(hz.AvatarGripPoseAnimationNames.Fire);
    });
  }
}
hz.Component.register(FeaturesLab_PlayAnimation);
