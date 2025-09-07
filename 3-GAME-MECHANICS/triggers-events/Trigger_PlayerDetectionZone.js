"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class PlayerDetectionZone extends core_1.Component {
    constructor() {
        super(...arguments);
        this.playersInZone = [];
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, this.onPlayerEnter.bind(this));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitTrigger, this.onPlayerExit.bind(this));
    }
    start() {
        // Intentionally left blank
    }
    onPlayerEnter(player) {
        this.playersInZone.push(player);
        console.log(`Players in zone: ${this.playersInZone.length}`);
    }
    onPlayerExit(player) {
        this.playersInZone = this.playersInZone.filter(p => p.id !== player.id);
        console.log(`Players in zone: ${this.playersInZone.length}`);
    }
}
core_1.Component.register(PlayerDetectionZone);
