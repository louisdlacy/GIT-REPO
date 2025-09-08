import { Component, PropTypes, Entity, NetworkEvent } from 'horizon/core';

// Forward declaration for the sysGameStateManager component type.
// This allows TypeScript to know about its methods without needing to import the full file.
declare class sysGameStateManager extends Component {
  public setGameState(newState: number): void;
  start(): void;
}

// Define the network event to listen for.
// This must match the definition in the sending script (TeamManager).
const OnTeamScoreChanged = new NetworkEvent<{ teamId: string, newScore: number }>('OnTeamScoreChanged');

// Define the GameState enum locally to match sysGameStateManager.
enum GameState {
  Lobby,
  InProgress,
  PostGame,
}

/**
 * TeamGameRulesManager
 * Monitors team scores to determine if a team-based win condition is met.
 */
class TeamGameRulesManager extends Component<typeof TeamGameRulesManager> {
  static propsDefinition = {
    // Reference to the central configuration entity (gfcConfiguration).
    gfcConfiguration: { type: PropTypes.Entity },
    // The score a team must reach to win the game.
    teamScoreToWin: { type: PropTypes.Number, default: 100 },
  };

  private isGameOver: boolean = false;

  override preStart() {
    // Listen for the global team score change event.
    this.connectNetworkBroadcastEvent(OnTeamScoreChanged, (payload) => {
      this.handleTeamScoreChanged(payload);
    });
  }

  override start() {
    console.log(`TeamGameRulesManager started. Score to win is set to ${this.props.teamScoreToWin}.`);
  }

  /**
   * Handles incoming team score changes and checks for win conditions.
   * @param payload The data from the OnTeamScoreChanged event.
   */
  private handleTeamScoreChanged(payload: { teamId: string, newScore: number }): void {
    // If the game is already over, do nothing to prevent multiple triggers.
    if (this.isGameOver) {
      return;
    }

    // Check if the new score meets or exceeds the win condition.
    if (payload.newScore >= this.props.teamScoreToWin) {
      this.isGameOver = true;
      console.log(`Win condition met by team ${payload.teamId} with a score of ${payload.newScore}! Ending game.`);

      // 1. Get the gfcConfiguration entity from props.
      const configEntity = this.props.gfcConfiguration;
      if (!configEntity) {
        console.error("TeamGameRulesManager: 'gfcConfiguration' property is not assigned.");
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
        console.error("TeamGameRulesManager: Could not find 'sysGameStateManager' component on the entity provided by gfcConfiguration.");
      }
    }
  }
}

Component.register(TeamGameRulesManager);