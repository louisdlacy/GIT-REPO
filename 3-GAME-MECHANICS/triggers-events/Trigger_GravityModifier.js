"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class GravityModifier extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, this.modifyGravity.bind(this));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitTrigger, this.resetGravity.bind(this));
    }
    start() { }
    modifyGravity(player) {
        player.gravity.set(2);
    }
    resetGravity(player) {
        player.gravity.set(9.81);
    }
}
core_1.Component.register(GravityModifier);
