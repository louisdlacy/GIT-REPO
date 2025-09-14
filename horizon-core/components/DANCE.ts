import * as hz from 'horizon/core';

class TestAnimScript extends hz.Component<typeof TestAnimScript> {
  static propsDefinition = {
    anim: {type: hz.PropTypes.Asset},
  };

  start() {
    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerEnterTrigger,
      (player: hz.Player) => {
        player.playAvatarAnimation(this.props.anim!, {
          looping: true,
          playRate: 1,
        });
      },
    );
  }
}

hz.Component.register(TestAnimScript);