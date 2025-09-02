import * as hz from 'horizon/core';
import { Npc } from 'horizon/npc';

class ScoreIncrementer extends hz.Component<typeof ScoreIncrementer> {
  static propsDefinition = {
    npcGizmo: { type: hz.PropTypes.Entity },
    scoreView: { type: hz.PropTypes.Entity },
  };

  private _score: number = 0;
  private _npc!: Npc;
  private _canInteract: boolean = true;

  preStart() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      this.onPlayerInteract(player);
    });
  }

  start() {
    this._score = 0;

    this._npc = this.props.npcGizmo!.as(Npc);
    if (!this._npc) {
      console.error("No NPC gizmo set!");
      return;
    }

    this._npc.conversation!.resetMemory();

    this._npc.conversation!.setDynamicContext('score', 'The current score is 0.');
  }

  async onPlayerInteract(player: hz.Player) {
    /*
    * Note: This flag blocks the user from prompting the LLM while it's still speaking,
    * since the current behavior for multiple elicitResponse requests in quick sucession
    * is to create a stack of responses to generate sequentially which can cause hallucinations.
    */
    if (!this._canInteract) {
      return;
    }

    this._score += 1;
    this.updateText();

    this._canInteract = false;

    this._npc.conversation!.stopSpeaking();
    this._npc.conversation!.setDynamicContext('score', `The current score of the game is ${this._score}. Announce this number when asked about the score of the game.`);

    await this._npc.conversation!.elicitResponse(`Announce the current score of the game.`);
    this._canInteract = true;
  }

  updateText() {
    const label = this.props.scoreView!.as(hz.TextGizmo);
    label.text.set("Score: " + this._score.toString());
  }
}
hz.Component.register(ScoreIncrementer);
