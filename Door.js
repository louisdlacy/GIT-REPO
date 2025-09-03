"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
// These events are missing from the horizon/core api definitions
const Occupied = new core_1.CodeBlockEvent('Occupied', [core_1.PropTypes.Player]);
const Empty = new core_1.CodeBlockEvent('Empty', [core_1.PropTypes.Player]);
/**
 * Opens and closes a door when a trigger is occupied or emptied.
 */
class Opener extends core_1.Component {
    constructor() {
        super(...arguments);
        this.isOpening = false;
        this.currentAngle = 0; // degrees
        this.originalRotation = core_1.Quaternion.one;
    }
    preStart() {
        if (!this.props.door) {
            console.error('Opener component requires a door prop to be set');
            return;
        }
        this.connectCodeBlockEvent(this.entity, Occupied, () => this.openDoor());
        this.connectCodeBlockEvent(this.entity, Empty, () => this.closeDoor());
        this.originalRotation = this.props.door.rotation.get();
    }
    start() {
    }
    openDoor() {
        this.isOpening = true;
        this.animateDoor();
    }
    closeDoor() {
        this.isOpening = false;
        this.animateDoor();
    }
    animateDoor() {
        // make door non-collidable while animating to avoid accidentally blocking players
        this.props.door?.collidable.set(false);
        // ensure the door is animating
        if (!this.updateSubscription) {
            this.updateSubscription = this.connectLocalBroadcastEvent(core_1.World.onUpdate, ({ deltaTime }) => this.rotateDoor(deltaTime));
        }
    }
    rotateDoor(deltaTime) {
        // increase/decrease angle depending on whether opening or closing
        this.currentAngle = (0, core_1.clamp)(this.currentAngle + (this.isOpening ? 1 : -1) * this.props.rotationSpeed * deltaTime, 0, 90);
        const deltaRotation = core_1.Quaternion.fromEuler(new core_1.Vec3(0, this.props.hingeLeft ? this.currentAngle : -this.currentAngle, 0));
        const newRotation = this.originalRotation.mul(deltaRotation);
        this.props.door?.rotation.set(newRotation);
        // check for completed animation
        if (this.currentAngle === 0 || this.currentAngle === 90) {
            this.updateSubscription?.disconnect();
            this.updateSubscription = undefined;
            this.props.door?.collidable.set(true);
        }
    }
}
Opener.propsDefinition = {
    // the door to open/close. Must have its pivot on the hinge side and Y up
    door: { type: core_1.PropTypes.Entity },
    // the speed of the door rotation
    rotationSpeed: { type: core_1.PropTypes.Number, default: 90 }, // degrees per second
    // the hinge side of the door (true = left, false = right)
    hingeLeft: { type: core_1.PropTypes.Boolean, default: true },
};
core_1.Component.register(Opener);
