"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class MoveInAStraightLine extends core_1.Component {
    constructor() {
        super(...arguments);
        this.timeElapsed = 0;
        this.maxTime = 5; // Time in seconds to move
        this.startPosition = core_1.Vec3.zero;
        this.endPosition = core_1.Vec3.zero;
    }
    preStart() {
        this.startPosition = this.entity.position.get();
        this.endPosition = this.startPosition.add(core_1.Vec3.forward.mul(10)); // Move 10 meters forward
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, this.update.bind(this));
    }
    start() { }
    update(data) {
        this.timeElapsed = Math.min(this.timeElapsed + data.deltaTime, this.maxTime);
        const alpha = this.timeElapsed / this.maxTime;
        const newPosition = core_1.Vec3.lerp(this.startPosition, this.endPosition, alpha);
        this.entity.position.set(newPosition);
        if (this.timeElapsed >= this.maxTime) {
            console.log('Movement completed');
            this.timeElapsed = 0;
        }
    }
}
core_1.Component.register(MoveInAStraightLine);
