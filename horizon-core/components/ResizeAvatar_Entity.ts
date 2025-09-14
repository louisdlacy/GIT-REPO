import { CodeBlockEvents, Component, Player, PropTypes } from 'horizon/core';


class ResizeAvatar_Entity extends Component<typeof ResizeAvatar_Entity>{
  static propsDefinition = {
    scale: { type: PropTypes.Number, default: 1 },
  };

  preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, this.playerEnterTrigger.bind(this));
  }

  start() {

  }

  playerEnterTrigger(player: Player) {
    player.avatarScale.set(this.props.scale);
  }
}
Component.register(ResizeAvatar_Entity);