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
export declare const TURBO_IS_ENABLED = true;
export declare const TURBO_DEBUG = true; /** TODO (Creator): IMPORTANT!!! Set to False before Release **/
import * as hz from 'horizon/core';
import { DiscoveryMadePayload, CustomEventPayload, EventData, Action } from 'horizon/analytics';
import { AreaEnterPayload, AreaExitPayload, DeathByEnemyPayload, DeathByPlayerPayload, FrictionHitPayload, KOEnemyPayload, KOPlayerPayload, LevelUpPayload, PlayerReadyEnterPayload, PlayerReadyExitPayload, RewardsEarnedPayload, RoundEndPayload, SectionEndPayload, SectionStartPayload, StageEndPayload, StageStartPayload, WeaponEquipPayload, WeaponGrabPayload, WeaponReleasePayload, WearableEquipPayload, WearableReleasePayload } from 'horizon/analytics';
import { FrictionCausedPayload, TaskStartPayload, TaskEndPayload, TaskStepStartPayload, TaskStepEndPayload, QuestCompletedPayload } from 'horizon/analytics';
export declare function isTurboManagerReady(): boolean;
export declare function Analytics(): AnalyticsManager | undefined;
/** TODO (Creator): Turbo Analytics Manager: IMPORTANT -> This Must be Attached to an entity in the world */
export declare class AnalyticsManager extends hz.Component {
    static s_instance: AnalyticsManager;
    start(): void;
    /** TODO (Creator): Add Hooks here from Existing Broadcasts
     WARNING: DO NOT SEND TURBO EVENTS FOR WORLD ENTER/EXIT, AFK/ENTER EXIT or you'll have double logging!
     @example
     this.connectLocalBroadcastEvent(Events.onFoundFiveDollars, (player:hz.Player) => {
         this.sendDiscoveryMade(player, { discoveryItemKey: "found_five_dollars" });
     });
     **/
    subscribeToEvents(): void;
    onDebugTurboPlayerEvent(_player: hz.Player, _eventData: EventData, _action: Action): void;
    /** TURBO SEND EVENTS */
    sendAreaEnter(payload: AreaEnterPayload): boolean;
    sendAreaExit(payload: AreaExitPayload): boolean;
    sendCustomEvent(payload: CustomEventPayload): boolean;
    sendDeathByEnemy(payload: DeathByEnemyPayload): boolean;
    sendDeathByPlayer(payload: DeathByPlayerPayload): boolean;
    sendKOPlayer(payload: KOPlayerPayload): boolean;
    sendKOEnemy(payload: KOEnemyPayload): boolean;
    sendLevelUp(payload: LevelUpPayload): boolean;
    sendPlayerReadyEnter(payload: PlayerReadyEnterPayload): boolean;
    sendPlayerReadyExit(payload: PlayerReadyExitPayload): boolean;
    sendRewardsEarned(payload: RewardsEarnedPayload): boolean;
    sendStageStart(payload: StageStartPayload): boolean;
    sendStageEnd(payload: StageEndPayload): boolean;
    sendSectionStart(payload: SectionStartPayload): boolean;
    sendSectionEnd(payload: SectionEndPayload): boolean;
    sendTaskStart(payload: TaskStartPayload): boolean;
    sendTaskStepStart(payload: TaskStepStartPayload): boolean;
    sendTaskStepEnd(payload: TaskStepEndPayload): boolean;
    sendTaskEnd(payload: TaskEndPayload): boolean;
    sendWeaponEquip(payload: WeaponEquipPayload): boolean;
    sendWeaponGrab(payload: WeaponGrabPayload): boolean;
    sendWeaponRelease(payload: WeaponReleasePayload): boolean;
    sendWearableEquip(payload: WearableEquipPayload): boolean;
    sendWearableRelease(payload: WearableReleasePayload): boolean;
    /** TODO (Creator): Round Start (All Players)
     * @remarks WARN: This is for ALL players and will send events for EACH affected player
     * @param playersInRound - Players that are in the game when the round starts
    */
    sendAllRoundStart(playersInRound: Array<hz.Player>, payload: {
        gameMode?: string;
        roundName?: string;
    }): boolean;
    /** TODO (Creator): Round End (All Players)
    * @remarks WARN: This is for ALL players and will send events for EACH affected player
    * @param playersLeftInRound - Players that are still in the game when the round ends
    */
    sendAllRoundEnd(playersLeftInRound: Array<hz.Player>, _payload: RoundEndPayload): boolean;
    sendDiscoveryMade(payload: DiscoveryMadePayload, firstTimeOnly?: boolean): boolean;
    sendFrictionCaused(payload: FrictionCausedPayload, firstTimeOnly?: boolean): boolean;
    sendFrictionHit(payload: FrictionHitPayload, firstTimeOnly?: boolean): boolean;
    sendQuestCompleted(payload: QuestCompletedPayload, firstTimeOnly?: boolean): boolean;
}
