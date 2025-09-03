"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class PlayerOrbiter extends core_1.Component {
    constructor() {
        super(...arguments);
        this.radius = 2; // Radius of the orbit
        this.timeElapsed = 0;
        this.maxTime = 1; // Time in seconds to complete one orbit
    }
    preStart() { }
    start() { }
    update(data) {
        if (!this.target) {
            return;
        }
        this.timeElapsed = Math.min(this.maxTime, this.timeElapsed + data.deltaTime);
        const alpha = this.timeElapsed / this.maxTime;
        const angle = alpha * Math.PI * 2; // Full circle in radians
        const targetPos = this.target.position.get();
        const x = targetPos.x + Math.cos(angle) * this.radius;
        const z = targetPos.z + Math.sin(angle) * this.radius;
        this.entity.position.set(new core_1.Vec3(x, targetPos.y, z));
    }
}
core_1.Component.register(PlayerOrbiter);
