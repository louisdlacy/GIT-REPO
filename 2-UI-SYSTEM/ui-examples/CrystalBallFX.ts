import * as hz from 'horizon/core';
import { CrystalBallEvents } from './CrystalBall';

export class CrystalBallFX extends hz.Component<typeof CrystalBallFX> {
  static propsDefinition = {
    crystalBallMesh: { type: hz.PropTypes.Entity },
    smokeVFX: { type: hz.PropTypes.Entity },
    light: { type: hz.PropTypes.Entity },
    glowFadeTime: { type: hz.PropTypes.Number, default: 250 },
    glowBrightness: { type: hz.PropTypes.Number, default: 10 },
    glowIntensity: { type: hz.PropTypes.Number, default: .3 },
  };

  private _ballMesh!: hz.MeshEntity;
  private _smokeVFX!: hz.ParticleGizmo;
  private _light!: hz.DynamicLightGizmo;

  // helper vars for ball glow effect
  private _ballTintStrOld = 0;
  private _ballTintStrNew = 0;
  private _ballBrightnessOld = 0;
  private _ballBrightnessNew = 0;
  private _ballTimeElapsed = 0;
  private _lightIntensityOld = 0;
  private _lightIntensityNew = 0;

  preStart() {

    // TODO: need to not make this a broadcast event so FX don't spawn if more than 1
    // ball is in the scene!

    this.connectLocalEvent(this.entity, CrystalBallEvents.BeginSpeechEvent, () => {
      this.playCrystalFX();
    });

    this.connectLocalEvent(this.entity, CrystalBallEvents.EndSpeechEvent, () => {
      this.stopCrystalFX();
    });

    this.connectLocalBroadcastEvent(hz.World.onUpdate, (data: {deltaTime: number}) => {
      this.update(data.deltaTime);
    });
  }

  start() {
    this._ballMesh = this.props.crystalBallMesh!.as(hz.MeshEntity);
    this._smokeVFX = this.props.smokeVFX!.as(hz.ParticleGizmo);
    this._light = this.props.light!.as(hz.DynamicLightGizmo);

    this._light.intensity.set(0);

    // just to prevent fading from happening at start for any reason
    this._ballTimeElapsed = this.props.glowFadeTime;
  }

  update(deltaTime: number) {
    if (this._ballTimeElapsed >= this.props.glowFadeTime) return;

    this._ballTimeElapsed += deltaTime * this.props.glowFadeTime;
    const lerpAmt = Math.min(this._ballTimeElapsed / this.props.glowFadeTime, 1.0);

    const brightness = this.lerp(this._ballBrightnessOld, this._ballBrightnessNew, lerpAmt);
    this._ballMesh.style.brightness.set(brightness);

    const tintStr = this.lerp(this._ballTintStrOld, this._ballTintStrNew, lerpAmt);
    this._ballMesh.style.tintStrength.set(tintStr);

    const glowIntensity = this.lerp(this._lightIntensityOld, this._lightIntensityNew, lerpAmt);
    this._light.intensity.set(glowIntensity);
  }

  lerp (a: number, b: number, t: number) {
    return a + t * (b - a);
  }

  playCrystalFX() {
    this._smokeVFX.play();

    this._ballTintStrOld = 0;
    this._ballTintStrNew = 1;
    this._ballBrightnessOld = 1;
    this._ballBrightnessNew = this.props.glowBrightness;
    this._ballTimeElapsed = 0;
    this._lightIntensityNew = this.props.glowIntensity;
    this._lightIntensityOld = 0;

    // this._ballMesh.style.tintStrength.set(1);
    // this._ballMesh.style.brightness.set(10);
  }

  stopCrystalFX() {
    this._smokeVFX.stop();

    this._ballTintStrOld = 1;
    this._ballTintStrNew = 0;
    this._ballBrightnessOld = this.props.glowBrightness;
    this._ballBrightnessNew = 1;
    this._ballTimeElapsed = 0;
    this._lightIntensityNew = 0;
    this._lightIntensityOld = this.props.glowIntensity;

    // this._ballMesh.style.tintStrength.set(0);
    // this._ballMesh.style.brightness.set(1);
  }
}
hz.Component.register(CrystalBallFX);
