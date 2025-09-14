import { Component, PropTypes, Entity, Player, NetworkEvent, AudioGizmo, World, Vec3, Quaternion } from 'horizon/core';

// Define the network events. These should match the events broadcast by a TriggerDetector script.
export const PlayerEntered = new NetworkEvent<{ player: Player }>('PlayerEntered');
export const PlayerExited = new NetworkEvent<{ player: Player }>('PlayerExited');

class StalkerTVController extends Component<typeof StalkerTVController> {
  static propsDefinition = {
    canFollow: { type: PropTypes.Boolean, default: true },
    followSpeed: { type: PropTypes.Number, default: 0.25 },
    soundFx: { type: PropTypes.Entity },
    voiceFx: { type: PropTypes.Entity },
    soundFxVolume: { type: PropTypes.Number, default: 1.0 },
    voiceFxVolume: { type: PropTypes.Number, default: 1.0 },
  };

  private playersInZone: Player[] = [];
  private audioGizmo?: AudioGizmo;
  private voiceGizmo?: AudioGizmo;

  override preStart() {
    // Listen for players entering and exiting the trigger zone via a direct network event.
    this.connectNetworkEvent(this.entity, PlayerEntered, (data) => this.handlePlayerEntered(data.player));
    this.connectNetworkEvent(this.entity, PlayerExited, (data) => this.handlePlayerExited(data.player));
    
    // Connect to the world update loop for continuous rotation logic.
    this.connectLocalBroadcastEvent(World.onUpdate, (data) => this.onUpdate(data.deltaTime));
  }

  override start() {
    // Cache the AudioGizmo references for performance.
    this.audioGizmo = this.props.soundFx?.as(AudioGizmo);
    this.voiceGizmo = this.props.voiceFx?.as(AudioGizmo);

    if (!this.audioGizmo) {
      console.warn('StalkerTVController: soundFx property is not set.');
    }
    if (!this.voiceGizmo) {
      console.warn('StalkerTVController: voiceFx property is not set.');
    }
  }

  private handlePlayerEntered(player: Player) {
    // Add player to the list if they aren't already present to avoid duplicates.
    if (!this.playersInZone.find(p => p.id === player.id)) {
      // If this is the first player, start the sounds.
      if (this.playersInZone.length === 0) {
        if (this.audioGizmo) {
          const soundVolume = Math.max(0, Math.min(1, this.props.soundFxVolume));
          this.audioGizmo.volume.set(soundVolume);
          this.audioGizmo.play();
        }
        if (this.voiceGizmo) {
          const voiceVolume = Math.max(0, Math.min(1, this.props.voiceFxVolume));
          this.voiceGizmo.volume.set(voiceVolume);
          this.voiceGizmo.play();
        }
      }
      this.playersInZone.push(player);
    }
  }

  private handlePlayerExited(player: Player) {
    // Find and remove the player from the list.
    const index = this.playersInZone.findIndex(p => p.id === player.id);
    if (index > -1) {
      this.playersInZone.splice(index, 1);
    }

    // If this was the last player, stop the sounds.
    if (this.playersInZone.length === 0) {
      this.audioGizmo?.stop();
      this.voiceGizmo?.stop();
    }
  }

  private onUpdate(deltaTime: number) {
    if (!this.props.canFollow || this.playersInZone.length === 0) {
      return;
    }

    const tvPosition = this.entity.position.get();
    let closestPlayer: Player | null = null;
    let minDistanceSq = Infinity;

    // Find the closest player in the zone.
    for (const player of this.playersInZone) {
      const distanceSq = tvPosition.distanceSquared(player.position.get());
      if (distanceSq < minDistanceSq) {
        minDistanceSq = distanceSq;
        closestPlayer = player;
      }
    }

    if (!closestPlayer) return;

    const playerHeadPosition = closestPlayer.head.position.get();
    const playerHeadForward = closestPlayer.head.forward.get();
    const toTvDirection = tvPosition.sub(playerHeadPosition).normalize();
    const dotProduct = Vec3.dot(playerHeadForward, toTvDirection);

    // Only follow if the player is looking away (dot product < 0.8).
    if (dotProduct < 0.8) {
      const playerPosition = closestPlayer.position.get();
      const direction = playerPosition.sub(tvPosition);
      direction.y = 0; // Only rotate on the Y-axis.

      if (direction.magnitudeSquared() > 0.001) {
        direction.normalizeInPlace();
        const targetRotation = Quaternion.lookRotation(direction, Vec3.up);
        const currentRotation = this.entity.rotation.get();
        const newRotation = Quaternion.slerp(currentRotation, targetRotation, this.props.followSpeed * deltaTime);
        this.entity.rotation.set(newRotation);
      }
    }
  }
}

Component.register(StalkerTVController);