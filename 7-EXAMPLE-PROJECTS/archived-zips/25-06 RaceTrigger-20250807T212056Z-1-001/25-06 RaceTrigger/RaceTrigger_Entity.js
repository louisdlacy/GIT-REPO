"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const timeStampMapMs = new Map();
let worldStartTimeMs = 0;
class RaceTrigger_Entity extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, (player) => { this.playerEnterTrigger(player); });
    }
    start() {
        worldStartTimeMs = Date.now();
    }
    playerEnterTrigger(player) {
        if (this.props.isStart) {
            timeStampMapMs.set(player, Date.now());
        }
        else {
            const elapsedMs = Date.now() - (timeStampMapMs.get(player) ?? worldStartTimeMs);
            this.world.leaderboards.setScoreForPlayer(this.props.leaderboardName, player, (elapsedMs / 1000), false);
        }
    }
}
RaceTrigger_Entity.propsDefinition = {
    isStart: { type: core_1.PropTypes.Boolean, default: true },
    leaderboardName: { type: core_1.PropTypes.String, default: 'LeaderboardName' },
};
core_1.Component.register(RaceTrigger_Entity);
