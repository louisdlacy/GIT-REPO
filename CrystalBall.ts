import * as hz from 'horizon/core';
import { Npc } from 'horizon/npc';

/*
  Events to broadcast to other scripts that the LLM is speaking
*/
export const CrystalBallEvents = {
  BeginSpeechEvent: new hz.LocalEvent<{}>('llmBeginSpeechEvent'),
  EndSpeechEvent: new hz.LocalEvent<{}>('llmEndSpeechEvent')
}

class CrystalBall extends hz.Component<typeof CrystalBall> {
  static propsDefinition = {
    trigger: { type: hz.PropTypes.Entity },
    speakFX: { type: hz.PropTypes.Entity }
  };

  private _npc!: Npc;
  private _canSpeak: boolean = true;

  preStart() {
    if (this.props.trigger) {
      this.connectCodeBlockEvent(this.props.trigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
        this.askForFuture();
      });

    }
  }

  start() {
    this._npc = this.entity.as(Npc);
    if (!this._npc) {
      console.error("CrystalBall script needs to be attached to an NPC gizmo!");
      return;
    }
  }

  async askForFuture() {
    if (!this._canSpeak) {
      return;
    }

    this.startSpeech();
    await this._npc.conversation!.elicitResponse("Give me a prediction about my future");
    this.endSpeech();
  }

  startSpeech() {
    this._canSpeak = false;

    this.sendLocalEvent(this.props.speakFX!, CrystalBallEvents.BeginSpeechEvent, {});
  }

  endSpeech() {
    this._canSpeak = true;

    this.sendLocalEvent(this.props.speakFX!, CrystalBallEvents.EndSpeechEvent, {});
  }
}
hz.Component.register(CrystalBall);
