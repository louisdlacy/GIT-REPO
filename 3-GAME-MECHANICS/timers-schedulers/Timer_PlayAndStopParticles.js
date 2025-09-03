"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class PlayAndStopParticles extends core_1.Component {
    preStart() {
        // Get the AudioGizmo ParticleGizmo from the entity
        this.particles = this.entity.as(core_1.ParticleGizmo);
        // Play the particle effects when the component starts
        this.particles.play();
        // Stop the particle effects after 3 seconds
        this.async.setTimeout(() => {
            this.particles?.stop();
        }, 3000);
    }
    start() {
        // Intentionally left blank
    }
}
core_1.Component.register(PlayAndStopParticles);
