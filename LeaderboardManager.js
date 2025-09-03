"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
/*
Leaderboard Manager Plug & Play © 2025 by GausRoth is licensed under Creative Commons Attribution 4.0 International.
To view a copy of this license, visit https://creativecommons.org/licenses/by/4.0/
*/
class LeaderboardManager extends core_1.Component {
    preStart() {
        // CODEBLOCKS
        // coming from a Code Block script comment out or DELETE if using TypeScript
        // use if you want to override the players score
        this.connectCodeBlockEvent(this.entity, new core_1.CodeBlockEvent('SetLBWithOverride', [core_1.PropTypes.String, core_1.PropTypes.Player, core_1.PropTypes.Number]), (leaderboardName, p, score) => this.SetLBWithOverride(leaderboardName, p, score));
        // use if you do not want to override the players score
        this.connectCodeBlockEvent(this.entity, new core_1.CodeBlockEvent('SetLBWithoutOverride', [core_1.PropTypes.String, core_1.PropTypes.Player, core_1.PropTypes.Number]), (leaderboardName, p, score) => this.SetLBWithoutOverride(leaderboardName, p, score));
        // TYPESCRIPT
        // coming from a TypeScript comment out or DELETE if using Code Blocks
        this.connectNetworkEvent(this.entity, new core_1.NetworkEvent('SetLeaderboard'), ({ leaderboardName, p, score, override }) => this.SetLeaderboard(leaderboardName, p, score, override));
    }
    start() { }
    // called from a TypeScript script. requires the leaderboards name (string), the player the score is for (Player), the value of the score (number) and if the score should be overridden (bool)
    SetLeaderboard(leaderboardName, p, score, override) {
        console.log("SetLeaderboard");
        this.world.leaderboards.setScoreForPlayer(leaderboardName, p, score, override);
    }
    // called from a CodeBlock script. requires the leaderboards name (string), the player the score is for (Player) and the value of the score (number)
    // NOTE: this will NOT override the players score
    SetLBWithoutOverride(leaderboardName, p, score) {
        console.log("SetLBWithoutOverride");
        this.world.leaderboards.setScoreForPlayer(leaderboardName, p, score, false);
    }
    // called from a CodeBlock script. requires the leaderboards name (string), the player the score is for (Player) and the value of the score (number)
    // NOTE: this WILL override the players score
    SetLBWithOverride(leaderboardName, p, score) {
        console.log("SetLBWithOverride");
        this.world.leaderboards.setScoreForPlayer(leaderboardName, p, score, true);
    }
}
LeaderboardManager.propsDefinition = {};
core_1.Component.register(LeaderboardManager);
