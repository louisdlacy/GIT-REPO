import { DialogContainer } from 'Dialog_UI';
import * as hz from 'horizon/core';

const MAX_TREE_LENGTH = 16; // For conversations that can loop back on themselves, terminate after this many steps so the tree doesn't infinitely grow

export class DialogScript extends hz.Component<typeof DialogScript> {
  static propsDefinition = {
    response: { type: hz.PropTypes.String },
    option1: { type: hz.PropTypes.String },
    nextDialog1: { type: hz.PropTypes.Entity },
    option2: { type: hz.PropTypes.String },
    nextDialog2: { type: hz.PropTypes.Entity },
    option3: { type: hz.PropTypes.String },
    nextDialog3: { type: hz.PropTypes.Entity },
  };

  private branchingDialogs: DialogScript[] = [];

  start() {
    let branch = this.props.nextDialog1?.getComponents<DialogScript>()[0];
    if (branch){
      this.branchingDialogs.push(branch);

      branch = this.props.nextDialog2?.getComponents<DialogScript>()[0];
      if (branch){
        this.branchingDialogs.push(branch);

        branch = this.props.nextDialog3?.getComponents<DialogScript>()[0];
        if (branch){
          this.branchingDialogs.push(branch);
        }
      }
    }
  }

  /**
   * Retrieves a dialog from the dialog tree based on the provided key sequence.
   *
   * @param key - An array of numbers representing the path in the dialog tree.
   * @returns A DialogContainer object with the dialog response and options, or undefined if the path is empty and the conversation has ended.
   */
  getDialogFromTree(key: number[]) : DialogContainer | undefined {
    if (key.length === 0){
      return {
        response: this.props.response,
        option1Text: this.props.option1 || 'Okay', // default to "Okay" if option1 is undefined
        option2Text: this.props.option2 || undefined,
        option3Text: this.props.option3 || undefined
      };
    }else if (key.length >= MAX_TREE_LENGTH){
      return {
        response: "You talk too much!",
        option1Text: "Okay, sorry",
      };
    }

    let index = key[0];
    if (this.branchingDialogs[index] === undefined){
      return undefined;
    }

    // traverse the tree until there are no more options
    key.shift();
    let result = this.branchingDialogs[index].getDialogFromTree(key);

    return result;
  }
}
hz.Component.register(DialogScript);
