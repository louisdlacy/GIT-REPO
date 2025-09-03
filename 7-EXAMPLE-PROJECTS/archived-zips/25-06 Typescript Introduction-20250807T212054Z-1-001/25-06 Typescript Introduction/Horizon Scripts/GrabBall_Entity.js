"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class GrabBall_Entity extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabStart, (isRightHand, player) => { this.grabStart(isRightHand, player); });
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabEnd, (player) => { this.grabEnd(player); });
    }
    start() {
    }
    grabStart(isRightHand, player) {
        const fxPos = this.entity.position.get();
        this.props.sfx?.position.set(fxPos);
        this.props.vfx?.position.set(fxPos);
        this.async.setTimeout(() => {
            this.props.sfx?.as(core_1.AudioGizmo).play();
            this.props.vfx?.as(core_1.ParticleGizmo).play();
        }, 100);
        if (isRightHand) {
            player.rightHand.playHaptics(350, core_1.HapticStrength.Medium, core_1.HapticSharpness.Soft);
        }
        else {
            player.leftHand.playHaptics(350, core_1.HapticStrength.Medium, core_1.HapticSharpness.Soft);
        }
    }
    grabEnd(player) {
        //Return
    }
}
GrabBall_Entity.propsDefinition = {
    sfx: { type: core_1.PropTypes.Entity },
    vfx: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(GrabBall_Entity);
