import * as hz from 'horizon/core';

// This component launches the player into the air like a trampoline
class Trampoline extends hz.Component<typeof Trampoline> {
  static propsDefinition = {
    launchVelocity: { type: hz.PropTypes.Number, default: 10 },
  };

  preStart(): void {
    // Connect to the OnPlayerEnterTrigger event
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, this.onPlayerEnterTrigger.bind(this));
  }

  start() {}

  onPlayerEnterTrigger(player: hz.Player) {
    // Launch the player into the air
    const launchVelocity = this.props.launchVelocity!;
    const velocity = player.velocity.get();
    velocity.y = launchVelocity;
    player.velocity.set(velocity);
  }
}

hz.Component.register(Trampoline);

