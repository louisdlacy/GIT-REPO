import * as hz from 'horizon/core';
import { sysEvents } from 'sysEvents';
import { sysAnimation, Easing } from 'sysAnimation';

class sysMoveObject extends hz.Component<typeof sysMoveObject> {
  static propsDefinition = {
    offset: {type: hz.PropTypes.Vec3},
    duration: {type: hz.PropTypes.Number},
  };

  private animation = new sysAnimation(this);
  private originalPosition = hz.Vec3.zero;
  private hasMoved = false;

  start() {
    this.originalPosition = this.entity.position.get();

    // When the `OnMoveObject` event is received, move the object position by `offset` during `duration` seconds
    this.connectLocalEvent(this.entity, sysEvents.OnMoveObject, () => {
      if (!this.hasMoved) {
        this.hasMoved = true;
        const newPos = this.originalPosition.add(this.props.offset);
        this.animation.animateTo(0, 1, this.props.duration * 1000, (value, pct)=>{
          const currentPos = hz.Vec3.lerp(this.originalPosition , newPos, pct);
          this.entity.position.set(currentPos);
        }, Easing.inOutSine);
      }
    });
  }
}
hz.Component.register(sysMoveObject);
