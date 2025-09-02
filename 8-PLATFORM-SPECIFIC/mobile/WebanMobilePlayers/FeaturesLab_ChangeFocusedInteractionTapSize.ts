import * as hz from 'horizon/core';
import { sysEvents } from 'sysEvents';
import { SetTextGizmoText } from 'sysUtils';

class FeaturesLab_ChangeFocusedInteractionTapSize extends hz.Component<typeof FeaturesLab_ChangeFocusedInteractionTapSize> {
  static propsDefinition = {
    changeTapSizeText: {type: hz.PropTypes.Entity},
  };

  private size = [0.4, 0.8, 1.2];
  private currentSizeIndex = 0;

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      this.currentSizeIndex = (this.currentSizeIndex + 1) % this.size.length;
      this.sendNetworkEvent(player, sysEvents.OnSetFocusedInteractionTapOptions, {
        enabled: true,
        tapOptions: {
          startScale: this.size[this.currentSizeIndex],
          endScale: 1,
        }
      });
      SetTextGizmoText(this.props.changeTapSizeText, `Focused Interaction<br>Changed the tap size to ${this.size[this.currentSizeIndex].toString()}`);
    });
  }
}
hz.Component.register(FeaturesLab_ChangeFocusedInteractionTapSize);
