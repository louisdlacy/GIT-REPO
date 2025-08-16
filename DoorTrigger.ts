import { Entity } from 'horizon/core';
import * as hz from 'horizon/core';

class DoorTrigger extends hz.Component<typeof DoorTrigger> {
  static propsDefinition = {
    door: {type: hz.PropTypes.Entity},
    trigger: {type: hz.PropTypes.Entity},
    slideDistance: {type: hz.PropTypes.Number, default: 4}
  };

  private initialPosition!: hz.Vec3;
  private targetPosition!: hz.Vec3;
  private isOpen: boolean = false;
  private updateSubscription!: hz.EventSubscription;

  start() {
    this.initialPosition = this.props.door!.position.get();
    // Calculate target position: move only to the left (negative X), keep Y and Z the same
    this.targetPosition = new hz.Vec3(
      this.initialPosition.x - this.props.slideDistance!,
      this.initialPosition.y,
      this.initialPosition.z
    );

    this.connectCodeBlockEvent(this.props.trigger!, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      this.askPlayerToOpenDoor(player);
    });

    // Add trigger for when player leaves the zone
    this.connectCodeBlockEvent(this.props.trigger!, hz.CodeBlockEvents.OnPlayerExitTrigger, (player: hz.Player) => {
      this.closeDoor();
    });
  }

  askPlayerToOpenDoor(player: hz.Player) {
    const message = "Do you want to open the door?";
    const options = ["Yes", "No"];
    // Assuming there's a UI component or a way to display a prompt to the player
    // For demonstration purposes, we'll use a simple console log
    console.log(message);
    // Simulating player response
    const response = "Yes"; // Replace with actual player input
    if (response === "Yes") {
      this.openDoor();
    }
  }

  openDoor() {
    if (!this.isOpen) {
      this.isOpen = true;
      this.slideDoor(this.targetPosition);
    }
  }

  closeDoor() {
    if (this.isOpen) {
      this.isOpen = false;
      this.slideDoor(this.initialPosition);
    }
  }

  slideDoor(targetPosition: hz.Vec3) {
    const duration = 1; // seconds
    const startTime = Date.now();
    const initialPosition = this.props.door!.position.get();

    // Disconnect any existing animation
    if (this.updateSubscription) {
      this.updateSubscription.disconnect();
    }

    this.updateSubscription = this.connectLocalBroadcastEvent(hz.World.onUpdate, (data: {deltaTime: number}) => {
      const elapsed = (Date.now() - startTime) / 1000;
      const t = Math.min(elapsed / duration, 1);
      
      // Use smooth interpolation for position
      const position = hz.Vec3.lerp(initialPosition, targetPosition, t);
      this.props.door!.position.set(position);
      
      if (t === 1) {
        this.updateSubscription.disconnect();
        console.log(this.isOpen ? 'Door opened' : 'Door closed');
      }
    });
  }
}

hz.Component.register(DoorTrigger);