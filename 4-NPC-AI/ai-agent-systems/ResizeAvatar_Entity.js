"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class ResizeAvatar_Entity extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterTrigger, this.playerEnterTrigger.bind(this));
    }
    start() {
    }
    playerEnterTrigger(player) {
        player.avatarScale.set(this.props.scale);
    }
}
ResizeAvatar_Entity.propsDefinition = {
    scale: { type: core_1.PropTypes.Number, default: 1 },
};
core_1.Component.register(ResizeAvatar_Entity);
