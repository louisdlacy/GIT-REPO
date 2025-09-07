"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class ChangePlayerSpeed extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, this.onPlayerEnterTrigger.bind(this));
    }
    start() { }
    onPlayerEnterTrigger(player) {
        // Change the player's speed
        player.locomotionSpeed.set(10);
    }
}
core_1.Component.register(ChangePlayerSpeed);
