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
/* True if the Discovery Item is legit (not left blank/undefined etc.) */
function isLegitDiscoKey(x) {
    return !!x && x.trim() !== '';
}
// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
class TurboDiscoveryMade extends hz.Component {
    constructor() {
        super(...arguments);
        this.seenPlayers = new Map();
        this.discoKey = 'Ninja Discovery';
    }
    start() {
        this.discoKey = isLegitDiscoKey(this.props.discoKey) ? this.props.discoKey : 'Ninja Discovery';
        this.debugDisplay = this.props.debugDisplay?.as(hz.TextGizmo);
        this.sfx = this.props.sfx?.as(hz.AudioGizmo);
        this.trigger = this.props.trigger?.as(hz.TriggerGizmo);
        if (this.trigger !== undefined) {
            this.connectCodeBlockEvent(this.trigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
                this.onDiscoveryMade(player);
            });
        }
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabStart, (_isRightHand, player) => {
            this.onDiscoveryMade(player);
        });
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (exitBy) => {
            this.removePlayer(exitBy);
        });
    }
    /** Discovery Made by Player */
    onDiscoveryMade(player) {
        if (player === this.world.getServerPlayer()) {
            return;
        }
        ;
        (0, DemoNinjaCommon_1.playSFX)(this.sfx);
        if (!this.seenPlayers.has(player.id)) {
            this.addPlayer(player);
        }
        else {
            this.updateSeenPlayerCount(player);
        }
        this.showDebugDisplay();
        this.async.setTimeout(() => (0, TurboAnalytics_1.Analytics)()?.sendDiscoveryMade({
            player,
            discoveryItemKey: this.discoKey,
            discoveryIsImplied: false,
            discoveryNumTimes: 1,
            discoveryAmount: 1
        }));
    }
    addPlayer(player) {
        if (analytics_1.TurboDataService.getDiscoveryItemSeenCount(player, this.discoKey) == 0) {
            const playerName = (0, DemoNinjaCommon_1.getPlayerName)(player, this.world);
            this.seenPlayers.set(player.id, { playerName, numTimes: 1 });
        }
        else {
            this.updateSeenPlayerCount(player);
        }
    }
    removePlayer(player) {
        this.seenPlayers.delete(player.id);
    }
    showDebugDisplay() {
        const keyDisplay = (0, DemoNinjaCommon_1.wrapColor)(this.discoKey, DemoNinjaCommon_1.HTMLHelpers.MetaLightBlue);
        let playerDisplayLocal = '';
        this.seenPlayers.forEach((seenPlayer) => {
            const { playerName, numTimes } = seenPlayer;
            const color = numTimes <= 1 ? DemoNinjaCommon_1.HTMLHelpers.Green : DemoNinjaCommon_1.HTMLHelpers.MetaLightBlue;
            playerDisplayLocal += (0, DemoNinjaCommon_1.wrapColor)(playerName + " " + (0, DemoNinjaCommon_1.wrapParens)(numTimes.toString()), color) + DemoNinjaCommon_1.HTMLHelpers.Break;
        });
        if (this.debugDisplay !== undefined) {
            (0, DemoNinjaCommon_1.setText)(this.debugDisplay, keyDisplay + DemoNinjaCommon_1.HTMLHelpers.Break + 'Seen Players: ' + DemoNinjaCommon_1.HTMLHelpers.Break + playerDisplayLocal);
        }
    }
    updateSeenPlayerCount(player) {
        const seenPlayer = this.seenPlayers.get(player.id);
        if (seenPlayer) {
            seenPlayer.numTimes++;
        }
    }
}
TurboDiscoveryMade.propsDefinition = {
    discoKey: { type: hz.PropTypes.String },
    debugDisplay: { type: hz.PropTypes.Entity },
    sfx: { type: hz.PropTypes.Entity },
    trigger: { type: hz.PropTypes.Entity },
};
hz.Component.register(TurboDiscoveryMade);
