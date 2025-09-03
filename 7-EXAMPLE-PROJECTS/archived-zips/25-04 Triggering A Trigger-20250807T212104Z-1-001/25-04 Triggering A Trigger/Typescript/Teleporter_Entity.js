"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class Teleporter_Entity extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, (player) => { this.playerEnterTrigger(player); });
    }
    start() {
    }
    playerEnterTrigger(player) {
        this.props.spawnPoint?.as(core_1.SpawnPointGizmo).teleportPlayer(player);
    }
}
Teleporter_Entity.propsDefinition = {
    spawnPoint: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(Teleporter_Entity);
