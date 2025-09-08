import { Component, PropTypes, Entity, NetworkEvent } from 'horizon/core';

// Forward declaration for the sysGameStateManager component type.
// This allows TypeScript to know about its methods without needing to import the full file.
declare class sysGameStateManager extends Component {
  public setGameState(newState: number): void;
  public getGameState(): number;
  start(): void;
}

// Define the events this manager will interact with or broadcast.
const OnGameStateChanged = new NetworkEvent<{ newState: number }>('OnGameStateChanged');
const OnMatchStart = new NetworkEvent<{}>('OnMatchStart');

// Define the GameState enum locally to match sysGameStateManager.
enum GameState {
  Lobby,
  InProgress,
  PostGame,
}

/**
 * GamePhaseManager
 * Manages the timing and transitions of different game phases like countdowns and match duration.
 */
class GamePhaseManager extends Component<typeof GamePhaseManager> {
  static propsDefinition = {
    // Reference to the central configuration entity.
    gfcConfiguration: { type: PropTypes.Entity },
    // The duration of the pre-game countdown in seconds.
    preGameCountdown: { type: PropTypes.Number, default: 5 },
    // The total duration of the game match in seconds.
    inGameDuration: { type: PropTypes.Number, default: 120 },
  };

  private countdownTimerId?: number;
  private gameTimerId?: number;

  override preStart() {
    // Listen for global game state changes broadcasted by sysGameStateManager.
    this.connectNetworkBroadcastEvent(OnGameStateChanged, (payload) => {
      this.handleGameStateChange(payload.newState);
    });
  }

  override start() {
    console.log("GamePhaseManager started.");
  }

  /**
   * Handles actions based on the new game state.
   * @param newState The new GameState enum value.
   */
  private handleGameStateChange(newState: GameState): void {
    if (newState === GameState.InProgress) {
      this.startPreGameCountdown();
    }
  }

  /**
   * Starts the pre-game countdown. After the countdown, it starts the main game timer.
   */
  private startPreGameCountdown(): void {
    console.log(`Pre-game countdown started for ${this.props.preGameCountdown} seconds.`);
    // Clear any existing timer to prevent duplicates.
    if (this.countdownTimerId) {
      this.async.clearTimeout(this.countdownTimerId);
    }
    this.countdownTimerId = this.async.setTimeout(() => {
      this.startMatch();
    }, this.props.preGameCountdown * 1000);
  }

  /**
   * Called after the pre-game countdown. Broadcasts the match start and begins the main game timer.
   */
  private startMatch(): void {
    console.log("Match starting now!");
    this.sendNetworkBroadcastEvent(OnMatchStart, {});

    // Clear any existing timer.
    if (this.gameTimerId) {
      this.async.clearTimeout(this.gameTimerId);
    }
    this.gameTimerId = this.async.setTimeout(() => {
      this.endMatch();
    }, this.props.inGameDuration * 1000);
  }

  /**
   * Called when the in-game timer expires. It requests a state change to PostGame.
   */
  private endMatch(): void {
    console.log("In-game timer finished. Ending match.");

    // 1. Get the gfcConfiguration entity from props.
    const configEntity = this.props.gfcConfiguration;
    if (!configEntity) {
      console.error("GamePhaseManager: 'gfcConfiguration' property is not assigned.");
      return;
    }

    // 2. Get the sysGameStateManager component from the config entity.
    const gameStateManagerComps = configEntity.getComponents("sysGameStateManager" as any);
    if (!gameStateManagerComps || gameStateManagerComps.length === 0) {
      console.error("GamePhaseManager: Could not find 'sysGameStateManager' component on the entity provided by gfcConfiguration.");
      return;
    }
    const gameStateManager = gameStateManagerComps[0] as sysGameStateManager;
    gameStateManager.setGameState(GameState.PostGame);
  }

  override dispose() {
    // Clean up timers when the component is destroyed.
    if (this.countdownTimerId) {
      this.async.clearTimeout(this.countdownTimerId);
    }
    if (this.gameTimerId) {
      this.async.clearTimeout(this.gameTimerId);
    }
  }
}

Component.register(GamePhaseManager);