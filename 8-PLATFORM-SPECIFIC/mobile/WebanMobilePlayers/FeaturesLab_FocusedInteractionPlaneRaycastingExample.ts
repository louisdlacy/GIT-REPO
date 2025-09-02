import * as hz from 'horizon/core';
import { sysEvents } from 'sysEvents';
import { SetTextGizmoText } from 'sysUtils';

class FeaturesLab_FocusedInteractionPlaneRaycastingExample extends hz.Component<typeof FeaturesLab_FocusedInteractionPlaneRaycastingExample> {
  static propsDefinition = {
    focusedInteractionPlaneRaycastingText: {type: hz.PropTypes.Entity},
    focusedInteractionPlaneRaycastingInstructionsText: {type: hz.PropTypes.Entity},
    objectToMove: {type: hz.PropTypes.Entity},
    planeRaycastingRaycast: {type: hz.PropTypes.Entity},
  };

  private activePlayer!: hz.Player;
  private raycastGizmo!: hz.RaycastGizmo | null;
  private objectStartPos!: hz.Vec3;

  start() {
    this.activePlayer = this.world.getServerPlayer();
    const cameraPos = hz.Vec3.add(this.entity.position.get(), new hz.Vec3(0, 0.25, -5));
    const cameraRot = hz.Quaternion.fromEuler(new hz.Vec3(0, 0, 0));

    if (this.props.planeRaycastingRaycast) {
      this.raycastGizmo = this.props.planeRaycastingRaycast.as(hz.RaycastGizmo);
    }

    if (this.props.objectToMove) {
      this.objectStartPos = this.props.objectToMove.position.get();
    }

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      if (this.activePlayer === this.world.getServerPlayer() && player.deviceType.get() !== hz.PlayerDeviceType.VR) {
        this.activePlayer = player;
        this.sendNetworkEvent(player, sysEvents.OnStartFocusMode, { exampleController: this.entity, cameraPosition: cameraPos, cameraRotation: cameraRot });
        SetTextGizmoText(this.props.focusedInteractionPlaneRaycastingText, `Focused Interaction<br>Plane Raycasting<br>Active player: ${player.name.get()}`);
        this.props.focusedInteractionPlaneRaycastingInstructionsText?.visible.set(true);
      }
    });

    this.connectNetworkEvent(this.entity, sysEvents.OnExitFocusMode, (data) => {
      if (this.activePlayer === data.player) {
        this.activePlayer = this.world.getServerPlayer();
        this.props.objectToMove?.position.set(this.objectStartPos);
        SetTextGizmoText(this.props.focusedInteractionPlaneRaycastingText, "Focused Interaction<br>Plane Raycasting");
        this.props.focusedInteractionPlaneRaycastingInstructionsText?.visible.set(false);
      }
    });

    this.connectNetworkEvent(this.entity, sysEvents.OnFocusedInteractionInputStarted, (data) => {
      this.MoveObjectToTouchPos(data.interactionInfo);
    });

    this.connectNetworkEvent(this.entity, sysEvents.OnFocusedInteractionInputMoved, (data) => {
      this.MoveObjectToTouchPos(data.interactionInfo);
    });

    this.connectNetworkEvent(this.entity, sysEvents.OnFocusedInteractionInputEnded, (data) => {
      this.MoveObjectToTouchPos(data.interactionInfo);
    });
  }

  private MoveObjectToTouchPos(interactionInfo: hz.InteractionInfo) {
    if (interactionInfo.interactionIndex !== 0 || !this.raycastGizmo) return;

    const hit: hz.RaycastHit | null = this.raycastGizmo.raycast(interactionInfo.worldRayOrigin, interactionInfo.worldRayDirection);
    if (hit && hit.hitPoint !== undefined && this.props.objectToMove) {
      this.props.objectToMove.position.set(hit.hitPoint);
    }
  }
}
hz.Component.register(FeaturesLab_FocusedInteractionPlaneRaycastingExample);
