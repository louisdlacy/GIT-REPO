"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const avatar_ai_agent_1 = require("horizon/avatar_ai_agent");
const core_1 = require("horizon/core");
class AvatarNPCs_Entity extends core_1.Component {
    constructor() {
        super(...arguments);
        this.destination = core_1.Vec3.zero;
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, (player) => { this.playerEnterWorld(player); });
    }
    start() {
        if (this.props.destination) {
            this.destination = this.props.destination.position.get();
        }
    }
    playerEnterWorld(player) {
        if (this.entity === avatar_ai_agent_1.AvatarAIAgent.getGizmoFromPlayer(player)) {
            this.entity.as(avatar_ai_agent_1.AvatarAIAgent).locomotion.moveToPosition(this.destination);
            this.async.setInterval(() => { this.loop(player); }, 500);
        }
    }
    loop(npcPlayer) {
        const distanceVec = this.destination.sub(npcPlayer.position.get());
        const distanceWithoutY = distanceVec.componentMul(new core_1.Vec3(1, 0, 1)).magnitude();
        if (distanceWithoutY < 1 && distanceWithoutY > 0.25) {
            this.entity.as(avatar_ai_agent_1.AvatarAIAgent).locomotion.jump();
        }
    }
}
AvatarNPCs_Entity.propsDefinition = {
    destination: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(AvatarNPCs_Entity);
