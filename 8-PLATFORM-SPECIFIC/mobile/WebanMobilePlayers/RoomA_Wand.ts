import * as hz from 'horizon/core';
import { sysEvents } from 'sysEvents';

// TODO: Disable HWXS Grab Relax Animation in the property panel of grabbable objects
class RoomA_Wand extends hz.Component<typeof RoomA_Wand> {
  static propsDefinition = {
    projectileLauncher: {type: hz.PropTypes.Entity},
    hintText: {type: hz.PropTypes.String},
    hintDuration: {type: hz.PropTypes.Number, default: 2},
    puzzleManager: {type: hz.PropTypes.Entity},
    objectToMove: {type: hz.PropTypes.Entity},
  };

  start() {
    const launcher = this.props.projectileLauncher?.as(hz.ProjectileLauncherGizmo);
    const door = this.props.objectToMove;
    if(launcher === undefined || launcher === null) return;

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabStart, (isRightHand: true, player: hz.Player) => {
      // Set ownership of the launcher to the player. This will also allow us to set the aim direction on web and mobile,
      // shooting projectile in the direction the camera is facing
      launcher.owner.set(player);

      // Send event to HintHUDManager to display wand hint
      this.sendNetworkBroadcastEvent(sysEvents.OnDisplayHintHUD, {players: [player], text: this.props.hintText, duration: this.props.hintDuration});

      // Play animation and launch projectile on index trigger down
      this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnIndexTriggerDown, (player: hz.Player) => {
        player.playAvatarGripPoseAnimationByName(hz.AvatarGripPoseAnimationNames.Fire);
        // Small delay to allow the animation to play before launching the projectile
        this.async.setTimeout(() => launcher.launchProjectile(), 30);
      });

      // Solve puzzle when door is hit
      this.connectCodeBlockEvent(launcher, hz.CodeBlockEvents.OnProjectileHitObject, (obj, position, normal) => {
        if(obj === door && this.props.puzzleManager) {
          this.sendNetworkEvent(this.props.puzzleManager, sysEvents.OnFinishPuzzle, {});
        }
      });
    });
  }
}
hz.Component.register(RoomA_Wand);
