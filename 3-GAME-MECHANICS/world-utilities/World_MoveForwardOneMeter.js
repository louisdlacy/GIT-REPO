"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class MoveForwardOneMeter extends core_1.Component {
    preStart() {
        const initialPosition = this.entity.position.get();
        const forwardDirection = this.entity.forward.get();
        const distanceToMove = 1; // Move one meter forward
        const newPosition = initialPosition.add(forwardDirection.mul(distanceToMove));
        this.entity.position.set(newPosition);
        console.log(`Moved entity from ${initialPosition} to ${newPosition}`);
    }
    start() { }
}
core_1.Component.register(MoveForwardOneMeter);
