"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class ProximityGenieController extends core_1.Component {
    constructor() {
        super(...arguments);
        this.playersInZone = new Set();
    }
    preStart() {
        // Listen for players entering and exiting the trigger this script is attached to.
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, (player) => this.onPlayerEnter(player));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitTrigger, (player) => this.onPlayerExit(player));
    }
    start() {
        // Ensure effects are hidden at the start.
        this.props.genieModel?.visible.set(false);
        this.props.smokeEffect?.as(core_1.ParticleGizmo)?.stop();
    }
    onPlayerEnter(player) {
        const playerCountBefore = this.playersInZone.size;
        this.playersInZone.add(player.id);
        // If this is the first player to enter the zone, start the activation timer.
        if (playerCountBefore === 0 && this.playersInZone.size === 1) {
            this.activationTimerId = this.async.setTimeout(() => {
                // Check if there's still a player in the zone when the timer completes.
                if (this.playersInZone.size > 0) {
                    this.activateEffects();
                }
                this.activationTimerId = undefined;
            }, this.props.activationDelay * 1000);
        }
    }
    onPlayerExit(player) {
        this.playersInZone.delete(player.id);
        // If this was the last player to leave the zone, deactivate the effects.
        if (this.playersInZone.size === 0) {
            // If the activation timer is running, cancel it.
            if (this.activationTimerId) {
                this.async.clearTimeout(this.activationTimerId);
                this.activationTimerId = undefined;
            }
            this.deactivateEffects();
        }
    }
    activateEffects() {
        this.props.genieModel?.visible.set(true);
        this.props.smokeEffect?.as(core_1.ParticleGizmo)?.play();
        this.props.shimmerSound?.as(core_1.AudioGizmo)?.play();
        this.props.swishSound?.as(core_1.AudioGizmo)?.play();
        this.props.genieVoice?.as(core_1.AudioGizmo)?.play();
    }
    deactivateEffects() {
        this.props.genieModel?.visible.set(false);
        this.props.smokeEffect?.as(core_1.ParticleGizmo)?.stop();
        this.props.shimmerSound?.as(core_1.AudioGizmo)?.stop();
        this.props.swishSound?.as(core_1.AudioGizmo)?.stop();
        this.props.genieVoice?.as(core_1.AudioGizmo)?.stop();
    }
}
ProximityGenieController.propsDefinition = {
    genieModel: { type: core_1.PropTypes.Entity },
    smokeEffect: { type: core_1.PropTypes.Entity },
    shimmerSound: { type: core_1.PropTypes.Entity },
    swishSound: { type: core_1.PropTypes.Entity },
    genieVoice: { type: core_1.PropTypes.Entity },
    activationDelay: { type: core_1.PropTypes.Number, default: 3 },
};
core_1.Component.register(ProximityGenieController);
