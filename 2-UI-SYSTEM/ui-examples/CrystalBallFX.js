"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrystalBallFX = void 0;
const hz = __importStar(require("horizon/core"));
const CrystalBall_1 = require("./CrystalBall");
class CrystalBallFX extends hz.Component {
    constructor() {
        super(...arguments);
        // helper vars for ball glow effect
        this._ballTintStrOld = 0;
        this._ballTintStrNew = 0;
        this._ballBrightnessOld = 0;
        this._ballBrightnessNew = 0;
        this._ballTimeElapsed = 0;
        this._lightIntensityOld = 0;
        this._lightIntensityNew = 0;
    }
    preStart() {
        // TODO: need to not make this a broadcast event so FX don't spawn if more than 1
        // ball is in the scene!
        this.connectLocalEvent(this.entity, CrystalBall_1.CrystalBallEvents.BeginSpeechEvent, () => {
            this.playCrystalFX();
        });
        this.connectLocalEvent(this.entity, CrystalBall_1.CrystalBallEvents.EndSpeechEvent, () => {
            this.stopCrystalFX();
        });
        this.connectLocalBroadcastEvent(hz.World.onUpdate, (data) => {
            this.update(data.deltaTime);
        });
    }
    start() {
        this._ballMesh = this.props.crystalBallMesh.as(hz.MeshEntity);
        this._smokeVFX = this.props.smokeVFX.as(hz.ParticleGizmo);
        this._light = this.props.light.as(hz.DynamicLightGizmo);
        this._light.intensity.set(0);
        // just to prevent fading from happening at start for any reason
        this._ballTimeElapsed = this.props.glowFadeTime;
    }
    update(deltaTime) {
        if (this._ballTimeElapsed >= this.props.glowFadeTime)
            return;
        this._ballTimeElapsed += deltaTime * this.props.glowFadeTime;
        const lerpAmt = Math.min(this._ballTimeElapsed / this.props.glowFadeTime, 1.0);
        const brightness = this.lerp(this._ballBrightnessOld, this._ballBrightnessNew, lerpAmt);
        this._ballMesh.style.brightness.set(brightness);
        const tintStr = this.lerp(this._ballTintStrOld, this._ballTintStrNew, lerpAmt);
        this._ballMesh.style.tintStrength.set(tintStr);
        const glowIntensity = this.lerp(this._lightIntensityOld, this._lightIntensityNew, lerpAmt);
        this._light.intensity.set(glowIntensity);
    }
    lerp(a, b, t) {
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
exports.CrystalBallFX = CrystalBallFX;
CrystalBallFX.propsDefinition = {
    crystalBallMesh: { type: hz.PropTypes.Entity },
    smokeVFX: { type: hz.PropTypes.Entity },
    light: { type: hz.PropTypes.Entity },
    glowFadeTime: { type: hz.PropTypes.Number, default: 250 },
    glowBrightness: { type: hz.PropTypes.Number, default: 10 },
    glowIntensity: { type: hz.PropTypes.Number, default: .3 },
};
hz.Component.register(CrystalBallFX);
