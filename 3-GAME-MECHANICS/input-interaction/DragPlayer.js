"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const camera_1 = __importDefault(require("horizon/camera"));
const core_1 = require("horizon/core");
class GamePlayer extends core_1.Component {
    constructor() {
        super(...arguments);
        this.isDragging = false;
        this.dragOffset = core_1.Vec3.zero;
        this.initialDragDepth = 0;
    }
    start() {
        this.owner = this.entity.owner.get();
        this.raycast = this.props.raycast?.as(core_1.RaycastGizmo);
        this.raycast?.owner.set(this.owner);
        if (this.owner === this.world.getServerPlayer()) {
            return;
        }
        this.cameraTarget = this.props.cameraTarget;
        if (this.cameraTarget) {
            camera_1.default.setCameraModeAttach(this.cameraTarget);
        }
        this.owner.enterFocusedInteractionMode();
        // Setup drag and drop event listeners
        this.connectLocalBroadcastEvent(core_1.PlayerControls.onFocusedInteractionInputStarted, this.onDragStart.bind(this));
        this.connectLocalBroadcastEvent(core_1.PlayerControls.onFocusedInteractionInputMoved, this.onDragMove.bind(this));
        this.connectLocalBroadcastEvent(core_1.PlayerControls.onFocusedInteractionInputEnded, this.onDragEnd.bind(this));
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, this.onUpdate.bind(this));
    }
    onDragStart(data) {
        const firstInteraction = data.interactionInfo[0];
        if (!firstInteraction)
            return;
        // Perform raycast to see if we hit an entity
        const rayData = this.raycast?.raycast(firstInteraction.worldRayOrigin, firstInteraction.worldRayDirection);
        if (rayData && rayData.targetType === core_1.RaycastTargetType.Entity) {
            this.draggedEntity = rayData.target.parent.get() ?? rayData.target; //Get the parent entity or the entity itself
            this.isDragging = true;
            // Store the initial depth (distance from ray origin) to maintain Z-position
            this.initialDragDepth = rayData.distance;
            // Calculate offset between hit point and entity center in camera target's coordinate system
            if (this.cameraTarget) {
                // Get camera target's orientation vectors
                const cameraRotation = this.cameraTarget.rotation.get();
                const cameraForward = core_1.Quaternion.mulVec3(cameraRotation, core_1.Vec3.forward);
                const cameraRight = core_1.Quaternion.mulVec3(cameraRotation, core_1.Vec3.right);
                const cameraUp = core_1.Quaternion.mulVec3(cameraRotation, core_1.Vec3.up);
                const cameraPos = this.cameraTarget.position.get();
                // Calculate offset in camera target's local coordinate system
                const hitRelativeToCam = rayData.hitPoint.sub(cameraPos);
                const entityRelativeToCam = this.draggedEntity.position.get().sub(cameraPos);
                // Project both points onto camera's coordinate system
                const hitInCamSpace = new core_1.Vec3(hitRelativeToCam.dot(cameraRight), hitRelativeToCam.dot(cameraUp), hitRelativeToCam.dot(cameraForward));
                const entityInCamSpace = new core_1.Vec3(entityRelativeToCam.dot(cameraRight), entityRelativeToCam.dot(cameraUp), entityRelativeToCam.dot(cameraForward));
                // Store offset in camera space
                this.dragOffset = entityInCamSpace.sub(hitInCamSpace);
            }
            else {
                // Fallback to world coordinates if no camera target
                this.dragOffset = this.draggedEntity.position.get().sub(rayData.hitPoint);
            }
            //console.log(`Started dragging entity: ${this.draggedEntity.name.get()} at depth: ${this.initialDragDepth}`);
        }
    }
    onDragMove(data) {
        if (!this.isDragging || !this.draggedEntity)
            return;
        const firstInteraction = data.interactionInfo[0];
        if (!firstInteraction)
            return;
        if (this.cameraTarget) {
            // Get camera target's orientation vectors
            const cameraRotation = this.cameraTarget.rotation.get();
            const cameraForward = core_1.Quaternion.mulVec3(cameraRotation, core_1.Vec3.forward);
            const cameraRight = core_1.Quaternion.mulVec3(cameraRotation, core_1.Vec3.right);
            const cameraUp = core_1.Quaternion.mulVec3(cameraRotation, core_1.Vec3.up);
            // Get the camera target's position as the reference point
            const cameraPos = this.cameraTarget.position.get();
            // Calculate the current ray intersection point
            const rayOrigin = firstInteraction.worldRayOrigin;
            const rayDirection = firstInteraction.worldRayDirection;
            const currentIntersection = rayOrigin.add(rayDirection.mul(this.initialDragDepth));
            // Transform the intersection point to camera target's coordinate system
            const intersectionRelativeToCam = currentIntersection.sub(cameraPos);
            const intersectionInCamSpace = new core_1.Vec3(intersectionRelativeToCam.dot(cameraRight), intersectionRelativeToCam.dot(cameraUp), intersectionRelativeToCam.dot(cameraForward));
            // Apply the offset (which is already in camera space)
            const targetInCamSpace = intersectionInCamSpace.add(this.dragOffset);
            // Transform back to world space
            const targetInWorldSpace = cameraPos
                .add(cameraRight.mul(targetInCamSpace.x))
                .add(cameraUp.mul(targetInCamSpace.y))
                .add(cameraForward.mul(targetInCamSpace.z));
            this.draggedEntity.position.set(targetInWorldSpace);
        }
        else {
            // Fallback to original world coordinate behavior
            const newPosition = firstInteraction.worldRayOrigin
                .add(firstInteraction.worldRayDirection.mul(this.initialDragDepth))
                .add(this.dragOffset);
            this.draggedEntity.position.set(newPosition);
        }
    }
    onDragEnd(data) {
        if (this.isDragging && this.draggedEntity) {
            //console.log(`Stopped dragging entity: ${this.draggedEntity.name.get()}`);
            this.isDragging = false;
            this.draggedEntity = undefined;
            this.dragOffset = core_1.Vec3.zero;
            this.initialDragDepth = 0;
        }
    }
    onUpdate() {
        // Optional: Add visual feedback or continuous updates during drag
        if (this.isDragging && this.draggedEntity) {
            // Could add visual effects or smooth movement here
        }
    }
}
GamePlayer.propsDefinition = {
    cameraTarget: { type: core_1.PropTypes.Entity },
    raycast: { type: core_1.PropTypes.Entity }
};
core_1.Component.register(GamePlayer);
