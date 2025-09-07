"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class PlayParticles extends core_1.Component {
    preStart() {
        this.particle = this.props.particle?.as(core_1.ParticleGizmo);
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, this.onPlayerEnterTrigger.bind(this));
    }
    start() {
        // Intentionally left blank
    }
    onPlayerEnterTrigger(player) {
        this.particle?.play();
    }
}
PlayParticles.propsDefinition = {
    particle: { type: core_1.PropTypes.Entity }
};
core_1.Component.register(PlayParticles);
