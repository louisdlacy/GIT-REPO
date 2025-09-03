"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class ContinuousSpin extends core_1.Component {
    constructor() {
        super(...arguments);
        this.timeElapsed = 0;
        this.amplitude = 45; // Amplitude of rotation in degrees/sec
    }
    preStart() {
        // Connect to update event to spin continuously
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, this.update.bind(this));
    }
    start() { }
    update(data) {
        // Accumulate rotation angle (in degrees)
        this.timeElapsed += data.deltaTime * this.amplitude;
        const angle = this.timeElapsed % 360; // keep angle within 0-360 degrees
        // Create rotation quaternion from the current angle
        const rotation = core_1.Quaternion.fromEuler(new core_1.Vec3(0, angle, 0));
        this.entity.rotation.set(rotation);
        if (this.timeElapsed >= 360) {
            this.timeElapsed = 0; // Reset the timer for continuous rotation
        }
    }
}
core_1.Component.register(ContinuousSpin);
