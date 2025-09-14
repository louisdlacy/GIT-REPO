import * as hz from 'horizon/core';

class FeaturesLab_DeathAndRespawnAnimations extends hz.Component<typeof FeaturesLab_DeathAndRespawnAnimations> {
  static propsDefinition = {
    spawnPoint: {type: hz.PropTypes.Entity},
  };

  private isEnabled = true;

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      if (this.isEnabled) {
        this.isEnabled = false;
        player.playAvatarGripPoseAnimationByName('Die');

        this.async.setTimeout(()=>{
          player.playAvatarGripPoseAnimationByName('Respawn');
          this.props.spawnPoint?.as(hz.SpawnPointGizmo)?.teleportPlayer(player);
          this.async.setTimeout(()=>{
            this.isEnabled = true;
          }, 100);
        }, 3000);
      }
    });
  }
}
hz.Component.register(FeaturesLab_DeathAndRespawnAnimations);
