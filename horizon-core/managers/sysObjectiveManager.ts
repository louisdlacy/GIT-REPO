import { Component, Player, NetworkEvent } from 'horizon/core';

/**
 * Defines the structure for a single objective.
 */
export interface Objective {
  id: string;
  description: string;
  targetValue: number;
  currentValue: number;
}

/**
 * Network event broadcasted when an objective's progress is updated.
 * The payload includes the player and the full state of the updated objective.
 */
export const OnObjectiveUpdated = new NetworkEvent<{
  player: Player;
  objectiveId: string;
  description: string;
  targetValue: number;
  currentValue: number;
}>('OnObjectiveUpdated');

/**
 * Network event broadcasted when a player completes an objective.
 * The payload includes the player and the ID of the completed objective.
 */
export const OnObjectiveCompleted = new NetworkEvent<{ player: Player; objectiveId: string }>('OnObjectiveCompleted');

/**
 * sysObjectiveManager
 * Manages objectives for all players, tracking progress and completion.
 */
class sysObjectiveManager extends Component<typeof sysObjectiveManager> {
  static propsDefinition = {};

  // Map<PlayerID, Map<ObjectiveID, ObjectiveData>>
  private playerObjectives: Map<number, Map<string, Objective>> = new Map();

  start() {
    console.log("sysObjectiveManager started.");
  }

  /**
   * Assigns a new objective to a player.
   * @param player The player to receive the objective.
   * @param objective The objective to add.
   */
  public addObjective(player: Player, objective: Objective): void {
    if (!this.playerObjectives.has(player.id)) {
      this.playerObjectives.set(player.id, new Map<string, Objective>());
    }

    const objectives = this.playerObjectives.get(player.id)!;
    if (objectives.has(objective.id)) {
      console.warn(`Player ${player.name.get()} already has objective '${objective.id}'. Overwriting.`);
    }
    
    objective.currentValue = objective.currentValue || 0;
    objectives.set(objective.id, objective);

    console.log(`Added objective '${objective.description}' for ${player.name.get()}.`);
    this.sendNetworkBroadcastEvent(OnObjectiveUpdated, {
      player,
      objectiveId: objective.id,
      description: objective.description,
      targetValue: objective.targetValue,
      currentValue: objective.currentValue,
    });
  }

  /**
   * Updates the progress of a specific objective for a player.
   * @param player The player whose objective progress is being updated.
   * @param objectiveId The ID of the objective to update.
   * @param amount The amount to add to the objective's current value.
   */
  public updateObjectiveProgress(player: Player, objectiveId: string, amount: number): void {
    const objectives = this.playerObjectives.get(player.id);
    if (!objectives) {
      console.warn(`Player ${player.name.get()} has no objectives.`);
      return;
    }

    const objective = objectives.get(objectiveId);
    if (!objective) {
      console.warn(`Player ${player.name.get()} does not have objective '${objectiveId}'.`);
      return;
    }

    if (objective.currentValue >= objective.targetValue) {
      return; // Already completed
    }

    objective.currentValue = Math.min(objective.targetValue, objective.currentValue + amount);
    console.log(`Updated progress for '${objective.description}' for ${player.name.get()}: ${objective.currentValue}/${objective.targetValue}`);

    this.sendNetworkBroadcastEvent(OnObjectiveUpdated, {
      player,
      objectiveId: objective.id,
      description: objective.description,
      targetValue: objective.targetValue,
      currentValue: objective.currentValue,
    });

    if (objective.currentValue >= objective.targetValue) {
      console.log(`Objective '${objective.description}' completed by ${player.name.get()}!`);
      this.sendNetworkBroadcastEvent(OnObjectiveCompleted, { player, objectiveId });
    }
  }
}

Component.register(sysObjectiveManager);