"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FountainController = void 0;
const core_1 = require("horizon/core");
class FountainController extends core_1.Component {
    preStart() {
        // Set up the event connection for looping audio if the soundEffect is assigned.
        if (this.props.soundEffect) {
            this.connectCodeBlockEvent(this.props.soundEffect, core_1.CodeBlockEvents.OnAudioCompleted, () => this.playLoopingSound());
        }
    }
    start() {
        // Handle the sound effect.
        if (this.props.soundEffect) {
            this.soundGizmo = this.props.soundEffect.as(core_1.AudioGizmo);
            if (this.soundGizmo) {
                // Start the sound loop.
                this.playLoopingSound();
            }
        }
        else {
            console.warn("FountainController: Please assign the sound effect asset to the 'soundEffect' property on the 'water_fountain' entity.");
        }
        // Handle the particle effect.
        if (this.props.particleEffect) {
            const particleGizmo = this.props.particleEffect.as(core_1.ParticleGizmo);
            if (particleGizmo) {
                particleGizmo.play();
            }
        }
        else {
            console.warn("FountainController: Please assign the particle effect asset to the 'particleEffect' property on the 'water_fountain' entity.");
        }
    }
    playLoopingSound() {
        // This method is called initially in start() and then by the OnAudioCompleted event.
        this.soundGizmo?.play();
    }
}
exports.FountainController = FountainController;
FountainController.propsDefinition = {
    soundEffect: { type: core_1.PropTypes.Entity },
    particleEffect: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(FountainController);
