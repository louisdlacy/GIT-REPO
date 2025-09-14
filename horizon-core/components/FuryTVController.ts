import { Component, PropTypes, Entity, Player, NetworkEvent, ParticleGizmo, AudioGizmo } from 'horizon/core';

// Define the network events that this component will listen for.
// These are expected to be sent by a TriggerDetector script.
export const PlayerEntered = new NetworkEvent<{ player: Player }>('PlayerEntered');
export const PlayerExited = new NetworkEvent<{ player: Player }>('PlayerExited');

class FuryTVController extends Component<typeof FuryTVController> {
  static propsDefinition = {
    particleFx: { type: PropTypes.Entity },
    staticSound: { type: PropTypes.Entity },
    fireSound: { type: PropTypes.Entity },
    voiceSound: { type: PropTypes.Entity },
    staticVolume: { type: PropTypes.Number, default: 1.0 },
    fireVolume: { type: PropTypes.Number, default: 1.0 },
    voiceVolume: { type: PropTypes.Number, default: 1.0 },
  };

  private playersInZone = new Set<number>();
  private particleGizmo?: ParticleGizmo;
  private staticSoundGizmo?: AudioGizmo;
  private fireSoundGizmo?: AudioGizmo;
  private voiceSoundGizmo?: AudioGizmo;

  override preStart() {
    // Connect to the network events that signal players entering/exiting the zone.
    this.connectNetworkEvent(this.entity, PlayerEntered, (data) => this.handlePlayerEntered(data.player));
    this.connectNetworkEvent(this.entity, PlayerExited, (data) => this.handlePlayerExited(data.player));
  }

  override start() {
    // Cache the gizmo references for better performance.
    this.particleGizmo = this.props.particleFx?.as(ParticleGizmo);
    this.staticSoundGizmo = this.props.staticSound?.as(AudioGizmo);
    this.fireSoundGizmo = this.props.fireSound?.as(AudioGizmo);
    this.voiceSoundGizmo = this.props.voiceSound?.as(AudioGizmo);

    if (!this.particleGizmo) {
      console.warn('FuryTVController: particleFx property is not set.');
    }
    if (!this.staticSoundGizmo) {
      console.warn('FuryTVController: staticSound property is not set.');
    }
    if (!this.fireSoundGizmo) {
      console.warn('FuryTVController: fireSound property is not set.');
    }
    if (!this.voiceSoundGizmo) {
      console.warn('FuryTVController: voiceSound property is not set.');
    }
  }

  private handlePlayerEntered(player: Player) {
    const playerCountBefore = this.playersInZone.size;
    this.playersInZone.add(player.id);

    // If this is the first player to enter the zone, activate the effects.
    if (playerCountBefore === 0 && this.playersInZone.size === 1) {
      this.activateEffects();
    }
  }

  private handlePlayerExited(player: Player) {
    this.playersInZone.delete(player.id);

    // If this was the last player to leave the zone, deactivate the effects.
    if (this.playersInZone.size === 0) {
      this.deactivateEffects();
    }
  }

  private activateEffects() {
    this.particleGizmo?.play();

    if (this.staticSoundGizmo) {
      this.staticSoundGizmo.volume.set(this.props.staticVolume);
      this.staticSoundGizmo.play();
    }
    if (this.fireSoundGizmo) {
      this.fireSoundGizmo.volume.set(this.props.fireVolume);
      this.fireSoundGizmo.play();
    }
    if (this.voiceSoundGizmo) {
      this.voiceSoundGizmo.volume.set(this.props.voiceVolume);
      this.voiceSoundGizmo.play();
    }
  }

  private deactivateEffects() {
    this.particleGizmo?.stop();
    this.staticSoundGizmo?.stop();
    this.fireSoundGizmo?.stop();
    this.voiceSoundGizmo?.stop();
  }
}

Component.register(FuryTVController);