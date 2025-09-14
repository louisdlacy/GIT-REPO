import * as hz from 'horizon/core';

export class ColorChangeButton extends hz.Component<typeof ColorChangeButton> {
  static propsDefinition = {
    trigger: { type: hz.PropTypes.Entity },
    color: { type: hz.PropTypes.Color },
    objectDetector: { type: hz.PropTypes.Entity },
    colorReceiver: { type: hz.PropTypes.Entity }
  };

  static ColorChangeEvent = new hz.LocalEvent<{
    color: hz.Color
  }>("colorChangeEvent");

  preStart() {
    if (this.props.trigger) {
      this.connectCodeBlockEvent(this.props.trigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
        this.sendLocalEvent(this.props.objectDetector!, ColorChangeButton.ColorChangeEvent, {
          color: this.props.color
        });

        this.sendLocalEvent(this.props.colorReceiver!, ColorChangeButton.ColorChangeEvent, {
          color: this.props.color
        });
      });
    }
  }

  start() {

  }
}
hz.Component.register(ColorChangeButton);
