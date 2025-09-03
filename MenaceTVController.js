"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerExited = exports.PlayerEntered = void 0;
const core_1 = require("horizon/core");
// These events are expected to be sent by a TriggerDetector script.
exports.PlayerEntered = new core_1.NetworkEvent('PlayerEntered');
exports.PlayerExited = new core_1.NetworkEvent('PlayerExited');
class MenaceTVController extends core_1.Component {
    constructor() {
        super(...arguments);
        this.playersInZone = new Set();
        this.initialEyePositions = new Map();
        this.isAnimating = false;
        this.animationTime = 0;
    }
    preStart() {
        this.connectNetworkEvent(this.entity, exports.PlayerEntered, (data) => this.handlePlayerEntered(data.player));
        this.connectNetworkEvent(this.entity, exports.PlayerExited, (data) => this.handlePlayerExited(data.player));
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, (data) => this.onUpdate(data.deltaTime));
    }
    start() {
        this.audioGizmo = this.props.soundFx?.as(core_1.AudioGizmo);
        if (!this.audioGizmo) {
            console.warn('MenaceTVController: soundFx property is not set.');
        }
        if (!this.props.eyes || this.props.eyes.length === 0) {
            console.error("MenaceTVController: 'eyes' property is not set or is empty.");
            return;
        }
        // Store the initial positions for each eye.
        this.props.eyes.forEach(eye => {
            if (eye) {
                this.initialEyePositions.set(eye, eye.position.get());
            }
        });
    }
    handlePlayerEntered(player) {
        const playerCountBefore = this.playersInZone.size;
        this.playersInZone.add(player.id);
        // If this is the first player to enter, start the animation and sound.
        if (playerCountBefore === 0 && this.playersInZone.size === 1) {
            this.isAnimating = true;
            if (this.audioGizmo) {
                this.audioGizmo.volume.set(this.props.soundFxVolume);
                this.audioGizmo.play();
            }
        }
    }
    handlePlayerExited(player) {
        this.playersInZone.delete(player.id);
        // If this was the last player to leave, stop the animation and sound.
        if (this.playersInZone.size === 0) {
            this.isAnimating = false;
            this.audioGizmo?.stop();
            this.resetEyePositions();
        }
    }
    onUpdate(deltaTime) {
        if (!this.isAnimating) {
            return;
        }
        this.animationTime += deltaTime;
        const bobOffset = Math.sin(this.animationTime * this.props.bobSpeed) * this.props.bobHeight;
        // Animate each eye based on its initial position.
        this.props.eyes?.forEach(eye => {
            if (eye) {
                const initialPos = this.initialEyePositions.get(eye);
                if (initialPos) {
                    const newPos = new core_1.Vec3(initialPos.x, initialPos.y + bobOffset, initialPos.z);
                    eye.position.set(newPos);
                }
            }
        });
    }
    resetEyePositions() {
        // Return each eye to its original position.
        this.props.eyes?.forEach(eye => {
            if (eye) {
                const initialPos = this.initialEyePositions.get(eye);
                if (initialPos) {
                    eye.position.set(initialPos);
                }
            }
        });
    }
}
MenaceTVController.propsDefinition = {
    eyes: { type: core_1.PropTypes.EntityArray },
    soundFx: { type: core_1.PropTypes.Entity },
    soundFxVolume: { type: core_1.PropTypes.Number, default: 1.0 },
    bobHeight: { type: core_1.PropTypes.Number, default: 0.1 },
    bobSpeed: { type: core_1.PropTypes.Number, default: 2 },
};
core_1.Component.register(MenaceTVController);
