"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const avatar_ai_agent_1 = require("horizon/avatar_ai_agent");
const core_1 = require("horizon/core");
class AvatarNPCs_Entity extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, (player) => { this.playerEnterWorld(player); });
    }
    start() {
    }
    playerEnterWorld(player) {
        if (this.entity === avatar_ai_agent_1.AvatarAIAgent.getGizmoFromPlayer(player)) {
            if (this.props.destination) {
                this.entity.as(avatar_ai_agent_1.AvatarAIAgent).locomotion.moveToPosition(this.props.destination.position.get());
            }
        }
    }
}
AvatarNPCs_Entity.propsDefinition = {
    destination: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(AvatarNPCs_Entity);
