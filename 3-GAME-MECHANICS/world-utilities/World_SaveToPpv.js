"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class SaveToPpv extends core_1.Component {
    constructor() {
        super(...arguments);
        //Assumes you have a PPV group in your world called "Test" with a number variable called "count" 
        this.ppvName = "Test:count";
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, this.onPlayerEnterWorld.bind(this));
    }
    start() { }
    onPlayerEnterWorld(player) {
        // Get the count
        let count = this.world.persistentStorage.getPlayerVariable(player, this.ppvName);
        //Add 1 to the count
        count++;
        // Save the count
        this.world.persistentStorage.setPlayerVariable(player, this.ppvName, count);
        console.log(`Player ${player.name.get()} has count: ${count}`);
    }
}
core_1.Component.register(SaveToPpv);
