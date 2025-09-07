"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class Hover extends core_1.Component {
    constructor() {
        super(...arguments);
        this.timeElapsed = 0;
        this.maxTime = 3; // Time in seconds to complete a full rotation
        this.amplitude = 1; // Amplitude of hover in meters
        this.startPosition = core_1.Vec3.zero;
    }
    preStart() {
        this.startPosition = this.entity.position.get();
        // Connect to update event to spin continuously
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, this.update.bind(this));
    }
    start() { }
    update(data) {
        this.timeElapsed = Math.min(this.maxTime, this.timeElapsed + data.deltaTime);
        const value = this.timeElapsed / this.maxTime * Math.PI * 2; // Convert to radians
        const results = Math.cos(value);
        // Map sine result (-1 to 1) to a hover height
        const hoverHeight = this.amplitude * results; // 1 meter amplitude of hover
        // Set the new position
        const newPosition = this.startPosition.add(new core_1.Vec3(0, hoverHeight, 0));
        this.entity.position.set(newPosition);
        if (this.timeElapsed >= this.maxTime) {
            this.timeElapsed = 0; // Reset the timer for continuous hover
        }
    }
}
core_1.Component.register(Hover);
