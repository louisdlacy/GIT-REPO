import { Component, NetworkEvent, Player } from 'horizon/core';

// =================================================================
// GLOBAL EVENT DEFINITIONS
// These events are defined here to be used across different manager scripts.
// =================================================================

/**
 * Broadcasts when the overall game state changes (e.g., from Lobby to InProgress).
 */
export const OnGameStateChanged = new NetworkEvent<{ newState: number }>('OnGameStateChanged');

/**
 * Broadcasts when a specific player stat (like health, ammo, etc.) is updated.
 */
export const OnPlayerStatChanged = new NetworkEvent<{ player: Player; statName: string; newValue: number }>('OnPlayerStatChanged');

/**
 * Broadcasts when a player is defeated (e.g., health reaches zero).
 */
export const OnPlayerDefeated = new NetworkEvent<{ player: Player }>('OnPlayerDefeated');

/**
 * Broadcasts when a player completes an objective.
 */
export const OnObjectiveCompleted = new NetworkEvent<{ player: Player; objectiveId: string }>('OnObjectiveCompleted');

/**
 * Broadcasts when a player's objective progress is updated.
 */
export const OnObjectiveUpdated = new NetworkEvent<{ player: Player; objectiveId: string; currentValue: number; targetValue: number }>('OnObjectiveUpdated');

/**
 * Broadcasts when a player collects an item.
 */
export const OnItemCollected = new NetworkEvent<{ player: Player, itemName: string, pointValue: number }>('OnItemCollected');


/**
 * sysGlobalEventManager
 * This component serves as a central library for defining globally accessible NetworkEvents.
 * It doesn't have any logic itself but allows other scripts to import and use these consistent event definitions.
 */
class sysGlobalEventManager extends Component<typeof sysGlobalEventManager> {
  static propsDefinition = {};

  start() {
    console.log("sysGlobalEventManager started. Global events are now defined.");
  }
}

Component.register(sysGlobalEventManager);