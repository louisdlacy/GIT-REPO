import * as hz from 'horizon/core';

export const gameStateChanged = new hz.LocalEvent<{state: GameState}>('gameStateChanged');
export const setGameState = new hz.LocalEvent<{state: GameState}>('setGameState');
export const moveGemToCourse = new hz.LocalEvent<{}>('moveGemToCourse');
export const collectGem = new hz.LocalEvent<{gem: hz.Entity}>('collectGem');

class GameManagerExample extends hz.Component<typeof GameManagerExample> {
  static propsDefinition = {
    gemOne: {type: hz.PropTypes.Entity},
    gemTwo: {type: hz.PropTypes.Entity},
    gemThree: {type: hz.PropTypes.Entity},
    gemFour: {type: hz.PropTypes.Entity},
    gemFive: {type: hz.PropTypes.Entity},
    scoreboard: {type: hz.PropTypes.Entity},
  };
  private gameState!: GameState;
  private gems: hz.Entity[] = [];
  private totalGemsCollected: Map<bigint, hz.Entity> = new Map<bigint, hz.Entity>();

  start() {
    this.setGameState(GameState.Ready);
    this.connectLocalBroadcastEvent(setGameState, (data:{state: GameState}) => {
      this.setGameState(data.state);
    });

    this.connectLocalBroadcastEvent(collectGem, (data:{gem: hz.Entity}) => {
      this.handleGemCollect(data.gem);
    });


    const gem1: Readonly<hz.Entity> | undefined = this.props.gemOne;
    const gem2: Readonly<hz.Entity> | undefined = this.props.gemTwo;
    const gem3: Readonly<hz.Entity> | undefined = this.props.gemThree;
    const gem4: Readonly<hz.Entity> | undefined = this.props.gemFour;
    const gem5: Readonly<hz.Entity> | undefined = this.props.gemFive;

    this.gems.push(
      gem1!,
      gem2!,
      gem3!,
      gem4!,
      gem5!,
    );
  }

  public setGameState(state: GameState): void {
    if (this.gameState === state) {
      return;
    }

    switch (state) {
      case GameState.Ready:
        if (this.gameState !== GameState.Playing) {
          this.gameState = GameState.Ready;
          this.onGameStateReady();
        }
        break;
      case GameState.Playing:
        if (this.gameState === GameState.Ready) {
          this.gameState = GameState.Playing;
          this.onGameStatePlaying();
        }
        break;
      case GameState.Finished:
        this.gameState = GameState.Finished;
        this.onGameStateFinished();
        break;
    }

    console.log(`new game state is: ${GameState[this.gameState]}`);
    // this.sendLocalBroadcastEvent(gameStateChanged, {state: this.gameState});
  }

  private updateScoreboard(text: string): void {
    this.props.scoreboard!.as(hz.TextGizmo)!.text.set(text);
  }


  private onGameStateFinished(): void {
    this.totalGemsCollected.clear();
    this.updateScoreboard('Game Over');
  };

  private onGameStateReady(): void {
    this.totalGemsCollected.clear();
    this.updateScoreboard('Ready');
  };

  private handleGemCollect(gem: hz.Entity): void {
    if (!this.totalGemsCollected.has(gem.id)) {
      this.totalGemsCollected.set(gem.id, gem);
      this.updateScoreboard(`Gems Collected: ${this.totalGemsCollected.size}`);
    }

    if (this.totalGemsCollected.size === this.gems.length) {
      this.setGameState(GameState.Finished);
    }
  }

  private onGameStatePlaying(): void {
    this.gems.forEach((gem: hz.Entity) => {
      this.sendLocalEvent(
        gem,
        moveGemToCourse,
        {},
      );
    });
    this.updateScoreboard('Game On!');
  }

}
hz.Component.register(GameManagerExample);

export enum GameState {
  'Ready',
  'Playing',
  'Finished',
};
