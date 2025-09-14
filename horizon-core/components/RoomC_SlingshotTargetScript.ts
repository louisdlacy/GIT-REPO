import * as hz from 'horizon/core';
import { sysEvents } from 'sysEvents';

class RoomC_SlingshotTargetScript extends hz.Component<typeof RoomC_SlingshotTargetScript> {
  static propsDefinition = {
    puzzleManager: {type: hz.PropTypes.Entity, default: null}
  };

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnEntityEnterTrigger, (enteredBy: hz.Entity) => {
      this.sendNetworkEvent(this.props.puzzleManager, sysEvents.OnFinishPuzzle, {});
    });
  }
}
hz.Component.register(RoomC_SlingshotTargetScript);
