"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class ForceRelease extends core_1.Component {
    preStart() {
        this.grabbable = this.entity.as(core_1.GrabbableEntity);
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabStart, this.onGrab.bind(this));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabEnd, this.onRelease.bind(this));
    }
    start() { }
    onGrab(isRightHand, player) {
        // This will force release the object from the player's hand
        this.grabbable?.forceRelease();
    }
    onRelease(player) {
        console.log('Released');
    }
}
core_1.Component.register(ForceRelease);
