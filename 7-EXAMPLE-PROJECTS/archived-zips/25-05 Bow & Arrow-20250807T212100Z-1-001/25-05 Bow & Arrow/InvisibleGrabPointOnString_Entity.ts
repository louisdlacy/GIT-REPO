import { events } from "Events_Data";
import { CodeBlockEvents, Component, Entity, EntityInteractionMode, PhysicalEntity, PhysicsForceMode, Player, PropTypes, Quaternion, Vec3, World } from "horizon/core";


class InvisibleGrabPointOnString_Entity extends Component<typeof InvisibleGrabPointOnString_Entity> {
  static propsDefinition = {
    returnReference: { type: PropTypes.Entity },
    frontOfBowReference: { type: PropTypes.Entity },
    arrowManager: { type: PropTypes.Entity },
  };

  isGrabbed = false;

  arrow: Entity | undefined;
  launchForward = Vec3.forward;
  bowStringPullDistance = 0.25;

  preStart() {
    this.connectLocalBroadcastEvent(World.onUpdate, (payload: { deltaTime: number }) => { this.onUpdate(payload.deltaTime); });

    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnGrabStart, (isRightHand, player) => { this.grabStart(player, isRightHand); });
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnGrabEnd, (player) => { this.grabEnd(player); });

    this.connectNetworkEvent(this.entity, events.networked.yourArrowIs, (payload: { arrow: Entity }) => { this.yourArrowIs(payload.arrow); });
  }

  start() {
    if (this.entity.owner.get() !== this.world.getServerPlayer()) {
      this.isGrabbed = true;
    }
  }

  grabStart(player: Player, isRightHand: boolean) {
    this.entity.owner.set(player);
    this.props.returnReference?.owner.set(player);

    this.isGrabbed = true;

    if (this.props.arrowManager) {
      this.sendNetworkEvent(this.props.arrowManager, events.networked.requestArrow, { requester: this.entity });
    }
  }

  grabEnd(player: Player) {
    this.isGrabbed = false;
    
    this.arrow?.as(PhysicalEntity).zeroVelocity();

    const multiplier = Math.min(Math.max(40 * this.bowStringPullDistance, 5), 40);

    this.arrow?.as(PhysicalEntity).applyForce(this.launchForward.mul(multiplier), PhysicsForceMode.VelocityChange);
    this.arrow?.as(PhysicalEntity).gravityEnabled.set(true);

    const tempArrow = this.arrow;
    
    this.async.setTimeout(() => {
      tempArrow?.collidable.set(true);
    }, 25);
    
    this.arrow = undefined;
  }

  onUpdate(deltaTime: number) {
    if (this.props.returnReference) {
      if (!this.isGrabbed) {
        this.entity.position.set(this.props.returnReference.position.get());
      }
      
      if (this.arrow) {
        if (this.props.frontOfBowReference) {
          const frontOfBowReferencePos = this.props.frontOfBowReference.position.get();
          const heldPos = this.entity.position.get();
  
          this.launchForward = frontOfBowReferencePos.sub(heldPos).normalize();
          this.bowStringPullDistance = heldPos.distance(this.props.returnReference.position.get());
  
          this.arrow.position.set(heldPos.add(this.launchForward.mul(0.5)));
          this.arrow.rotation.set(Quaternion.lookRotation(this.launchForward, Vec3.up));
        }
      }
    }
  }

  yourArrowIs(arrow: Entity) {
    arrow.as(PhysicalEntity).zeroVelocity();
    arrow.as(PhysicalEntity).gravityEnabled.set(false);
    arrow.collidable.set(false);

    this.arrow = arrow;
  }
}
Component.register(InvisibleGrabPointOnString_Entity);