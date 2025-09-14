import { BigBox_ToastEvents } from 'BigBox_UI_ToastHud';
import { CodeBlockEvents, Component, Player, PropTypes } from 'horizon/core';

class BigBox_ToastTriggerExample extends Component<typeof BigBox_ToastTriggerExample> {
  static propsDefinition = {
    message: { type: PropTypes.String, default: "Hello Horizon World" },
  };

  start() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, (player: Player) => {
      this.sendNetworkBroadcastEvent(BigBox_ToastEvents.textToast, {
        player: player,
        text: this.props.message // This message can be anything you want!
      });
    });
  }
}

Component.register(BigBox_ToastTriggerExample);
