"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class PlayerEnterTrigger extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, this.onPlayerEnter.bind(this));
    }
    start() { }
    onPlayerEnter(player) {
        console.log(`${player.name.get()} entered the trigger`);
    }
}
core_1.Component.register(PlayerEnterTrigger);
