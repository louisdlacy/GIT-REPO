"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class PlayerEnterWorld extends core_1.Component {
    preStart() {
        // Listen for players entering the world
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, this.onPlayerEnter.bind(this));
        // Listen for players leaving the world
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitWorld, this.onPlayerExit.bind(this));
    }
    start() { }
    onPlayerEnter(player) {
        console.log(`${player.name.get()} has entered the world.`);
    }
    onPlayerExit(player) {
        console.log(`${player.name.get()} has left the world.`);
    }
}
core_1.Component.register(PlayerEnterWorld);
