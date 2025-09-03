"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class AimAssist extends core_1.Component {
    start() { }
    preStart() {
        this.target = this.props.target;
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabStart, this.onGrab.bind(this));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabEnd, this.onRelease.bind(this));
    }
    onGrab(isRightHand, player) {
        if (!this.target) {
            console.error('Target not set in properties');
            return;
        }
        player.setAimAssistTarget(this.target);
    }
    onRelease(player) {
        player.clearAimAssistTarget();
    }
}
AimAssist.propsDefinition = {
    target: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(AimAssist);
