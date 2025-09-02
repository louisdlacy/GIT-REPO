import * as hz from 'horizon/core';

export class LLMButton extends hz.Component<typeof LLMButton> {
  static propsDefinition = {
    trigger: { type: hz.PropTypes.Entity },
    npc: { type: hz.PropTypes.Entity }
  };

  static ColorQueryEvent = new hz.LocalEvent<{}>("colorQueryEvent");

  preStart() {
    if (this.props.trigger) {
      this.connectCodeBlockEvent(this.props.trigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
        this.sendLocalEvent(this.props.npc!, LLMButton.ColorQueryEvent, {});
      });
    }
  }

  start() {

  }
}
hz.Component.register(LLMButton);
