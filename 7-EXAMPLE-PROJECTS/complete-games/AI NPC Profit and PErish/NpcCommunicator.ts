import { BaseComponent } from 'BaseComponent';
import { LogLevel } from 'BaseLogger';
import * as hz from 'horizon/core';
import { NPC_Base } from 'NPC_Base';

/**
 * This is a simple class which will pass text to the given NPC and allow a simple form of communication.
 */
class NpcCommunicator extends BaseComponent<typeof NpcCommunicator> {
  static propsDefinition = {
    ...BaseComponent.propsDefinition,
    targetNpc: { type: hz.PropTypes.Entity },
    button: { type: hz.PropTypes.Entity },
    trigger: { type: hz.PropTypes.Entity },
    text: { type: hz.PropTypes.String },
  };

  targetNpc: NPC_Base | undefined;

  preStart(): void {


    this.connectCodeBlockEvent(this.props.button!, hz.CodeBlockEvents.OnPlayerCollision, (player: hz.Player) => {
      this.tellNpc(player);
    })

    this.connectCodeBlockEvent(this.props.trigger!, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      this.tellNpc(player);
    })
  }

  start() {
    this.targetNpc = this.getAndVerifyComponent(this.props.targetNpc, NPC_Base);
    if (!this.targetNpc) {
      this.log("Target NPC not found", this.enableLogging, LogLevel.Error);
      return;
    }
  }

  tellNpc(player: hz.Player) {
    if (!player) {
      this.log(`No player found. How did we get here?`, true, LogLevel.Error);
      return;
    }

    // this will interrupt the NPC from voicing what they're saying if they are currently speaking
    // but they'll still think that they completed speaking their sentences
    this.targetNpc?.askLLMToStopTalking();  //make the input clear;

    let text = `${player.name.get()} just said: ${this.props.text}`;
    this.log(`Telling NPC: ${text}`, this.enableLogging);
    this.targetNpc?.elicitSpeech(text);
  }

}
hz.Component.register(NpcCommunicator);
