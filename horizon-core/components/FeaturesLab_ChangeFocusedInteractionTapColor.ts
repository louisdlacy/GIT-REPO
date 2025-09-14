import * as hz from 'horizon/core';
import { sysEvents } from 'sysEvents';
import { SetTextGizmoText } from 'sysUtils';

class FeaturesLab_ChangeFocusedInteractionTapColor extends hz.Component<typeof FeaturesLab_ChangeFocusedInteractionTapColor> {
  static propsDefinition = {
    changeTapColorText: {type: hz.PropTypes.Entity},
  };

  private colors = [hz.Color.white, hz.Color.red, hz.Color.blue, hz.Color.green];
  private colorStrings = ["white", "red", "blue", "green"];
  private currentColorIndex = 0;

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
      this.sendNetworkEvent(player, sysEvents.OnSetFocusedInteractionTapOptions, {
        enabled: true,
        tapOptions: {
          startColor: this.colors[this.currentColorIndex],
          endColor: this.colors[this.currentColorIndex],
        }
      });
      SetTextGizmoText(this.props.changeTapColorText, `Focused Interaction<br>Changed the tap color to ${this.colorStrings[this.currentColorIndex]}`);
    });
  }
}
hz.Component.register(FeaturesLab_ChangeFocusedInteractionTapColor);
