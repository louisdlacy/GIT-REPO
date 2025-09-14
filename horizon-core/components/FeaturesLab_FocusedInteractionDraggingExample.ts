import * as hz from 'horizon/core';
import { sysEvents } from 'sysEvents';
import { SetTextGizmoText } from 'sysUtils';

class FeaturesLab_FocusedInteractionDraggingExample extends hz.Component<typeof FeaturesLab_FocusedInteractionDraggingExample> {
  static propsDefinition = {
    focusedInteractionDraggingText: {type: hz.PropTypes.Entity},
    focusedInteractionDraggingInstructionsText: {type: hz.PropTypes.Entity},
    objectToDrag: {type: hz.PropTypes.Entity},
  };

  private activePlayer!: hz.Player;
  private dragLastPos?: hz.Vec3;

  start() {
    this.activePlayer = this.world.getServerPlayer();
    const cameraPos = hz.Vec3.add(this.entity.position.get(), new hz.Vec3(0, 2, -4));
    const cameraRot = hz.Quaternion.fromEuler(new hz.Vec3(30, 0, 0));

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      if (this.activePlayer === this.world.getServerPlayer() && player.deviceType.get() !== hz.PlayerDeviceType.VR) {
        this.activePlayer = player;
        this.sendNetworkEvent(player, sysEvents.OnStartFocusMode, { exampleController: this.entity, cameraPosition: cameraPos, cameraRotation: cameraRot });
        SetTextGizmoText(this.props.focusedInteractionDraggingText, `Focused Interaction<br>Dragging<br>Active player: ${player.name.get()}`);
        this.props.focusedInteractionDraggingInstructionsText?.visible.set(true);
      }
    });

    this.connectNetworkEvent(this.entity, sysEvents.OnExitFocusMode, (data) => {
      if (this.activePlayer === data.player) {
        this.activePlayer = this.world.getServerPlayer();
        SetTextGizmoText(this.props.focusedInteractionDraggingText, "Focused Interaction<br>Dragging");
        this.props.focusedInteractionDraggingInstructionsText?.visible.set(false);
      }
    });

    this.connectNetworkEvent(this.entity, sysEvents.OnFocusedInteractionInputStarted, (data) => {
      const interaction = data.interactionInfo;
      if (interaction !== undefined && interaction.interactionIndex === 0) {
        this.dragLastPos = interaction.screenPosition;
      }
    });

    this.connectNetworkEvent(this.entity, sysEvents.OnFocusedInteractionInputMoved, (data) => {
      const interaction = data.interactionInfo;
      if (interaction !== undefined && interaction.interactionIndex === 0) {
        if (this.dragLastPos === undefined || this.props.objectToDrag === undefined) return;

        let dragDelta = interaction.screenPosition.sub(this.dragLastPos);
        if (dragDelta.magnitude() > 0) {
          let rotation = hz.Quaternion.fromEuler(new hz.Vec3(dragDelta.y * 1080, -dragDelta.x * 1080, 0));
          this.props.objectToDrag.rotation.set(rotation.mul(this.props.objectToDrag.rotation.get()));
        }

        this.dragLastPos = interaction.screenPosition;
      }
    });

    this.connectNetworkEvent(this.entity, sysEvents.OnFocusedInteractionInputEnded, (data) => {
      const interaction = data.interactionInfo;
      if (interaction !== undefined && interaction.interactionIndex === 0) {
        this.dragLastPos = undefined;
      }
    });
  }
}
hz.Component.register(FeaturesLab_FocusedInteractionDraggingExample);
