import * as hz from 'horizon/core';

class ColorChanger extends hz.Component<typeof ColorChanger> {
  static propsDefinition = {
    minHue: { type: hz.PropTypes.Number, default: 0 },
    maxHue: { type: hz.PropTypes.Number, default: 360 },
    duration: { type: hz.PropTypes.Number, default: 5 },
  };

  private hue: number = 0;
  private direction: number = 1;

  start() {
    this.connectLocalBroadcastEvent(hz.World.onUpdate, this.update.bind(this));
  }

  update(data: { deltaTime: number }) {
    this.hue += this.direction * (360 / this.props.duration!) * data.deltaTime;
    if (this.hue > this.props.maxHue!) {
      this.hue = this.props.maxHue!;
      this.direction = -1;
    } else if (this.hue < this.props.minHue!) {
      this.hue = this.props.minHue!;
      this.direction = 1;
    }

    const color = hz.Color.fromHSV(new hz.Vec3(this.hue, 1, 1));
    this.entity.color.set(color);
  }
}

hz.Component.register(ColorChanger);