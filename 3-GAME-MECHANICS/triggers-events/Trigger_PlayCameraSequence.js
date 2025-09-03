"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const camera_1 = __importDefault(require("horizon/camera"));
// See World_OwnershipManagement to manage ownership 
// This script must be set to "Local" execution mode in the editor.
class PlayCameraSequence extends core_1.Component {
    constructor() {
        super(...arguments);
        this.sequence = [];
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
        //Load up sequence
        this.sequence = [];
        this.sequence.push({
            position: this.entity.position.get().add(this.entity.forward.get().mul(2)),
            rotation: core_1.Quaternion.lookRotation(this.entity.forward.get().mul(-1), core_1.Vec3.up),
            duration: 2
        });
        this.sequence.push({
            position: this.entity.position.get().add(this.entity.up.get().mul(4)),
            rotation: core_1.Quaternion.lookRotation(core_1.Vec3.down, core_1.Vec3.up),
            duration: 2
        });
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, this.onPlayerEnterTrigger.bind(this));
    }
    start() {
        // Intentionally left blank
    }
    onPlayerEnterTrigger() {
        this.playNextCamera();
    }
    playNextCamera() {
        const cameraData = this.sequence.shift();
        if (cameraData) {
            camera_1.default.setCameraModeFixed({
                position: cameraData.position,
                rotation: cameraData.rotation,
                duration: cameraData.duration
            });
            this.async.setTimeout(() => {
                this.playNextCamera();
            }, cameraData.duration * 1000);
        }
        else {
            this.async.setTimeout(() => {
                // Reset the camera mode to default
                camera_1.default.setCameraModeThirdPerson();
            }, 1000);
        }
    }
}
core_1.Component.register(PlayCameraSequence);
