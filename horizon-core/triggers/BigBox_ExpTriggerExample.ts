import { BigBox_ExpEvents } from 'BigBox_ExpManager';
import { CodeBlockEvents, Component, Player, PropTypes } from 'horizon/core';

class BigBox_ExpTriggerExample extends Component<typeof BigBox_ExpTriggerExample> {
  static propsDefinition = {
    xpGained: { type: PropTypes.Number, default: 10.0 },
  };

  start() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, (player: Player) => {
      this.sendNetworkBroadcastEvent(BigBox_ExpEvents.expAddToPlayer, { player: player, exp: this.props.xpGained });
    });
  }
}
Component.register(BigBox_ExpTriggerExample);
