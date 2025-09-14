import * as hz from 'horizon/core';
import { sysEvents } from 'sysEvents';
import { SetTextGizmoText } from 'sysUtils';

class FeaturesLab_ChangeFocusedInteractionTrailSize extends hz.Component<typeof FeaturesLab_ChangeFocusedInteractionTrailSize> {
  static propsDefinition = {
    changeTrailSizeText: {type: hz.PropTypes.Entity},
  };

  private size = [1.0, 1.2, 0.6];
  private currentSizeIndex = 0;

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      this.currentSizeIndex = (this.currentSizeIndex + 1) % this.size.length;
      this.sendNetworkEvent(player, sysEvents.OnSetFocusedInteractionTrailOptions, {
        enabled: true,
        trailOptions: {
          startWidth: this.size[this.currentSizeIndex],
          endWidth: 0.1,
        }
      });
      SetTextGizmoText(this.props.changeTrailSizeText, `Focused Interaction<br>Changed the trail size to ${this.size[this.currentSizeIndex].toString()}`);
    });
  }
}
hz.Component.register(FeaturesLab_ChangeFocusedInteractionTrailSize);
