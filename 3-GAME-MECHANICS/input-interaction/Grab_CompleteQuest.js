"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class CompleteQuest extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabStart, this.onGrab.bind(this));
    }
    onGrab(isRightHand, player) {
        //Asuming you have a quest called "MyQuest"
        player.setAchievementComplete("MyQuest", true);
    }
    start() { }
}
core_1.Component.register(CompleteQuest);
