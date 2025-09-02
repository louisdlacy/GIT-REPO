import { Component, MeshEntity, Color, Vec3, PropTypes } from 'horizon/core';

class RainbowCycle extends Component<typeof RainbowCycle> {
  static propsDefinition = {
    mesh: { type: PropTypes.Entity },
    colorRateOfChange: { type: PropTypes.Number, default: 0.05 },
    intervalTime: { type: PropTypes.Number, default: 0.01 }
  };

  private mesh?: MeshEntity;

  private hue: number = 0;

  private speed = 0;

  preStart() {
    this.mesh = this.props.mesh?.as(MeshEntity);

    this.speed = this.props.colorRateOfChange;

    this.mesh?.style.tintStrength.set(1); // Set the tint strength to 1 for full effect

    this.async.setInterval(
      () => { this.cycle(); },
      1000 * this.props.intervalTime
    );
  }

  start() { }

  cycle() {
    // Increment the hue value based on deltaTime
    this.hue = (this.hue + this.speed) % 1; // Wrap around at 1

    // Convert HSV to RGB and set the color
    const color = Color.fromHSV(new Vec3(this.hue, 1, 1)); // Full saturation and value

    this.mesh?.style.tintColor.set(color);
  }
}

Component.register(RainbowCycle);