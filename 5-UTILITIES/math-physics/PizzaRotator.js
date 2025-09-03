"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PizzaRotator = void 0;
const core_1 = require("horizon/core");
/**
 * This component continuously rotates the entity it is attached to on the Y-axis.
 * The speed of the rotation can be configured through the properties panel.
 */
class PizzaRotator extends core_1.Component {
    preStart() {
        // Connect to the world's update loop to apply rotation every frame
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, (data) => {
            this.rotateEntity(data.deltaTime);
        });
    }
    // The start method is required for all components.
    // Initialization logic can be placed here.
    start() { }
    rotateEntity(deltaTime) {
        // Calculate the rotation amount for this frame in radians
        const rotationAmount = (0, core_1.degreesToRadians)(this.props.rotationSpeed * deltaTime);
        // Create a quaternion representing the rotation around the world's Y-axis (up)
        const rotationDelta = core_1.Quaternion.fromAxisAngle(core_1.Vec3.up, rotationAmount);
        // Get the current rotation of the entity
        const currentRotation = this.entity.rotation.get();
        // Apply the new rotation by multiplying the current rotation by the delta
        const newRotation = rotationDelta.mul(currentRotation);
        // Set the entity's new rotation
        this.entity.rotation.set(newRotation);
    }
}
exports.PizzaRotator = PizzaRotator;
// Define the properties that can be configured in the editor
PizzaRotator.propsDefinition = {
    // The speed of rotation in degrees per second
    rotationSpeed: { type: core_1.PropTypes.Number, default: 30 },
};
// Register the component so it can be used in the world
core_1.Component.register(PizzaRotator);
