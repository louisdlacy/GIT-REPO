import { Weapon } from 'Weapon';
import * as hz from 'horizon/core';

const projectileLauncherOptions = {
  speed: 200,
  duration: 1
}

// Extends Weapon<typeof Gun> means this class inherits all the properties and methods of the Weapon class.
// You can use this pattern to create your own weapon with custom properties and methods.
class Gun extends Weapon<typeof Gun> {
  static propsDefinition = {
    ...Weapon.propsDefinition, // Add the Weapon.propsDefinition using the spread operator (...) in order to extend Weapon.
    projectileLauncher: {type: hz.PropTypes.Entity},
    muzzleFlash: {type: hz.PropTypes.Entity},
    gunshotSfx: {type: hz.PropTypes.Entity},
  };

  start() {
    super.start();
  }

  // Override onGrab() and onRelease() to set the projectileLauncher's owner to the player who grabbed it, and back to the server.
  // (The projectileLauncher must be owner by the player in order for editor properties GrabAimPosition / GrabAimRotation to take effect.)
  onGrab(player: hz.Player): void {
    this.props.projectileLauncher?.as(hz.ProjectileLauncherGizmo).owner.set(player);
    super.onGrab(player);
  }

  onRelease(): void {
    this.props.projectileLauncher?.as(hz.ProjectileLauncherGizmo).owner.set(this.world.getServerPlayer());
    super.onRelease();
  }

  onIndexTriggerDown(player: hz.Player): boolean {
    // Calling super.onIndexTriggerDown() in an override function will play the fire animation, and return true if the weapon was fired (accounting for fireCooldown).
    const didFire = super.onIndexTriggerDown(player);
    if (didFire) {
      this.props.muzzleFlash?.as(hz.ParticleGizmo).play();
      this.props.gunshotSfx?.as(hz.AudioGizmo).play();
      this.props.projectileLauncher?.as(hz.ProjectileLauncherGizmo).launch(projectileLauncherOptions);

    }
    return didFire;
  }
}
hz.Component.register(Gun);
