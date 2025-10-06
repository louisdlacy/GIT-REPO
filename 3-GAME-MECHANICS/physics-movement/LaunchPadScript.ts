import { Component, PropTypes, CodeBlockEvents, Player, Vec3, AudioGizmo, ParticleGizmo } from 'horizon/core';

export class LaunchPadScript extends Component<typeof LaunchPadScript> {
  static propsDefinition = {
    launchForce: { type: PropTypes.Number, default: 10 },
    launchSfx: { type: PropTypes.Entity },
    launchVfx: { type: PropTypes.Entity },
  };

  override preStart() {
    // Connect to the event that fires when a player enters the trigger.
    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnPlayerEnterTrigger,
      (player: Player) => {
        this.launchPlayer(player);
      }
    );
  }

  override start() {
    // No initialization needed in the start method for this component.
  }

  private launchPlayer(player: Player) {
    // Play the launch sound effect if it has been assigned.
    if (this.props.launchSfx) {
      this.props.launchSfx.as(AudioGizmo)?.play();
    }
    
    // Play the launch particle effect if it has been assigned.
    if (this.props.launchVfx) {
      this.props.launchVfx.as(ParticleGizmo)?.play();
    }

    // Get the launch pad's local 'up' direction and normalize it.
    const launchDirection = this.entity.up.get().normalize();

    // Calculate the final launch velocity by scaling the direction by the launchForce.
    const launchVelocity = launchDirection.mul(this.props.launchForce);

    // Apply the new velocity to the player.
    player.velocity.set(launchVelocity);
  }
}

Component.register(LaunchPadScript);