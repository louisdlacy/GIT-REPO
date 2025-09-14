import { CodeBlockEvents, Component, Player, PropTypes } from "horizon/core";


class Bow_Entity extends Component<typeof Bow_Entity> {
  static propsDefinition = {
    returnRef: { type: PropTypes.Entity },
    returnDelayMs: { type: PropTypes.Number, default: 5_000 },
  };

  setTimeoutID = 0;

  preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnGrabStart, (isRightHand, player) => { this.grabStart(player, isRightHand); });
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnGrabEnd, (player) => { this.grabEnd(player); });
  }

  start() {

  }

  grabStart(player: Player, isRightHand: boolean) {
    this.async.clearTimeout(this.setTimeoutID);

    this.entity.owner.set(player);
    this.props.returnRef?.owner.set(player);
  }

  grabEnd(player: Player) {
    this.setTimeoutID = this.async.setTimeout(() => { this.returnToOrg(); }, this.props.returnDelayMs);
  }
  
  returnToOrg() {
    if (this.props.returnRef) {
      this.entity.position.set(this.props.returnRef.position.get());
      this.entity.rotation.set(this.props.returnRef.rotation.get());
    }
  }
}
Component.register(Bow_Entity);