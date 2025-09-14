import * as hz from 'horizon/core';
import { setGameState, GameState } from 'GameManager_COMPLETE';

class StartGameTriggerExample extends hz.Component<typeof StartGameTriggerExample> {
  static propsDefinition = {};

  start() {
    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerEnterTrigger,
      (enteredBy: hz.Player) => {
        this.handleOnPlayerEnter();
      }
    );
  }

  private handleOnPlayerEnter(): void {
    this.sendLocalBroadcastEvent(setGameState, {state: GameState.Playing});
  }
}
hz.Component.register(StartGameTriggerExample);
