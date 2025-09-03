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
const hz = __importStar(require("horizon/core"));
const PartsBasedAnimationSystem_1 = require("./PartsBasedAnimationSystem");
class BeepyBoop extends PartsBasedAnimationSystem_1.PB_AnimatedComponent {
    constructor() {
        super(...arguments);
        this.onUpdate = (_deltaTime) => {
            if (!this.props.on)
                return;
            this._faceClosestPlayer();
        };
    }
    start() {
        if (!this.props.on)
            return;
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
    _faceClosestPlayer() {
        const beepyBoop = this.entity.position.get();
        const players = this.world.getPlayers();
        if (!players.length)
            return;
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
        if (best === 0)
            return;
        const yaw = Math.atan2(closest.x - beepyBoop.x, closest.z - beepyBoop.z) *
            (180 / Math.PI);
        const q = hz.Quaternion.fromEuler(new hz.Vec3(0, yaw, 0));
        this.entity.rotation.set(q);
    }
}
BeepyBoop.propsDefinition = PartsBasedAnimationSystem_1.PB_AnimatedComponent.withProps({
    on: { type: hz.PropTypes.Boolean },
    helloSFX: { type: hz.PropTypes.Entity },
});
hz.Component.register(BeepyBoop);
