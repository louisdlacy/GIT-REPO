import * as hz from 'horizon/core';
import { sysEvents } from 'sysEvents';

class FeaturesLab_FocusedInteractionTappingExampleSphereColor extends hz.Component<typeof FeaturesLab_FocusedInteractionTappingExampleSphereColor> {
  static propsDefinition = {};

  private colors = [hz.Color.black, hz.Color.blue, hz.Color.green, hz.Color.red, hz.Color.white];
  private currentColorIndex = 0;

  start() {
    this.connectNetworkEvent(this.entity, sysEvents.OnEntityTapped, () => {
      this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
      this.entity.as(hz.MeshEntity)?.style.tintColor.set(this.colors[this.currentColorIndex]);
      this.entity.as(hz.MeshEntity)?.style.tintStrength.set(1);
    });
  }
}
hz.Component.register(FeaturesLab_FocusedInteractionTappingExampleSphereColor);
