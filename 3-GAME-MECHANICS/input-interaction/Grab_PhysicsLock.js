"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class PhysicsLock extends core_1.Component {
    preStart() {
        this.physicsEntity = this.entity.as(core_1.PhysicalEntity);
        // Lock the physics entity to prevent it from moving
        this.physicsEntity.locked.set(true);
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabStart, this.onGrab.bind(this));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabEnd, this.onRelease.bind(this));
    }
    start() {
        // Intentionally left blank
    }
    onGrab() {
        console.log('Locked entity grabbed');
    }
    onRelease() {
        console.log('Locked entity released');
    }
}
core_1.Component.register(PhysicsLock);
