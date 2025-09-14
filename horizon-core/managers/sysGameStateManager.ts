import { Component, NetworkEvent } from 'horizon/core';

/**
 * Enum for the different states of the game.
 */
export enum GameState {
  Lobby,
  InProgress,
  PostGame,
}

/**
 * Network event to broadcast game state changes.
 */
const OnGameStateChanged = new NetworkEvent<{ newState: GameState }>('OnGameStateChanged');

/**
 * sysGameStateManager
 * A central manager for the game's state.
 */
class sysGameStateManager extends Component<typeof sysGameStateManager> {
  static propsDefinition = {};

  private currentState: GameState = GameState.Lobby;

  /**
   * Logs the initial state when the component starts.
   */
  override start() {
    console.log(`sysGameStateManager started. Initial state: ${GameState[this.currentState]}`);
  }

  /**
   * Sets the current game state and broadcasts the change.
   * @param newState The new state to set.
   */
  public setGameState(newState: GameState): void {
    if (this.currentState === newState) {
      return; // Avoid redundant state changes and event sends.
    }

    const oldState = GameState[this.currentState];
    this.currentState = newState;
    const newStateName = GameState[this.currentState];

    console.log(`Game state changed from ${oldState} to ${newStateName}.`);

    // Broadcast the state change to all clients.
    this.sendNetworkBroadcastEvent(OnGameStateChanged, { newState: this.currentState });
  }

  /**
   * Returns the current game state.
   * @returns The current GameState enum value.
   */
  public getGameState(): GameState {
    return this.currentState;
  }
}

Component.register(sysGameStateManager);