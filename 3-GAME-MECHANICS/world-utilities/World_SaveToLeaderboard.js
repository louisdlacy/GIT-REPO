"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class SaveToLeaderboard extends core_1.Component {
    constructor() {
        super(...arguments);
        //Assumes you have a PPV group in your world called "Test" with a number variable called "score" 
        this.ppvName = "Test:score";
        //Assumes you have a leaderboard called "TotalScore"
        this.leaderboardName = "TotalScore";
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, this.onPlayerEnterWorld.bind(this));
    }
    start() { }
    onPlayerEnterWorld(player) {
        // Get the player's score
        let score = this.world.persistentStorage.getPlayerVariable(player, this.ppvName);
        //Add 1 to the score
        score++;
        // Save the player's score
        this.world.persistentStorage.setPlayerVariable(player, this.ppvName, score);
        //Save to leaderboard
        this.world.leaderboards.setScoreForPlayer(this.leaderboardName, player, score, false);
    }
}
core_1.Component.register(SaveToLeaderboard);
