"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class PlayerFinder extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, this.onPlayerEnterWorld.bind(this));
    }
    start() { }
    onPlayerEnterWorld(player) {
        const allPlayers = this.world.getPlayers();
        const playerNames = allPlayers.map(p => p.name.get());
        console.log(`Players in the world: ${playerNames.join(', ')}`);
    }
}
core_1.Component.register(PlayerFinder);
