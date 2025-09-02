import * as hz from 'horizon/core';
import { sysEvents } from 'sysEvents';
import { SetTextGizmoText } from 'sysUtils';

class FocusedInteractionTappingExample extends hz.Component<typeof FocusedInteractionTappingExample> {
  static propsDefinition = {
    focusedInteractionTappingText: {type: hz.PropTypes.Entity},
    focusedInteractionTappingInstructionsText: {type: hz.PropTypes.Entity},
    tappingRaycast: {type: hz.PropTypes.Entity},
    relativeCameraPosition: {type: hz.PropTypes.Vec3},
    cameraRotation: {type: hz.PropTypes.Vec3},
    cameraFov: {type: hz.PropTypes.Number},
  };

  private activePlayer!: hz.Player;
  private raycastGizmo!: hz.RaycastGizmo | null;

  start() {
    this.activePlayer = this.world.getServerPlayer();
    const cameraPos = hz.Vec3.add(this.entity.position.get(), this.props.relativeCameraPosition);
    const cameraRot = hz.Quaternion.fromEuler(this.props.cameraRotation);

    if (this.props.tappingRaycast) {
      this.raycastGizmo = this.props.tappingRaycast.as(hz.RaycastGizmo);
    }

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      if (this.activePlayer === this.world.getServerPlayer() && player.deviceType.get() !== hz.PlayerDeviceType.VR) {
        this.activePlayer = player;
        this.sendNetworkEvent(player, sysEvents.OnStartFocusMode, {exampleController: this.entity, cameraPosition: cameraPos, cameraRotation: cameraRot});
        this.sendNetworkEvent(player, sysEvents.OnSetCameraFOV, {newFOV: this.props.cameraFov});
        SetTextGizmoText(this.props.focusedInteractionTappingText, `Focused Interaction<br>Tapping<br>Active player: ${player.name.get()}`);
        this.props.focusedInteractionTappingInstructionsText?.visible.set(true);
      }
    });

    this.connectNetworkEvent(this.entity, sysEvents.OnExitFocusMode, (data) => {
      if (this.activePlayer === data.player) {
        this.activePlayer = this.world.getServerPlayer();
        this.sendNetworkEvent(data.player, sysEvents.OnResetCameraFOV, {});
        SetTextGizmoText(this.props.focusedInteractionTappingText, "Focused Interaction<br>Tapping");
        this.props.focusedInteractionTappingInstructionsText?.visible.set(false);
      }
    });

    this.connectNetworkEvent(this.entity, sysEvents.OnFocusedInteractionInputEnded, (data) => {
      const interaction = data.interactionInfo;
      if (interaction !== undefined && interaction.interactionIndex === 0 && this.raycastGizmo) {
        const hit: hz.RaycastHit | null = this.raycastGizmo.raycast(interaction.worldRayOrigin, interaction.worldRayDirection);
        if (hit && hit.targetType === hz.RaycastTargetType.Entity && hit.target) {
          this.sendNetworkEvent(hit.target, sysEvents.OnEntityTapped, null);
        }
      }
    });
  }
}
hz.Component.register(FocusedInteractionTappingExample);
