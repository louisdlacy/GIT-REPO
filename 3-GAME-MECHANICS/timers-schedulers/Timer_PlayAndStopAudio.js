"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class PlayAndStopAudio extends core_1.Component {
    preStart() {
        // Get the AudioGizmo component from the entity
        this.audio = this.entity.as(core_1.AudioGizmo);
        // Play the sound when the component starts
        this.audio.play();
        // Stop the sound after 3 seconds
        this.async.setTimeout(() => {
            this.audio?.stop();
        }, 3000);
    }
    start() {
        // Intentionally left blank
    }
}
core_1.Component.register(PlayAndStopAudio);
