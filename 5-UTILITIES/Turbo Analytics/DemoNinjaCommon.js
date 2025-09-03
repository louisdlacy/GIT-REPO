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
exports.wrapParens = exports.wrapColor = exports.setText = exports.getTimeString = exports.getTimerDisplay = exports.getStringWithBreaks = exports.getPlayerName = exports.exists = exports.HTMLHelpers = void 0;
exports.setPos = setPos;
exports.setPosAndRot = setPosAndRot;
exports.respawnPlayer = respawnPlayer;
exports.playSFX = playSFX;
exports.stopSFX = stopSFX;
// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
const hz = __importStar(require("horizon/core"));
const TurboAnalytics_1 = require("TurboAnalytics");
const DebugTurbo_1 = require("DebugTurbo");
var DebugTurbo_2 = require("DebugTurbo");
Object.defineProperty(exports, "HTMLHelpers", { enumerable: true, get: function () { return DebugTurbo_2.HTMLHelpers; } });
Object.defineProperty(exports, "exists", { enumerable: true, get: function () { return DebugTurbo_2.exists; } });
Object.defineProperty(exports, "getPlayerName", { enumerable: true, get: function () { return DebugTurbo_2.getPlayerName; } });
Object.defineProperty(exports, "getStringWithBreaks", { enumerable: true, get: function () { return DebugTurbo_2.getStringWithBreaks; } });
Object.defineProperty(exports, "getTimerDisplay", { enumerable: true, get: function () { return DebugTurbo_2.getTimerDisplay; } });
Object.defineProperty(exports, "getTimeString", { enumerable: true, get: function () { return DebugTurbo_2.getTimeString; } });
Object.defineProperty(exports, "setText", { enumerable: true, get: function () { return DebugTurbo_2.setText; } });
Object.defineProperty(exports, "wrapColor", { enumerable: true, get: function () { return DebugTurbo_2.wrapColor; } });
Object.defineProperty(exports, "wrapParens", { enumerable: true, get: function () { return DebugTurbo_2.wrapParens; } });
function setPos(obj, pos) {
    if ((0, DebugTurbo_1.exists)(obj)) {
        obj?.position.set(pos);
    }
}
function setPosAndRot(obj, pos, rot) {
    if ((0, DebugTurbo_1.exists)(obj)) {
        obj?.position.set(pos);
        obj?.rotation.set(rot);
    }
}
function respawnPlayer(spawnPoint, player) {
    spawnPoint?.as(hz.SpawnPointGizmo)?.teleportPlayer(player);
}
function playSFX(sfx) {
    sfx?.as(hz.AudioGizmo)?.play();
}
function stopSFX(sfx) {
    sfx?.as(hz.AudioGizmo)?.stop();
}
/** Demo: RoundStart Trigger
 * @remarks TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
 */
class RoundStartTrigger extends hz.Component {
    start() {
        this.sfx = this.props.sfx?.as(hz.AudioGizmo);
        this.destSpawnPoint = this.props.destSpawnPoint?.as(hz.SpawnPointGizmo);
        // Warning! Game Round Starts should only be sent once per Round via a Round Manager since it sends action for each player
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            this.onRoundStart(player);
        });
    }
    // TODO (Creator) - See below for important note about Round-based experiences and Turbo Areas
    onRoundStart(player) {
        const players = this.world.getPlayers();
        respawnPlayer(this.destSpawnPoint, player);
        /** Players currently in an Area marked as Lobby won't be considered in the round.  Make sure to use the isRound to help with this.
        * Respawns can also sometimes happen before the Area Trigger is registered.
        * ensure your ordering is correct.  For example, you may want to send AreaEnter for each player into a Active Round Area before sending the RoundStart
    
        players.forEach((player, index) => {
          this.async.setTimeout(() => {
            Analytics()?.sendAreaEnter({ player, actionArea: "Game Area", actionAreaIsLobbySection: false, actionAreaIsPlayerReadyZone: false, turboState: ParticipationEnum.IN_ROUND } as AreaEnterPayload);
          }, index * 50);
        });
    
        **/
        (0, TurboAnalytics_1.Analytics)()?.sendAllRoundStart(players, {});
        playSFX(this.sfx);
    }
}
RoundStartTrigger.propsDefinition = {
    destSpawnPoint: { type: hz.PropTypes.Entity },
    sfx: { type: hz.PropTypes.Entity },
};
hz.Component.register(RoundStartTrigger);
/** Demo: RoundStart Trigger
 * @remarks TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
 */
class RoundEndTrigger extends hz.Component {
    start() {
        this.sfx = this.props.sfx?.as(hz.AudioGizmo);
        // Warning! Game Round Ends should only be sent once per Round via a Round Manager since it sends action for each player
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (_player) => {
            this.onRoundEnd();
        });
    }
    ;
    onRoundEnd() {
        const players = this.world.getPlayers();
        (0, TurboAnalytics_1.Analytics)()?.sendAllRoundEnd(players, {});
        playSFX(this.sfx);
    }
    ;
}
RoundEndTrigger.propsDefinition = {
    sfx: { type: hz.PropTypes.Entity },
};
hz.Component.register(RoundEndTrigger);
/** Demo: Simple World Timer Display on a Text Object
 * @remarks TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
 */
class WorldTimer extends hz.Component {
    constructor() {
        super(...arguments);
        this.totalSeconds = 0.0;
    }
    start() {
        if (!TurboAnalytics_1.TURBO_DEBUG) {
            return;
        }
        ;
        this.totalSeconds = 0.0;
        this.txtObject = this.props.txtObject?.as(hz.TextGizmo);
        // Subscribe to the World Update Event
        this.connectLocalBroadcastEvent(hz.World.onUpdate, (data) => {
            this.updateSeconds(data.deltaTime);
        });
        // Update UI every second (instead of per frame)
        this.async.setInterval(() => {
            this.updateDisplay();
        }, 1000);
    }
    updateDisplay() {
        (0, DebugTurbo_1.setText)(this.txtObject, (0, DebugTurbo_1.getTimeString)(this.totalSeconds));
    }
    updateSeconds(deltaTime) {
        this.totalSeconds += deltaTime;
    }
}
WorldTimer.propsDefinition = {
    txtObject: { type: hz.PropTypes.Entity },
};
hz.Component.register(WorldTimer);
/** Demo: Release Notes
 * @remarks TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
 */
class DemoTurboReleaseNotes extends hz.Component {
    start() {
        const WHATS_NEW = (0, DebugTurbo_1.getStringWithBreaks)(DebugTurbo_1.HTMLHelpers.AlignLeft, (0, DebugTurbo_1.wrapColor)("<size=200%>What's New in V22? (Highlights)</size>", DebugTurbo_1.HTMLHelpers.Pink), "* Turbo API launched as horizon/analytics!", "* Refactored, simplified, and optimized Modules");
        const CORE_API = (0, DebugTurbo_1.getStringWithBreaks)(DebugTurbo_1.HTMLHelpers.AlignLeft, (0, DebugTurbo_1.wrapColor)("<size=200%>Turbo Modules: Core API</size>", DebugTurbo_1.HTMLHelpers.MetaLightBlue), "* Strongly typed payloads and simplified events", "* TurboDataService for realtime events queries");
        const TESTING = (0, DebugTurbo_1.getStringWithBreaks)(DebugTurbo_1.HTMLHelpers.AlignLeft, (0, DebugTurbo_1.wrapColor)("<size=200%>Turbo Modules: Testing and Quality</size>", DebugTurbo_1.HTMLHelpers.MetaLightBlue), "* Turbo API is covered by 100's of integration tests");
        const ONBOARDING = (0, DebugTurbo_1.getStringWithBreaks)(DebugTurbo_1.HTMLHelpers.AlignLeft, (0, DebugTurbo_1.wrapColor)("<size=200%>Turbo Onboarding Experience</size>", DebugTurbo_1.HTMLHelpers.MetaLightBlue), "* Changed up the music and the art", "* Did you find the secret elevator?");
        (0, DebugTurbo_1.setText)(this.props.txtWhatsNew?.as(hz.Entity), WHATS_NEW);
        (0, DebugTurbo_1.setText)(this.props.txtCoreLibrary?.as(hz.Entity), CORE_API);
        (0, DebugTurbo_1.setText)(this.props.txtTesting?.as(hz.Entity), TESTING);
        (0, DebugTurbo_1.setText)(this.props.txtOnboarding?.as(hz.Entity), ONBOARDING);
    }
}
DemoTurboReleaseNotes.propsDefinition = {
    txtWhatsNew: { type: hz.PropTypes.Entity },
    txtCoreLibrary: { type: hz.PropTypes.Entity },
    txtOnboarding: { type: hz.PropTypes.Entity },
    txtTesting: { type: hz.PropTypes.Entity },
};
hz.Component.register(DemoTurboReleaseNotes);
