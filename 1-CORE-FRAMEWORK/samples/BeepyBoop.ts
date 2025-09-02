import * as hz from "horizon/core";

import { PB_AnimatedComponent } from "./PartsBasedAnimationSystem";

class BeepyBoop extends PB_AnimatedComponent<typeof BeepyBoop> {
  static propsDefinition = PB_AnimatedComponent.withProps({
    on: { type: hz.PropTypes.Boolean },
    helloSFX: { type: hz.PropTypes.Entity },
  });

  start() {
    if (!this.props.on) return;
    this.playAnimation({
      animationName: "Wave",
      callbacks: {
        byFrame: {
          20: () => {
            this.props.helloSFX?.as(hz.AudioGizmo).play();
          },
        },
      },
    });
  }

  protected onUpdate = (_deltaTime: number) => {
    if (!this.props.on) return;
    this._faceClosestPlayer();
  };

  private _faceClosestPlayer() {
    const beepyBoop = this.entity.position.get();
    const players = this.world.getPlayers();
    if (!players.length) return;

    let closest = players[0].position.get();
    let best = beepyBoop.distance(closest);

    for (let i = 1; i < players.length; i++) {
      const p = players[i].position.get();
      const d = beepyBoop.distance(p);
      if (d < best) {
        best = d;
        closest = p;
      }
    }

    if (best === 0) return;
    const yaw =
      Math.atan2(closest.x - beepyBoop.x, closest.z - beepyBoop.z) *
      (180 / Math.PI);
    const q = hz.Quaternion.fromEuler(new hz.Vec3(0, yaw, 0));
    this.entity.rotation.set(q);
  }
}

hz.Component.register(BeepyBoop);
