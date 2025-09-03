"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const avatar_ai_agent_1 = require("horizon/avatar_ai_agent");
const camera_1 = __importDefault(require("horizon/camera"));
const SpawnEvent = new core_1.NetworkEvent('Spawn');
const MoveEvent = new core_1.NetworkEvent('Move');
const AttachEvent = new core_1.NetworkEvent('Attach');
// This script must be set to "Default" execution mode in the editor.
class NpcAvatarControl extends core_1.Component {
    constructor() {
        super(...arguments);
        this.moveDirection = core_1.Vec3.zero;
    }
    preStart() {
        // Get the NPC agent reference
        this.agent = this.entity.as(avatar_ai_agent_1.AvatarAIAgent);
        // Connect update event for continuous movement
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, this.onUpdate.bind(this));
        this.connectNetworkBroadcastEvent(SpawnEvent, this.onSpawnPlayer.bind(this));
        this.connectNetworkBroadcastEvent(MoveEvent, this.onMoveEvent.bind(this));
    }
    start() { }
    async onSpawnPlayer() {
        const result = await this.agent?.spawnAgentPlayer();
        if (result === avatar_ai_agent_1.AgentSpawnResult.Success) {
            const player = this.agent?.agentPlayer.get();
            if (player) {
                this.sendNetworkBroadcastEvent(AttachEvent, { player: player });
            }
        }
    }
    onMoveEvent(event) {
        // Update the direction based on the network event
        this.moveDirection = event.direction;
    }
    onUpdate(data) {
        if (!this.agent)
            return;
        // If any movement input is active, move the NPC
        if (this.moveDirection.magnitude() > 0) {
            const player = this.agent?.agentPlayer.get();
            if (!player)
                return;
            const currentPosition = player.position.get();
            const newPosition = currentPosition.add(this.moveDirection);
            // Use the agent's locomotion to move to the new position
            this.agent.locomotion.moveToPosition(newPosition, {
                travelTime: 0.5, // Adjust the travel time as needed
            });
            this.agent.locomotion.rotateTo(this.moveDirection, {
                rotationTime: 0.001, // Adjust the rotation time as needed
            });
        }
        else if (this.agent.locomotion.isMoving.get()) {
            // Stop movement if no input is active
            this.agent.locomotion.stopMovement();
        }
    }
}
core_1.Component.register(NpcAvatarControl);
// This script must be set to "Local" execution mode in the editor.
class PlayerController extends core_1.Component {
    constructor() {
        super(...arguments);
        this.isMovingForward = false;
        this.isMovingBackward = false;
        this.isMovingLeft = false;
        this.isMovingRight = false;
    }
    preStart() {
        // Initialize owner and server player references
        this.owner = this.entity.owner.get();
        this.serverPlayer = this.world.getServerPlayer();
        // Check if the entity is owned by a player
        if (this.owner === this.serverPlayer) {
            // The entity is owned by the server player, so end the script
            return;
        }
        // Get the NPC agent reference
        this.agent = this.entity.as(avatar_ai_agent_1.AvatarAIAgent);
        // Forward movement (W key in Desktop, Thumbstick forward in VR)
        const forwardInput = core_1.PlayerControls.connectLocalInput(core_1.PlayerInputAction.LeftXAxis, core_1.ButtonIcon.None, this);
        forwardInput.registerCallback((action, pressed) => {
            this.isMovingForward = pressed;
        });
        // Backward movement (S key in Desktop, Thumbstick backward in VR)
        const backwardInput = core_1.PlayerControls.connectLocalInput(core_1.PlayerInputAction.LeftYAxis, core_1.ButtonIcon.None, this);
        backwardInput.registerCallback((action, pressed) => {
            this.isMovingBackward = pressed;
        });
        // Connect update event for continuous movement
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, this.onUpdate.bind(this));
    }
    start() { }
    onUpdate(data) {
        if (!this.agent)
            return;
        // Calculate movement direction based on input
        const moveDirection = this.calculateMoveDirection();
        // If any movement input is active, move the NPC
        if (moveDirection.magnitude() > 0) {
            const currentPosition = this.agent.position.get();
            const newPosition = currentPosition.add(moveDirection);
            // Use the agent's locomotion to move to the new position
            this.agent.locomotion.moveToPosition(newPosition);
        }
    }
    calculateMoveDirection() {
        // Get the camera's forward and right vectors for movement relative to camera
        const cameraForward = camera_1.default.forward.get().componentMul(new core_1.Vec3(1, 0, 1)).normalize();
        const cameraRight = cameraForward.cross(core_1.Vec3.up);
        let moveDirection = core_1.Vec3.zero;
        if (this.isMovingForward) {
            moveDirection = moveDirection.add(cameraForward);
        }
        if (this.isMovingBackward) {
            moveDirection = moveDirection.sub(cameraForward);
        }
        if (this.isMovingRight) {
            moveDirection = moveDirection.add(cameraRight);
        }
        if (this.isMovingLeft) {
            moveDirection = moveDirection.sub(cameraRight);
        }
        // Normalize the direction if it has magnitude
        if (moveDirection.magnitude() > 0) {
            moveDirection = moveDirection.normalize();
        }
        return moveDirection;
    }
}
core_1.Component.register(PlayerController);
