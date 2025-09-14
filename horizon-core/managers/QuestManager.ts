/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */

/*
  This script manages the initialization, tracking, resolution and resetting of the quests in the world.

*/

import * as hz from 'horizon/core';
import { isNPC } from 'Utils';

export enum QuestNames {
  'QuestCollect1Coin', // trade 2 gems for 1 coin in the kiosk
  'QuestCollect1Gem', // collect 1 gem.
  'QuestCollect5Gems', // collect five gems in the world
  'QuestCollect15Gems', // collect 15 total gems (requires replay)
  'Collect1RedGem', // collect 1 red gem (requires collecting coins and trading them at kiosk) // 250108 SPO added.
  };


export const questComplete = new hz.LocalEvent<{player: hz.Player, questName: QuestNames}>('questComplete');
export const questReset = new hz.LocalEvent<{player: hz.Player, questName: QuestNames}>('questReset');
export const questBoardUpdate = new hz.LocalEvent<{}>('questBoardUpdate');

class QuestManager extends hz.Component<typeof QuestManager> {
  static propsDefinition = {
    questBoard: {type: hz.PropTypes.Entity}, // a reference to the hosting object if script is attached to the Quest Board. Else, a link to the Quest Board.
    sfxQuestWin: {type: hz.PropTypes.Entity},
    vfxAllQuestsWin: {type: hz.PropTypes.Entity},
    sfxAllQuestsWin: {type: hz.PropTypes.Entity},
    redGem: {type: hz.PropTypes.Entity},
    redGemPosition: {type: hz.PropTypes.Entity},
  };

  preStart() {}

  start() {
    this.questBoardUpdate()

    // listener for questComplete event.
    this.connectLocalBroadcastEvent(questComplete, (data:{player: hz.Player, questName: QuestNames}) => {
      this.completeQuest(data.player, data.questName);
    });


    // listener for questReset event.
    this.connectLocalBroadcastEvent(questReset, (data:{player: hz.Player, questName: QuestNames}) => {
      this.resetQuest(data.player, data.questName);
    });

    // listener for questBoardUpdate event.
    this.connectLocalBroadcastEvent(questBoardUpdate, ({}) => {
      this.questBoardUpdate();
    });

  };

  public completeQuest(player: hz.Player, questName: QuestNames): void {
    if (isNPC(player) == false) {
      let qValue = QuestNames[questName]
      if (player.hasCompletedAchievement(qValue) == false) {
        player.setAchievementComplete(qValue, true)
        console.log("Quest " + qValue + " complete for " + player.name.get()+"!")
        this.world.ui.showPopupForPlayer(player, 'Quest Complete!',2)
        if (qValue == "Collect1RedGem") {
          this.onCollect1RedGem()
        }
        if (this.props.sfxQuestWin) {
          this.props.sfxQuestWin.as(hz.AudioGizmo).play()
        }
        this.async.setTimeout(() => {
          if (this.checkAllQuestsCompleted(player) == true) { // This means all quests have been completed.
            if (this.props.vfxAllQuestsWin) {
              let myVFX: hz.ParticleGizmo = this.props.vfxAllQuestsWin.as(hz.ParticleGizmo)
              myVFX.play()
            }
            if (this.props.sfxAllQuestsWin) {
              let mySFX: hz.AudioGizmo = this.props.sfxAllQuestsWin.as(hz.AudioGizmo)
              mySFX.play()
            }
          }
        }, 3000);
      }
    }
  }

  public checkAllQuestsCompleted(player:hz.Player) {
    const keys = Object.keys(QuestNames)
    let allQuests: boolean = true
    let keyString: string = ""
    keys.forEach((key,value) => {
      keyString = key.toString()
      if (keyString.length >= 2) {
        if (player.hasCompletedAchievement(key.toString()) == false) {
          allQuests = false;
          return allQuests;
        };
      }
    });
    return allQuests;
  };
  
  
  public resetQuest(player: hz.Player, questName: QuestNames): void {
    let qValue = QuestNames[questName]
    if (qValue != undefined ) {
      // console.log("[QuestManager]: for " + player.name.get() + ", resetting quest: " + qValue)
      player.setAchievementComplete(qValue, false)
      if (qValue == "Collect1RedGem") {
        if ((this.props.redGem) && (this.props.redGemPosition)) {
          let myGem: hz.Entity | undefined = this.props.redGem?.as(hz.Entity)
          myGem.position.set(this.props.redGemPosition.position.get());
          myGem.as(hz.Entity).visible.set(false);
        }
    }
    }

  }

  public questBoardUpdate(): void {
    if (this.props.questBoard) {
      let myQuests: string[] = []
      const keys = Object.keys(QuestNames)
      keys.forEach((key,value) => {
        if (key) {
          myQuests.push(key.toString())
        }
      })
      if (myQuests.length > 0) {
        let myBoard: hz.AchievementsGizmo = this.props.questBoard.as(hz.AchievementsGizmo)
        myBoard.displayAchievements(myQuests)
      } else {
        console.error("No quests to display!")
      }

    }
  }

  public onCollect1RedGem(): void {
    if ((this.props.redGem) && (this.props.redGemPosition)) {
      this.props.redGem.position.set(this.props.redGemPosition.position.get());
      this.props.redGem.as(hz.Entity).visible.set(true);
    }

  }


}

hz.Component.register(QuestManager);