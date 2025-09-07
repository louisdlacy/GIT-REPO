import { clamp, CodeBlockEvent, Component, EventSubscription, Player, PropTypes, Quaternion, Vec3, World } from "horizon/core";

// These events are missing from the horizon/core api definitions
const Occupied = new CodeBlockEvent<[player: Player]>('Occupied', [PropTypes.Player]);
const Empty = new CodeBlockEvent<[player: Player]>('Empty', [PropTypes.Player]);

/**
 * Opens and closes a door when a trigger is occupied or emptied.
 */
class Opener extends Component<typeof Opener> {
  static propsDefinition = {
    // the door to open/close. Must have its pivot on the hinge side and Y up
    door: { type: PropTypes.Entity },
    // the speed of the door rotation
    rotationSpeed: { type: PropTypes.Number, default: 90 }, // degrees per second
    // the hinge side of the door (true = left, false = right)
    hingeLeft: { type: PropTypes.Boolean, default: true },
  }

  private isOpening = false;
  private currentAngle = 0; // degrees
  private updateSubscription?: EventSubscription;
  private originalRotation = Quaternion.one;

  override preStart() {
    if (!this.props.door) {
      console.error('Opener component requires a door prop to be set');
      return;
    }
    this.connectCodeBlockEvent(this.entity, Occupied, () => this.openDoor());
    this.connectCodeBlockEvent(this.entity, Empty, () => this.closeDoor());
    this.originalRotation = this.props.door.rotation.get();
  }

  override start() { 
  }

  private openDoor() {
    this.isOpening = true;
    this.animateDoor();
  }

  private closeDoor() {
    this.isOpening = false;
    this.animateDoor();
  }

  private animateDoor() {
    // make door non-collidable while animating to avoid accidentally blocking players
    this.props.door?.collidable.set(false);
    // ensure the door is animating
    if (!this.updateSubscription) {
      this.updateSubscription = this.connectLocalBroadcastEvent(World.onUpdate, ({ deltaTime }) => this.rotateDoor(deltaTime));
    }
  }

  private rotateDoor(deltaTime: number) {
    // increase/decrease angle depending on whether opening or closing
    this.currentAngle = clamp(this.currentAngle + (this.isOpening ? 1 : -1) * this.props.rotationSpeed * deltaTime, 0, 90);
    const deltaRotation = Quaternion.fromEuler(new Vec3(0, this.props.hingeLeft ? this.currentAngle : -this.currentAngle, 0));
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

Component.register(Opener);