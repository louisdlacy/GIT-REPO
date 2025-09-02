import { ColorChangeButton } from 'ColorChangeButton';
import * as hz from 'horizon/core';
import { Npc } from 'horizon/npc';
import { LLMButton } from 'LLMButton';

/*
  Note: need to assign hex -> color name here to pass into dynamic context
  since LLM is VERY BAD at properly recognizing hex values and translating them to color names
*/
const Colors = new Map<string, string>([
  ['#ffffff', 'gray'],
  ['#ff0000', 'red'],
  ['#00ff00', 'green'],
  ['#0000ff', 'blue']
]);

class ObjectDetector extends hz.Component<typeof ObjectDetector> {
  static propsDefinition = {
    speakingIndicator: {type: hz.PropTypes.Entity},
  };

  private _npc!: Npc;
  private _canReport: boolean = true;

  preStart() {
    this.connectLocalEvent(this.entity, ColorChangeButton.ColorChangeEvent, (data) => {
      this.updateColorKnowledge(data.color);
    });

    this.connectLocalEvent(this.entity, LLMButton.ColorQueryEvent, () => {
      this.askAboutColor();
    });
  }

  start() {
    this._npc = this.entity.as(Npc);
    if (!this._npc) {
      console.error("ObjectDetector: needs to be attached to NPC gizmo!");
    }

    /*
    * Note: Resetting the LLM's memory on start (and sometimes periodically through gameplay)
    * is a good practice to prevent the LLM's responses from degrading or hallucinating over time.
    */
    this._npc.conversation!.resetMemory();

    // Set understanding of sphere color to gray by default
    this.updateColorKnowledge(new hz.Color(1, 1, 1));

  }

  updateColorKnowledge(newColor: hz.Color) {
    const colorName = Colors.get(newColor.toHex());

    if (colorName == null) {
      console.log("Color name not defined for " + newColor.toHex() + "!");
      return;
    }

    this._npc.conversation!.addEventPerception("The sphere is now the color " + colorName + ".");

    const newColorPrompt = "The sphere is currently the color " + colorName + ".";
    this._npc.conversation!.setDynamicContext("sphere_color", newColorPrompt);
  }

  async askAboutColor() {
    /*
    * Note: This flag blocks the user from prompting the LLM while it's still speaking,
    * since the current behavior for multiple elicitResponse requests in quick sucession
    * is to create a stack of responses to generate sequentially. In this use case we would
    * only care about the most recent color, so having it report old colors wouldn't make sense.
    */
    if (!this._canReport) {
      return;
    }

    let meshEnt = this.props.speakingIndicator!.as(hz.MeshEntity);
    this._canReport = false;
    meshEnt.style.brightness.set(10);

    await this._npc.conversation!.elicitResponse("Tell me the current color of the sphere.");

    this._canReport = true;
    meshEnt.style.brightness.set(0);
  }
}
hz.Component.register(ObjectDetector);
