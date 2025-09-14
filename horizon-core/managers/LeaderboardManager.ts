import { Component, Player, CodeBlockEvent, PropTypes, NetworkEvent } from 'horizon/core';

/*
Leaderboard Manager Plug & Play © 2025 by GausRoth is licensed under Creative Commons Attribution 4.0 International.
To view a copy of this license, visit https://creativecommons.org/licenses/by/4.0/
*/

class LeaderboardManager extends Component<typeof LeaderboardManager> {
    static propsDefinition = {};

    preStart() {
        // CODEBLOCKS
        // coming from a Code Block script comment out or DELETE if using TypeScript

        // use if you want to override the players score
        this.connectCodeBlockEvent(this.entity, new CodeBlockEvent<[leaderboardName: string, p: Player, score: number]>('SetLBWithOverride', [PropTypes.String, PropTypes.Player, PropTypes.Number]), (leaderboardName: string, p: Player, score: number) => this.SetLBWithOverride(leaderboardName, p, score));

        // use if you do not want to override the players score
        this.connectCodeBlockEvent(this.entity, new CodeBlockEvent<[leaderboardName: string, p: Player, score: number]>('SetLBWithoutOverride', [PropTypes.String, PropTypes.Player, PropTypes.Number]), (leaderboardName, p, score) => this.SetLBWithoutOverride(leaderboardName, p, score));

        // TYPESCRIPT
        // coming from a TypeScript comment out or DELETE if using Code Blocks
        this.connectNetworkEvent(this.entity, new NetworkEvent<{ leaderboardName: string, p: Player, score: number, override: boolean }>('SetLeaderboard'), ({ leaderboardName, p, score, override }) => this.SetLeaderboard(leaderboardName, p, score, override));
    }

    start() { }

    // called from a TypeScript script. requires the leaderboards name (string), the player the score is for (Player), the value of the score (number) and if the score should be overridden (bool)
    SetLeaderboard(leaderboardName: string, p: Player, score: number, override: boolean) {
        console.log("SetLeaderboard")
        this.world.leaderboards.setScoreForPlayer(leaderboardName, p, score, override);
    }

    // called from a CodeBlock script. requires the leaderboards name (string), the player the score is for (Player) and the value of the score (number)
    // NOTE: this will NOT override the players score
    SetLBWithoutOverride(leaderboardName: string, p: Player, score: number) {
        console.log("SetLBWithoutOverride")
        this.world.leaderboards.setScoreForPlayer(leaderboardName, p, score, false);
    }

    // called from a CodeBlock script. requires the leaderboards name (string), the player the score is for (Player) and the value of the score (number)
    // NOTE: this WILL override the players score
    SetLBWithOverride(leaderboardName: string, p: Player, score: number) {
        console.log("SetLBWithOverride")
        this.world.leaderboards.setScoreForPlayer(leaderboardName, p, score, true);
    }
}
Component.register(LeaderboardManager);