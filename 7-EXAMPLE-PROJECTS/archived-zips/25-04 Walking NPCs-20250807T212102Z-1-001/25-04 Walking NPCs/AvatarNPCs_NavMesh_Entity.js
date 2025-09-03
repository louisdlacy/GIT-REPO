"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const avatar_ai_agent_1 = require("horizon/avatar_ai_agent");
const core_1 = require("horizon/core");
const navmesh_1 = __importDefault(require("horizon/navmesh"));
class AvatarNPCs_Entity extends core_1.Component {
    constructor() {
        super(...arguments);
        this.destination = core_1.Vec3.zero;
        this.prevPos = core_1.Vec3.zero;
    }
    async preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, (player) => { this.playerEnterWorld(player); });
        const navMeshManager = navmesh_1.default.getInstance(this.world);
        this.navMesh = await navMeshManager.getByName('NPC') ?? undefined;
        if (this.navMesh) {
            this.navMesh.rebake();
        }
        else {
            console.log('navMesh not found');
        }
    }
    start() {
        if (this.props.destination) {
            this.destination = this.props.destination.position.get();
        }
    }
    playerEnterWorld(player) {
        if (this.entity === avatar_ai_agent_1.AvatarAIAgent.getGizmoFromPlayer(player)) {
            const positions = this.navMesh?.getPath(player.position.get(), this.destination)?.waypoints;
            this.entity.as(avatar_ai_agent_1.AvatarAIAgent).locomotion.moveToPositions(positions ?? [this.destination]);
            if (this.props.detectJump) {
                this.async.setInterval(() => { this.loop(player); }, 500);
            }
        }
    }
    loop(npcPlayer) {
        const distanceVec = this.destination.sub(npcPlayer.position.get());
        const distanceWithoutY = distanceVec.componentMul(new core_1.Vec3(1, 0, 1)).magnitude();
        const curPos = npcPlayer.position.get();
        const distanceMoved = curPos.distance(this.prevPos);
        this.prevPos = curPos;
        const isAtDest = distanceWithoutY < 0.25;
        const isStagnant = distanceMoved < 0.25;
        if (isStagnant && !isAtDest) {
            this.entity.as(avatar_ai_agent_1.AvatarAIAgent).locomotion.jump();
        }
    }
}
AvatarNPCs_Entity.propsDefinition = {
    destination: { type: core_1.PropTypes.Entity },
    detectJump: { type: core_1.PropTypes.Boolean, default: false },
};
core_1.Component.register(AvatarNPCs_Entity);
