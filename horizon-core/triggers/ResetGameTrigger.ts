/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */

/**
  This script monitors the Reset trigger zone and sends the local broadcast event setGameState to trigger
  the resetting of the game to Ready state.

 */
import * as hz from 'horizon/core';
import { GameState, setGameState } from 'GameManager';

class ResetGameTrigger extends hz.Component<typeof ResetGameTrigger> {
    static propsDefinition = {};

  start() {
    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerEnterTrigger,
      (enteredBy: hz.Player) => {
        this.handleOnPlayerEnter();
      }
    )
  }

  private handleOnPlayerEnter(): void {
    console.log("ResetGameTrigger");
    this.sendLocalBroadcastEvent(setGameState, {state: GameState.Ready});
  }
}
hz.Component.register(ResetGameTrigger);
