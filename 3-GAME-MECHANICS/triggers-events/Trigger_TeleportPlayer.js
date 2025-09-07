"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class TeleportPlayer extends core_1.Component {
    preStart() {
        this.spawnPointGizmo = this.props.spawnPointGizmo?.as(core_1.SpawnPointGizmo);
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, this.onPlayerEnter.bind(this));
    }
    start() { }
    onPlayerEnter(player) {
        this.spawnPointGizmo?.teleportPlayer(player);
    }
}
TeleportPlayer.propsDefinition = {
    spawnPointGizmo: { type: core_1.PropTypes.Entity }
};
core_1.Component.register(TeleportPlayer);
