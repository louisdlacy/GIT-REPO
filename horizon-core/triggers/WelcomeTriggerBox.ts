import * as hz from "horizon/core";

export class WelcomeTriggerBox extends hz.Component<typeof WelcomeTriggerBox> {
  static propsDefinition = {};

  static welcomeTriggerZoneEvent = new hz.LocalEvent<{
    player: hz.Player;
    entered: boolean;
  }>("welcomeTriggerZoneEvent");

  start() {
    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerEnterTrigger,
      (player) => {
        this.sendLocalBroadcastEvent(
          WelcomeTriggerBox.welcomeTriggerZoneEvent,
          { player, entered: true }
        );
      }
    );

    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerExitTrigger,
      (player) => {
        this.sendLocalBroadcastEvent(
          WelcomeTriggerBox.welcomeTriggerZoneEvent,
          { player, entered: false }
        );
      }
    );
  }
}
hz.Component.register(WelcomeTriggerBox);
