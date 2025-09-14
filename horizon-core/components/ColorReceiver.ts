import * as hz from 'horizon/core';
import { ColorChangeButton } from './ColorChangeButton';

class ColorReceiver extends hz.Component<typeof ColorReceiver> {
  static propsDefinition = {};

  private meshEnt!: hz.MeshEntity;

  preStart() {
      this.connectLocalEvent(this.entity, ColorChangeButton.ColorChangeEvent, (data) => {
        this.updateColor(data.color);
      });
    }

  start() {
    this.meshEnt = this.entity.as(hz.MeshEntity);
    this.meshEnt.style.tintStrength.set(1.0);
  }

  updateColor(newColor: hz.Color) {
      this.meshEnt.style.tintColor.set(newColor);
  }
}
hz.Component.register(ColorReceiver);
