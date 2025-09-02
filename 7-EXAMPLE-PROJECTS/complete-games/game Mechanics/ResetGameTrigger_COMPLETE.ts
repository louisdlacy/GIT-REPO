import * as hz from 'horizon/core';
import { GameState, setGameState } from 'GameManager_COMPLETE';

class ResetGameTriggerExample extends hz.Component<typeof ResetGameTriggerExample> {
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
    this.sendLocalBroadcastEvent(setGameState, {state: GameState.Ready});
  }
}
hz.Component.register(ResetGameTriggerExample);
