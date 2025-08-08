import * as hz from 'horizon/core';

export const RegisterWaypoint: hz.LocalEvent<{waypoint: hz.Entity, routeIndex: number, index: number}> = new hz.LocalEvent<{waypoint: hz.Entity, routeIndex: number, index: number}>('RegisterWaypoint');

class NPCAndroidWaypoint extends hz.Component<typeof NPCAndroidWaypoint> {
  static propsDefinition = {
    routeIndex: {type: hz.PropTypes.Number, default: 0},
    index: {type: hz.PropTypes.Number, default: 0},
  };

  start() {
    this.sendLocalBroadcastEvent(RegisterWaypoint, {waypoint: this.entity, routeIndex: this.props.routeIndex, index: this.props.index});
  }
}
hz.Component.register(NPCAndroidWaypoint);
