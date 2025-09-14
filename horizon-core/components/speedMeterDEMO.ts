import * as hz from 'horizon/core';

class speedMeterDEMO extends hz.Component<typeof speedMeterDEMO> {
  static propsDefinition = {
    speedMeter: { type: hz.PropTypes.Entity }
  };

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player) => {
      this.props.speedMeter?.owner.set(player);
      
    });
  }
}
hz.Component.register(speedMeterDEMO);