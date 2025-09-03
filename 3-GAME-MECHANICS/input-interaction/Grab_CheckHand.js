"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class CheckHand extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabStart, this.onGrab.bind(this));
    }
    start() { }
    onGrab(isRightHand, player) {
        if (isRightHand) {
            console.log('Right hand grabbed');
        }
        else {
            console.log('Left hand grabbed');
        }
    }
}
core_1.Component.register(CheckHand);
