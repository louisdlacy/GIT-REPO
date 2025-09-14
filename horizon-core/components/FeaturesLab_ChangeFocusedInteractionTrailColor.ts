import * as hz from 'horizon/core';
import { sysEvents } from 'sysEvents';
import { SetTextGizmoText } from 'sysUtils';

class FeaturesLab_ChangeFocusedInteractionTrailColor extends hz.Component<typeof FeaturesLab_ChangeFocusedInteractionTrailColor> {
  static propsDefinition = {
    changeTrailColorText: {type: hz.PropTypes.Entity},
  };

  private colors = [hz.Color.white, hz.Color.red, hz.Color.blue, hz.Color.green];
  private colorStrings = ["white", "red", "blue", "green"];
  private currentColorIndex = 0;

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
      this.sendNetworkEvent(player, sysEvents.OnSetFocusedInteractionTrailOptions, {
        enabled: true,
        trailOptions: {
          startColor: this.colors[this.currentColorIndex],
          endColor: this.colors[this.currentColorIndex],
        }
      });
      SetTextGizmoText(this.props.changeTrailColorText, `Focused Interaction<br>Changed the trail color to ${this.colorStrings[this.currentColorIndex]}`);
    });
  }
}
hz.Component.register(FeaturesLab_ChangeFocusedInteractionTrailColor);
