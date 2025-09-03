"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class MoveBackward extends core_1.Component {
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
        const backward = this.entity.forward.get().mul(-1); // Invert the forward direction to move backward
        const newPosition = currentPosition.add(backward.mul(this.speed * data.deltaTime));
        this.entity.position.set(newPosition);
    }
}
core_1.Component.register(MoveBackward);
