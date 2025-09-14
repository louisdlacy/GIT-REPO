import { Component, PropTypes, Vec3, World } from "horizon/core";

class OceanWater extends Component<typeof OceanWater> {
  static propsDefinition = {
    speed: { type: PropTypes.Number, default: 0.1 },
    amplitude: { type: PropTypes.Number, default: 0.1 },
    scalingAmplitude: { type: PropTypes.Number, default: 0.006 },
  };
  private waterLevel: number = 0;
  private phase: number = 0;
  preStart() {
    this.connectLocalBroadcastEvent(World.onUpdate, this.update.bind(this));
    this.waterLevel = this.entity.position.get().y + this.props.amplitude;
  }

  start() {}
  update(data: { deltaTime: number }) {
    this.phase += this.props.speed * data.deltaTime;
    const yPos = Math.sin(this.phase) * this.props.amplitude + this.waterLevel;
    const currScale = Vec3.one.sub(
      Vec3.one.mul(Math.cos(this.phase) * this.props.scalingAmplitude)
    );
    this.entity.position.set(new Vec3(0, yPos, 0));
    this.entity.scale.set(currScale);
  }
}
Component.register(OceanWater);
