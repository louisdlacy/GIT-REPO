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
exports.JumpBoostPickupEvents = void 0;
const hz = __importStar(require("horizon/core"));
exports.JumpBoostPickupEvents = {
    OnPickupJumpBoost: new hz.NetworkEvent('OnPickupJumpBoost'),
    OnApplyJumpBoost: new hz.NetworkEvent('OnApplyJumpBoost'),
};
class JumpBoostPickupTz extends hz.Component {
    constructor() {
        super(...arguments);
        this.updateIntervalId = -1;
        this.updateDelayS = 0.1;
        this.update = (deltaTime) => { };
        this.elapsed = 0;
        this.active = true;
        this.respawnRemaining = -1;
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (enteredBy) => {
            this.onTriggerEnter(enteredBy);
        });
    }
    start() {
        this.active = this.props.active || false;
        if (this.active) {
            // Set the update method to point to the animateMesh method
            this.update = this.animateMesh;
        }
        // Repeatedly call this.update every this.updateDelayS seconds (0.1s by default)
        this.updateIntervalId = this.async.setInterval(() => {
            this.update(this.updateDelayS);
        }, this.updateDelayS * 1000);
    }
    activate() {
        this.active = true;
        this.props.mesh.visible.set(true);
        this.update = this.animateMesh;
    }
    deactivate() {
        this.active = false;
        this.props.mesh.visible.set(false);
        this.update = (deltaTime) => { };
        if (this.props.respawnEnabled) {
            this.respawnRemaining = this.props.respawnDelay;
            this.update = this.awaitRespawn;
        }
    }
    awaitRespawn(deltaTime) {
        this.respawnRemaining -= deltaTime;
        if (this.respawnRemaining <= 0) {
            this.activate();
        }
    }
    animateMesh(deltaTime) {
        if (this.props.mesh === undefined || this.props.mesh === null) {
            return;
        }
        this.elapsed += deltaTime;
        // Rotation
        const animRotationTheta = this.elapsed * this.props.animRotationFrequency * Math.PI * 2;
        this.props.mesh.rotateRelativeTo(this.entity, hz.Quaternion.fromAxisAngle(this.props.mesh.up.get(), animRotationTheta), hz.Space.World);
        // Position
        const animPositionDelta = Math.sin(this.elapsed * this.props.animBobFrequency) * this.props.animBobAmplitude;
        this.props.mesh.moveRelativeTo(this.entity, this.props.mesh.up.get().mul(animPositionDelta), hz.Space.Local);
    }
    onTriggerEnter(player) {
        if (this.active) {
            this.applyJumpBoost(player);
            this.sendNetworkBroadcastEvent(exports.JumpBoostPickupEvents.OnPickupJumpBoost, {
                player,
                jumpBoostAmount: this.props.jumpBoostAmount,
                duration: this.props.jumpBoostDuration
            });
            this.deactivate();
        }
    }
    applyJumpBoost(player) {
        // Apply jump boost to player - try to set jump speed directly like speed boost
        try {
            player.jumpSpeed.set(this.props.jumpBoostAmount);
            this.async.setTimeout(() => {
                // Reset player's jump speed after duration
                player.jumpSpeed.set(8.0); // default jump speed
            }, this.props.jumpBoostDuration * 1000);
        }
        catch (error) {
            console.log("Jump boost failed to apply from server, using network approach");
            // Fallback to network approach if direct setting fails
        }
    }
}
JumpBoostPickupTz.propsDefinition = {
    active: { type: hz.PropTypes.Boolean, default: true },
    mesh: { type: hz.PropTypes.Entity },
    pfx: { type: hz.PropTypes.Entity },
    light: { type: hz.PropTypes.Entity },
    animRotationFrequency: { type: hz.PropTypes.Number, default: 0.5 },
    animBobFrequency: { type: hz.PropTypes.Number, default: 0.5 },
    animBobAmplitude: { type: hz.PropTypes.Number, default: 0.1 },
    jumpBoostDuration: { type: hz.PropTypes.Number, default: 30 }, // duration of jump boost in seconds
    jumpBoostAmount: { type: hz.PropTypes.Number, default: 15 }, // amount of jump boost to apply
    respawnEnabled: { type: hz.PropTypes.Boolean, default: true },
    respawnDelay: { type: hz.PropTypes.Number, default: 15 }, // respawn time in seconds
};
hz.Component.register(JumpBoostPickupTz);
