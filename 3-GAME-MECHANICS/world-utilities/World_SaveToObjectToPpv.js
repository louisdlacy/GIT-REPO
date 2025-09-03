"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class SaveToObjectToPpv extends core_1.Component {
    constructor() {
        super(...arguments);
        //Assumes you have a PPV group in your world called "Test" with an object variable called "data" 
        this.ppvName = "Test:data";
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, this.onPlayerEnterWorld.bind(this));
    }
    start() { }
    onPlayerEnterWorld(player) {
        // Get the data
        let data = this.world.persistentStorage.getPlayerVariable(player, this.ppvName);
        if (!data) {
            console.log("No data found, creating new data");
            data = {
                playerName: player.name.get(),
                count: 0
            };
        }
        //Add 1 to the count
        data.count++;
        // Save the data
        this.world.persistentStorage.setPlayerVariable(player, this.ppvName, data);
        console.log(`Player ${data.playerName} has count: ${data.count}`);
    }
}
core_1.Component.register(SaveToObjectToPpv);
