import { Component, PropTypes } from "horizon/core";
import { SublevelEntity } from "horizon/world_streaming";
import { sublevel_Data } from "Sublevel_Data";


class Sublevel_Entity extends Component<typeof Sublevel_Entity> {
  static propsDefinition = {
    name: { type: PropTypes.String, default: 'BlueCube' },
  };

  start() {
    sublevel_Data.sublevels.push(this.entity.as(SublevelEntity));
  }
}
Component.register(Sublevel_Entity);