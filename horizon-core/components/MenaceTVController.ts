import { Component, PropTypes, Entity, Player, NetworkEvent, AudioGizmo, World, Vec3 } from 'horizon/core';

// These events are expected to be sent by a TriggerDetector script.
export const PlayerEntered = new NetworkEvent<{ player: Player }>('PlayerEntered');
export const PlayerExited = new NetworkEvent<{ player: Player }>('PlayerExited');

class MenaceTVController extends Component<typeof MenaceTVController> {
  static propsDefinition = {
    eyes: { type: PropTypes.EntityArray },
    soundFx: { type: PropTypes.Entity },
    soundFxVolume: { type: PropTypes.Number, default: 1.0 },
    bobHeight: { type: PropTypes.Number, default: 0.1 },
    bobSpeed: { type: PropTypes.Number, default: 2 },
  };

  private playersInZone = new Set<number>();
  private initialEyePositions = new Map<Entity, Vec3>();
  private audioGizmo?: AudioGizmo;
  private isAnimating = false;
  private animationTime = 0;

  override preStart() {
    this.connectNetworkEvent(this.entity, PlayerEntered, (data) => this.handlePlayerEntered(data.player));
    this.connectNetworkEvent(this.entity, PlayerExited, (data) => this.handlePlayerExited(data.player));
    this.connectLocalBroadcastEvent(World.onUpdate, (data) => this.onUpdate(data.deltaTime));
  }

  override start() {
    this.audioGizmo = this.props.soundFx?.as(AudioGizmo);
    if (!this.audioGizmo) {
      console.warn('MenaceTVController: soundFx property is not set.');
    }

    if (!this.props.eyes || this.props.eyes.length === 0) {
      console.error("MenaceTVController: 'eyes' property is not set or is empty.");
      return;
    }

    // Store the initial positions for each eye.
    this.props.eyes.forEach(eye => {
      if (eye) {
        this.initialEyePositions.set(eye, eye.position.get());
      }
    });
  }

  private handlePlayerEntered(player: Player) {
    const playerCountBefore = this.playersInZone.size;
    this.playersInZone.add(player.id);

    // If this is the first player to enter, start the animation and sound.
    if (playerCountBefore === 0 && this.playersInZone.size === 1) {
      this.isAnimating = true;
      if (this.audioGizmo) {
        this.audioGizmo.volume.set(this.props.soundFxVolume);
        this.audioGizmo.play();
      }
    }
  }

  private handlePlayerExited(player: Player) {
    this.playersInZone.delete(player.id);

    // If this was the last player to leave, stop the animation and sound.
    if (this.playersInZone.size === 0) {
      this.isAnimating = false;
      this.audioGizmo?.stop();
      this.resetEyePositions();
    }
  }

  private onUpdate(deltaTime: number) {
    if (!this.isAnimating) {
      return;
    }

    this.animationTime += deltaTime;
    const bobOffset = Math.sin(this.animationTime * this.props.bobSpeed) * this.props.bobHeight;

    // Animate each eye based on its initial position.
    this.props.eyes?.forEach(eye => {
      if (eye) {
        const initialPos = this.initialEyePositions.get(eye);
        if (initialPos) {
          const newPos = new Vec3(initialPos.x, initialPos.y + bobOffset, initialPos.z);
          eye.position.set(newPos);
        }
      }
    });
  }

  private resetEyePositions() {
    // Return each eye to its original position.
    this.props.eyes?.forEach(eye => {
      if (eye) {
        const initialPos = this.initialEyePositions.get(eye);
        if (initialPos) {
          eye.position.set(initialPos);
        }
      }
    });
  }
}

Component.register(MenaceTVController);