"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const navmesh_1 = require("horizon/navmesh");
class NpcNavTest extends core_1.Component {
    constructor() {
        super(...arguments);
        this.startPosition = core_1.Vec3.zero;
        this.endPosition = core_1.Vec3.zero;
        this.shouldMoveTowardsEnd = true;
    }
    preStart() {
        this.agent = this.entity.as(navmesh_1.NavMeshAgent);
        this.startPosition = this.agent?.position.get() ?? core_1.Vec3.zero;
        this.endPosition = this.props.destination?.position.get() ?? core_1.Vec3.zero;
        const destination = this.shouldMoveTowardsEnd
            ? this.endPosition
            : this.startPosition;
        this.agent?.destination.set(destination);
        this.async.setInterval(() => {
            //console.log('Moving agent to position:', this.shouldMoveTowardsEnd);
            this.shouldMoveTowardsEnd = !this.shouldMoveTowardsEnd;
            const targetPosition = this.shouldMoveTowardsEnd
                ? this.endPosition
                : this.startPosition;
            this.agent?.destination.set(targetPosition);
        }, 3000);
    }
    start() {
        // Intentionally left blank
    }
}
NpcNavTest.propsDefinition = {
    destination: { type: core_1.PropTypes.Entity }
};
core_1.Component.register(NpcNavTest);
