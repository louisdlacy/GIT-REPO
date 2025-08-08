import * as hz from 'horizon/core';

class RoomC_SlingshotRope extends hz.Component<typeof RoomC_SlingshotRope> {
  static propsDefinition = {
    anchor: {type: hz.PropTypes.Entity},
    pouch: {type: hz.PropTypes.Entity},
  };

  private defaultScale!: hz.Vec3;

  start() {
    this.defaultScale = this.entity.scale.get();

    this.async.setInterval(() => {
      this.update();
    }, 15);
  }

  update() {
    const anchor: hz.Entity | undefined = this.props.anchor;
    const pouch: hz.Entity | undefined = this.props.pouch;
    if (anchor === undefined || pouch === undefined) throw new Error('SlingshotRope: Anchor or rope not found!');

    // Scale the rope between the anchor and the pouch
    const deltaVector = pouch.position.get().sub(anchor.position.get());
    const midpoint = anchor.position.get().add(deltaVector.div(2));

    this.entity.position.set(midpoint); // move to midpoint
    this.entity.lookAt(pouch.position.get()); // rotate in correct direction
    this.entity.scale.set(new hz.Vec3(this.defaultScale.x, this.defaultScale.y, deltaVector.magnitude())); // stretch between the two points
  }
}
hz.Component.register(RoomC_SlingshotRope);
