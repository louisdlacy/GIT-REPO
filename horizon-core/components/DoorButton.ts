import { CutsceneEvents } from 'DoorCutscene';
import * as hz from 'horizon/core';

class DoorButton extends hz.Component<typeof DoorButton> {
  static propsDefinition = {
    doorCutscene: {type: hz.PropTypes.Entity}
  };

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      if (this.props.doorCutscene !== undefined && this.props.doorCutscene !== null) {
        this.sendLocalEvent(this.props.doorCutscene, CutsceneEvents.OnStartCutscene, {player, doorButton: this.entity});
        this.entity.as(hz.TriggerGizmo).enabled.set(false);
      } else {
        console.warn("DoorButton pressed, but no doorCutscene was set in the props.")
      }
    });
    this.connectNetworkEvent(this.entity, CutsceneEvents.OnCutsceneComplete, () => {
      this.entity.as(hz.TriggerGizmo).enabled.set(true);
    });
  }
}
hz.Component.register(DoorButton);
