"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class MoveBackAndForth extends core_1.Component {
    constructor() {
        super(...arguments);
        this.timeElapsed = 0;
        this.maxTime = 5; // Time in seconds to move
        this.startPosition = core_1.Vec3.zero;
        this.endPosition = core_1.Vec3.zero;
        this.direction = 1; // 1 for forward, -1 for backward
    }
    preStart() {
        this.startPosition = this.entity.position.get();
        this.endPosition = this.startPosition.add(core_1.Vec3.forward.mul(10)); // Move 10 meters forward
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, this.update.bind(this));
    }
    start() { }
    update(data) {
        this.timeElapsed = Math.max(0, Math.min(this.timeElapsed + data.deltaTime * this.direction, this.maxTime));
        const alpha = this.timeElapsed / this.maxTime;
        // Interpolate between start and end position
        const newPosition = core_1.Vec3.lerp(this.startPosition, this.endPosition, alpha);
        // Set the new position
        this.entity.position.set(newPosition);
        if (this.timeElapsed === this.maxTime || this.timeElapsed === 0) {
            // Reverse direction
            this.direction = -this.direction;
        }
    }
}
core_1.Component.register(MoveBackAndForth);
