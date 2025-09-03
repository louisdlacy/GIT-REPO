"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class Oscillate extends core_1.Component {
    constructor() {
        super(...arguments);
        this.timeElapsed = 0;
        this.maxTime = 5; // Time in seconds to complete a full rotation
        this.amplitude = 45; // Amplitude of oscillation in degrees
    }
    preStart() {
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, this.update.bind(this));
    }
    start() { }
    update(data) {
        this.timeElapsed = Math.min(this.maxTime, this.timeElapsed + data.deltaTime);
        const value = this.timeElapsed / this.maxTime * Math.PI * 2; // Convert to radians
        const results = Math.sin(value);
        // Map sine result (-1 to 1) to a rotation angle
        const rotationAngle = this.amplitude * results; // 45 degrees amplitude of oscillation
        // Create rotation quaternion directly
        const rotation = core_1.Quaternion.fromEuler(new core_1.Vec3(0, rotationAngle, 0));
        // Set the absolute rotation
        this.entity.rotation.set(rotation);
        if (this.timeElapsed >= this.maxTime) {
            this.timeElapsed = 0; // Reset the timer for continuous oscillation
        }
    }
}
core_1.Component.register(Oscillate);
