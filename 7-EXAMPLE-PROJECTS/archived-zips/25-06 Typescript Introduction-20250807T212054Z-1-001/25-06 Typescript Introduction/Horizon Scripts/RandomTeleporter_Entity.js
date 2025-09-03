"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const RandomSpawnPoint_Func_1 = require("RandomSpawnPoint_Func");
class RandomTeleporter_Entity extends core_1.Component {
    preStart() {
        if (this.props.trigger) {
            this.connectCodeBlockEvent(this.props.trigger, core_1.CodeBlockEvents.OnPlayerEnterTrigger, (player) => { this.playerEnterTrigger(player); });
        }
    }
    start() {
    }
    playerEnterTrigger(player) {
        RandomSpawnPoint_Func_1.randomSpawnPoint_Func.randomlyTeleportPlayer(player);
    }
}
RandomTeleporter_Entity.propsDefinition = {
    trigger: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(RandomTeleporter_Entity);
