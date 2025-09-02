import { Component, Vec3, Quaternion, World } from 'horizon/core';

class ContinuousSpin extends Component<typeof ContinuousSpin> {
  private timeElapsed: number = 0;
  private amplitude: number = 45; // Amplitude of rotation in degrees/sec

  preStart() {
    // Connect to update event to spin continuously
    this.connectLocalBroadcastEvent(
      World.onUpdate,
      this.update.bind(this)
    );
  }

  start() {}

  private update(data: { deltaTime: number }) {
    // Accumulate rotation angle (in degrees)
    this.timeElapsed += data.deltaTime * this.amplitude;
    const angle = this.timeElapsed % 360; // keep angle within 0-360 degrees
    // Create rotation quaternion from the current angle
    const rotation = Quaternion.fromEuler(new Vec3(0, angle, 0));
    this.entity.rotation.set(rotation);
    if (this.timeElapsed >= 360) {
      this.timeElapsed = 0; // Reset the timer for continuous rotation
    }
  }
}

Component.register(ContinuousSpin);