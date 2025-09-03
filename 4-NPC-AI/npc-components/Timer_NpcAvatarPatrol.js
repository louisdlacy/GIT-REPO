"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const avatar_ai_agent_1 = require("horizon/avatar_ai_agent");
class NpcAvatarMove extends core_1.Component {
    constructor() {
        super(...arguments);
        this.startPosition = core_1.Vec3.zero;
        this.endPosition = core_1.Vec3.zero;
        this.shouldMoveTowardsEnd = true;
    }
    preStart() {
        this.agent = this.entity.as(avatar_ai_agent_1.AvatarAIAgent);
        this.startPosition = this.agent?.position.get() ?? core_1.Vec3.zero;
        this.endPosition = this.props.destination?.position.get() ?? core_1.Vec3.zero;
        this.agent?.locomotion.moveToPosition(this.shouldMoveTowardsEnd
            ? this.endPosition
            : this.startPosition);
        this.async.setInterval(() => {
            //console.log('Moving agent to position:', this.shouldMoveTowardsEnd);
            this.shouldMoveTowardsEnd = !this.shouldMoveTowardsEnd;
            const targetPosition = this.shouldMoveTowardsEnd
                ? this.endPosition
                : this.startPosition;
            this.agent?.locomotion.moveToPosition(targetPosition);
        }, 3000);
    }
    start() {
        // Intentionally left blank
    }
}
NpcAvatarMove.propsDefinition = {
    destination: { type: core_1.PropTypes.Entity }
};
core_1.Component.register(NpcAvatarMove);
