import { Color, Component, ParticleGizmo, PropTypes, Vec3 } from "horizon/core";


class ParticleFXTest_Entity extends Component<typeof ParticleFXTest_Entity> {
  static propsDefinition = {
    opacity: { type: PropTypes.Number, default: 1 },
    hueStep: { type: PropTypes.Number, default: 0.001 },
  };

  hue = 0;

  start() {
    this.async.setInterval(() => {this.loop();}, 100);
  }
  
  loop() {
    this.hue += this.props.hueStep;
    this.entity.as(ParticleGizmo).setVFXParameterValue('ParticleColor', getArrayFromColor(Color.fromHSV(new Vec3(this.hue, 1, 1)), this.props.opacity));
  }
}
Component.register(ParticleFXTest_Entity);


function getArrayFromColor(color: Color, opacity: number): number[] {
  return [color.r, color.g, color.b, opacity];
}