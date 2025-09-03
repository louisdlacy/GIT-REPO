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
class ClickAndDragCamera extends core_1.Component {
    constructor() {
        super(...arguments);
        this.lastInteractionPoint = new core_1.Vec3(0, 0, 0);
        this.panSpeed = 500; // Adjust this for faster/slower camera movement
        this.downRotation = core_1.Quaternion.lookRotation(core_1.Vec3.down, core_1.Vec3.up);
        // Track interaction counts
        this.interactions = 0;
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
        // Set initial camera position
        camera_1.default.setCameraModeFixed({
            position: new core_1.Vec3(0, 20, 0),
            rotation: this.downRotation
        });
        // Enter focused interaction mode to capture inputs
        this.owner.enterFocusedInteractionMode();
        // Connect events for interaction
        this.connectLocalBroadcastEvent(core_1.PlayerControls.onFocusedInteractionInputStarted, this.onFocusedInteractionInputStarted.bind(this));
        this.connectLocalBroadcastEvent(core_1.PlayerControls.onFocusedInteractionInputMoved, this.onFocusedInteractionInputMoved.bind(this));
        this.connectLocalBroadcastEvent(core_1.PlayerControls.onFocusedInteractionInputEnded, this.onFocusedInteractionInputEnded.bind(this));
    }
    start() {
        // Intentionally left blank
    }
    onFocusedInteractionInputStarted(data) {
        if (this.interactions === 0) {
            // Store initial position
            this.lastInteractionPoint = data.interactionInfo[0].screenPosition;
        }
        // Count the interactions started in this frame
        this.interactions += data.interactionInfo.length;
        console.log(`Interactions started this frame: ${data.interactionInfo.length}`);
    }
    onFocusedInteractionInputMoved(data) {
        // Calculate movement delta from last position
        const deltaX = data.interactionInfo[0].screenPosition.x - this.lastInteractionPoint.x;
        const deltaY = data.interactionInfo[0].screenPosition.y - this.lastInteractionPoint.y;
        if (deltaX !== 0 || deltaY !== 0) {
            console.log(`Is Dragging`);
            let cameraPosition = camera_1.default.position.get();
            // Update camera position based on drag direction
            // Invert X movement for natural feeling (drag right moves camera left)
            cameraPosition = new core_1.Vec3(cameraPosition.x - deltaX * this.panSpeed, cameraPosition.y, cameraPosition.z - deltaY * this.panSpeed);
            // Apply the new camera position
            camera_1.default.setCameraModeFixed({
                position: cameraPosition,
                rotation: this.downRotation,
                duration: 0.1,
                easing: camera_1.Easing.Linear
            });
        }
        // Update the last position for next movement
        this.lastInteractionPoint = data.interactionInfo[0].screenPosition;
    }
    onFocusedInteractionInputEnded(data) {
        // Count the interactions ended in this frame
        this.interactions -= data.interactionInfo.length;
        console.log(`Interactions ended this frame: ${data.interactionInfo.length}`);
    }
}
core_1.Component.register(ClickAndDragCamera);
