"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class BouncePad_Entity extends core_1.Component {
    preStart() {
        if (this.props.trigger) {
            this.connectCodeBlockEvent(this.props.trigger, core_1.CodeBlockEvents.OnPlayerEnterTrigger, (player) => { this.playerEnterTrigger(player); });
        }
    }
    start() {
    }
    playerEnterTrigger(player) {
        const direction = (core_1.Vec3.lerp(this.entity.up.get(), player.torso.forward.get(), 0.5)).normalize();
        player.velocity.set(direction.mul(this.props.bounceVelocityMultiplier));
    }
}
BouncePad_Entity.propsDefinition = {
    trigger: { type: core_1.PropTypes.Entity },
    bounceVelocityMultiplier: { type: core_1.PropTypes.Number, default: 10 },
    isUsingPlayerForward: { type: core_1.PropTypes.Boolean, default: false },
};
core_1.Component.register(BouncePad_Entity);
