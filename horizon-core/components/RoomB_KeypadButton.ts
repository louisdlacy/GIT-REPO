import * as hz from 'horizon/core';
import { sysEvents } from 'sysEvents';

class RoomB_KeypadButton extends hz.Component<typeof RoomB_KeypadButton> {
  static propsDefinition = {
    keypad: { type: hz.PropTypes.Entity },
    number: { type: hz.PropTypes.Number },
  };

  private startPos = hz.Vec3.zero;
  private pushedPos = hz.Vec3.zero;
  private isPushed = false;

  start() {
    const keypad: hz.Entity | undefined = this.props.keypad;
    if (keypad === undefined) return;

    this.startPos = this.entity.position.get();
    this.pushedPos = this.startPos.add(this.entity.forward.get().mul(-0.02));
    this.isPushed = false;

    // Listen for collisions with the player to press the button. Applicable for VR players physically pressing the button
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerCollision, () => {
      this.HandleButtonPress(keypad);
    });

    // Listen for `OnEntityTapped` events to press the button. Applicable for Web and Mobile players using Focused Interactions to press the button
    this.connectNetworkEvent(this.entity, sysEvents.OnEntityTapped, () => {
      this.HandleButtonPress(keypad);
    });
  }

  private HandleButtonPress(keypad: hz.Entity) {
    if (this.isPushed) return;

      this.isPushed = true;
      this.entity.position.set(this.pushedPos);
      // Notify the keypad that a button has been pressed
      this.sendNetworkEvent(keypad, sysEvents.OnButtonPressed, { number: this.props.number });
      // Reset the button after a small delay
      this.async.setTimeout(() => this.ResetButton(), 300);
  }

  private ResetButton() {
    this.entity.position.set(this.startPos);
    this.isPushed = false;
  }
}
hz.Component.register(RoomB_KeypadButton);
