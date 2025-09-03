"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
// This must be used on an entity with Physics or Both (Grab & Physics)
class SpringPhysics extends core_1.Component {
    preStart() {
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, this.update.bind(this));
    }
    start() { }
    update(data) {
        // Always tries to move back to (0,0,0) when pushed with physics
        this.physicalEntity?.springPushTowardPosition(core_1.Vec3.zero);
        // Always tries to rotate back to (0,0,0) when pushed with physics
        this.physicalEntity?.springSpinTowardRotation(core_1.Quaternion.zero);
    }
}
core_1.Component.register(SpringPhysics);
