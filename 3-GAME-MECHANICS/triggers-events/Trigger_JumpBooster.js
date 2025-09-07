"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
// Custom player movement must be enabled in world settings in the editor.
class JumpBooster extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, this.boostPlayer.bind(this));
    }
    start() { }
    boostPlayer(player) {
        const jumpForce = core_1.Vec3.up.mul(100);
        player.velocity.set(jumpForce);
    }
}
core_1.Component.register(JumpBooster);
