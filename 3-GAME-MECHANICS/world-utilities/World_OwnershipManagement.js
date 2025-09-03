"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class OwnershipManagement extends core_1.Component {
    preStart() {
        this.serverPlayer = this.world.getServerPlayer();
        this.localEntity = this.props.localEntity?.as(core_1.Entity);
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, this.onPlayerEnterWorld.bind(this));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitWorld, this.onPlayerExitWorld.bind(this));
    }
    start() { }
    onPlayerEnterWorld(player) {
        this.localEntity?.owner.set(player);
    }
    onPlayerExitWorld(player) {
        this.localEntity?.owner.set(this.serverPlayer);
    }
}
OwnershipManagement.propsDefinition = {
    localEntity: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(OwnershipManagement);
