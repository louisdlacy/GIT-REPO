"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class CloseInstance extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, this.OnPlayerEnterTrigger.bind(this));
    }
    OnPlayerEnterTrigger() {
        // This will lock the instance and not allow any new players to join
        this.world.matchmaking.allowPlayerJoin(false);
    }
    start() { }
}
core_1.Component.register(CloseInstance);
