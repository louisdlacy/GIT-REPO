import { Component, MeshEntity, Color, Vec3, PropTypes } from 'horizon/core';

//Modified From Tellous' Original, Thank You!

class RainbowCycle extends Component<typeof RainbowCycle> {
  static propsDefinition = {
    colorShift: { type: PropTypes.Number, default: 0.01 },
    loopMs: { type: PropTypes.Number, default: 100 }
  };

  hsv = new Vec3(0, 1, 1);
  
  start() {
    const mesh = this.entity.as(MeshEntity);
    mesh.style.tintStrength.set(1);
    mesh.style.brightness.set(1);

    this.async.setInterval(()=> { this.loop(mesh); }, this.props.loopMs);
  }

  loop(mesh: MeshEntity) {
    this.hsv.x = (this.hsv.x + this.props.colorShift) % 1;

    mesh.style.tintColor.set(Color.fromHSV(this.hsv));
  }
}

Component.register(RainbowCycle);