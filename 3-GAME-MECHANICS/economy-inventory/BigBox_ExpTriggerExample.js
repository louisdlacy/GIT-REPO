"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BigBox_ExpManager_1 = require("BigBox_ExpManager");
const core_1 = require("horizon/core");
class BigBox_ExpTriggerExample extends core_1.Component {
    start() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            this.sendNetworkBroadcastEvent(BigBox_ExpManager_1.BigBox_ExpEvents.expAddToPlayer, { player: player, exp: this.props.xpGained });
        });
    }
}
BigBox_ExpTriggerExample.propsDefinition = {
    xpGained: { type: core_1.PropTypes.Number, default: 10.0 },
};
core_1.Component.register(BigBox_ExpTriggerExample);
