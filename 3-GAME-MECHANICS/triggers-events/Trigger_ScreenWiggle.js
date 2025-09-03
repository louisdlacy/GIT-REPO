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
const core_1 = require("horizon/core");
const camera_1 = __importStar(require("horizon/camera"));
// See World_OwnershipManagement to manage ownership 
// This script must be set to "Local" execution mode in the editor.
class ScreenWiggle extends core_1.Component {
    constructor() {
        super(...arguments);
        this.isWiggling = false;
        this.intensity = 5;
        this.duration = 1;
        this.oscillations = 4;
    }
    preStart() {
        // The player will own the entity when it is grabbed
        this.owner = this.entity.owner.get();
        this.serverPlayer = this.world.getServerPlayer();
        // Check if the entity is owned by a player
        if (this.owner === this.serverPlayer) {
            // The entity is owned by the server player, so end the script
            return;
        }
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, this.onPlayerEnterTrigger.bind(this));
    }
    start() {
        // Intentionally left blank
    }
    onPlayerEnterTrigger() {
        // Only start a new shake if we're not already shaking
        if (!this.isWiggling) {
            this.startScreenWiggle();
        }
    }
    async startScreenWiggle() {
        this.isWiggling = true;
        // Calculate individual oscillation duration
        const oscillationDuration = this.duration / this.oscillations;
        // Create a series of alternating camera rolls with decreasing intensity
        for (let i = 0; i < this.oscillations; i++) {
            // Calculate decreasing intensity for this oscillation
            const currentIntensity = this.intensity * (1 - i / this.oscillations);
            // Alternate between positive and negative roll angles
            const rollAngle = (i % 2 === 0) ? currentIntensity : -currentIntensity;
            // Set the camera roll with easing for a smooth transition
            await camera_1.default.setCameraRollWithOptions(rollAngle, {
                duration: oscillationDuration / 2,
                easing: camera_1.Easing.EaseInOut
            });
        }
        // Return camera to normal
        await camera_1.default.setCameraRollWithOptions(0, {
            duration: oscillationDuration,
            easing: camera_1.Easing.EaseOut
        });
        this.isWiggling = false;
    }
}
core_1.Component.register(ScreenWiggle);
