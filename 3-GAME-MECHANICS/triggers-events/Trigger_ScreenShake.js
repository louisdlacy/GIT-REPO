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
class ScreenShake extends core_1.Component {
    constructor() {
        super(...arguments);
        this.isShaking = false;
        this.intensity = 0.05; // Intensity of position change in meters
        this.duration = 1;
        this.oscillations = 10;
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
        if (!this.isShaking) {
            this.startScreenShake();
        }
    }
    async startScreenShake() {
        this.isShaking = true;
        // Store the original camera position
        const originalPosition = camera_1.default.position.get();
        // Calculate individual oscillation duration
        const oscillationDuration = this.duration / this.oscillations;
        // Create a series of random offsets for the camera position with decreasing intensity
        for (let i = 0; i < this.oscillations; i++) {
            // Calculate decreasing intensity for this oscillation
            const currentIntensity = this.intensity * (1 - i / this.oscillations);
            // Generate a random offset in all directions
            const offsetX = (Math.random() * 2 - 1) * currentIntensity;
            const offsetY = (Math.random() * 2 - 1) * currentIntensity;
            const offsetZ = (Math.random() * 2 - 1) * currentIntensity;
            // Apply the offset to the original position
            const newPosition = new core_1.Vec3(originalPosition.x + offsetX, originalPosition.y + offsetY, originalPosition.z + offsetZ);
            // Apply the new position
            camera_1.default.setCameraModeFixed({
                position: newPosition,
                rotation: camera_1.default.rotation.get(),
                duration: oscillationDuration,
                easing: camera_1.Easing.EaseInOut
            });
            // Wait for half the oscillation duration
            await new Promise(resolve => {
                this.async.setTimeout(() => {
                    resolve(null);
                }, oscillationDuration * 500);
            });
        }
        // Return camera to original position
        camera_1.default.setCameraModeThirdPerson();
        this.isShaking = false;
    }
}
core_1.Component.register(ScreenShake);
