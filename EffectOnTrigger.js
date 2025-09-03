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
// Import the necessary modules from the Horizon Worlds core API.
const hz = __importStar(require("horizon/core"));
/**
 * A powerful, all-in-one component to trigger sound, particle, and/or trail
 * effects when a player or a specific entity enters its trigger zone.
 */
class EffectOnTrigger extends hz.Component {
    constructor() {
        super(...arguments);
        this.canPlay = true;
    }
    start() {
        this.triggerGizmo = this.entity.as(hz.TriggerGizmo);
        if (this.props.enableSound && this.props.soundEffect)
            this.soundGizmo = this.props.soundEffect.as(hz.AudioGizmo);
        if (this.props.enableParticles && this.props.particleEffect)
            this.particleGizmo = this.props.particleEffect.as(hz.ParticleGizmo);
        if (this.props.enableTrail && this.props.trailEffect)
            this.trailGizmo = this.props.trailEffect.as(hz.TrailGizmo);
        this.connectCodeBlockEvent(this.triggerGizmo, hz.CodeBlockEvents.OnPlayerEnterTrigger, this.handlePlayerEnter.bind(this));
        this.connectCodeBlockEvent(this.triggerGizmo, hz.CodeBlockEvents.OnEntityEnterTrigger, this.handleEntityEnter.bind(this));
        this.connectCodeBlockEvent(this.triggerGizmo, hz.CodeBlockEvents.OnPlayerExitTrigger, this.handleExit.bind(this));
        this.connectCodeBlockEvent(this.triggerGizmo, hz.CodeBlockEvents.OnEntityExitTrigger, this.handleExit.bind(this));
    }
    handlePlayerEnter(player) {
        const triggerType = this.getTriggerTypeFromString(this.props.triggerType);
        if (triggerType === 0 || triggerType === 2) {
            if (this.canPlay) {
                if (!this.props.allowRetrigger)
                    this.canPlay = false;
                this.triggerEffects(player);
            }
        }
    }
    handleEntityEnter(enteredEntity) {
        const triggerType = this.getTriggerTypeFromString(this.props.triggerType);
        if (triggerType === 1 || triggerType === 2) {
            if (this.props.triggeringEntity && this.props.triggeringEntity.id === enteredEntity.id) {
                if (this.canPlay) {
                    if (!this.props.allowRetrigger)
                        this.canPlay = false;
                    this.triggerEffects(); // Entity effects are always global
                }
            }
        }
    }
    handleExit(exitedBy) {
        this.canPlay = true; // Always reset on exit
        if (this.props.playOnExit) {
            const player = exitedBy instanceof hz.Player ? exitedBy : undefined;
            this.triggerEffects(player);
        }
    }
    triggerEffects(player) {
        const playEffectFor = this.getPlayEffectForFromString(this.props.playEffectFor);
        const isPlayerSpecific = playEffectFor === 1 && player;
        if (this.soundGizmo) {
            const options = { fade: 0 };
            if (isPlayerSpecific)
                options.players = [player];
            this.soundGizmo.play(options);
        }
        if (this.particleGizmo) {
            const options = {};
            if (isPlayerSpecific)
                options.players = [player];
            this.particleGizmo.play(options);
        }
        if (this.trailGizmo) {
            this.trailGizmo.play();
        }
    }
    // --- STRING CONVERSION HELPERS ---
    getTriggerTypeFromString(triggerType) {
        const lowerCaseType = triggerType.toLowerCase().trim();
        switch (lowerCaseType) {
            case "entity only": return 1;
            case "both": return 2;
            case "player only":
            default: return 0;
        }
    }
    getPlayEffectForFromString(playFor) {
        const lowerCasePlayFor = playFor.toLowerCase().trim();
        if (lowerCasePlayFor === "triggering player only") {
            return 1;
        }
        return 0; // Default to "Everyone"
    }
}
// -- PROPERTIES --
EffectOnTrigger.propsDefinition = {
    // --- Effect Toggles & Gizmos ---
    enableSound: { type: hz.PropTypes.Boolean, default: true },
    soundEffect: { type: hz.PropTypes.Entity },
    enableParticles: { type: hz.PropTypes.Boolean, default: false },
    particleEffect: { type: hz.PropTypes.Entity },
    enableTrail: { type: hz.PropTypes.Boolean, default: false },
    trailEffect: { type: hz.PropTypes.Entity },
    // --- Trigger Logic ---
    // MODIFIED: Now a String. e.g., "Player Only", "Entity Only", "Both".
    triggerType: { type: hz.PropTypes.String, default: "Player Only" },
    triggeringEntity: { type: hz.PropTypes.Entity },
    // --- Behavior Controls ---
    // MODIFIED: Now a String. e.g., "Everyone", "Triggering Player Only".
    playEffectFor: { type: hz.PropTypes.String, default: "Everyone" },
    allowRetrigger: { type: hz.PropTypes.Boolean, default: false },
    playOnExit: { type: hz.PropTypes.Boolean, default: false }
};
hz.Component.register(EffectOnTrigger);
