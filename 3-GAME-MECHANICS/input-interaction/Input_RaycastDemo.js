"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class RaycastDemo extends core_1.Component {
    preStart() {
        this.ray = this.props.ray?.as(core_1.RaycastGizmo);
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnIndexTriggerDown, this.onIndexTriggerDown.bind(this));
    }
    start() {
        // Intentionally left blank
    }
    onIndexTriggerDown() {
        const origin = this.entity.position.get();
        const direction = new core_1.Vec3(0, 0, 1).normalize();
        const rayData = this.ray?.raycast(origin, direction, { layerType: core_1.LayerType.Objects, maxDistance: 100 });
        if (rayData) {
            if (rayData.targetType === core_1.RaycastTargetType.Entity) {
                console.log(`Hit ${rayData.target.name} at distance ${rayData.distance}`);
            }
            else if (rayData.targetType === core_1.RaycastTargetType.Static) {
                console.log(`Hit static object at distance ${rayData.distance}`);
            }
        }
        else {
            console.log("No hit detected");
        }
    }
}
RaycastDemo.propsDefinition = {
    ray: { type: core_1.PropTypes.Entity }
};
core_1.Component.register(RaycastDemo);
