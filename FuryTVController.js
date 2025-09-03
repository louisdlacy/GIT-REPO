"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerExited = exports.PlayerEntered = void 0;
const core_1 = require("horizon/core");
// Define the network events that this component will listen for.
// These are expected to be sent by a TriggerDetector script.
exports.PlayerEntered = new core_1.NetworkEvent('PlayerEntered');
exports.PlayerExited = new core_1.NetworkEvent('PlayerExited');
class FuryTVController extends core_1.Component {
    constructor() {
        super(...arguments);
        this.playersInZone = new Set();
    }
    preStart() {
        // Connect to the network events that signal players entering/exiting the zone.
        this.connectNetworkEvent(this.entity, exports.PlayerEntered, (data) => this.handlePlayerEntered(data.player));
        this.connectNetworkEvent(this.entity, exports.PlayerExited, (data) => this.handlePlayerExited(data.player));
    }
    start() {
        // Cache the gizmo references for better performance.
        this.particleGizmo = this.props.particleFx?.as(core_1.ParticleGizmo);
        this.staticSoundGizmo = this.props.staticSound?.as(core_1.AudioGizmo);
        this.fireSoundGizmo = this.props.fireSound?.as(core_1.AudioGizmo);
        this.voiceSoundGizmo = this.props.voiceSound?.as(core_1.AudioGizmo);
        if (!this.particleGizmo) {
            console.warn('FuryTVController: particleFx property is not set.');
        }
        if (!this.staticSoundGizmo) {
            console.warn('FuryTVController: staticSound property is not set.');
        }
        if (!this.fireSoundGizmo) {
            console.warn('FuryTVController: fireSound property is not set.');
        }
        if (!this.voiceSoundGizmo) {
            console.warn('FuryTVController: voiceSound property is not set.');
        }
    }
    handlePlayerEntered(player) {
        const playerCountBefore = this.playersInZone.size;
        this.playersInZone.add(player.id);
        // If this is the first player to enter the zone, activate the effects.
        if (playerCountBefore === 0 && this.playersInZone.size === 1) {
            this.activateEffects();
        }
    }
    handlePlayerExited(player) {
        this.playersInZone.delete(player.id);
        // If this was the last player to leave the zone, deactivate the effects.
        if (this.playersInZone.size === 0) {
            this.deactivateEffects();
        }
    }
    activateEffects() {
        this.particleGizmo?.play();
        if (this.staticSoundGizmo) {
            this.staticSoundGizmo.volume.set(this.props.staticVolume);
            this.staticSoundGizmo.play();
        }
        if (this.fireSoundGizmo) {
            this.fireSoundGizmo.volume.set(this.props.fireVolume);
            this.fireSoundGizmo.play();
        }
        if (this.voiceSoundGizmo) {
            this.voiceSoundGizmo.volume.set(this.props.voiceVolume);
            this.voiceSoundGizmo.play();
        }
    }
    deactivateEffects() {
        this.particleGizmo?.stop();
        this.staticSoundGizmo?.stop();
        this.fireSoundGizmo?.stop();
        this.voiceSoundGizmo?.stop();
    }
}
FuryTVController.propsDefinition = {
    particleFx: { type: core_1.PropTypes.Entity },
    staticSound: { type: core_1.PropTypes.Entity },
    fireSound: { type: core_1.PropTypes.Entity },
    voiceSound: { type: core_1.PropTypes.Entity },
    staticVolume: { type: core_1.PropTypes.Number, default: 1.0 },
    fireVolume: { type: core_1.PropTypes.Number, default: 1.0 },
    voiceVolume: { type: core_1.PropTypes.Number, default: 1.0 },
};
core_1.Component.register(FuryTVController);
