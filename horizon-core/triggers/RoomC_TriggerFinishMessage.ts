import * as hz from 'horizon/core';
import { sysEvents } from 'sysEvents';

class RoomC_TriggerFinishMessage extends hz.Component<typeof RoomC_TriggerFinishMessage> {
  static propsDefinition = {
    message: {type: hz.PropTypes.String},
    messageDuration: {type: hz.PropTypes.Number, default: 5},
  };

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
      this.sendNetworkBroadcastEvent(sysEvents.OnDisplayHintHUD, {players: [player], text: this.props.message, duration: this.props.messageDuration});
    });
  }
}
hz.Component.register(RoomC_TriggerFinishMessage);
