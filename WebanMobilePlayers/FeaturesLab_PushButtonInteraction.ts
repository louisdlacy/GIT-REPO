import * as hz from 'horizon/core';
import { SetTextGizmoText } from 'sysUtils';

class FeaturesLab_PushButtonInteraction extends hz.Component<typeof FeaturesLab_PushButtonInteraction> {
  static propsDefinition = {
    buttonInteractionText: {type: hz.PropTypes.Entity},
  };

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      SetTextGizmoText(this.props.buttonInteractionText, `${player.name.get()} pushed the button`);
      this.async.setTimeout(() => {
        SetTextGizmoText(this.props.buttonInteractionText, "Button interaction");
      }, 1000);
    });
  }
}
hz.Component.register(FeaturesLab_PushButtonInteraction);
