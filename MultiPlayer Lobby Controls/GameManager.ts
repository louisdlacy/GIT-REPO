import { GameState, Events } from 'GameUtils';
import * as hz from 'horizon/core';

/** This script must be added to a game object in order to run */
class GameManager extends hz.Component<typeof GameManager> {
  static propsDefinition = {

  };
  private gameState: GameState = GameState.Ready;
  timerID: number = 0;
  countdownTimeInMS: number = 3000;

  /* Using preStart for broadcast listeners helps make sure bindings are in place first */
  preStart() {
    this.connectLocalBroadcastEvent(Events.registerNewMatch,
      (data: { gem: hz.Entity, player: hz.Player }) => {
        // TODO: update the game state to "Starting"
      }
    );

    this.connectLocalBroadcastEvent(Events.gameOver,
      (data: { gem: hz.Entity, player: hz.Player }) => {
        // TODO: update the game state to "Ending"
      }
    );

    this.connectLocalBroadcastEvent(Events.setGameState,
      (data: { newState: GameState }) => {
        this.setGameState(data.newState);
      }
    );
  }

  start() {
    this.setGameState(GameState.Ready);
  }

  public setGameState(state: GameState): void {
    /* If the new state is the same as the current state, stop. */
    if (this.gameState === state) {
      return;
    }

    const previousState = this.gameState;
    switch (state) {
      case GameState.Ready:
        this.gameState = GameState.Ready;
        break;
      case GameState.Starting:
        if (this.gameState === GameState.Ready) {
          this.gameState = GameState.Starting;
          // TODO: Call the "handleNewMatchStarting" event handler
        }
        break;
      case GameState.Playing:
        this.gameState = GameState.Playing;
        break;
      case GameState.Ending:
        this.gameState = GameState.Ending;
        this.handleGameOver();
        break;
      case GameState.Finished:
        this.gameState = GameState.Finished;
        break;
    }

    this.sendLocalBroadcastEvent(Events.gameStateChanged, {
      fromState: previousState,
      toState: this.gameState
    });
  }

  /* Displays a 3 second count down to all players */
  handleNewMatchStarting() {
    this.timerID = this.async.setInterval(() => {
      if(this.countdownTimeInMS > 0) {
        // TODO: show Popup UI message to everyone with remaining time
        this.countdownTimeInMS -= 1000; // decrement the countdown by 1 second
      } else {
        if (this.timerID !== 0) {
          this.async.clearInterval(this.timerID);
          this.timerID = 0;
          this.setGameState(GameState.Playing);
          this.countdownTimeInMS = 3000; // reset the initial countdown value
        }
      }
    }, 1000);
  }

  handleGameOver() {
    if (this.timerID === 0) {
      this.world.ui.showPopupForEveryone(`Game Over! \n Teleporting back to Lobby`, 3);
      this.timerID = this.async.setTimeout(() => {
        this.setGameState(GameState.Finished);
        this.async.clearTimeout(this.timerID);
        this.timerID = 0;
      }, 3000);
    }
  }
}
hz.Component.register(GameManager);
