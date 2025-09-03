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
// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
class TurboWearable extends hz.Component {
    start() {
        this.seenPlayers = new Map();
        this.wearableKey = this.props.wearableKey ?? 'Wearable Key';
        this.wearableType = this.props.wearableType ?? 'Wearable Type';
        this.debugDisplay = this.props.debugDisplay?.as(hz.TextGizmo);
        this.sfxEquip = this.props.sfxEquip?.as(hz.AudioGizmo);
        this.sfxRelease = this.props.sfxRelease?.as(hz.AudioGizmo);
        this.isGrabToEquip = this.props.isGrabToEquip ?? false;
        // On Attach Event: WearableEquip
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnAttachStart, (player) => {
            this.onEquip(player);
        });
        // On Unattach Event: Wearable Release
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnAttachEnd, (player) => {
            this.onRelease(player);
        });
        // On Grab Event (if set in props): Wearable Equip
        if (this.isGrabToEquip === true) {
            this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabStart, (_isRightHand, player) => {
                this.onEquip(player);
            });
        }
        // Remove OnExitWorld
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (exitBy) => {
            this.removePlayer(exitBy);
        });
    }
    onEquip(player) {
        if (player === this.world.getServerPlayer()) {
            return;
        }
        (0, DemoNinjaCommon_1.playSFX)(this.sfxEquip);
        if (!this.seenPlayers.has(player.id)) {
            this.addPlayer(player);
        }
        else {
            this.updateSeenPlayerCount(player);
        }
        this.onChange();
        this.async.setTimeout(() => (0, TurboAnalytics_1.Analytics)()?.sendWearableEquip({
            player,
            wearableKey: this.wearableKey,
            wearableType: this.wearableType
        }));
    }
    onRelease(player) {
        if (player === this.world.getServerPlayer()) {
            return;
        }
        (0, DemoNinjaCommon_1.playSFX)(this.sfxRelease);
        this.onChange();
        this.async.setTimeout(() => (0, TurboAnalytics_1.Analytics)()?.sendWearableRelease({
            player,
            wearableKey: this.wearableKey,
            wearableType: this.wearableType
        }));
    }
    addPlayer(player) {
        if (!this.hasSeen(player)) {
            const playerName = (0, DemoNinjaCommon_1.getPlayerName)(player, this.world);
            const playerSeenProps = { playerName, numTimes: 1 };
            this.seenPlayers.set(player.id, playerSeenProps);
        }
    }
    removePlayer(player) {
        this.seenPlayers.delete(player.id);
    }
    getSeenPlayer(player) {
        return this.seenPlayers.get(player.id);
    }
    hasSeen(player) {
        return analytics_1.TurboDataService.getWearablesSeen(player)?.has(this.wearableKey) ?? false;
    }
    updateSeenPlayerCount(player) {
        const seenPlayer = this.getSeenPlayer(player);
        if (seenPlayer) {
            seenPlayer.numTimes++;
        }
    }
    showDebugDisplay() {
        const keyDisplay = (0, DemoNinjaCommon_1.wrapColor)('Key: ' + this.wearableKey + " (Type: " + this.wearableType + ")", DemoNinjaCommon_1.HTMLHelpers.Purple);
        let playerDisplayLocal = '';
        this.seenPlayers.forEach((seenPlayer) => {
            const { playerName, numTimes } = seenPlayer;
            const color = numTimes <= 1 ? DemoNinjaCommon_1.HTMLHelpers.Green : DemoNinjaCommon_1.HTMLHelpers.MetaLightBlue;
            playerDisplayLocal += (0, DemoNinjaCommon_1.wrapColor)(playerName + " " + (0, DemoNinjaCommon_1.wrapParens)(numTimes.toString()), color) + DemoNinjaCommon_1.HTMLHelpers.Break;
        });
        (0, DemoNinjaCommon_1.setText)(this.debugDisplay, keyDisplay + DemoNinjaCommon_1.HTMLHelpers.Break + 'Seen Players: ' + DemoNinjaCommon_1.HTMLHelpers.Break + playerDisplayLocal);
    }
    onChange() {
        this.showDebugDisplay();
    }
}
TurboWearable.propsDefinition = {
    wearableKey: { type: hz.PropTypes.String },
    wearableType: { type: hz.PropTypes.String },
    debugDisplay: { type: hz.PropTypes.Entity },
    sfxEquip: { type: hz.PropTypes.Entity },
    sfxRelease: { type: hz.PropTypes.Entity },
    isGrabToEquip: { type: hz.PropTypes.Boolean, default: false },
};
hz.Component.register(TurboWearable);
