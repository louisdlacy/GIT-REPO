"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
// This only affects web and mobile.
class PoseOverride extends core_1.Component {
    start() { }
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabStart, this.onGrab.bind(this));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabEnd, this.onRelease.bind(this));
    }
    onGrab(isRightHand, player) {
        player.setAvatarGripPoseOverride(core_1.AvatarGripPose.Sword);
    }
    onRelease(player) {
        player.clearAvatarGripPoseOverride();
    }
}
core_1.Component.register(PoseOverride);
