"use strict";
/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * @format
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
const hz = __importStar(require("horizon/core"));
const analytics_1 = require("horizon/analytics");
const TurboAnalytics_1 = require("TurboAnalytics");
const DemoNinjaCommon_1 = require("DemoNinjaCommon");
// Turbo Rocket Fuel Ninja Quests
var NinjaQuests;
(function (NinjaQuests) {
    NinjaQuests["DISCOVERY_MADE"] = "turbo_discovery";
    NinjaQuests["FRICTION_HIT"] = "turbo_friction";
    NinjaQuests["LOBBY"] = "turbo_lobby";
    NinjaQuests["TASKS"] = "turbo_tasks";
    NinjaQuests["WEARABLE"] = "turbo_wearable";
})(NinjaQuests || (NinjaQuests = {}));
const analyticsLabels = new Map([
    [NinjaQuests.DISCOVERY_MADE, 'Discovery Made'],
    [NinjaQuests.FRICTION_HIT, 'Friction Hit'],
    [NinjaQuests.LOBBY, 'Lobby'],
    [NinjaQuests.TASKS, 'Tasks'],
    [NinjaQuests.WEARABLE, 'Wearable'],
]);
// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
class NinjaQuestsManager extends hz.Component {
    start() {
        this.connectLocalBroadcastEvent(analytics_1.TurboDebug.events.onDebugTurboPlayerEvent, (data) => {
            const action = data.action;
            if (action === undefined) {
                return;
            }
            ;
            const player = data.player;
            this.checkQuests(player, action, { player, ...data.eventData });
        });
    }
    checkQuests(player, action, payload) {
        if (!payload) {
            return;
        }
        switch (action) {
            case analytics_1.Action.ACHIEVEMENT_UNLOCKED:
                this.sendQuestComplete(player, NinjaQuests.TASKS);
                break;
            case analytics_1.Action.AREA_ENTER:
                const areaData = payload;
                if (areaData.actionAreaIsLobbySection === true && areaData.actionArea === "Lobby") {
                    this.sendQuestComplete(player, NinjaQuests.LOBBY);
                }
                break;
            case analytics_1.Action.DISCOVERY_MADE:
                this.sendQuestComplete(player, NinjaQuests.DISCOVERY_MADE);
                break;
            case analytics_1.Action.FRICTION_HIT:
                this.sendQuestComplete(player, NinjaQuests.FRICTION_HIT);
                break;
            case analytics_1.Action.TASK_START:
                this.sendQuestComplete(player, NinjaQuests.TASKS);
                break;
            case analytics_1.Action.WEARABLE_EQUIP:
                this.sendQuestComplete(player, NinjaQuests.WEARABLE);
                break;
        }
    }
    sendQuestComplete(player, ninjaQuestId) {
        const questKey = ninjaQuestId.toString();
        // Skip if player already logged the quest in Turbo
        if (analytics_1.TurboDataService.getQuestsUnlocked(player).includes(questKey)) {
            return;
        }
        ;
        // HzW Quests
        player.setAchievementComplete(questKey, true);
        // 🚀 Turbo Analytics: Lookup the analytics label for the quest for cleaner Analytics
        const analyticsLabel = analyticsLabels.get(ninjaQuestId);
        (0, TurboAnalytics_1.Analytics)()?.sendQuestCompleted({ player, achievementKey: analyticsLabel }, true);
    }
}
hz.Component.register(NinjaQuestsManager);
/* True if the Rewards Type is legit (not left blank/undefined etc.) */
function isLegitRewardsType(x) {
    return !!x && x.trim() !== '';
}
// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
class TurboRewardsEarned extends hz.Component {
    constructor() {
        super(...arguments);
        this.seenPlayers = new Map();
    }
    start() {
        this.rewardsType = isLegitRewardsType(this.props.rewardsType) ? this.props.rewardsType : 'Ninja Coin';
        this.rewardsEarned = this.props.rewardsEarned ?? 1;
        this.debugDisplay = this.props.debugDisplay?.as(hz.TextGizmo);
        this.sfx = this.props.sfx?.as(hz.AudioGizmo);
        this.trigger = this.props.trigger?.as(hz.TriggerGizmo);
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabStart, (_isRightHand, player) => {
            this.onRewardsEarned(player);
        });
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (exitBy) => {
            this.removePlayer(exitBy);
        });
    }
    onRewardsEarned(player) {
        if (player === this.world.getServerPlayer()) {
            return;
        }
        ;
        (0, DemoNinjaCommon_1.playSFX)(this.sfx);
        if (!this.seenPlayers.has(player)) {
            this.addPlayer(player);
        }
        else {
            this.updatePlayerRewards(player);
        }
        this.async.setTimeout(() => (0, TurboAnalytics_1.Analytics)()?.sendRewardsEarned({
            player,
            rewardsType: this.rewardsType,
            rewardsEarned: this.rewardsEarned
        }));
        this.showDebugDisplay(player);
    }
    addPlayer(player) {
        if (!analytics_1.TurboDataService.getRewardsSeenKeys(player).includes(this.rewardsType)) {
            const playerName = (0, DemoNinjaCommon_1.getPlayerName)(player, this.world);
            this.seenPlayers.set(player, { playerName, rewardsEarned: this.rewardsEarned });
        }
        else {
            this.updatePlayerRewards(player);
        }
    }
    removePlayer(player) {
        this.seenPlayers.delete(player);
    }
    showDebugDisplay(player) {
        const keyDisplay = (0, DemoNinjaCommon_1.wrapColor)(this.rewardsType, DemoNinjaCommon_1.HTMLHelpers.MetaLightBlue);
        let playerDisplayLocal = '';
        this.seenPlayers.forEach((seenPlayer) => {
            const rewardsAmount = analytics_1.TurboDataService.getRewardsEarnedByType(player)?.get(this.rewardsType) || this.rewardsEarned;
            const { playerName } = seenPlayer;
            const color = rewardsAmount <= 1 ? DemoNinjaCommon_1.HTMLHelpers.Green : DemoNinjaCommon_1.HTMLHelpers.MetaLightBlue;
            playerDisplayLocal += (0, DemoNinjaCommon_1.wrapColor)(playerName + " " + (0, DemoNinjaCommon_1.wrapParens)(rewardsAmount.toString()), color) + DemoNinjaCommon_1.HTMLHelpers.Break;
        });
        if (this.debugDisplay !== undefined) {
            (0, DemoNinjaCommon_1.setText)(this.debugDisplay, keyDisplay + DemoNinjaCommon_1.HTMLHelpers.Break + 'Seen Players: ' + DemoNinjaCommon_1.HTMLHelpers.Break + playerDisplayLocal);
        }
    }
    updatePlayerRewards(player) {
        const seenPlayer = this.seenPlayers.get(player);
        if (seenPlayer !== undefined) {
            const currentRewards = seenPlayer.rewardsEarned || 0;
            const rewardsEarned = currentRewards + this.rewardsEarned;
            this.seenPlayers.set(player, { playerName: seenPlayer.playerName, rewardsEarned: rewardsEarned });
        }
    }
}
TurboRewardsEarned.propsDefinition = {
    rewardsType: { type: hz.PropTypes.String },
    rewardsEarned: { type: hz.PropTypes.Number, default: 1 },
    debugDisplay: { type: hz.PropTypes.Entity },
    sfx: { type: hz.PropTypes.Entity },
    trigger: { type: hz.PropTypes.Entity },
};
hz.Component.register(TurboRewardsEarned);
