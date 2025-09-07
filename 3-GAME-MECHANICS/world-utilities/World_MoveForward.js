"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class MoveForward extends core_1.Component {
    constructor() {
        super(...arguments);
        this.speed = 1; // Increase this value to move faster
    }
    preStart() {
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, this.update.bind(this));
    }
    start() { }
    update(data) {
        const currentPosition = this.entity.position.get();
        const forward = this.entity.forward.get();
        const newPosition = currentPosition.add(forward.mul(this.speed * data.deltaTime));
        this.entity.position.set(newPosition);
    }
}
core_1.Component.register(MoveForward);
