import * as hz from 'horizon/core';
import { sysEvents } from 'sysEvents';

export class sysHintHUDEntity extends hz.Component<typeof sysHintHUDEntity> {
  static propsDefinition = {
    Text: {type: hz.PropTypes.Entity},
  };

  start() {
    // Hide the entity by default
    this.entity.setVisibilityForPlayers([], hz.PlayerVisibilityMode.VisibleTo);

    // Notify the HintHUDManager to register this entity and this component
    this.sendLocalBroadcastEvent(sysEvents.OnRegisterHintHUDEntity, { HUDEntity: this.entity, HUDComponent: this });
  }

  // Public function to update the text of this entity
  // This is called by the HintHUDManager
  public UpdateHintHUDText(text: string) {
    this.props.Text?.as(hz.TextGizmo)?.text.set(text);
  }
}
hz.Component.register(sysHintHUDEntity);
