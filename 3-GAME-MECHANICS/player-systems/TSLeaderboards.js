"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
/*
YouTube Tutorial:
https://youtu.be/2bH_ypYp3R0

GitHub:
https://github.com/Gausroth/HorizonWorldsTutorials

Documentaion:
https://developers.meta.com/horizon-worlds/learn/documentation/code-blocks-and-gizmos/world-leaderboard-gizmo
https://developers.meta.com/horizon-worlds/learn/documentation/desktop-editor/quests-leaderboards-and-variable-groups/leaderboard-reset-frequency
https://developers.meta.com/horizon-worlds/reference/2.0.0/core_ileaderboards
https://developers.meta.com/horizon-worlds/learn/documentation/mhcp-program/community-tutorials/creator-manual#leaderboards
*/
class TSLeaderboards extends core_1.Component {
    preStart() {
        // coming from a Code Block script comment out or DELETE if using TypeScript
        this.connectCodeBlockEvent(this.entity, new core_1.CodeBlockEvent('SetLeaderboard', [core_1.PropTypes.String, core_1.PropTypes.Player, core_1.PropTypes.Number, core_1.PropTypes.Boolean]), (leaderboardName, p, score, override) => this.setLeaderboard(leaderboardName, p, score, override));
        // coming from a TypeScript comment out or DELETE if using Code Blocks
        this.connectNetworkEvent(this.entity, new core_1.NetworkEvent('SetLeaderboard'), ({ leaderboardName, p, score, override }) => this.setLeaderboard(leaderboardName, p, score, override));
    }
    start() { }
    setLeaderboard(leaderboardName, p, score, override) {
        this.world.leaderboards.setScoreForPlayer(leaderboardName, p, score, override);
    }
}
TSLeaderboards.propsDefinition = {};
core_1.Component.register(TSLeaderboards);
