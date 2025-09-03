"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class EulerToQuaternionRotation extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, this.onPlayerEnterWorld.bind(this));
    }
    start() { }
    onPlayerEnterWorld() {
        // Create quaternion
        const yRotation = core_1.Quaternion.fromEuler(new core_1.Vec3(0, 90, 0)); // 90 degrees around Y axis
        const currentRotation = this.entity.rotation.get();
        const newRotation = yRotation.mul(currentRotation);
        // Rotate 90 degrees around Y axis
        this.entity.rotation.set(newRotation);
    }
}
EulerToQuaternionRotation.propsDefinition = {
    entity: { type: core_1.PropTypes.Entity }
};
core_1.Component.register(EulerToQuaternionRotation);
