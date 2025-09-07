"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class PlaySoundAtPosition extends core_1.Component {
    preStart() {
        this.sound = this.props.sound?.as(core_1.AudioGizmo);
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabStart, this.onGrab.bind(this));
    }
    start() { }
    onGrab(isRightHand, player) {
        this.sound?.position.set(this.entity.position.get());
        this.sound?.play();
    }
}
PlaySoundAtPosition.propsDefinition = {
    sound: { type: core_1.PropTypes.Entity }
};
core_1.Component.register(PlaySoundAtPosition);
