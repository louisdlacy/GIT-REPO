import { Component, PropTypes, Entity, AudioGizmo, ParticleGizmo, CodeBlockEvents } from 'horizon/core';

export class FountainController extends Component<typeof FountainController> {
  static propsDefinition = {
    soundEffect: { type: PropTypes.Entity },
    particleEffect: { type: PropTypes.Entity },
  };

  private soundGizmo?: AudioGizmo;

  override preStart() {
    // Set up the event connection for looping audio if the soundEffect is assigned.
    if (this.props.soundEffect) {
      this.connectCodeBlockEvent(
        this.props.soundEffect,
        CodeBlockEvents.OnAudioCompleted,
        () => this.playLoopingSound()
      );
    }
  }

  override start() {
    // Handle the sound effect.
    if (this.props.soundEffect) {
      this.soundGizmo = this.props.soundEffect.as(AudioGizmo);
      if (this.soundGizmo) {
        // Start the sound loop.
        this.playLoopingSound();
      }
    } else {
      console.warn("FountainController: Please assign the sound effect asset to the 'soundEffect' property on the 'water_fountain' entity.");
    }

    // Handle the particle effect.
    if (this.props.particleEffect) {
      const particleGizmo = this.props.particleEffect.as(ParticleGizmo);
      if (particleGizmo) {
        particleGizmo.play();
      }
    } else {
      console.warn("FountainController: Please assign the particle effect asset to the 'particleEffect' property on the 'water_fountain' entity.");
    }
  }

  private playLoopingSound() {
    // This method is called initially in start() and then by the OnAudioCompleted event.
    this.soundGizmo?.play();
  }
}

Component.register(FountainController);