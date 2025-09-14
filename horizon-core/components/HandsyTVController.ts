import { Component, PropTypes, Entity, Player, NetworkEvent, AudioGizmo, World, Vec3, Quaternion } from 'horizon/core';

// These events are expected to be sent by a TriggerDetector script.
export const PlayerEntered = new NetworkEvent<{ player: Player }>('PlayerEntered');
export const PlayerExited = new NetworkEvent<{ player: Player }>('PlayerExited');

class HandsyTVController extends Component<typeof HandsyTVController> {
  static propsDefinition = {
    hands: { type: PropTypes.EntityArray },
    soundFx: { type: PropTypes.Entity },
    soundFxVolume: { type: PropTypes.Number, default: 1.0 },
    reachDistance: { type: PropTypes.Number, default: 1 },
    animationSpeed: { type: PropTypes.Number, default: 1.5 },
  };

  private playersInZone = new Set<number>();
  private audioGizmo?: AudioGizmo;
  private initialHandPositions = new Map<Entity, Vec3>();
  private targetHandPositions = new Map<Entity, Vec3>();
  private isAnimatingForward = false;
  private animationProgress = 0;

  override preStart() {
    // Listen for players entering and exiting the trigger zone.
    this.connectNetworkEvent(this.entity, PlayerEntered, (data) => this.handlePlayerEntered(data.player));
    this.connectNetworkEvent(this.entity, PlayerExited, (data) => this.handlePlayerExited(data.player));
    // Connect to the world update loop for continuous animation.
    this.connectLocalBroadcastEvent(World.onUpdate, (data) => this.onUpdate(data.deltaTime));
  }

  override start() {
    this.audioGizmo = this.props.soundFx?.as(AudioGizmo);
    if (!this.audioGizmo) {
      console.warn('HandsyTVController: soundFx property is not set.');
    }

    if (!this.props.hands || this.props.hands.length === 0) {
      console.error("HandsyTVController: 'hands' property is not set or is empty.");
      return;
    }

    // Store initial and target positions for each hand and set them to invisible.
    this.props.hands.forEach(hand => {
      if (hand) {
        hand.visible.set(false);
        const initialLocalPos = hand.transform.localPosition.get();
        this.initialHandPositions.set(hand, initialLocalPos);

        const targetLocalPos = new Vec3(initialLocalPos.x, initialLocalPos.y, initialLocalPos.z + this.props.reachDistance);
        this.targetHandPositions.set(hand, targetLocalPos);
      }
    });
  }

  private handlePlayerEntered(player: Player) {
    const playerCountBefore = this.playersInZone.size;
    this.playersInZone.add(player.id);

    // If this is the first player, start the forward animation and effects.
    if (playerCountBefore === 0 && this.playersInZone.size === 1) {
      this.isAnimatingForward = true;
      if (this.audioGizmo) {
        this.audioGizmo.volume.set(this.props.soundFxVolume);
        this.audioGizmo.play();
      }
      this.props.hands?.forEach(hand => hand?.visible.set(true));
    }
  }

  private handlePlayerExited(player: Player) {
    this.playersInZone.delete(player.id);

    // If this was the last player, start the backward animation and stop effects.
    if (this.playersInZone.size === 0) {
      this.isAnimatingForward = false;
      this.audioGizmo?.stop();
    }
  }

  private onUpdate(deltaTime: number) {
    const animationStep = this.props.animationSpeed * deltaTime;

    // Update animation progress based on the target direction.
    if (this.isAnimatingForward) {
      if (this.animationProgress < 1.0) {
        this.animationProgress = Math.min(1.0, this.animationProgress + animationStep);
      }
    } else {
      if (this.animationProgress > 0.0) {
        this.animationProgress = Math.max(0.0, this.animationProgress - animationStep);
      }
    }

    // Apply the animation to each hand.
    this.props.hands?.forEach(hand => {
      if (hand) {
        const initialPos = this.initialHandPositions.get(hand);
        const targetPos = this.targetHandPositions.get(hand);

        if (initialPos && targetPos) {
          const newLocalPos = Vec3.lerp(initialPos, targetPos, this.animationProgress);
          hand.transform.localPosition.set(newLocalPos);
        }
      }
    });

    // If the hands have fully retracted, make them invisible again.
    if (!this.isAnimatingForward && this.animationProgress === 0) {
      this.props.hands?.forEach(hand => hand?.visible.set(false));
    }
  }
}

Component.register(HandsyTVController);