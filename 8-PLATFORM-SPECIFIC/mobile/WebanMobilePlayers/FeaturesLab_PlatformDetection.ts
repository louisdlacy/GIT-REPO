import * as hz from 'horizon/core';
import { SetTextGizmoText } from 'sysUtils';

class FeaturesLab_PlatformDetection extends hz.Component<typeof FeaturesLab_PlatformDetection> {
  static propsDefinition = {};

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player: hz.Player) => {
      SetTextGizmoText(this.entity, `Platform: ${player.deviceType.get()}`);

      // Branching code depending on player platform example
      switch(player.deviceType.get()) {
        case hz.PlayerDeviceType.VR:
          console.log("Platform: VR");
          break;
        case hz.PlayerDeviceType.Desktop:
          console.log("Platform: Desktop");
          break;
        case hz.PlayerDeviceType.Mobile:
          console.log("Platform: Mobile");
          break;
      }
    });
  }
}
hz.Component.register(FeaturesLab_PlatformDetection);
