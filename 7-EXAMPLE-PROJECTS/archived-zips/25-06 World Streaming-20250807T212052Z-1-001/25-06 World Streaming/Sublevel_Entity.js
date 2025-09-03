"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const world_streaming_1 = require("horizon/world_streaming");
const Sublevel_Data_1 = require("Sublevel_Data");
class Sublevel_Entity extends core_1.Component {
    start() {
        Sublevel_Data_1.sublevel_Data.sublevels.push(this.entity.as(world_streaming_1.SublevelEntity));
    }
}
Sublevel_Entity.propsDefinition = {
    name: { type: core_1.PropTypes.String, default: 'BlueCube' },
};
core_1.Component.register(Sublevel_Entity);
