"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class ReturnToStartingPosition extends core_1.Component {
    constructor() {
        super(...arguments);
        this.startPosition = core_1.Vec3.zero;
        this.startRotation = core_1.Quaternion.zero;
    }
    preStart() {
        // Store the initial position and rotation of the entity
        this.startPosition = this.entity.position.get();
        this.startRotation = this.entity.rotation.get();
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabEnd, this.onRelease.bind(this));
    }
    start() {
        // Intentionally left blank
    }
    onRelease() {
        this.entity.position.set(this.startPosition);
        this.entity.rotation.set(this.startRotation);
    }
}
core_1.Component.register(ReturnToStartingPosition);
