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
/* True if the string is legit */
function isLegit(x) {
    return !!x && x.trim() !== '';
}
/* Turbo Friction Hit + Demo Turbo Options */
// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
class TurboFrictionHit extends hz.Component {
    constructor() {
        super(...arguments);
        this.FRICTION_COLOR_HTML = DemoNinjaCommon_1.HTMLHelpers.Orange;
        this.seenPlayers = new Map();
    }
    start() {
        this.frictionItemKey = isLegit(this.props.frictionItemKey) ? this.props.frictionItemKey : 'No Friction Key';
        this.trigger = this.props.trigger?.as(hz.TriggerGizmo);
        this.debugDisplay = this.props.debugDisplay?.as(hz.TextGizmo);
        this.sfx = this.props.sfx?.as(hz.AudioGizmo);
        if (this.trigger !== undefined) {
            this.connectCodeBlockEvent(this.trigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
                this.onFrictionHit(player);
            });
        }
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (exitBy) => {
            this.removePlayer(exitBy);
        });
    }
    onChange() {
        analytics_1.Turbo.getConfigs().debug && this.showDebugDisplay();
    }
    addPlayer(player) {
        if (!this.hasSeen(player)) {
            const playerName = (0, DemoNinjaCommon_1.getPlayerName)(player, this.world);
            const playerSeenProps = { playerName, numTimes: 1 };
            this.seenPlayers.set(player.id, playerSeenProps);
        }
        else {
            this.updateSeenPlayerCount(player);
        }
    }
    removePlayer(player) {
        this.seenPlayers.delete(player.id);
    }
    getSeenPlayer(player) {
        return this.seenPlayers.get(player.id);
    }
    hasSeen(player) {
        return this.seenPlayers.has(player.id);
    }
    updateSeenPlayerCount(player) {
        const seenPlayer = this.getSeenPlayer(player);
        if (seenPlayer) {
            seenPlayer.numTimes++;
        }
    }
    showDebugDisplay() {
        const keyDisplay = (0, DemoNinjaCommon_1.wrapColor)(this.props.frictionItemKey, this.FRICTION_COLOR_HTML);
        let playerDisplayLocal = '';
        this.seenPlayers.forEach((seenPlayer) => {
            const { playerName, numTimes } = seenPlayer;
            const color = numTimes <= 1 ? DemoNinjaCommon_1.HTMLHelpers.Green : this.FRICTION_COLOR_HTML;
            playerDisplayLocal += (0, DemoNinjaCommon_1.wrapColor)(playerName + " " + (0, DemoNinjaCommon_1.wrapParens)(numTimes.toString()), color) + DemoNinjaCommon_1.HTMLHelpers.Break;
        });
        if (this.debugDisplay != null) {
            (0, DemoNinjaCommon_1.setText)(this.debugDisplay, keyDisplay + DemoNinjaCommon_1.HTMLHelpers.Break + 'Seen Players: ' + DemoNinjaCommon_1.HTMLHelpers.Break + playerDisplayLocal);
        }
    }
    /** Friction Hit by Player */
    onFrictionHit(player) {
        if (player === this.world.getServerPlayer()) {
            return;
        }
        const turboData = {
            player,
            frictionItemKey: this.frictionItemKey,
            frictionIsImplied: false,
            frictionNumTimes: 1,
            frictionAmount: 1
        };
        if (this.sfx != null) {
            analytics_1.Turbo.getConfigs().debug && (0, DemoNinjaCommon_1.playSFX)(this.sfx);
        }
        const playerKey = player.id;
        if (!this.seenPlayers.has(playerKey)) {
            this.addPlayer(player);
        }
        else {
            this.updateSeenPlayerCount(player);
        }
        this.onChange();
        this.async.setTimeout(() => (0, TurboAnalytics_1.Analytics)()?.sendFrictionHit(turboData, false));
    }
}
TurboFrictionHit.propsDefinition = {
    frictionItemKey: { type: hz.PropTypes.String },
    debugDisplay: { type: hz.PropTypes.Entity },
    sfx: { type: hz.PropTypes.Entity },
    trigger: { type: hz.PropTypes.Entity },
};
hz.Component.register(TurboFrictionHit);
/** Demo: Simple Teleport Trigger + Friction Event when player falls off the world */
// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
class DemoFallOffWorldFrictionTrigger extends hz.Component {
    start() {
        this.destination = this.props.destination?.as(hz.SpawnPointGizmo);
        this.sfx = this.props.sfx?.as(hz.AudioGizmo);
        this.debugDisplay = this.props.debugDisplay?.as(hz.TextGizmo);
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            if (player === this.world.getServerPlayer()) {
                return;
            }
            // Sometimes it spawns the player and hits the trigger, so we can just use Turbo to ignore it!
            if (analytics_1.TurboDataService.getWorldSeconds(player) < 5.0) {
                return;
            }
            this.onFrictionHit(player);
        });
    }
    onFrictionHit(player) {
        const frictionItemKey = 'Fell Off World';
        (0, DemoNinjaCommon_1.respawnPlayer)(this.destination, player);
        (0, DemoNinjaCommon_1.playSFX)(this.sfx);
        (0, TurboAnalytics_1.Analytics)()?.sendFrictionHit({ player, frictionItemKey, frictionNumTimes: 1 });
        const seenCount = analytics_1.TurboDataService.getFrictionItemSeenCount(player, frictionItemKey);
        const playerName = (0, DemoNinjaCommon_1.getPlayerName)(player, this.world);
        this.debugDisplay && (0, DemoNinjaCommon_1.setText)(this.debugDisplay, (0, DemoNinjaCommon_1.wrapColor)("Fell Off World", DemoNinjaCommon_1.HTMLHelpers.Orange) +
            DemoNinjaCommon_1.HTMLHelpers.Break +
            (0, DemoNinjaCommon_1.wrapColor)(playerName + " (" + seenCount + ")", seenCount > 0 ? DemoNinjaCommon_1.HTMLHelpers.MetaLightBlue : DemoNinjaCommon_1.HTMLHelpers.Green));
    }
}
DemoFallOffWorldFrictionTrigger.propsDefinition = {
    destination: { type: hz.PropTypes.Entity },
    sfx: { type: hz.PropTypes.Entity },
    debugDisplay: { type: hz.PropTypes.Entity },
};
hz.Component.register(DemoFallOffWorldFrictionTrigger);
/** Demo: Friction Caused Example with a > 1 Amount */
// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
class DemoFrictionCausedTrigger extends hz.Component {
    start() {
        this.debugDisplay = this.props.debugDisplay?.as(hz.TextGizmo);
        this.sfx = this.props.sfx?.as(hz.AudioGizmo);
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            if (player === this.world.getServerPlayer()) {
                return;
            }
            this.onFrictionCaused(player);
        });
    }
    onFrictionCaused(player) {
        const frictionItemKey = 'Messed With the Blocks!';
        (0, DemoNinjaCommon_1.playSFX)(this.sfx);
        (0, TurboAnalytics_1.Analytics)()?.sendFrictionCaused({ player, frictionItemKey });
        const playerName = (0, DemoNinjaCommon_1.getPlayerName)(player, this.world);
        if (this.debugDisplay !== undefined) {
            const numTimes = analytics_1.TurboDataService.getFrictionCausedSeen(player).get(frictionItemKey) || 1;
            (0, DemoNinjaCommon_1.setText)(this.debugDisplay, (0, DemoNinjaCommon_1.wrapColor)("Friction Caused: Messed with the Blocks!", DemoNinjaCommon_1.HTMLHelpers.Red) +
                DemoNinjaCommon_1.HTMLHelpers.Break +
                (0, DemoNinjaCommon_1.wrapColor)(playerName + " " + (0, DemoNinjaCommon_1.wrapParens)(numTimes.toString()), DemoNinjaCommon_1.HTMLHelpers.MetaLightBlue));
        }
    }
}
DemoFrictionCausedTrigger.propsDefinition = {
    sfx: { type: hz.PropTypes.Entity },
    debugDisplay: { type: hz.PropTypes.Entity },
};
hz.Component.register(DemoFrictionCausedTrigger);
