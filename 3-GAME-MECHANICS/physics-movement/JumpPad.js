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
exports.JumpPad = exports.JumpPadEvents = void 0;
const hz = __importStar(require("horizon/core"));
exports.JumpPadEvents = {
    playerLaunched: new hz.NetworkEvent('playerLaunched'),
    jumpPadActivated: new hz.LocalEvent('jumpPadActivated'),
};
class JumpPad extends hz.Component {
    constructor() {
        super(...arguments);
        this.isActive = true;
        this.lastLaunchTime = 0;
        this.playersInZone = new Set();
    }
    preStart() {
        super.preStart();
        this.launchVFX = this.props.launchVFX?.as(hz.ParticleGizmo);
        this.launchSFX = this.props.launchSFX?.as(hz.AudioGizmo);
        this.idleVFX = this.props.idleVFX?.as(hz.ParticleGizmo);
        this.idleSFX = this.props.idleSFX?.as(hz.AudioGizmo);
        this.triggerZone = this.props.triggerZone?.as(hz.TriggerGizmo);
        if (this.props.debugMode) {
            console.log(`[JumpPad] Simple mode initialized`);
        }
    }
    start() {
        if (this.triggerZone) {
            this.triggerEnter = this.connectCodeBlockEvent(this.triggerZone, hz.CodeBlockEvents.OnPlayerEnterTrigger, this.onPlayerEnterTrigger.bind(this));
            this.triggerExit = this.connectCodeBlockEvent(this.triggerZone, hz.CodeBlockEvents.OnPlayerExitTrigger, this.onPlayerExitTrigger.bind(this));
        }
        this.playerLaunched = this.connectNetworkEvent(this.entity, exports.JumpPadEvents.playerLaunched, this.onPlayerLaunched.bind(this));
        this.startIdleEffects();
    }
    dispose() {
        this.triggerEnter?.disconnect();
        this.triggerExit?.disconnect();
        this.playerLaunched?.disconnect();
        this.stopIdleEffects();
        super.dispose();
    }
    onPlayerEnterTrigger(player) {
        this.playersInZone.add(player);
        if (this.props.debugMode) {
            console.log(`[JumpPad] Player ${player.name.get()} entered trigger zone`);
        }
        this.launchPlayer(player);
    }
    onPlayerExitTrigger(player) {
        this.playersInZone.delete(player);
        if (this.props.debugMode) {
            console.log(`[JumpPad] Player ${player.name.get()} exited trigger zone`);
        }
    }
    launchPlayer(player) {
        if (!this.isActive) {
            if (this.props.debugMode) {
                console.log(`[JumpPad] Jump pad is not active`);
            }
            return;
        }
        const currentTime = Date.now();
        if (currentTime - this.lastLaunchTime < this.props.cooldownTime) {
            if (this.props.debugMode) {
                console.log(`[JumpPad] Jump pad is on cooldown`);
            }
            return;
        }
        // Calculate launch velocity based on pad's forward direction and angle
        const launchVelocity = this.calculateLaunchVelocity();
        player.velocity.set(launchVelocity);
        this.lastLaunchTime = currentTime;
        this.playLaunchEffects();
        this.sendNetworkEvent(this.entity, exports.JumpPadEvents.playerLaunched, {
            player: player,
            launchVelocity: launchVelocity
        });
        this.sendLocalEvent(this.entity, exports.JumpPadEvents.jumpPadActivated, {
            jumpPad: this.entity,
            player: player
        });
        if (this.props.debugMode) {
            console.log(`[JumpPad] Launched player ${player.name.get()} with velocity:`, launchVelocity);
        }
    }
    calculateLaunchVelocity() {
        // Get the pad's forward direction
        const forward = this.entity.forward.get().normalize();
        // Up direction
        const up = this.entity.up.get().normalize();
        // Calculate the launch direction by rotating forward by launchAngle towards up
        const angleRad = hz.degreesToRadians(this.props.launchAngle);
        // Interpolate between forward and up
        const launchDir = forward.mul(Math.cos(angleRad)).add(up.mul(Math.sin(angleRad))).normalize();
        return launchDir.mul(this.props.launchForce);
    }
    playLaunchEffects() {
        this.stopIdleEffects();
        if (this.launchVFX) {
            this.launchVFX.play();
        }
        if (this.launchSFX) {
            this.launchSFX.play();
        }
        this.async.setTimeout(() => {
            this.startIdleEffects();
        }, 2000);
    }
    startIdleEffects() {
        if (this.idleVFX) {
            this.idleVFX.play();
        }
        if (this.idleSFX) {
            this.idleSFX.play();
        }
    }
    stopIdleEffects() {
        if (this.idleVFX) {
            this.idleVFX.stop();
        }
        if (this.idleSFX) {
            this.idleSFX.stop();
        }
    }
    onPlayerLaunched(data) {
        if (this.props.debugMode) {
            console.log(`[JumpPad] Network event: Player ${data.player.name.get()} launched`);
        }
    }
    // Public methods for external control
    activate() {
        this.isActive = true;
        this.startIdleEffects();
    }
    deactivate() {
        this.isActive = false;
        this.stopIdleEffects();
    }
    getIsActive() {
        return this.isActive;
    }
    getPlayersInZone() {
        return Array.from(this.playersInZone);
    }
    receiveOwnership(state, fromPlayer, toPlayer) {
        if (state) {
            this.isActive = state.isActive;
            this.lastLaunchTime = state.lastLaunchTime;
        }
    }
    transferOwnership(oldPlayer, newPlayer) {
        return {
            isActive: this.isActive,
            lastLaunchTime: this.lastLaunchTime,
        };
    }
}
exports.JumpPad = JumpPad;
JumpPad.propsDefinition = {
    launchForce: { type: hz.PropTypes.Number, default: 15 },
    launchAngle: { type: hz.PropTypes.Number, default: 45 },
    cooldownTime: { type: hz.PropTypes.Number, default: 1000 },
    triggerZone: { type: hz.PropTypes.Entity },
    launchVFX: { type: hz.PropTypes.Entity },
    launchSFX: { type: hz.PropTypes.Entity },
    idleVFX: { type: hz.PropTypes.Entity },
    idleSFX: { type: hz.PropTypes.Entity },
    debugMode: { type: hz.PropTypes.Boolean, default: false },
};
hz.Component.register(JumpPad);
