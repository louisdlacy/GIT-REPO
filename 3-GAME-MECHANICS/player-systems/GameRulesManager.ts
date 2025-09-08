import { Component, PropTypes, Entity, Player, NetworkEvent } from 'horizon/core';

// Forward declaration for the sysGameStateManager component type.
// This allows TypeScript to know about its methods without needing to import the full file.
declare class sysGameStateManager extends Component {
  public setGameState(newState: number): void;
  start(): void;
}

// Redefine the GameState enum locally as it cannot be imported from other scripts.
enum GameState {
  Lobby,
  InProgress,
  PostGame,
}

// Define the network event to listen for stat changes.
// This must match the definition in the sending script (e.g., sysPlayerStatsManager).
const OnPlayerStatChanged = new NetworkEvent<{ player: Player; statName: string; newValue: number }>('OnPlayerStatChanged');

/**
 * GameRulesManager
 * Monitors player stats to determine if win/loss conditions are met.
 */
class GameRulesManager extends Component<typeof GameRulesManager> {
  static propsDefinition = {
    // Reference to the central configuration entity (gfcConfiguration).
    gfcConfiguration: { type: PropTypes.Entity },
    // The score required to win the game.
    scoreToWin: { type: PropTypes.Number, default: 100 },
  };

  private isGameOver: boolean = false;

  override preStart() {
    // Listen for the global player stat change event.
    this.connectNetworkBroadcastEvent(OnPlayerStatChanged, (payload) => {
      this.handlePlayerStatChanged(payload);
    });
  }

  override start() {
    console.log(`GameRulesManager started. Score to win is set to ${this.props.scoreToWin}.`);
  }

  /**
   * Handles incoming player stat changes and checks for win conditions.
   * @param payload The data from the OnPlayerStatChanged event.
   */
  private handlePlayerStatChanged(payload: { player: Player; statName: string; newValue: number }): void {
    // If the game is already over, do nothing.
    if (this.isGameOver) {
      return;
    }

    // Check if the stat is 'score' and if it meets the win condition.
    if (payload.statName === 'score' && payload.newValue >= this.props.scoreToWin) {
      this.isGameOver = true;
      console.log(`Win condition met by ${payload.player.name.get()} with a score of ${payload.newValue}! Ending game.`);

      // 1. Get the gfcConfiguration entity from props.
      const configEntity = this.props.gfcConfiguration;
      if (!configEntity) {
        console.error("GameRulesManager: 'gfcConfiguration' property is not assigned.");
        return;
      }

      // 2. Get the sysGameStateManager component from the config entity.
      // Note: In a real implementation, you would get the sysConfiguration component first,
      // then get the gameStateManager entity from its props. This is a simplified approach.
      const gameStateManagerComps = configEntity.getComponents("sysGameStateManager" as any);
      if (gameStateManagerComps && gameStateManagerComps.length > 0) {
        const gameStateManager = gameStateManagerComps[0] as sysGameStateManager;
        gameStateManager.setGameState(GameState.PostGame);
      } else {
        console.error("GameRulesManager: Could not find 'sysGameStateManager' component on the entity provided by gfcConfiguration.");
      }
    }
  }
}

Component.register(GameRulesManager);