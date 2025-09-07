"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class ApplyForce extends core_1.Component {
    constructor() {
        super(...arguments);
        this.forceStrength = core_1.Vec3.zero;
    }
    preStart() {
        // Set the force strength to apply
        this.forceStrength = core_1.Vec3.up.mul(100);
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnEntityEnterTrigger, this.onEntityEnterTrigger.bind(this));
    }
    start() {
        // Intentionally left blank
    }
    onEntityEnterTrigger(entity) {
        const physicalEntity = entity.as(core_1.PhysicalEntity);
        physicalEntity.applyForce(this.forceStrength, core_1.PhysicsForceMode.Force);
    }
}
core_1.Component.register(ApplyForce);
