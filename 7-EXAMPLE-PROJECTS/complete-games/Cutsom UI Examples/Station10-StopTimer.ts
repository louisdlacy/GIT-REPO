/*
  Station 10a: Non-Interactive Overlay

  This station demonstrates use of the non-interactive Screen Overlay mode for custom UIs. When a custom UI is set to this mode,
  it is displayed as a screen overlay in front of the player, which makes it a useful mechanism for displaying HUD information
  during gameplay.

  In this station, a non-interactive timer is placed in front of the player. The player has a predefined number of seconds to find the
  button in the world and step on it, stopping the timer. Else, the timer runs out, and the player "loses."

  This script attaches to the trigger zone, which when breached, causes the TimerEnd event to emit. The TimerEnd
  event causes the timer to stop running.
  
*/

import * as hz from 'horizon/core';
import { TimerEnd } from 'Station10-NonInteractiveOverlay'; // imports the event, which is emitted when the player enters the trigger.

class Station10_StopTimer extends hz.Component<typeof Station10_StopTimer> {
  static propsDefinition = {};

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (enteredBy: hz.Player) => {
      this.sendNetworkBroadcastEvent(TimerEnd, {timeMS: -1});
      console.log("Sent TimerEnd event from trigger.")
    })

  }
}
hz.Component.register(Station10_StopTimer);