import * as hz from 'horizon/core';
import { sysEvents } from 'sysEvents';

class RoomB_RotateClues extends hz.Component<typeof RoomB_RotateClues> {
  static propsDefinition = {
    objectToDrag: {type: hz.PropTypes.Entity},
  };

  private activePlayer!: hz.Player;
  private dragLastPos?: hz.Vec3;

  private vrPlayers!: hz.Player[];

  start() {
    this.activePlayer = this.world.getServerPlayer();
    const cameraPos = hz.Vec3.add(this.entity.position.get(), new hz.Vec3(0, 1, 0));
    const cameraRot = hz.Quaternion.fromEuler(new hz.Vec3(90, 0, 0));

    this.vrPlayers = [];
    // Set who can grab the object to none at first
    this.SetWhoCanGrabObject([]);

    // Set who can grab the object to VR players only. Web and Mobile players will use Focused Interactions instead of grabbing the object to interact with it
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player: hz.Player) => {
      if (player.deviceType.get() === hz.PlayerDeviceType.VR) {
        this.vrPlayers.push(player);
        this.SetWhoCanGrabObject(this.vrPlayers);
      }
    });

    // Updating who can grab the object when a player leaves the world
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (player: hz.Player) => {
      if (player.deviceType.get() === hz.PlayerDeviceType.VR) {
        let playerIndex = this.vrPlayers.indexOf(player);
        if (playerIndex > -1) {
          this.vrPlayers.splice(playerIndex, 1);
        }
        this.SetWhoCanGrabObject(this.vrPlayers);
      }
    });

    // Enter Focused Interaction mode when a non-VR player interacts with the object
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      if (this.activePlayer === this.world.getServerPlayer() && player.deviceType.get() !== hz.PlayerDeviceType.VR && this.props.objectToDrag !== undefined) {
        this.activePlayer = player;
        this.SetWhoCanGrabObject([]);
        this.sendNetworkEvent(player, sysEvents.OnStartFocusMode, { exampleController: this.entity, cameraPosition: cameraPos, cameraRotation: cameraRot });
      }
    });

    // Reset status after a player exits Focused Interaction mode
    this.connectNetworkEvent(this.entity, sysEvents.OnExitFocusMode, (data) => {
      if (this.activePlayer === data.player) {
        this.activePlayer = this.world.getServerPlayer();
        this.SetWhoCanGrabObject(this.vrPlayers);
      }
    });

    // Tracking Focused Interaction inputs to rotate the object
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
          let newRotation = hz.Quaternion.fromEuler(new hz.Vec3(dragDelta.y * 1080, 0, -dragDelta.x * 1080));
          this.props.objectToDrag.rotation.set(newRotation.mul(this.props.objectToDrag.rotation.get()));
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

  private SetWhoCanGrabObject(players: hz.Player[]) {
    if (this.props.objectToDrag !== undefined && this.props.objectToDrag.simulated.get()) {
      this.props.objectToDrag.as(hz.GrabbableEntity)?.setWhoCanGrab(players);
    }
  }
}
hz.Component.register(RoomB_RotateClues);
