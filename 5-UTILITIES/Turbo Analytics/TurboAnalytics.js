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
exports.AnalyticsManager = exports.TURBO_DEBUG = exports.TURBO_IS_ENABLED = void 0;
exports.isTurboManagerReady = isTurboManagerReady;
exports.Analytics = Analytics;
/**
 * 🚀 Turbo Analytics: Turbo API for Horizon In-World Analytics (Welcome!!)
 * TODO: (Creator) IMPORTANT: Make sure to attach an Entity to the Analytics Manager or nothing will work!
 * TODO: (Creator) <--- Search for this to uncover attention items
 * TODO: (Creator) Don't forget to have fun!
 */
exports.TURBO_IS_ENABLED = true; /* TODO (Creator): Turbo Killswitch */
exports.TURBO_DEBUG = true; /** TODO (Creator): IMPORTANT!!! Set to False before Release **/
const IS_DEMO = exports.TURBO_DEBUG && true; /** TODO (Creator): IMPORTANT!!! Set to False before Release **/
const hz = __importStar(require("horizon/core"));
const analytics_1 = require("horizon/analytics");
/* TODO (Creator): IMPORTANT! Replace the Demo Settings with this instead */
const PRODUCTION_TURBO_SETTINGS = {
    debug: exports.TURBO_DEBUG,
    // ...
};
/**
 * TODO (Creator): WARNING DEMO ONLY
 * @remarks: Hover over individual props for definition preview
 **/
const DEMO_TURBO_SETTINGS = {
    debug: exports.TURBO_DEBUG,
    // TODO (Creator): Demo Only - Remove these overrides for your own use case
    gameMode: "NinjaModeV2",
    playerInitialArea: 'Turbo Start',
    eventsForWeaponGrabAndRelease: true, // WARN: Can be expensive if used too frequently, but is required for PvP Weapon Utilization
    eventsForWearableEquipAndRelease: true,
    // TODO (Creator): Friction No KOs is a built-in Turbo feature that can be enabled/disabled
    frictionNoKOsTimerSeconds: 60.0,
    useDiscovery: true,
    useFriction: true,
    useFrictionNoKOs: true,
    useLevelUp: true,
    useRewards: true,
    // TODO (Creator): Enable these for Round-based Experiences
    useRounds: true,
    useStages: true,
    useSections: true,
    useTasks: true,
    useWeaponEquip: true,
    useWeaponGrabAndRelease: true,
    useWeapons: true,
    useWearableEquipAndRelease: true,
    useWearables: true,
};
function getTurboSettings() {
    if (IS_DEMO) {
        console.warn(`🚀 TURBO: DEMO IS ACTIVE!  Are you sure???`);
        return DEMO_TURBO_SETTINGS;
    }
    exports.TURBO_DEBUG && console.log(`🚀 TURBO: PRODUCTION Settings Active ✅`);
    return PRODUCTION_TURBO_SETTINGS;
}
function isTurboManagerReady() {
    return exports.TURBO_IS_ENABLED && !!analytics_1.Turbo;
}
function Analytics() {
    return AnalyticsManager && AnalyticsManager.s_instance;
}
/** TODO (Creator): Turbo Analytics Manager: IMPORTANT -> This Must be Attached to an entity in the world */
class AnalyticsManager extends hz.Component {
    start() {
        AnalyticsManager.s_instance = this;
        if (!exports.TURBO_IS_ENABLED)
            return;
        this.subscribeToEvents();
        analytics_1.Turbo.register(this, getTurboSettings());
        this.entity.visible.set(false);
        console.log(`🚀 TURBO: Initializing TurboAnalyticsManager API`);
        if (analytics_1.Turbo.getConfigs().debug) {
            this.async.setTimeout(() => {
                !analytics_1.Turbo.isReady() && console.warn("🚀 TURBO: Turbo Analytics is not ready yet.  Are you sure it's hooked up?");
            }, 1000 * 3);
        }
    }
    /** TODO (Creator): Add Hooks here from Existing Broadcasts
     WARNING: DO NOT SEND TURBO EVENTS FOR WORLD ENTER/EXIT, AFK/ENTER EXIT or you'll have double logging!
     @example
     this.connectLocalBroadcastEvent(Events.onFoundFiveDollars, (player:hz.Player) => {
         this.sendDiscoveryMade(player, { discoveryItemKey: "found_five_dollars" });
     });
     **/
    subscribeToEvents() {
        this.connectLocalBroadcastEvent(analytics_1.TurboDebug.events.onDebugTurboPlayerEvent, (data) => {
            this.onDebugTurboPlayerEvent(data.player, data.eventData, data.action);
        });
    }
    /* Turbo Debugging - DO NOT USE IN PRODUCTION
    @remarks Note: You can delete this once debug is off, but it's needed during Debugging
      because without it, sometimes the first emmitted debug event from Turbo is dropped which can cause the event to stop emmitting including for other potential subscribers
      See @DebugTurbo for various starter tools for you to debug and you'll see what's up (What's up!?)
    */
    onDebugTurboPlayerEvent(_player, _eventData, _action) {
        // return;
    }
    /** TURBO SEND EVENTS */
    sendAreaEnter(payload) { return analytics_1.Turbo.send(analytics_1.TurboEvents.OnAreaEnter, payload); }
    sendAreaExit(payload) { return analytics_1.Turbo.send(analytics_1.TurboEvents.OnAreaExit, payload); }
    sendCustomEvent(payload) { return analytics_1.Turbo.send(analytics_1.TurboEvents.OnCustomAction, payload); }
    sendDeathByEnemy(payload) { return analytics_1.Turbo.send(analytics_1.TurboEvents.OnDeathByEnemy, payload); }
    sendDeathByPlayer(payload) { return analytics_1.Turbo.send(analytics_1.TurboEvents.OnDeathByPlayer, payload); }
    sendKOPlayer(payload) { return analytics_1.Turbo.send(analytics_1.TurboEvents.OnKOPlayer, payload); }
    sendKOEnemy(payload) { return analytics_1.Turbo.send(analytics_1.TurboEvents.OnKOEnemy, payload); }
    sendLevelUp(payload) { return analytics_1.Turbo.send(analytics_1.TurboEvents.OnLevelUp, payload); }
    sendPlayerReadyEnter(payload) { return analytics_1.Turbo.send(analytics_1.TurboEvents.OnPlayerReadyEnter, payload); }
    sendPlayerReadyExit(payload) { return analytics_1.Turbo.send(analytics_1.TurboEvents.OnPlayerReadyExit, payload); }
    sendRewardsEarned(payload) { return analytics_1.Turbo.send(analytics_1.TurboEvents.OnRewardsEarned, payload); }
    sendStageStart(payload) { return analytics_1.Turbo.send(analytics_1.TurboEvents.OnStageStart, payload); }
    ;
    sendStageEnd(payload) { return analytics_1.Turbo.send(analytics_1.TurboEvents.OnStageEnd, payload); }
    ;
    sendSectionStart(payload) { return analytics_1.Turbo.send(analytics_1.TurboEvents.OnSectionStart, payload); }
    ;
    sendSectionEnd(payload) { return analytics_1.Turbo.send(analytics_1.TurboEvents.OnSectionEnd, payload); }
    ;
    sendTaskStart(payload) { return analytics_1.Turbo.send(analytics_1.TurboEvents.OnTaskStart, payload); }
    ;
    sendTaskStepStart(payload) { return analytics_1.Turbo.send(analytics_1.TurboEvents.OnTaskStepStart, payload); }
    ;
    sendTaskStepEnd(payload) { return analytics_1.Turbo.send(analytics_1.TurboEvents.OnTaskStepEnd, payload); }
    ;
    sendTaskEnd(payload) { return analytics_1.Turbo.send(analytics_1.TurboEvents.OnTaskEnd, payload); }
    ;
    sendWeaponEquip(payload) { return analytics_1.Turbo.send(analytics_1.TurboEvents.OnWeaponEquip, payload); }
    sendWeaponGrab(payload) { return analytics_1.Turbo.send(analytics_1.TurboEvents.OnWeaponGrab, payload); }
    sendWeaponRelease(payload) { return analytics_1.Turbo.send(analytics_1.TurboEvents.OnWeaponRelease, payload); }
    sendWearableEquip(payload) { return analytics_1.Turbo.send(analytics_1.TurboEvents.OnWearableEquip, payload); }
    sendWearableRelease(payload) { return analytics_1.Turbo.send(analytics_1.TurboEvents.OnWearableRelease, payload); }
    /** TODO (Creator): Round Start (All Players)
     * @remarks WARN: This is for ALL players and will send events for EACH affected player
     * @param playersInRound - Players that are in the game when the round starts
    */
    sendAllRoundStart(playersInRound, payload) {
        return analytics_1.Turbo.send(analytics_1.TurboEvents.OnGameRoundStartForPlayers, {
            players: playersInRound,
            sendPlayerRoundStart: true,
            gameStartData: payload
        });
    }
    /** TODO (Creator): Round End (All Players)
    * @remarks WARN: This is for ALL players and will send events for EACH affected player
    * @param playersLeftInRound - Players that are still in the game when the round ends
    */
    sendAllRoundEnd(playersLeftInRound, _payload) {
        return analytics_1.Turbo.send(analytics_1.TurboEvents.OnGameRoundEndForPlayers, {
            players: playersLeftInRound,
            sendPlayerRoundEnd: true,
        });
    }
    sendDiscoveryMade(payload, firstTimeOnly = false) {
        if (firstTimeOnly && analytics_1.TurboDataService.getDiscoveryItemSeenCount(payload.player, payload.discoveryItemKey) > 0) {
            return false;
        }
        return analytics_1.Turbo.send(analytics_1.TurboEvents.OnDiscoveryMade, payload);
    }
    sendFrictionCaused(payload, firstTimeOnly = false) {
        if (firstTimeOnly && analytics_1.TurboDataService.getFrictionCausedSeen(payload.player).has(payload.frictionItemKey)) {
            return false;
        }
        return analytics_1.Turbo.send(analytics_1.TurboEvents.OnFrictionCaused, payload);
    }
    sendFrictionHit(payload, firstTimeOnly = false) {
        if (firstTimeOnly && analytics_1.TurboDataService.getFrictionItemSeenCount(payload.player, payload.frictionItemKey) > 0) {
            return false;
        }
        return analytics_1.Turbo.send(analytics_1.TurboEvents.OnFrictionHit, payload);
    }
    sendQuestCompleted(payload, firstTimeOnly = true) {
        if (firstTimeOnly && analytics_1.TurboDataService.getQuestsUnlocked(payload.player).includes(payload.achievementKey)) {
            return false;
        }
        return analytics_1.Turbo.send(analytics_1.TurboEvents.OnQuestCompleted, payload);
    }
}
exports.AnalyticsManager = AnalyticsManager;
hz.Component.register(AnalyticsManager);
