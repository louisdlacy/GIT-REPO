import * as hz from 'horizon/core';
import { sysEvents } from 'sysEvents';
import { SetTextGizmoText } from 'sysUtils';

class FeaturesLab_FocusedInteractionFlickingExample extends hz.Component<typeof FeaturesLab_FocusedInteractionFlickingExample> {
  static propsDefinition = {
    focusedInteractionFlickingText: {type: hz.PropTypes.Entity},
    focusedInteractionFlickingInstructionsText: {type: hz.PropTypes.Entity},
    objectToFlick: {type: hz.PropTypes.Entity},
  };

  private activePlayer!: hz.Player;
  private objectStartPos!: hz.Vec3;
  private objectStartRot!: hz.Quaternion;
  private objectPhysicalEntity!: hz.PhysicalEntity | null;

  private dragStartPos?: hz.Vec3;

  private canSwipe: boolean = true;

  start() {
    this.activePlayer = this.world.getServerPlayer();
    const cameraPos = hz.Vec3.add(this.entity.position.get(), new hz.Vec3(0, 10, 3));
    const cameraRot = hz.Quaternion.fromEuler(new hz.Vec3(90, 0, 0));

    if (this.props.objectToFlick !== undefined) {
      this.objectStartPos = this.props.objectToFlick.position.get();
      this.objectStartRot = this.props.objectToFlick.rotation.get();
      this.objectPhysicalEntity = this.props.objectToFlick.as(hz.PhysicalEntity);
    }

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      if (this.activePlayer === this.world.getServerPlayer() && player.deviceType.get() !== hz.PlayerDeviceType.VR) {
        this.activePlayer = player;
        this.sendNetworkEvent(player, sysEvents.OnStartFocusMode, { exampleController: this.entity, cameraPosition: cameraPos, cameraRotation: cameraRot });
        SetTextGizmoText(this.props.focusedInteractionFlickingText, `Focused Interaction<br>Flicking<br>Active player: ${player.name.get()}`);
        this.props.focusedInteractionFlickingInstructionsText?.visible.set(true);
      }
    });

    this.connectNetworkEvent(this.entity, sysEvents.OnExitFocusMode, (data) => {
      if (this.activePlayer === data.player) {
        this.activePlayer = this.world.getServerPlayer();
        this.ResetObject();
        SetTextGizmoText(this.props.focusedInteractionFlickingText, "Focused Interaction<br>Flicking");
        this.props.focusedInteractionFlickingInstructionsText?.visible.set(false);
      }
    });

    this.connectNetworkEvent(this.entity, sysEvents.OnFocusedInteractionInputStarted, (data) => {
      if (!this.canSwipe || data.interactionInfo.interactionIndex !== 0) return;

      this.dragStartPos = data.interactionInfo.screenPosition;
    });

    this.connectNetworkEvent(this.entity, sysEvents.OnFocusedInteractionInputEnded, (data) => {
      if (!this.canSwipe || data.interactionInfo.interactionIndex !== 0 || this.dragStartPos === undefined) return;

      let dragTotalDelta = data.interactionInfo.screenPosition.sub(this.dragStartPos);
      let dragAngle = 90 - (Math.atan2(dragTotalDelta.y, dragTotalDelta.x) * 180) / Math.PI;
      dragAngle *= 0.25;
      let force = hz.Vec3.zero;
      force.x += 1000 * (dragTotalDelta.x / 100);
      force.z += 1000 * (dragTotalDelta.y / 100);
      this.objectPhysicalEntity?.applyForce(force.mul(1000), hz.PhysicsForceMode.Impulse);

      this.dragStartPos = undefined;
      this.canSwipe = false;

      this.async.setTimeout(() => {
        this.ResetObject();
      }, 1500);
    });
  }

  private ResetObject() {
    if (this.props.objectToFlick !== undefined) {
    this.props.objectToFlick.position.set(this.objectStartPos);
    this.props.objectToFlick.rotation.set(this.objectStartRot);
    }
    this.objectPhysicalEntity?.zeroVelocity();
    this.canSwipe = true;
  }
}
hz.Component.register(FeaturesLab_FocusedInteractionFlickingExample);
