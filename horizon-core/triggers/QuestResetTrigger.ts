/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */

/*
  This script resets all of the active quests in the world. It is attached to a Trigger Zone gizmo.

*/

import * as hz from 'horizon/core';
import { QuestNames, questBoardUpdate, questComplete, questReset } from 'QuestManager';
import { resetGemCounter } from 'GameManager';

class QuestResetTrigger extends hz.Component<typeof QuestResetTrigger> {
  static propsDefinition = {
    vfxAllQuestsWin: {type: hz.PropTypes.Entity},
    sfxAllQuestsWin: {type: hz.PropTypes.Entity},
  };

  start() {
    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerEnterTrigger,
      (enteredBy: hz.Player) => {
        const keys = Object.keys(QuestNames)
        keys.forEach((key,value) => {
          if ((value.valueOf() == 0) && (value.toString() != "0") && (value.toString() != "undefined") )
            console.log("Resetting quest: " + value)
            this.sendLocalBroadcastEvent( questReset, {player: enteredBy, questName: value } );
        })
        this.sendLocalBroadcastEvent( questBoardUpdate, {} );
        // resets the counter for total lifetime gems.
        this.sendLocalBroadcastEvent( resetGemCounter, {collector: enteredBy} );
        // stop playback of any effects that may be playing because of winning the game.
        if ((this.props.vfxAllQuestsWin) && (this.props.sfxAllQuestsWin)) {
          this.props.vfxAllQuestsWin?.as(hz.ParticleGizmo).stop()
          this.props.sfxAllQuestsWin?.as(hz.AudioGizmo).stop()
        }
        console.log("[QuestManager]: " + enteredBy.name.get() + " all quests reset.")
      }
    )
  }

}
hz.Component.register(QuestResetTrigger);