import { Component, PropTypes, Player, CodeBlockEvents, ParticleGizmo, AudioGizmo } from 'horizon/core';

class ProximityGenieController extends Component<typeof ProximityGenieController> {
  static propsDefinition = {
    genieModel: { type: PropTypes.Entity },
    smokeEffect: { type: PropTypes.Entity },
    shimmerSound: { type: PropTypes.Entity },
    swishSound: { type: PropTypes.Entity },
    genieVoice: { type: PropTypes.Entity },
    activationDelay: { type: PropTypes.Number, default: 3 },
  };

  private playersInZone = new Set<number>();
  private activationTimerId: number | undefined;

  override preStart() {
    // Listen for players entering and exiting the trigger this script is attached to.
    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnPlayerEnterTrigger,
      (player: Player) => this.onPlayerEnter(player)
    );

    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnPlayerExitTrigger,
      (player: Player) => this.onPlayerExit(player)
    );
  }

  override start() {
    // Ensure effects are hidden at the start.
    this.props.genieModel?.visible.set(false);
    this.props.smokeEffect?.as(ParticleGizmo)?.stop();
  }

  private onPlayerEnter(player: Player) {
    const playerCountBefore = this.playersInZone.size;
    this.playersInZone.add(player.id);

    // If this is the first player to enter the zone, start the activation timer.
    if (playerCountBefore === 0 && this.playersInZone.size === 1) {
      this.activationTimerId = this.async.setTimeout(() => {
        // Check if there's still a player in the zone when the timer completes.
        if (this.playersInZone.size > 0) {
          this.activateEffects();
        }
        this.activationTimerId = undefined;
      }, this.props.activationDelay * 1000);
    }
  }

  private onPlayerExit(player: Player) {
    this.playersInZone.delete(player.id);

    // If this was the last player to leave the zone, deactivate the effects.
    if (this.playersInZone.size === 0) {
      // If the activation timer is running, cancel it.
      if (this.activationTimerId) {
        this.async.clearTimeout(this.activationTimerId);
        this.activationTimerId = undefined;
      }
      this.deactivateEffects();
    }
  }

  private activateEffects() {
    this.props.genieModel?.visible.set(true);
    this.props.smokeEffect?.as(ParticleGizmo)?.play();
    this.props.shimmerSound?.as(AudioGizmo)?.play();
    this.props.swishSound?.as(AudioGizmo)?.play();
    this.props.genieVoice?.as(AudioGizmo)?.play();
  }

  private deactivateEffects() {
    this.props.genieModel?.visible.set(false);
    this.props.smokeEffect?.as(ParticleGizmo)?.stop();
    this.props.shimmerSound?.as(AudioGizmo)?.stop();
    this.props.swishSound?.as(AudioGizmo)?.stop();
    this.props.genieVoice?.as(AudioGizmo)?.stop();
  }
}

Component.register(ProximityGenieController);