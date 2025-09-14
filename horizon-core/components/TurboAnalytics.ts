/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * @format
 */

/**
 * 🚀 Turbo Analytics: Turbo API for Horizon In-World Analytics (Welcome!!)
 * TODO: (Creator) IMPORTANT: Make sure to attach an Entity to the Analytics Manager or nothing will work!
 * TODO: (Creator) <--- Search for this to uncover attention items
 * TODO: (Creator) Don't forget to have fun!
 */

export const TURBO_IS_ENABLED = true; /* TODO (Creator): Turbo Killswitch */
export const TURBO_DEBUG = true; /** TODO (Creator): IMPORTANT!!! Set to False before Release **/
const IS_DEMO = TURBO_DEBUG && true; /** TODO (Creator): IMPORTANT!!! Set to False before Release **/

import * as hz from 'horizon/core';
import { ITurboSettings, Turbo, TurboEvents, DiscoveryMadePayload, TurboDataService, CustomEventPayload, TurboDebug, EventData, Action } from 'horizon/analytics'
import { AreaEnterPayload, AreaExitPayload, DeathByEnemyPayload, DeathByPlayerPayload, FrictionHitPayload, KOEnemyPayload, KOPlayerPayload, LevelUpPayload, PlayerReadyEnterPayload, PlayerReadyExitPayload, RewardsEarnedPayload, RoundEndPayload, SectionEndPayload, SectionStartPayload, StageEndPayload, StageStartPayload, WeaponEquipPayload, WeaponGrabPayload, WeaponReleasePayload, WearableEquipPayload, WearableReleasePayload } from 'horizon/analytics';
import { FrictionCausedPayload, TaskStartPayload, TaskEndPayload, TaskStepStartPayload, TaskStepEndPayload, QuestCompletedPayload } from 'horizon/analytics';


/* TODO (Creator): IMPORTANT! Replace the Demo Settings with this instead */
const PRODUCTION_TURBO_SETTINGS: Partial<ITurboSettings> = {
  debug: TURBO_DEBUG,
  // ...
}

/**
 * TODO (Creator): WARNING DEMO ONLY
 * @remarks: Hover over individual props for definition preview
 **/
const DEMO_TURBO_SETTINGS: Partial<ITurboSettings> = {
  debug: TURBO_DEBUG,
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
}

function getTurboSettings(): Partial<ITurboSettings> {
  if (IS_DEMO) {
    console.warn(`🚀 TURBO: DEMO IS ACTIVE!  Are you sure???`);
    return DEMO_TURBO_SETTINGS;
  }
  TURBO_DEBUG && console.log(`🚀 TURBO: PRODUCTION Settings Active ✅`);
  return PRODUCTION_TURBO_SETTINGS;
}

export function isTurboManagerReady(): boolean {
  return TURBO_IS_ENABLED && !!Turbo;
}

export function Analytics(): AnalyticsManager | undefined {
  return AnalyticsManager && AnalyticsManager.s_instance;
}

/** TODO (Creator): Turbo Analytics Manager: IMPORTANT -> This Must be Attached to an entity in the world */
export class AnalyticsManager extends hz.Component {
  static s_instance: AnalyticsManager;

  start() {
    AnalyticsManager.s_instance = this;
    if (!TURBO_IS_ENABLED) return;
    this.subscribeToEvents();
    Turbo.register(this, getTurboSettings());

    this.entity.visible.set(false);
    console.log(`🚀 TURBO: Initializing TurboAnalyticsManager API`);

    if (Turbo.getConfigs().debug) {
      this.async.setTimeout(() => {
        !Turbo.isReady() && console.warn("🚀 TURBO: Turbo Analytics is not ready yet.  Are you sure it's hooked up?");
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
    this.connectLocalBroadcastEvent(TurboDebug.events.onDebugTurboPlayerEvent, (data: { player: hz.Player; eventData: EventData; action: Action }) => {
      this.onDebugTurboPlayerEvent(data.player, data.eventData, data.action);
    });
  }

  /* Turbo Debugging - DO NOT USE IN PRODUCTION
  @remarks Note: You can delete this once debug is off, but it's needed during Debugging
    because without it, sometimes the first emmitted debug event from Turbo is dropped which can cause the event to stop emmitting including for other potential subscribers
    See @DebugTurbo for various starter tools for you to debug and you'll see what's up (What's up!?)
  */
  onDebugTurboPlayerEvent(_player: hz.Player, _eventData: EventData, _action: Action): void {
    // return;
  }


  /** TURBO SEND EVENTS */

  sendAreaEnter(payload: AreaEnterPayload): boolean { return Turbo.send(TurboEvents.OnAreaEnter, payload); }
  sendAreaExit(payload: AreaExitPayload): boolean { return Turbo.send(TurboEvents.OnAreaExit, payload); }
  sendCustomEvent(payload: CustomEventPayload): boolean { return Turbo.send(TurboEvents.OnCustomAction, payload); }
  sendDeathByEnemy(payload: DeathByEnemyPayload): boolean { return Turbo.send(TurboEvents.OnDeathByEnemy, payload); }
  sendDeathByPlayer(payload: DeathByPlayerPayload): boolean { return Turbo.send(TurboEvents.OnDeathByPlayer, payload); }
  sendKOPlayer(payload: KOPlayerPayload): boolean { return Turbo.send(TurboEvents.OnKOPlayer, payload); }
  sendKOEnemy(payload: KOEnemyPayload): boolean { return Turbo.send(TurboEvents.OnKOEnemy, payload); }
  sendLevelUp(payload: LevelUpPayload): boolean { return Turbo.send(TurboEvents.OnLevelUp, payload); }
  sendPlayerReadyEnter(payload: PlayerReadyEnterPayload): boolean { return Turbo.send(TurboEvents.OnPlayerReadyEnter, payload); }
  sendPlayerReadyExit(payload: PlayerReadyExitPayload): boolean { return Turbo.send(TurboEvents.OnPlayerReadyExit, payload); }
  sendRewardsEarned(payload: RewardsEarnedPayload): boolean { return Turbo.send(TurboEvents.OnRewardsEarned, payload); }
  sendStageStart(payload: StageStartPayload): boolean { return Turbo.send(TurboEvents.OnStageStart, payload); };
  sendStageEnd(payload: StageEndPayload): boolean { return Turbo.send(TurboEvents.OnStageEnd, payload); };
  sendSectionStart(payload: SectionStartPayload): boolean { return Turbo.send(TurboEvents.OnSectionStart, payload); };
  sendSectionEnd(payload: SectionEndPayload): boolean { return Turbo.send(TurboEvents.OnSectionEnd, payload); };
  sendTaskStart(payload: TaskStartPayload): boolean { return Turbo.send(TurboEvents.OnTaskStart, payload); };
  sendTaskStepStart(payload: TaskStepStartPayload): boolean { return Turbo.send(TurboEvents.OnTaskStepStart, payload); };
  sendTaskStepEnd(payload: TaskStepEndPayload): boolean { return Turbo.send(TurboEvents.OnTaskStepEnd, payload); };
  sendTaskEnd(payload: TaskEndPayload): boolean { return Turbo.send(TurboEvents.OnTaskEnd, payload); };
  sendWeaponEquip(payload: WeaponEquipPayload): boolean { return Turbo.send(TurboEvents.OnWeaponEquip, payload); }
  sendWeaponGrab(payload: WeaponGrabPayload): boolean { return Turbo.send(TurboEvents.OnWeaponGrab, payload); }
  sendWeaponRelease(payload: WeaponReleasePayload): boolean { return Turbo.send(TurboEvents.OnWeaponRelease, payload); }
  sendWearableEquip(payload: WearableEquipPayload): boolean { return Turbo.send(TurboEvents.OnWearableEquip, payload); }
  sendWearableRelease(payload: WearableReleasePayload): boolean { return Turbo.send(TurboEvents.OnWearableRelease, payload); }

  /** TODO (Creator): Round Start (All Players)
   * @remarks WARN: This is for ALL players and will send events for EACH affected player
   * @param playersInRound - Players that are in the game when the round starts
  */
  sendAllRoundStart(playersInRound: Array<hz.Player>, payload: { gameMode?: string; roundName?: string; }): boolean {
    return Turbo.send(TurboEvents.OnGameRoundStartForPlayers, {
      players: playersInRound,
      sendPlayerRoundStart: true,
      gameStartData: payload
    });
  }

  /** TODO (Creator): Round End (All Players)
  * @remarks WARN: This is for ALL players and will send events for EACH affected player
  * @param playersLeftInRound - Players that are still in the game when the round ends
  */
  sendAllRoundEnd(playersLeftInRound: Array<hz.Player>, _payload: RoundEndPayload): boolean {
    return Turbo.send(TurboEvents.OnGameRoundEndForPlayers, {
      players: playersLeftInRound,
      sendPlayerRoundEnd: true,
    });
  }

  sendDiscoveryMade(payload: DiscoveryMadePayload, firstTimeOnly = false): boolean {
    if (firstTimeOnly && TurboDataService.getDiscoveryItemSeenCount(payload.player, payload.discoveryItemKey) > 0) {
      return false;
    }
    return Turbo.send(TurboEvents.OnDiscoveryMade, payload);
  }

  sendFrictionCaused(payload: FrictionCausedPayload, firstTimeOnly = false): boolean {
    if (firstTimeOnly && TurboDataService.getFrictionCausedSeen(payload.player).has(payload.frictionItemKey)) {
      return false;
    }
    return Turbo.send(TurboEvents.OnFrictionCaused, payload);
  }

  sendFrictionHit(payload: FrictionHitPayload, firstTimeOnly = false): boolean {
    if (firstTimeOnly && TurboDataService.getFrictionItemSeenCount(payload.player, payload.frictionItemKey) > 0) {
      return false;
    }
    return Turbo.send(TurboEvents.OnFrictionHit, payload);
  }

  sendQuestCompleted(payload: QuestCompletedPayload, firstTimeOnly: boolean = true): boolean {
    if (firstTimeOnly && TurboDataService.getQuestsUnlocked(payload.player).includes(payload.achievementKey)) {
      return false;
    }
    return Turbo.send(TurboEvents.OnQuestCompleted, payload);
  }

  // No... see @Turbo for automatic handlers
  // sendAFKEnter()
  // sendAFKExit()
  // sendWorldEnter()
  // sendWorldExit()

}
hz.Component.register(AnalyticsManager);
