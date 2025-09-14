/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */

/**
  This script manages the basic gameflow and the events that trigger changes to gamestate. The events are defined in 
  this file and exported. This file contains listeners for these events, as well as handlers that are triggered when
  the listener receives the specified event.

  As properties of the GameManager class, you specify the 5 gems that are to be found in the world. 
 */

import * as hz from 'horizon/core';
import { QuestNames, questComplete } from 'QuestManager';
import { isNPC } from 'Utils';

// $$$ SPO Added to decrementGreenGemCount
// import { refreshScore } from 'EconomyUI';

export const gameStateChanged = new hz.LocalEvent<{state: GameState}>('gameStateChanged');
export const setGameState = new hz.LocalEvent<{state: GameState}>('setGameState');
export const moveGemToCourse = new hz.LocalEvent<{gem: hz.Entity}>('moveGemToCourse');
export const collectGem = new hz.LocalEvent<{gem: hz.Entity, collector: hz.Player}>('collectGem');
export const resetGemCounter = new hz.LocalEvent<{collector: hz.Player}>('resetGemCounter');



// $$$ SPO Added to decrementGreenGemCount
export const merchantTakesGem = new hz.LocalEvent<{gem: hz.Entity, player: hz.Player}>('merchantTakesGem');

export let gems: hz.Entity[] = [];
export let totalGemsCollected: Map<bigint, hz.Entity> = new Map<bigint, hz.Entity>();

  class GameManager extends hz.Component<typeof GameManager> {
    static propsDefinition = {
    gemOne: {type: hz.PropTypes.Entity},
    gemTwo: {type: hz.PropTypes.Entity},
    gemThree: {type: hz.PropTypes.Entity},
    gemFour: {type: hz.PropTypes.Entity},
    gemFive: {type: hz.PropTypes.Entity},
    scoreboard: {type: hz.PropTypes.Entity},
    sfxStartGame: {type: hz.PropTypes.Entity}, 
    sfxResetGame: {type: hz.PropTypes.Entity}, 
  };

  private gameState!: GameState;

  private totalGemsCollected: Map<bigint, hz.Entity> = totalGemsCollected;//new Map<bigint, hz.Entity>();
  private totalLifetimeGemsCollected: number = 0 // tracked for counting toward QuestCollect15TotalGems

  start() {
    this.gameState = GameState.Ready;
    this.setGameState(GameState.Ready);

    let gem1: Readonly<hz.Entity> | undefined = this.props.gemOne;
    let gem2: Readonly<hz.Entity> | undefined = this.props.gemTwo;
    let gem3: Readonly<hz.Entity> | undefined = this.props.gemThree;
    let gem4: Readonly<hz.Entity> | undefined = this.props.gemFour;
    let gem5: Readonly<hz.Entity> | undefined = this.props.gemFive;

    gems.push(
      gem1!,
      gem2!,
      gem3!,
      gem4!,
      gem5!
    );

  this.connectLocalBroadcastEvent(setGameState, (data:{state: GameState}) => {
    this.setGameState(data.state);
    });

  this.connectLocalBroadcastEvent(collectGem, (data:{gem: hz.Entity, collector: hz.Player}) => {
    this.handleGemCollect(data.gem);

    // If gemCount >= 15 then send event to resolve quest for collecting 15 total gems.
    if (!isNPC(data.collector)) {
      this.totalLifetimeGemsCollected++;
      // $$$ SPO Added:
      // this.sendLocalBroadcastEvent( refreshScore, {  player : data.collector } );
      
      // console.log("[GameManager] " + data.collector.name.get() + " grabbed a gem! Lifetime total: " + this.totalLifetimeGemsCollected.toString())
      if ((this.totalLifetimeGemsCollected >= 15) && (data.collector.hasCompletedAchievement('QuestCollect15Gems') == false)) {
          this.sendLocalBroadcastEvent( questComplete, {player: data.collector, questName: QuestNames.QuestCollect15Gems } );
      }
    }
  });

    // If reset gem counter event is reset, then reset gem counts for player (data.collector).
    this.connectLocalBroadcastEvent(resetGemCounter, (data:{collector: hz.Player}) => {
    // triggered only when all quests are reset.
    this.resetGemCounter(data.collector);
  });

  }

  public resetGemCounter(player: hz.Player): void {
    this.totalLifetimeGemsCollected = 0;
    // console.log("[" + player.name.get() + "]: Total gems collected reset: 0")
  }

  public setGameState(state: GameState): void {
    if (this.gameState === state) {
      return;
    }

    const initialGameStateValue = this.gameState;
    switch (state) {
      case GameState.Ready:
        if (this.gameState !== GameState.Ready) {
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
        this.updateScoreboard('Game Over?');
        break;
    }

    if (initialGameStateValue !== this.gameState) {
      this.sendLocalBroadcastEvent(gameStateChanged, {state: this.gameState});
    }
  }
  private updateScoreboard(text: string): void {
    let sb:any = this.props.scoreboard
    sb.as(hz.TextGizmo).text.set(text);
  }


  private onGameStateReady(): void {
    this.totalGemsCollected.clear();
    if (this.props.sfxResetGame) {
      let mySFX: hz.AudioGizmo = this.props.sfxResetGame.as(hz.AudioGizmo);
      mySFX.play()
    }
    this.updateScoreboard('Ready to Start!');
  }

  private handleGemCollect(gem: hz.Entity): void {
    if (!this.totalGemsCollected.has(gem.id)) {
      this.totalGemsCollected.set(gem.id, gem);
      this.updateScoreboard(`Gems Collected: ${this.totalGemsCollected.size}`);
    }
    if (this.totalGemsCollected.size === gems.length) {
      this.setGameState(GameState.Finished);
    }
  }

  private onGameStatePlaying(): void {
    this.updateScoreboard('Game On!');
    if (this.props.sfxStartGame) {
      let mySFX: hz.AudioGizmo = this.props.sfxStartGame.as(hz.AudioGizmo);
      mySFX.play()
    }
    gems.forEach((gem: hz.Entity) => {
      this.sendLocalEvent(
        gem,
        moveGemToCourse,
        { gem : gem },
      );
    });
  }
}
hz.Component.register(GameManager);

export enum GameState {
  'Ready',
  'Playing',
  'Finished',
};
