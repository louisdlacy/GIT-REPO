import { CodeBlockEvents, Component, Player, PropTypes, Quaternion, Vec3, World } from "horizon/core";


class BowString_Entity extends Component<typeof BowString_Entity> {
  static propsDefinition = {
    bowReference: { type: PropTypes.Entity },
    grabbableReference: { type: PropTypes.Entity },
    diameter: { type: PropTypes.Number, default: 0.02 },
  };
  
  preStart() {
    this.connectLocalBroadcastEvent(World.onUpdate, (payload: { deltaTime: number }) => { this.onUpdate(payload.deltaTime); });
    
    if (this.props.grabbableReference) {
      this.connectCodeBlockEvent(this.props.grabbableReference, CodeBlockEvents.OnGrabStart, (isRightHand, player) => { this.grabStart(player, isRightHand); });
    }
  }

  start() {
  }

  grabStart(player: Player, isRightHand: boolean) {
    this.props.bowReference?.owner.set(player);
    this.entity.owner.set(player);
  }

  onUpdate(deltaTime: number) {
    if (this.props.grabbableReference && this.props.bowReference) {
      const grabRefPos = this.props.grabbableReference.position.get();
      const bowRefPos = this.props.bowReference.position.get();

      this.entity.position.set(Vec3.lerp(grabRefPos, bowRefPos, 0.5));

      this.entity.rotation.set(Quaternion.lookRotation(grabRefPos.sub(bowRefPos), Vec3.up).mul(Quaternion.fromEuler(new Vec3(0, 90, 0))));
      
      this.entity.scale.set(new Vec3(grabRefPos.distance(bowRefPos), this.props.diameter, this.props.diameter));
    }
  }
}
Component.register(BowString_Entity);