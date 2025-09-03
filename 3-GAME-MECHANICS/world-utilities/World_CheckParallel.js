"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class CheckParallel extends core_1.Component {
    preStart() {
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, this.onUpdate.bind(this));
    }
    start() { }
    onUpdate() {
        // Dot product (scalar)
        const dot = this.entity.up.get().dot(core_1.Vec3.up);
        if (dot === 0) {
            console.log("Entity Up is perpendicular with World Up");
        }
        else if (dot === 1) {
            console.log("Entity Up is parallel with World Up");
        }
        else if (dot === -1) {
            console.log("Entity Up is parallel with World Down");
        }
    }
}
CheckParallel.propsDefinition = {
    entity: { type: core_1.PropTypes.Entity }
};
core_1.Component.register(CheckParallel);
