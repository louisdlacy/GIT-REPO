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
exports.HTMLHelpers = void 0;
exports.getPlayerName = getPlayerName;
exports.exists = exists;
exports.getColorHexFromAction = getColorHexFromAction;
exports.getStringWithBreaks = getStringWithBreaks;
exports.getTimeString = getTimeString;
exports.getTimerDisplay = getTimerDisplay;
exports.setText = setText;
exports.wrapColor = wrapColor;
exports.wrapParens = wrapParens;
// TODO (Creator): TURBO DEBUG ONLY - REMOVE BEFORE PUBLISHING YOUR WORLD
const hz = __importStar(require("horizon/core"));
const analytics_1 = require("horizon/analytics");
const TurboAnalytics_1 = require("TurboAnalytics");
const DebugConsts = {
    PrintToConsole: false,
    PrintToTxtGizmo: true,
};
const actionKeys = Object.freeze(new Set(["action", "actionArea", "actionAreaIsLobbySection", "actionAreaIsPlayerReadyZone", "actionCustom", "discoveryItemKey", "frictionItemKey", "gameMode", "gameState", "roundId", "roundName", "stageName", "taskKey", "taskStepKey", "turboState", "weaponKey", "wearableKey"]));
/** Retreives the Player Alias based on World with a fallback */
function getPlayerName(player, world) {
    if (player === world.getServerPlayer()) {
        return 'Server Player';
    }
    ;
    try {
        return player.name.get() ?? 'No Player Name';
    }
    catch (error) {
        return 'No Player Name';
    }
    finally {
        // Finally...
    }
}
/** Provides a set of common HTML strings used in UI display */
exports.HTMLHelpers = {
    NewLine: '\n',
    Break: '<br>',
    AlignLeft: '<align=left>',
    AlignCenter: '<align=center>',
    Red: '<color="red">',
    Orange: '<color="orange">',
    Yellow: '<color="yellow">',
    Green: '<color="green">',
    Blue: '<color="blue">',
    Purple: '<color=#CF9FFF>',
    Pink: '<color=#FF22EE>',
    White: '<color=#FFFFFF>',
    Black: '<color=#000000>',
    Gray: '<color=#1C2B33>',
    MetaLightBlue: '<color=#0080FB>',
    EndColorTag: '</color>',
};
function exists(obj) {
    return obj !== undefined && obj != null;
}
/** Returns the string hexcode based on the Turbo Action for easier visual contrast */
function getColorHexFromAction(turboTriggerAction) {
    switch (turboTriggerAction) {
        case analytics_1.Action.DISCOVERY_MADE:
            return exports.HTMLHelpers.MetaLightBlue;
        case analytics_1.Action.FRICTION_HIT:
        case analytics_1.Action.FRICTION_CAUSED:
            return exports.HTMLHelpers.Orange;
        case analytics_1.Action.LEVEL_UP:
            return exports.HTMLHelpers.Pink;
        case analytics_1.Action.REWARDS_EARNED:
            return exports.HTMLHelpers.Purple;
        case analytics_1.Action.ACHIEVEMENT_UNLOCKED:
            return exports.HTMLHelpers.Purple;
        case analytics_1.Action.AREA_ENTER:
        case analytics_1.Action.ROUND_START:
        case analytics_1.Action.SECTION_START:
        case analytics_1.Action.STAGE_START:
        case analytics_1.Action.TASK_START:
        case analytics_1.Action.TASK_STEP_START:
            return exports.HTMLHelpers.Green;
        case analytics_1.Action.AREA_EXIT:
        case analytics_1.Action.ROUND_END:
        case analytics_1.Action.SECTION_END:
        case analytics_1.Action.STAGE_END:
        case analytics_1.Action.TASK_END:
        case analytics_1.Action.TASK_STEP_END:
            return exports.HTMLHelpers.Red;
        case analytics_1.Action.WEAPON_EQUIP:
        case analytics_1.Action.WEAPON_GRAB:
        case analytics_1.Action.WEARABLE_EQUIP:
            return exports.HTMLHelpers.Green;
        case analytics_1.Action.WEAPON_RELEASE:
        case analytics_1.Action.WEARABLE_RELEASE:
            return exports.HTMLHelpers.Pink;
        default:
            return exports.HTMLHelpers.MetaLightBlue;
    }
}
function getStringWithBreaks(...items) {
    let outString = "";
    items.forEach(item => { outString += item.toString() + exports.HTMLHelpers.Break; });
    return outString;
}
/** Formats seconds into mm:ss format */
function getTimeString(timeInSeconds) {
    let minutes = Math.max(0, Math.floor(timeInSeconds / 60));
    let seconds = Math.max(0, Math.floor(timeInSeconds % 60));
    let str = minutes.toString() + ':';
    if (seconds < 10) {
        str += '0';
    }
    str += seconds.toString();
    return str;
}
/** Displays a color-formatted representation of a Turbo Timer (individual) for Debugging UIs and HUDs */
function getTimerDisplay(timerKey, sessionSeconds, latestIntervalSeconds, showOnlyRunning = false, isRunning = true, showTimerKey = false) {
    let outDisplay = "";
    const running = sessionSeconds > 0 && isRunning; // proxy for now
    if (running || !showOnlyRunning) {
        const timerColor = running ? exports.HTMLHelpers.Green : exports.HTMLHelpers.White;
        outDisplay += wrapColor(`(S:) ${getTimeString(sessionSeconds)}`, timerColor);
        outDisplay += exports.HTMLHelpers.Break;
        outDisplay += wrapColor(`(C:) ${getTimeString(latestIntervalSeconds)}`, timerColor);
        outDisplay += exports.HTMLHelpers.Break;
        if (showTimerKey) {
            outDisplay += wrapColor(`Timer Key: ${timerKey}`, timerColor);
        }
        outDisplay += exports.HTMLHelpers.Break;
    }
    return outDisplay;
}
function setText(txtGizmo, str) {
    txtGizmo && txtGizmo.as(hz.TextGizmo)?.text.set(str);
}
// Wraps Text with Color Tags
function wrapColor(text, colorStartHex) {
    return colorStartHex + text + exports.HTMLHelpers.EndColorTag;
}
// Wraps Text with Parentheses
function wrapParens(text) {
    return "(" + text + ")";
}
/** Shared Util for showing a Turbo Seen Map with formatting */
function getSeenStateMap(seenMap, colorHTML = exports.HTMLHelpers.Pink) {
    const entries = Array.from(seenMap.entries());
    return wrapColor(Array.from(entries.map((entry, _key) => `${entry[0]}: ${entry[1]}`)).join(exports.HTMLHelpers.NewLine), colorHTML);
}
/** Returns printable KV Props for Debugging Payloads */
function getPrintKV(obj, skipEmpty = false, nLevels = 0, includeKeys) {
    let outString = "";
    // Sort by Key
    Object.entries(obj).sort((a, b) => a[0].localeCompare(b[0])).forEach(([key, val]) => {
        if (!includeKeys?.has(key)) {
            return;
        }
        let valString = "";
        if (val == undefined || val == null) {
            if (!skipEmpty) {
                valString = `${key} = ${valString} (Missing)`;
            }
        }
        else {
            if (Array.isArray(val)) {
                valString = val.join('\n');
            }
            else if (typeof val === 'object') {
                if (nLevels > 0)
                    valString = JSON.stringify(val);
                else {
                    valString = getPrintKV(val, skipEmpty, nLevels + 1);
                }
            }
            else {
                valString = val && val.toString();
            }
        }
        outString += `${key} = ${valString}` + '\n';
    });
    return outString;
}
/** UI for showing Turbo Game State (shared across all players) */
class TurboDebuggerGameState extends hz.Component {
    start() {
        if (!TurboAnalytics_1.TURBO_DEBUG) {
            return;
        } // Killswitch for Debug
        this.txtObj1 = this.props.txtObj1?.as(hz.TextGizmo);
        this.async.setInterval(() => this.updateDisplay(), 1000);
    }
    updateDisplay() {
        if (this.txtObj1 === undefined) {
            return;
        }
        const gameState = analytics_1.TurboDataService.getGameStateEnum();
        const gameIsActive = analytics_1.TurboDataService.isGameActive();
        const gameRoundID = analytics_1.TurboDataService.getGameRoundId();
        const gameRoundName = analytics_1.TurboDataService.getGameRoundName();
        const gameRoundSeconds = analytics_1.TurboDataService.isGameActive() ? analytics_1.TurboDataService.getGameRoundSeconds() : 0;
        let outString = exports.HTMLHelpers.AlignLeft;
        outString += wrapColor("🚀 TURBO GAME STATE", exports.HTMLHelpers.MetaLightBlue) + exports.HTMLHelpers.NewLine;
        outString += wrapColor("Game State: " + gameState, gameState === analytics_1.GameStateEnum.ACTIVE ? exports.HTMLHelpers.Green : exports.HTMLHelpers.White) + exports.HTMLHelpers.NewLine;
        outString += wrapColor("Game Round ID: " + gameRoundID, exports.HTMLHelpers.MetaLightBlue) + exports.HTMLHelpers.NewLine;
        outString += wrapColor("Game Round Name: " + gameRoundName, exports.HTMLHelpers.MetaLightBlue) + exports.HTMLHelpers.NewLine;
        outString += wrapColor("Game Round Seconds: " + gameRoundSeconds, gameIsActive ? exports.HTMLHelpers.Green : exports.HTMLHelpers.MetaLightBlue) + exports.HTMLHelpers.NewLine;
        setText(this.txtObj1, outString);
    }
}
TurboDebuggerGameState.propsDefinition = {
    txtObj1: { type: hz.PropTypes.Entity },
};
hz.Component.register(TurboDebuggerGameState);
/** Debug the current Turbo Player State snapshot for a given player
* Connect this to a Trigger and optionally map a Text Gizmo to see the Output
* @remarks Some TurboDataService APIs may change, so do not rely on it in production, unless you really need to!
* TODO (Creator): TURBO DEBUG ONLY - REMOVE BEFORE PUBLISHING YOUR WORLD
*/
class TurboDebuggerPlayerState extends hz.Component {
    constructor() {
        super(...arguments);
        this.currentPlayerName = ''; // cache avoids unnecessary bridge calls
    }
    start() {
        this.txtGizmo = this.props.txtGizmo?.as(hz.TextGizmo);
        setText(this.txtGizmo, 'TURBO: Player State');
        // Entering the trigger will set the current player and show + subscribe to new events coming in
        // That's an approximate way to see changes instead of a continuous set of updates which is expensive
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            if (player === this.world.getServerPlayer()) {
                return;
            }
            ;
            this.currentPlayer = player;
            this.currentPlayerName = getPlayerName(player, this.world);
            this.showMyTurboState(player);
        });
        // Subscribe to new events
        this.connectLocalBroadcastEvent(analytics_1.TurboDebug.events.onDebugTurboPlayerEvent, (data) => {
            if (data.player == this.currentPlayer)
                this.showMyTurboState(this.currentPlayer);
        });
    }
    showMyTurboState(player) {
        const playerAlias = this.currentPlayerName;
        const consolePrefix = `🚀 TURBO ${playerAlias} State: `;
        // Game
        const gameState = analytics_1.TurboDataService.getGameStateEnum();
        const gameRoundName = analytics_1.TurboDataService.getGameRoundName();
        const gameRoundSeconds = analytics_1.TurboDataService.getGameRoundSeconds();
        // Player
        const area = analytics_1.TurboDataService.getCurrentArea(player);
        const areaLatestSeconds = analytics_1.TurboDataService.getAreaLatestIntervalSeconds(player, area);
        const areaSeconds = analytics_1.TurboDataService.getAreaSessionSeconds(player, area);
        const discoveries = analytics_1.TurboDataService.getDiscoveriesSeen(player);
        const frictions = analytics_1.TurboDataService.getFrictionsSeen(player);
        const frictionsCaused = analytics_1.TurboDataService.getFrictionCausedSeen(player);
        const numEvents = analytics_1.TurboDataService.getTotalEventCounts(player);
        const roundName = analytics_1.TurboDataService.getRoundName(player);
        const roundSeconds = analytics_1.TurboDataService.getRoundSeconds(player);
        const tasks = analytics_1.TurboDataService.getTasksSeen(player);
        const turboState = analytics_1.TurboDataService.getParticipationState(player);
        const weaponsSeen = analytics_1.TurboDataService.getWeaponsSeen(player);
        const wearablesSeen = analytics_1.TurboDataService.getWearablesSeen(player);
        const worldSeconds = analytics_1.TurboDataService.getWorldSeconds(player);
        // Log to Console
        if (DebugConsts.PrintToConsole) {
            console.log(`${consolePrefix} Area: ${area}`);
            console.log(`${consolePrefix} Area Session Seconds: ${areaSeconds}`);
            console.log(`${consolePrefix} Area Latest Interval Seconds: ${areaLatestSeconds}`);
            // ...
        }
        ;
        // Display on Text Gizmo
        if (DebugConsts.PrintToTxtGizmo) {
            let outString = exports.HTMLHelpers.AlignLeft;
            outString += `Player:  ${playerAlias} (Action Count: ${numEvents.toString()})\n`;
            outString += `World Seconds: ${worldSeconds}\n`;
            // Area
            outString += wrapColor(`Area: ${area}\n`, exports.HTMLHelpers.Green);
            outString += wrapColor(`Area Session (Seconds): ${areaSeconds}\n`, exports.HTMLHelpers.Green);
            outString += `Area Latest Interval (Seconds): ${areaLatestSeconds}\n`;
            // Games and Rounds State
            if (analytics_1.Turbo.getConfigs().useRounds) {
                outString += wrapColor(`Game State: ${gameState}\n`, gameState == analytics_1.GameStateEnum.ACTIVE ? exports.HTMLHelpers.Green : exports.HTMLHelpers.Yellow);
                if (gameRoundName) {
                    outString += `Game Round: ${gameRoundName}\n`;
                }
                if (gameRoundSeconds > 0) {
                    outString += `Game Round Seconds: ${gameRoundSeconds}\n`;
                }
                if (roundName != null) {
                    outString += `Player Round: ${roundName}\n`;
                }
                if (roundSeconds > 0) {
                    outString += `Player Round Seconds: ${roundSeconds}\n`;
                }
                outString += wrapColor(`Player Participation: ${turboState}\n`, turboState == analytics_1.ParticipationEnum.IN_ROUND ? exports.HTMLHelpers.Green : exports.HTMLHelpers.White);
            }
            // Seeen State
            if (discoveries.size > 0) {
                outString += `Discoveries: \n${getSeenStateMap(discoveries, exports.HTMLHelpers.MetaLightBlue)}\n`;
            }
            ;
            if (frictions.size > 0) {
                outString += `Friction: \n${getSeenStateMap(frictions, exports.HTMLHelpers.Orange)}\n`;
            }
            ;
            if (frictionsCaused.size > 0) {
                outString += `Friction Caused: \n${getSeenStateMap(frictionsCaused, exports.HTMLHelpers.Orange)}\n`;
            }
            if (tasks.size > 0) {
                outString += `Tasks Seen: \n${getSeenStateMap(tasks, exports.HTMLHelpers.Green)}\n`;
            }
            if (weaponsSeen.size > 0) {
                outString += `Weapons Seen: \n${getSeenStateMap(weaponsSeen, exports.HTMLHelpers.Pink)}\n`;
            }
            if (wearablesSeen.size > 0) {
                outString += `Wearables Seen: \n${getSeenStateMap(wearablesSeen, exports.HTMLHelpers.Purple)}\n`;
            }
            setText(this.txtGizmo, outString);
        }
        ;
    }
}
TurboDebuggerPlayerState.propsDefinition = {
    txtGizmo: { type: hz.PropTypes.Entity },
};
hz.Component.register(TurboDebuggerPlayerState);
/** Debug Turbo: Stream events to console or Txt Objects with some basic formatting
 * @remarks TODO (Creator): TURBO DEBUG ONLY - REMOVE BEFORE PUBLISHING YOUR WORLD
*/
class TurboDebuggerEventStream extends hz.Component {
    start() {
        this.txtGizmo = this.props.txtGizmo;
        this.connectLocalBroadcastEvent(analytics_1.TurboDebug.events.onDebugTurboPlayerEvent, (data) => {
            const streamData = {};
            Object.entries(data.eventData).forEach(([key, val]) => { if (actionKeys.has(key)) {
                streamData[key] = val;
            } });
            this.onDebugTurboPlayerEvent(data.player, streamData, data.action);
        });
    }
    /** Returns formatted display string for an Event for Debugging */
    getDisplayActionData(playerAlias, action, turboEventData, skipEmpty = false) {
        let outString = exports.HTMLHelpers.AlignLeft;
        outString += 'Player: ' + wrapColor(playerAlias, exports.HTMLHelpers.MetaLightBlue) + ' | Action: ' + wrapColor(analytics_1.Action[action].toString(), getColorHexFromAction(action)) + '\n\n';
        outString += '____Turbo Action Data____' + '\n';
        outString += getPrintKV(turboEventData, skipEmpty, 2, actionKeys) + '\n';
        return outString;
    }
    onDebugTurboPlayerEvent(player, eventData, action) {
        const playerAlias = eventData.playerAlias?.toString() ?? getPlayerName(player, this.world);
        DebugConsts.PrintToConsole && console.log(`🚀 TURBO: ✉️ Player ${playerAlias} -  Action - ${analytics_1.Action[action].toString()}`);
        DebugConsts.PrintToTxtGizmo && setText(this.txtGizmo, this.getDisplayActionData(playerAlias, action, eventData));
    }
}
TurboDebuggerEventStream.propsDefinition = {
    txtGizmo: { type: hz.PropTypes.Entity },
};
hz.Component.register(TurboDebuggerEventStream);
const settingsKeys = Object.freeze(new Set(["debug", "gameMode", "playerInitialState", "playerInitialArea", "useDiscovery", "useFriction", "useGameMode", "useLevelUp", "useRewards", "useTasks", "useRounds", "useSections", "useStages", "useQuests", "useWeaponEquip", "useWeaponGrab", "useWeapons", "useWearables", "turboUpdateSeconds",]));
/** This class is useful for TurboSettings Validation, it can help confirm enabled modules, events, and data
 * @remarks TODO (Creator): TURBO DEBUG ONLY - REMOVE BEFORE PUBLISHING YOUR WORLD
*/
class TurboDebugConfig {
    /** Warnings/Validations based on deltas from defaults */
    static runValidations() {
        const outMesssages = new Array();
        if (!analytics_1.Turbo.getConfigs())
            return new Array();
        let counters = { info: 0, warning: 0, error: 0 };
        function print(msg, level = 'info') {
            switch (level) {
                case 'error':
                    console.error(msg + '\n');
                    outMesssages.push("[ERROR] " + msg + '\n');
                    counters.error++;
                    break;
                case 'warning':
                    console.warn(msg + '\n');
                    outMesssages.push("[WARN] " + msg + '\n');
                    counters.warning++;
                    break;
                case 'info':
                    // skip console printing for info level by default - summarized in caller side
                    // console.log(prefix + msg + HTML.NEW_LINE);
                    outMesssages.push("[INFO] " + msg + '\n');
                    counters.info++;
                    break;
            }
        }
        function validateGameMode() {
            if (analytics_1.Turbo.getConfigs().gameMode.toLowerCase().includes("ninja")) {
                print("Ninja found in GameMode.  This is just for Demo purposes.  Please ensure this is intentional!");
            }
        }
        // Run Validations
        validateGameMode();
        // Print Summary
        print("TurboSettings validation results: " + counters.info + ' Info, ' + counters.warning + ' Warning, ' + counters.error + ' Errors.' + '\n');
        return outMesssages;
    }
}
/** UI for TurboSettings Display on Text Gizmos
 * @remarks TODO (Creator): TURBO DEBUG ONLY - REMOVE BEFORE PUBLISHING YOUR WORLD
*/
class TurboConfigsUI extends hz.Component {
    constructor() {
        super(...arguments);
        // Text Gizmos: inventory for output of text stream for Display
        this.txtGizmos = [];
        this.settingsDisplay = [];
    }
    start() {
        if (!TurboAnalytics_1.TURBO_DEBUG) {
            return;
        } // Killswitch for Debug
        this.txtGizmos = [];
        this.txtObj1 = this.props.txtObj1?.as(hz.TextGizmo);
        this.txtObj2 = this.props.txtObj2?.as(hz.TextGizmo);
        this.txtObj3 = this.props.txtObj3?.as(hz.TextGizmo);
        if (this.txtObj1 != undefined) {
            this.txtGizmos.push(this.txtObj1);
        }
        if (this.txtObj2 != undefined) {
            this.txtGizmos.push(this.txtObj2);
        }
        if (this.txtObj3 != undefined) {
            this.txtGizmos.push(this.txtObj3);
        }
        this.async.setTimeout(() => this.displaySettings(), 500);
    }
    clearDisplay() {
        this.txtGizmos.forEach((gizmo) => setText(gizmo, ""));
    }
    // Returns a formatted setting key based on overrides from default and some warning heuristics
    getFormattedKey(isDefault, key) {
        let colorString = exports.HTMLHelpers.White;
        let formattedKey = key.toString();
        // Change Display if there's an Override from Default
        if (!isDefault) {
            // Add Text Indicator
            formattedKey = "*" + formattedKey;
            // Dynamic Warning Color based on Heuristics
            switch (key) {
                // Warning Cases
                case 'playerInitialArea':
                case 'playerInitialState':
                case 'turboUpdateSeconds':
                case 'useRounds':
                case 'heartbeatFrequencySeconds':
                case 'gameMode':
                    colorString = exports.HTMLHelpers.Pink;
                    break;
                default:
                    colorString = exports.HTMLHelpers.MetaLightBlue;
            }
        }
        return wrapColor(formattedKey, colorString);
    }
    // Returns a formatted string representing the Turbo Setting value based on it's type
    getFormattedValue(settingValue) {
        const dType = typeof settingValue;
        switch (dType) {
            case 'boolean':
                settingValue = settingValue;
                break;
            case 'number':
                settingValue = settingValue;
                break;
            case 'object':
                if (settingValue instanceof Set) {
                    settingValue = settingValue;
                }
                else {
                    settingValue = JSON.stringify(settingValue);
                }
            default:
                settingValue = settingValue;
                break;
        }
        let valText = String(settingValue)?.toString() ?? '[None]';
        let colorString = exports.HTMLHelpers.White;
        switch (dType) {
            case 'boolean':
                colorString = settingValue ? exports.HTMLHelpers.Green : exports.HTMLHelpers.Gray;
                break;
            case 'number':
                colorString = settingValue > 0 ? exports.HTMLHelpers.Green : exports.HTMLHelpers.Gray;
                break;
            case 'object':
                const settingValueObj = settingValue;
                if (settingValueObj instanceof Set) {
                    valText = Array.from(settingValueObj.keys()).join(", ");
                    colorString = settingValueObj.size > 0 ? exports.HTMLHelpers.Green : exports.HTMLHelpers.Gray;
                }
                else {
                    valText = JSON.stringify(settingValue);
                    colorString = Object.entries(settingValue).length > 0 ? exports.HTMLHelpers.MetaLightBlue : exports.HTMLHelpers.Gray;
                }
                break;
        }
        return wrapColor(valText, colorString);
    }
    /** Sets up a string array with formatted string representations of each setting for display */
    cachePrettySettings() {
        this.clearDisplay();
        const currentSettingsMap = Object.entries(analytics_1.Turbo.getConfigs());
        let skipCounter = 0;
        currentSettingsMap.forEach(([key, settingValue]) => {
            const settingKey = key;
            if (!settingsKeys.has(key.toString())) {
                skipCounter++;
                return;
            }
            const defaultValue = analytics_1.TurboDefaultSettings[settingKey];
            const isDefault = defaultValue === settingValue;
            const formattedKey = this.getFormattedKey(isDefault, settingKey);
            const formattedValue = this.getFormattedValue(settingValue);
            let maybeDefaultInfo = "";
            if (!isDefault) {
                maybeDefaultInfo = wrapColor(wrapParens("Default: " + defaultValue.toString()), exports.HTMLHelpers.MetaLightBlue);
            }
            ;
            this.settingsDisplay.push(formattedKey + " : " + formattedValue + " " + maybeDefaultInfo + '\n');
        });
        this.settingsDisplay.push('\n' + "Not Shown" + wrapParens(skipCounter.toString()));
    }
    /**
     * Displays Current Turbo settings on the UI
     * @remarks Splits the strings across available TextGizmos for display with Max Limits of the Text
     */
    displaySettings() {
        this.cachePrettySettings();
        const maxStringLength = 1000;
        const remainingBuffer = 10;
        const joinString = "";
        const stopAtLength = maxStringLength - remainingBuffer;
        let stream = exports.HTMLHelpers.AlignLeft;
        let iTxtGizmo = 0;
        this.settingsDisplay.forEach((output) => {
            const currentLength = stream.length;
            const newLength = joinString.length + output.length;
            if (currentLength + newLength < stopAtLength) {
                stream += joinString + output;
            }
            else {
                // Time to print
                if (iTxtGizmo < this.txtGizmos.length) {
                    setText(this.txtGizmos[iTxtGizmo], stream);
                    iTxtGizmo++;
                    // Reset the stream with the new Text for the next time
                    stream = exports.HTMLHelpers.AlignLeft + output;
                }
                else {
                    TurboAnalytics_1.TURBO_DEBUG && console.warn("🔥🔥🔥 TurboSettingsUI: Can't finish streaming the settings, there aren't enough text objects available to fit the full text.  Please add more text objects.");
                }
            }
            // Send the last one
            setText(this.txtGizmos[iTxtGizmo], stream);
        });
    }
}
TurboConfigsUI.propsDefinition = {
    txtObj1: { type: hz.PropTypes.Entity },
    txtObj2: { type: hz.PropTypes.Entity },
    txtObj3: { type: hz.PropTypes.Entity },
};
hz.Component.register(TurboConfigsUI);
/** Provides confidence about your Turbo Setup
* @remarks  TODO (Creator): TURBO DEBUG ONLY - REMOVE BEFORE PUBLISHING YOUR WORLD
*  It checks the necessary components + flags some rules/heuristics.  feel free to extend this and provide some useful recipes for others
*/
class TurboValidator extends hz.Component {
    start() {
        if (!TurboAnalytics_1.TURBO_DEBUG) {
            return;
        }
        console.log("🚀 TURBO: Validating...");
        this.async.setTimeout(() => this.validateMe(), 1000);
    }
    // Nice Avatar, BTW
    validateMe() {
        TurboValidator.validated = new Array();
        TurboValidator.failed = new Array();
        this.validateTurboManager();
        this.validateAnalyticsManager();
        this.validateConfigs();
        this.printResults();
    }
    printResults() {
        if (TurboValidator.failed.length == 0) {
            console.log("🚀 TURBO: [PASS] Validations All Good!" + '\n' + TurboValidator.validated.join('\n'));
        }
        else {
            console.warn("🔥🔥🔥 TURBO: [WARN] Validations Warning! Some things are not good!" + '\n' +
                "Failures: " + '\n' + TurboValidator.failed.join('\n') + '\n' +
                "Here's the things that were OK: " + '\n' + TurboValidator.validated.join('\n'));
        }
    }
    validateConfigs() {
        const configValidationResults = TurboDebugConfig.runValidations();
        TurboValidator.validated.push("Validate Turbo Configs Results: " + configValidationResults.join(", "));
    }
    validateAnalyticsManager() {
        if (TurboAnalytics_1.AnalyticsManager && TurboAnalytics_1.AnalyticsManager.s_instance !== undefined) {
            TurboValidator.validated.push("🚀 TURBO: [PASS] AnalyticsManager is ready");
        }
        else {
            TurboValidator.failed.push("🔥🔥🔥 TURBO: [WARN] AnalyticsManager is NOT ready!");
        }
        return;
    }
    validateTurboManager() {
        if (analytics_1.Turbo.isReady()) {
            TurboValidator.validated.push("🚀 TURBO: [PASS] Turbo is ready");
        }
        else {
            TurboValidator.failed.push("🔥🔥🔥 TURBO: [WARN] Turbo is NOT ready!");
        }
        return;
    }
}
TurboValidator.propsDefinition = {};
TurboValidator.validated = new Array();
TurboValidator.failed = new Array();
hz.Component.register(TurboValidator);
