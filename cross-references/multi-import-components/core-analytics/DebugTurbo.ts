/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * @format
 */

// TODO (Creator): TURBO DEBUG ONLY - REMOVE BEFORE PUBLISHING YOUR WORLD

import * as hz from 'horizon/core';
import { Action, EventData, GameStateEnum, ParticipationEnum, Turbo, TurboDataService, TurboDebug, TurboDefaultSettings } from 'horizon/analytics';
import { AnalyticsManager, TURBO_DEBUG } from 'TurboAnalytics';

const DebugConsts = {
  PrintToConsole: false,
  PrintToTxtGizmo: true,
}

const actionKeys: ReadonlySet<string> = Object.freeze(new Set(["action", "actionArea", "actionAreaIsLobbySection", "actionAreaIsPlayerReadyZone", "actionCustom", "discoveryItemKey", "frictionItemKey", "gameMode", "gameState", "roundId", "roundName", "stageName", "taskKey", "taskStepKey", "turboState", "weaponKey", "wearableKey"]));

/** Retreives the Player Alias based on World with a fallback */
export function getPlayerName(player: hz.Player, world: hz.World): string {
  if (player === world.getServerPlayer()) { return 'Server Player' };
  try {
    return player.name.get() ?? 'No Player Name';
  } catch (error) {
    return 'No Player Name';
  } finally {
    // Finally...
  }
}

/** Provides a set of common HTML strings used in UI display */
export const HTMLHelpers = {
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
}

export function exists(obj: hz.Entity | undefined): boolean {
  return obj !== undefined && obj != null;
}

/** Returns the string hexcode based on the Turbo Action for easier visual contrast */
export function getColorHexFromAction(turboTriggerAction: Action): string {
  switch (turboTriggerAction) {
    case Action.DISCOVERY_MADE:
      return HTMLHelpers.MetaLightBlue;
    case Action.FRICTION_HIT:
    case Action.FRICTION_CAUSED:
      return HTMLHelpers.Orange;
    case Action.LEVEL_UP:
      return HTMLHelpers.Pink;
    case Action.REWARDS_EARNED:
      return HTMLHelpers.Purple;
    case Action.ACHIEVEMENT_UNLOCKED:
      return HTMLHelpers.Purple;
    case Action.AREA_ENTER:
    case Action.ROUND_START:
    case Action.SECTION_START:
    case Action.STAGE_START:
    case Action.TASK_START:
    case Action.TASK_STEP_START:
      return HTMLHelpers.Green;
    case Action.AREA_EXIT:
    case Action.ROUND_END:
    case Action.SECTION_END:
    case Action.STAGE_END:
    case Action.TASK_END:
    case Action.TASK_STEP_END:
      return HTMLHelpers.Red;
    case Action.WEAPON_EQUIP:
    case Action.WEAPON_GRAB:
    case Action.WEARABLE_EQUIP:
      return HTMLHelpers.Green;
    case Action.WEAPON_RELEASE:
    case Action.WEARABLE_RELEASE:
      return HTMLHelpers.Pink;
    default:
      return HTMLHelpers.MetaLightBlue;
  }
}

export function getStringWithBreaks(...items: Object[]): string {
  let outString = "";
  items.forEach(item => { outString += item.toString() + HTMLHelpers.Break; });
  return outString;
}

/** Formats seconds into mm:ss format */
export function getTimeString(timeInSeconds: number) {
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
export function getTimerDisplay(timerKey: string, sessionSeconds: number, latestIntervalSeconds: number, showOnlyRunning: boolean = false, isRunning: boolean = true, showTimerKey: boolean = false): string {
  let outDisplay = "";
  const running = sessionSeconds > 0 && isRunning; // proxy for now
  if (running || !showOnlyRunning) {
    const timerColor = running ? HTMLHelpers.Green : HTMLHelpers.White;
    outDisplay += wrapColor(`(S:) ${getTimeString(sessionSeconds)}`, timerColor);
    outDisplay += HTMLHelpers.Break;
    outDisplay += wrapColor(`(C:) ${getTimeString(latestIntervalSeconds)}`, timerColor);
    outDisplay += HTMLHelpers.Break;
    if (showTimerKey) {
      outDisplay += wrapColor(`Timer Key: ${timerKey}`, timerColor);
    }
    outDisplay += HTMLHelpers.Break;
  }
  return outDisplay;
}

export function setText(txtGizmo: hz.Entity | hz.TextGizmo | undefined, str: string) {
  txtGizmo && txtGizmo.as(hz.TextGizmo)?.text.set(str);
}

// Wraps Text with Color Tags
export function wrapColor(text: string, colorStartHex: string): string {
  return colorStartHex + text + HTMLHelpers.EndColorTag
}

// Wraps Text with Parentheses
export function wrapParens(text: string): string {
  return "(" + text + ")";
}

/** Shared Util for showing a Turbo Seen Map with formatting */
function getSeenStateMap(seenMap: Map<string, number>, colorHTML: string = HTMLHelpers.Pink): string {
  const entries = Array.from(seenMap.entries());
  return wrapColor(Array.from(entries.map((entry, _key) => `${entry[0]}: ${entry[1]}`)).join(HTMLHelpers.NewLine), colorHTML);
}

/** Returns printable KV Props for Debugging Payloads */
function getPrintKV(obj: Object, skipEmpty: boolean = false, nLevels = 0, includeKeys?: ReadonlySet<string> | undefined): string {
  let outString = "";

  // Sort by Key
  Object.entries(obj).sort((a, b) => a[0].localeCompare(b[0])).forEach(([key, val]) => {
    if (!includeKeys?.has(key)) { return; }
    let valString: string = "";
    if (val == undefined || val == null) {
      if (!skipEmpty) {
        valString = `${key} = ${valString} (Missing)`;
      }
    } else {
      if (Array.isArray(val)) {
        valString = val.join('\n');
      } else if (typeof val === 'object') {
        if (nLevels > 0)
          valString = JSON.stringify(val);
        else {
          valString = getPrintKV(val, skipEmpty, nLevels + 1);
        }
      } else {
        valString = val && val.toString();
      }
    }
    outString += `${key} = ${valString}` + '\n';
  });
  return outString;
}

/** UI for showing Turbo Game State (shared across all players) */
class TurboDebuggerGameState extends hz.Component<typeof TurboDebuggerGameState> {
  static propsDefinition = {
    txtObj1: { type: hz.PropTypes.Entity },
  };

  txtObj1: hz.TextGizmo | undefined;

  start(): void {
    if (!TURBO_DEBUG) { return; } // Killswitch for Debug

    this.txtObj1 = this.props.txtObj1?.as(hz.TextGizmo);
    this.async.setInterval(() => this.updateDisplay(), 1000);
  }

  updateDisplay(): void {
    if (this.txtObj1 === undefined) { return; }
    const gameState = TurboDataService.getGameStateEnum();
    const gameIsActive = TurboDataService.isGameActive();
    const gameRoundID = TurboDataService.getGameRoundId();
    const gameRoundName = TurboDataService.getGameRoundName();
    const gameRoundSeconds = TurboDataService.isGameActive() ? TurboDataService.getGameRoundSeconds() : 0;

    let outString = HTMLHelpers.AlignLeft;
    outString += wrapColor("🚀 TURBO GAME STATE", HTMLHelpers.MetaLightBlue) + HTMLHelpers.NewLine;
    outString += wrapColor("Game State: " + gameState, gameState === GameStateEnum.ACTIVE ? HTMLHelpers.Green : HTMLHelpers.White) + HTMLHelpers.NewLine;
    outString += wrapColor("Game Round ID: " + gameRoundID, HTMLHelpers.MetaLightBlue) + HTMLHelpers.NewLine;
    outString += wrapColor("Game Round Name: " + gameRoundName, HTMLHelpers.MetaLightBlue) + HTMLHelpers.NewLine;
    outString += wrapColor("Game Round Seconds: " + gameRoundSeconds, gameIsActive ? HTMLHelpers.Green : HTMLHelpers.MetaLightBlue) + HTMLHelpers.NewLine;
    setText(this.txtObj1, outString);
  }
}
hz.Component.register(TurboDebuggerGameState);


/** Debug the current Turbo Player State snapshot for a given player
* Connect this to a Trigger and optionally map a Text Gizmo to see the Output
* @remarks Some TurboDataService APIs may change, so do not rely on it in production, unless you really need to!
* TODO (Creator): TURBO DEBUG ONLY - REMOVE BEFORE PUBLISHING YOUR WORLD
*/
class TurboDebuggerPlayerState extends hz.Component<typeof TurboDebuggerEventStream> {
  static propsDefinition = {
    txtGizmo: { type: hz.PropTypes.Entity },
  };

  txtGizmo: hz.TextGizmo | undefined;
  currentPlayer: hz.Player | undefined;
  currentPlayerName: string = ''; // cache avoids unnecessary bridge calls

  start() {
    this.txtGizmo = this.props.txtGizmo?.as(hz.TextGizmo);
    setText(this.txtGizmo, 'TURBO: Player State')

    // Entering the trigger will set the current player and show + subscribe to new events coming in
    // That's an approximate way to see changes instead of a continuous set of updates which is expensive
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      if (player === this.world.getServerPlayer()) {
        return
      };
      this.currentPlayer = player;
      this.currentPlayerName = getPlayerName(player, this.world);
      this.showMyTurboState(player);
    });

    // Subscribe to new events
    this.connectLocalBroadcastEvent(TurboDebug.events.onDebugTurboPlayerEvent, (data: { player: hz.Player; eventData: EventData; action: Action }) => {
      if (data.player == this.currentPlayer)
        this.showMyTurboState(this.currentPlayer);
    });

  }

  showMyTurboState(player: hz.Player) {

    const playerAlias = this.currentPlayerName;
    const consolePrefix = `🚀 TURBO ${playerAlias} State: `;

    // Game
    const gameState = TurboDataService.getGameStateEnum();
    const gameRoundName = TurboDataService.getGameRoundName();
    const gameRoundSeconds = TurboDataService.getGameRoundSeconds();

    // Player
    const area = TurboDataService.getCurrentArea(player);
    const areaLatestSeconds = TurboDataService.getAreaLatestIntervalSeconds(player, area);
    const areaSeconds = TurboDataService.getAreaSessionSeconds(player, area);
    const discoveries = TurboDataService.getDiscoveriesSeen(player);
    const frictions = TurboDataService.getFrictionsSeen(player);
    const frictionsCaused = TurboDataService.getFrictionCausedSeen(player);
    const numEvents = TurboDataService.getTotalEventCounts(player);
    const roundName = TurboDataService.getRoundName(player);
    const roundSeconds = TurboDataService.getRoundSeconds(player);
    const tasks = TurboDataService.getTasksSeen(player);
    const turboState = TurboDataService.getParticipationState(player);
    const weaponsSeen = TurboDataService.getWeaponsSeen(player);
    const wearablesSeen = TurboDataService.getWearablesSeen(player);
    const worldSeconds = TurboDataService.getWorldSeconds(player);

    // Log to Console
    if (DebugConsts.PrintToConsole) {
      console.log(`${consolePrefix} Area: ${area}`);
      console.log(`${consolePrefix} Area Session Seconds: ${areaSeconds}`);
      console.log(`${consolePrefix} Area Latest Interval Seconds: ${areaLatestSeconds}`);
      // ...
    };

    // Display on Text Gizmo
    if (DebugConsts.PrintToTxtGizmo) {
      let outString = HTMLHelpers.AlignLeft;
      outString += `Player:  ${playerAlias} (Action Count: ${numEvents.toString()})\n`;

      outString += `World Seconds: ${worldSeconds}\n`;

      // Area
      outString += wrapColor(`Area: ${area}\n`, HTMLHelpers.Green);
      outString += wrapColor(`Area Session (Seconds): ${areaSeconds}\n`, HTMLHelpers.Green);
      outString += `Area Latest Interval (Seconds): ${areaLatestSeconds}\n`;

      // Games and Rounds State
      if (Turbo.getConfigs().useRounds) {
        outString += wrapColor(`Game State: ${gameState}\n`, gameState == GameStateEnum.ACTIVE ? HTMLHelpers.Green : HTMLHelpers.Yellow);
        if (gameRoundName) { outString += `Game Round: ${gameRoundName}\n`; }
        if (gameRoundSeconds > 0) { outString += `Game Round Seconds: ${gameRoundSeconds}\n`; }
        if (roundName != null) { outString += `Player Round: ${roundName}\n`; }
        if (roundSeconds > 0) { outString += `Player Round Seconds: ${roundSeconds}\n`; }
        outString += wrapColor(`Player Participation: ${turboState}\n`, turboState == ParticipationEnum.IN_ROUND ? HTMLHelpers.Green : HTMLHelpers.White);
      }

      // Seeen State
      if (discoveries.size > 0) { outString += `Discoveries: \n${getSeenStateMap(discoveries, HTMLHelpers.MetaLightBlue)}\n` };
      if (frictions.size > 0) { outString += `Friction: \n${getSeenStateMap(frictions, HTMLHelpers.Orange)}\n` };
      if (frictionsCaused.size > 0) { outString += `Friction Caused: \n${getSeenStateMap(frictionsCaused, HTMLHelpers.Orange)}\n`; }
      if (tasks.size > 0) { outString += `Tasks Seen: \n${getSeenStateMap(tasks, HTMLHelpers.Green)}\n` }
      if (weaponsSeen.size > 0) { outString += `Weapons Seen: \n${getSeenStateMap(weaponsSeen, HTMLHelpers.Pink)}\n`; }
      if (wearablesSeen.size > 0) { outString += `Wearables Seen: \n${getSeenStateMap(wearablesSeen, HTMLHelpers.Purple)}\n` }


      setText(this.txtGizmo, outString);
    };
  }
}
hz.Component.register(TurboDebuggerPlayerState);


/** Debug Turbo: Stream events to console or Txt Objects with some basic formatting
 * @remarks TODO (Creator): TURBO DEBUG ONLY - REMOVE BEFORE PUBLISHING YOUR WORLD
*/
class TurboDebuggerEventStream extends hz.Component<typeof TurboDebuggerEventStream> {
  static propsDefinition = {
    txtGizmo: { type: hz.PropTypes.Entity },
  };

  txtGizmo!: hz.Entity;

  start() {
    this.txtGizmo = this.props.txtGizmo as hz.Entity;
    this.connectLocalBroadcastEvent(TurboDebug.events.onDebugTurboPlayerEvent, (data: { player: hz.Player; eventData: EventData; action: Action }) => {
      const streamData: Partial<EventData> = {};
      Object.entries(data.eventData).forEach(([key, val]) => { if (actionKeys.has(key)) { streamData[key] = val } });
      this.onDebugTurboPlayerEvent(data.player, streamData, data.action);
    });
  }

  /** Returns formatted display string for an Event for Debugging */
  getDisplayActionData(playerAlias: string, action: Action, turboEventData: Partial<EventData>, skipEmpty: boolean = false): string {
    let outString = HTMLHelpers.AlignLeft;
    outString += 'Player: ' + wrapColor(playerAlias, HTMLHelpers.MetaLightBlue) + ' | Action: ' + wrapColor(Action[action].toString(), getColorHexFromAction(action)) + '\n\n';
    outString += '____Turbo Action Data____' + '\n';
    outString += getPrintKV(turboEventData, skipEmpty, 2, actionKeys) + '\n';
    return outString;
  }

  onDebugTurboPlayerEvent(player: hz.Player, eventData: Partial<EventData>, action: Action) {
    const playerAlias = eventData.playerAlias?.toString() ?? getPlayerName(player, this.world);
    DebugConsts.PrintToConsole && console.log(`🚀 TURBO: ✉️ Player ${playerAlias} -  Action - ${Action[action].toString()}`);
    DebugConsts.PrintToTxtGizmo && setText(this.txtGizmo, this.getDisplayActionData(playerAlias, action, eventData));
  }
}
hz.Component.register(TurboDebuggerEventStream);


const settingsKeys: ReadonlySet<string> = Object.freeze(new Set(["debug", "gameMode", "playerInitialState", "playerInitialArea", "useDiscovery", "useFriction", "useGameMode", "useLevelUp", "useRewards", "useTasks", "useRounds", "useSections", "useStages", "useQuests", "useWeaponEquip", "useWeaponGrab", "useWeapons", "useWearables", "turboUpdateSeconds",]));
type TurboSettingKey = keyof typeof TurboDefaultSettings;
type TurboSettingValue = typeof TurboDefaultSettings[TurboSettingKey];

/** This class is useful for TurboSettings Validation, it can help confirm enabled modules, events, and data
 * @remarks TODO (Creator): TURBO DEBUG ONLY - REMOVE BEFORE PUBLISHING YOUR WORLD
*/
class TurboDebugConfig {
  /** Warnings/Validations based on deltas from defaults */
  static runValidations(): Array<string> {
    const outMesssages = new Array<string>();
    if (!Turbo.getConfigs()) return new Array<string>();
    let counters = { info: 0, warning: 0, error: 0 };
    function print(msg: string, level: string = 'info') {
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
      if ((Turbo.getConfigs().gameMode as string).toLowerCase().includes("ninja")) {
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
class TurboConfigsUI extends hz.Component<typeof TurboConfigsUI> {
  static propsDefinition = {
    txtObj1: { type: hz.PropTypes.Entity },
    txtObj2: { type: hz.PropTypes.Entity },
    txtObj3: { type: hz.PropTypes.Entity },
  };

  txtObj1: hz.TextGizmo | undefined;
  txtObj2: hz.TextGizmo | undefined;
  txtObj3: hz.TextGizmo | undefined;

  // Text Gizmos: inventory for output of text stream for Display
  txtGizmos: hz.TextGizmo[] = [];
  settingsDisplay: string[] = [];

  start() {
    if (!TURBO_DEBUG) { return; } // Killswitch for Debug
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
  getFormattedKey(isDefault: boolean, key: TurboSettingKey): string {
    let colorString = HTMLHelpers.White;
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
          colorString = HTMLHelpers.Pink;
          break;
        default:
          colorString = HTMLHelpers.MetaLightBlue;
      }
    }
    return wrapColor(formattedKey, colorString);
  }

  // Returns a formatted string representing the Turbo Setting value based on it's type
  getFormattedValue(settingValue: TurboSettingValue): string {
    const dType = typeof settingValue;

    switch (dType) {
      case 'boolean':
        settingValue = settingValue as boolean;
        break;
      case 'number':
        settingValue = settingValue as number;
        break;
      case 'object':
        if (settingValue instanceof Set) {
          settingValue = settingValue as Set<string>;
        } else {
          settingValue = JSON.stringify(settingValue);
        }
      default:
        settingValue = settingValue as string;
        break;
    }

    let valText = String(settingValue)?.toString() ?? '[None]';
    let colorString = HTMLHelpers.White;

    switch (dType) {
      case 'boolean':
        colorString = (settingValue as boolean) ? HTMLHelpers.Green : HTMLHelpers.Gray;
        break;
      case 'number':
        colorString = (settingValue as number) > 0 ? HTMLHelpers.Green : HTMLHelpers.Gray;
        break;
      case 'object':
        const settingValueObj = settingValue as Object;
        if (settingValueObj instanceof Set) {
          valText = Array.from(settingValueObj.keys()).join(", ");
          colorString = settingValueObj.size > 0 ? HTMLHelpers.Green : HTMLHelpers.Gray;
        } else {
          valText = JSON.stringify(settingValue);
          colorString = Object.entries(settingValue).length > 0 ? HTMLHelpers.MetaLightBlue : HTMLHelpers.Gray;
        }
        break;
    }
    return wrapColor(valText, colorString);
  }

  /** Sets up a string array with formatted string representations of each setting for display */
  cachePrettySettings(): void {
    this.clearDisplay();
    const currentSettingsMap = Object.entries(Turbo.getConfigs());
    let skipCounter = 0;
    currentSettingsMap.forEach(([key, settingValue]) => {
      const settingKey = key as TurboSettingKey;
      if (!settingsKeys.has(key.toString())) {
        skipCounter++;
        return;
      }
      const defaultValue = TurboDefaultSettings[settingKey];
      const isDefault = defaultValue === settingValue;
      const formattedKey = this.getFormattedKey(isDefault, settingKey);
      const formattedValue = this.getFormattedValue(settingValue as TurboSettingValue);
      let maybeDefaultInfo = "";
      if (!isDefault) {
        maybeDefaultInfo = wrapColor(wrapParens("Default: " + defaultValue.toString()), HTMLHelpers.MetaLightBlue);
      };
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
    let stream = HTMLHelpers.AlignLeft;
    let iTxtGizmo = 0;
    this.settingsDisplay.forEach((output) => {
      const currentLength = stream.length;
      const newLength = joinString.length + output.length;
      if (currentLength + newLength < stopAtLength) {
        stream += joinString + output;
      } else {
        // Time to print
        if (iTxtGizmo < this.txtGizmos.length) {
          setText(this.txtGizmos[iTxtGizmo], stream);
          iTxtGizmo++;
          // Reset the stream with the new Text for the next time
          stream = HTMLHelpers.AlignLeft + output;
        } else {
          TURBO_DEBUG && console.warn("🔥🔥🔥 TurboSettingsUI: Can't finish streaming the settings, there aren't enough text objects available to fit the full text.  Please add more text objects.");
        }
      }
      // Send the last one
      setText(this.txtGizmos[iTxtGizmo], stream);
    });
  }
}
hz.Component.register(TurboConfigsUI);



/** Provides confidence about your Turbo Setup
* @remarks  TODO (Creator): TURBO DEBUG ONLY - REMOVE BEFORE PUBLISHING YOUR WORLD
*  It checks the necessary components + flags some rules/heuristics.  feel free to extend this and provide some useful recipes for others
*/
class TurboValidator extends hz.Component<typeof TurboValidator> {
  static propsDefinition = {};
  txtGizmo!: hz.TextGizmo;
  static validated = new Array<string>();
  static failed = new Array<string>();

  start() {
    if (!TURBO_DEBUG) { return; }
    console.log("🚀 TURBO: Validating...");
    this.async.setTimeout(() => this.validateMe(), 1000);
  }

  // Nice Avatar, BTW
  private validateMe(): void {
    TurboValidator.validated = new Array<string>();
    TurboValidator.failed = new Array<string>();
    this.validateTurboManager();
    this.validateAnalyticsManager();
    this.validateConfigs();
    this.printResults();
  }

  printResults() {
    if (TurboValidator.failed.length == 0) {
      console.log("🚀 TURBO: [PASS] Validations All Good!" + '\n' + TurboValidator.validated.join('\n'));
    } else {
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
    if (AnalyticsManager && AnalyticsManager.s_instance !== undefined) {
      TurboValidator.validated.push("🚀 TURBO: [PASS] AnalyticsManager is ready")
    } else {
      TurboValidator.failed.push("🔥🔥🔥 TURBO: [WARN] AnalyticsManager is NOT ready!");
    }
    return;
  }

  validateTurboManager() {
    if (Turbo.isReady()) {
      TurboValidator.validated.push("🚀 TURBO: [PASS] Turbo is ready");
    } else {
      TurboValidator.failed.push("🔥🔥🔥 TURBO: [WARN] Turbo is NOT ready!");
    }
    return;
  }
}
hz.Component.register(TurboValidator);
