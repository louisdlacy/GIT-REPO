"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class DistanceCheck extends core_1.Component {
    constructor() {
        super(...arguments);
        this.startPosition = core_1.Vec3.zero;
        this.endPosition = core_1.Vec3.zero;
    }
    preStart() {
        // Set up the start and end positions
        this.startPosition = this.entity.position.get();
        this.endPosition = this.startPosition.add(this.entity.forward.get().mul(10));
        // Set up an interval to check the distance every second
        this.async.setInterval(() => {
            const distance = this.startPosition.distance(this.endPosition);
            console.log(distance);
        }, 1000);
    }
    start() {
        // Intentionally left blank
    }
}
core_1.Component.register(DistanceCheck);
