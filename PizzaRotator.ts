import { Component, PropTypes, World, Quaternion, Vec3, degreesToRadians } from 'horizon/core';

/**
 * This component continuously rotates the entity it is attached to on the Y-axis.
 * The speed of the rotation can be configured through the properties panel.
 */
export class PizzaRotator extends Component<typeof PizzaRotator> {
  // Define the properties that can be configured in the editor
  static propsDefinition = {
    // The speed of rotation in degrees per second
    rotationSpeed: { type: PropTypes.Number, default: 30 },
  };

  override preStart() {
    // Connect to the world's update loop to apply rotation every frame
    this.connectLocalBroadcastEvent(
      World.onUpdate,
      (data: { deltaTime: number }) => {
        this.rotateEntity(data.deltaTime);
      }
    );
  }

  // The start method is required for all components.
  // Initialization logic can be placed here.
  override start() {}

  private rotateEntity(deltaTime: number) {
    // Calculate the rotation amount for this frame in radians
    const rotationAmount = degreesToRadians(this.props.rotationSpeed * deltaTime);

    // Create a quaternion representing the rotation around the world's Y-axis (up)
    const rotationDelta = Quaternion.fromAxisAngle(Vec3.up, rotationAmount);

    // Get the current rotation of the entity
    const currentRotation = this.entity.rotation.get();

    // Apply the new rotation by multiplying the current rotation by the delta
    const newRotation = rotationDelta.mul(currentRotation);

    // Set the entity's new rotation
    this.entity.rotation.set(newRotation);
  }
}

// Register the component so it can be used in the world
Component.register(PizzaRotator);