import { sysEvents } from 'sysEvents';
import * as hz from 'horizon/core';

class RoomC_CannonBall extends hz.Component<typeof RoomC_CannonBall> {
  static propsDefinition = {};

  start() {
    this.sendNetworkBroadcastEvent(sysEvents.OnRegisterBall, {ball: this.entity});
  }
}
hz.Component.register(RoomC_CannonBall);
