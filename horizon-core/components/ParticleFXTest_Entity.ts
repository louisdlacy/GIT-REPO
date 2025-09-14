import { Color, Component, ParticleGizmo, Vec3 } from "horizon/core";


class ParticleFXTest_Entity extends Component<typeof ParticleFXTest_Entity> {
  static propsDefinition = {};

  hue = 0;

  start() {
    this.async.setInterval(() => {this.loop();}, 100);
  }
  
  loop() {
    this.hue += 0.001
    this.entity.as(ParticleGizmo).setVFXParameterValue('ParticleColor', getArrayFromColor(Color.fromHSV(new Vec3(this.hue, 1, 1)), 1));
  }
}
Component.register(ParticleFXTest_Entity);


function getArrayFromColor(color: Color, opacity: number): number[] {
  return [color.r, color.g, color.b, opacity];
}