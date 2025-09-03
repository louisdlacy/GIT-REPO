"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class PlayAndStopAnimation extends core_1.Component {
    preStart() {
        // Get the AnimatedEntity component from the entity
        this.animatedEntity = this.entity.as(core_1.AnimatedEntity);
        // Play the animation when the component starts
        this.animatedEntity.play();
        // Stop the animation after 3 seconds
        this.async.setTimeout(() => {
            this.animatedEntity?.stop();
        }, 3000);
    }
    start() {
        // Intentionally left blank
    }
}
core_1.Component.register(PlayAndStopAnimation);
