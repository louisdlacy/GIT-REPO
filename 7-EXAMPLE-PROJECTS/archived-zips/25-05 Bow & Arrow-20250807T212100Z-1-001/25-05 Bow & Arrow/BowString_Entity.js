"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class BowString_Entity extends core_1.Component {
    preStart() {
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, (payload) => { this.onUpdate(payload.deltaTime); });
        if (this.props.grabbableReference) {
            this.connectCodeBlockEvent(this.props.grabbableReference, core_1.CodeBlockEvents.OnGrabStart, (isRightHand, player) => { this.grabStart(player, isRightHand); });
        }
    }
    start() {
    }
    grabStart(player, isRightHand) {
        this.props.bowReference?.owner.set(player);
        this.entity.owner.set(player);
    }
    onUpdate(deltaTime) {
        if (this.props.grabbableReference && this.props.bowReference) {
            const grabRefPos = this.props.grabbableReference.position.get();
            const bowRefPos = this.props.bowReference.position.get();
            this.entity.position.set(core_1.Vec3.lerp(grabRefPos, bowRefPos, 0.5));
            this.entity.rotation.set(core_1.Quaternion.lookRotation(grabRefPos.sub(bowRefPos), core_1.Vec3.up).mul(core_1.Quaternion.fromEuler(new core_1.Vec3(0, 90, 0))));
            this.entity.scale.set(new core_1.Vec3(grabRefPos.distance(bowRefPos), this.props.diameter, this.props.diameter));
        }
    }
}
BowString_Entity.propsDefinition = {
    bowReference: { type: core_1.PropTypes.Entity },
    grabbableReference: { type: core_1.PropTypes.Entity },
    diameter: { type: core_1.PropTypes.Number, default: 0.02 },
};
core_1.Component.register(BowString_Entity);
