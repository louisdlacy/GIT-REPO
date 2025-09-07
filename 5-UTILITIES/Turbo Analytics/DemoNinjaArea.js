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
const DemoNinjaCommon_1 = require("DemoNinjaCommon");
const TurboAnalytics_1 = require("TurboAnalytics");
/* True if the Area Key is legit (not left blank/undefined etc.) */
function isLegitArea(x) {
    return !!x && x.trim() !== '';
}
// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
class DemoTurboArea extends hz.Component {
    constructor() {
        super(...arguments);
        this.isRunning = false;
        this.seenPlayers = new Map();
    }
    cacheProps() {
        this.areaResolved = isLegitArea(this.props.area) ? this.props.area : 'UNKNOWN';
        this.isLobby = this.props.isLobby ?? true;
        this.isPlayerReady = this.props.isPlayerReady ?? false;
        this.isInRound = this.props.isInRound ?? false;
        this.seenPlayers.clear();
        this.displayTxtObj = this.props.displayTxtObj?.as(hz.TextGizmo);
        this.enterSFX = this.props.enterSFX?.as(hz.AudioGizmo);
        this.exitSFX = this.props.exitSFX?.as(hz.AudioGizmo);
    }
    start() {
        this.cacheProps();
        this.displayTxtObj?.visible.set(true);
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (enterBy) => {
            this.onAreaEnter(enterBy);
        });
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, (exitedBy) => {
            this.onAreaExit(exitedBy);
        });
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (exitBy) => {
            this.removePlayer(exitBy);
        });
        this.async.setTimeout(() => {
            this.async.setInterval(() => {
                this.showDemoDisplay();
            }, 1000);
        }, 1000);
    }
    onAreaEnter(player) {
        this.isRunning = true;
        this.addPlayer(player);
        (0, DemoNinjaCommon_1.playSFX)(this.enterSFX);
        (0, TurboAnalytics_1.Analytics)()?.sendAreaEnter({
            player,
            actionArea: this.areaResolved,
            actionAreaIsLobbySection: this.isLobby,
            actionAreaIsPlayerReadyZone: this.isPlayerReady,
            turboState: this.isInRound ? analytics_1.ParticipationEnum.IN_ROUND : undefined // Force In Round on Enter
        });
    }
    onAreaExit(player) {
        this.isRunning = false;
        (0, DemoNinjaCommon_1.playSFX)(this.exitSFX);
        (0, TurboAnalytics_1.Analytics)()?.sendAreaExit({
            player,
            actionArea: this.areaResolved,
            actionAreaIsLobbySection: this.isLobby,
            actionAreaIsPlayerReadyZone: this.isPlayerReady
        });
    }
    addPlayer(player) {
        if (!this.hasSeen(player)) {
            const playerName = this.getPlayerName(player);
            const playerSeenProps = { playerName, numTimes: 1 };
            this.seenPlayers.set(player, playerSeenProps);
        }
        else {
            this.updateSeenPlayerCount(player);
        }
    }
    getPlayerName(player) {
        return player.name.get();
    }
    getSeenPlayer(player) {
        return this.seenPlayers.get(player);
    }
    hasSeen(player) {
        return this.seenPlayers.has(player);
    }
    removePlayer(player) {
        this.seenPlayers.delete(player);
    }
    showDemoDisplay() {
        const keyDisplay = (0, DemoNinjaCommon_1.wrapColor)("Turbo Area: " + this.areaResolved, DemoNinjaCommon_1.HTMLHelpers.MetaLightBlue);
        let playerDisplayLocal = '';
        this.seenPlayers.forEach((seenData, player) => {
            const { playerName, numTimes } = seenData;
            const color = numTimes <= 1 ? DemoNinjaCommon_1.HTMLHelpers.Green : DemoNinjaCommon_1.HTMLHelpers.MetaLightBlue;
            playerDisplayLocal += (0, DemoNinjaCommon_1.wrapColor)(playerName + " - # Visits: " + (0, DemoNinjaCommon_1.wrapParens)(numTimes.toString()), color) + DemoNinjaCommon_1.HTMLHelpers.Break;
            if (analytics_1.Turbo.isReady()) {
                const timerKey = this.areaResolved;
                const sessionSeconds = 1.0 * analytics_1.TurboDataService.getAreaSessionSeconds(player, timerKey);
                const latestSeconds = 1.0 * analytics_1.TurboDataService.getAreaLatestIntervalSeconds(player, timerKey);
                playerDisplayLocal += (0, DemoNinjaCommon_1.getTimerDisplay)(timerKey, sessionSeconds, latestSeconds, false, this.isRunning) + DemoNinjaCommon_1.HTMLHelpers.Break;
                playerDisplayLocal = playerDisplayLocal.replace("(S:)", "Session - ").replace("(C:)", "Latest - ");
            }
        });
        if (this.seenPlayers.size > 0) {
            (0, DemoNinjaCommon_1.setText)(this.displayTxtObj, keyDisplay + DemoNinjaCommon_1.HTMLHelpers.Break + 'Seen Players:' + DemoNinjaCommon_1.HTMLHelpers.Break + playerDisplayLocal);
        }
        else {
            (0, DemoNinjaCommon_1.setText)(this.displayTxtObj, keyDisplay + DemoNinjaCommon_1.HTMLHelpers.Break + (0, DemoNinjaCommon_1.wrapColor)('Seen Players:' + DemoNinjaCommon_1.HTMLHelpers.Break + "None", DemoNinjaCommon_1.HTMLHelpers.Gray));
        }
    }
    updateSeenPlayerCount(player) {
        const seenPlayer = this.getSeenPlayer(player);
        if (seenPlayer) {
            seenPlayer.numTimes++;
        }
    }
}
DemoTurboArea.propsDefinition = {
    area: { type: hz.PropTypes.String },
    isLobby: { type: hz.PropTypes.Boolean, default: true },
    isPlayerReady: { type: hz.PropTypes.Boolean, default: false },
    isInRound: { type: hz.PropTypes.Boolean, default: false },
    displayTxtObj: { type: hz.PropTypes.Entity },
    enterSFX: { type: hz.PropTypes.Entity },
    exitSFX: { type: hz.PropTypes.Entity },
};
hz.Component.register(DemoTurboArea);
