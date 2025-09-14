

import LocalCamera from "horizon/camera";
import { Component, Entity, Player, PropTypes, RaycastGizmo, RaycastTargetType, PlayerControls, InteractionInfo, Vec3, World, Quaternion } from "horizon/core";

class GamePlayer extends Component<typeof GamePlayer> {
  static propsDefinition = {
    cameraTarget: { type: PropTypes.Entity },
    raycast: { type: PropTypes.Entity }
  };

  owner?: Player;
  cameraTarget?: Entity;
  raycast?: RaycastGizmo;
  
  // Drag and drop state
  private draggedEntity?: Entity;
  private isDragging = false;
  private dragOffset = Vec3.zero;
  private initialDragDepth = 0;

  start() {
    this.owner = this.entity.owner.get();

    this.raycast = this.props.raycast?.as(RaycastGizmo);
    this.raycast?.owner.set(this.owner);

    if (this.owner === this.world.getServerPlayer()) {
      return;
    }

    this.cameraTarget = this.props.cameraTarget;

    if (this.cameraTarget) {
      LocalCamera.setCameraModeAttach(this.cameraTarget,);
    }

    this.owner.enterFocusedInteractionMode();
    
    // Setup drag and drop event listeners
    this.connectLocalBroadcastEvent(
      PlayerControls.onFocusedInteractionInputStarted,
      this.onDragStart.bind(this)
    );

    this.connectLocalBroadcastEvent(
      PlayerControls.onFocusedInteractionInputMoved,
      this.onDragMove.bind(this)
    );

    this.connectLocalBroadcastEvent(
      PlayerControls.onFocusedInteractionInputEnded,
      this.onDragEnd.bind(this)
    );

    this.connectLocalBroadcastEvent(
      World.onUpdate,
      this.onUpdate.bind(this)
    );
  }

  private onDragStart(data: { interactionInfo: InteractionInfo[] }) {
    const firstInteraction = data.interactionInfo[0];
    if (!firstInteraction) return;

    // Perform raycast to see if we hit an entity
    const rayData = this.raycast?.raycast(
      firstInteraction.worldRayOrigin,
      firstInteraction.worldRayDirection
    );

    if (rayData && rayData.targetType === RaycastTargetType.Entity) {
      this.draggedEntity = rayData.target.parent.get() ?? rayData.target; //Get the parent entity or the entity itself
      this.isDragging = true;
      
      // Store the initial depth (distance from ray origin) to maintain Z-position
      this.initialDragDepth = rayData.distance;
      
      // Calculate offset between hit point and entity center in camera target's coordinate system
      if (this.cameraTarget) {
        // Get camera target's orientation vectors
        const cameraRotation = this.cameraTarget.rotation.get();
        const cameraForward = Quaternion.mulVec3(cameraRotation, Vec3.forward);
        const cameraRight = Quaternion.mulVec3(cameraRotation, Vec3.right);
        const cameraUp = Quaternion.mulVec3(cameraRotation, Vec3.up);
        
        const cameraPos = this.cameraTarget.position.get();
        
        // Calculate offset in camera target's local coordinate system
        const hitRelativeToCam = rayData.hitPoint.sub(cameraPos);
        const entityRelativeToCam = this.draggedEntity.position.get().sub(cameraPos);
        
        // Project both points onto camera's coordinate system
        const hitInCamSpace = new Vec3(
          hitRelativeToCam.dot(cameraRight),
          hitRelativeToCam.dot(cameraUp),
          hitRelativeToCam.dot(cameraForward)
        );
        
        const entityInCamSpace = new Vec3(
          entityRelativeToCam.dot(cameraRight),
          entityRelativeToCam.dot(cameraUp),
          entityRelativeToCam.dot(cameraForward)
        );
        
        // Store offset in camera space
        this.dragOffset = entityInCamSpace.sub(hitInCamSpace);
      } else {
        // Fallback to world coordinates if no camera target
        this.dragOffset = this.draggedEntity.position.get().sub(rayData.hitPoint);
      }
      
      //console.log(`Started dragging entity: ${this.draggedEntity.name.get()} at depth: ${this.initialDragDepth}`);
    }
  }

  private onDragMove(data: { interactionInfo: InteractionInfo[] }) {
    if (!this.isDragging || !this.draggedEntity) return;

    const firstInteraction = data.interactionInfo[0];
    if (!firstInteraction) return;

    if (this.cameraTarget) {
      // Get camera target's orientation vectors
      const cameraRotation = this.cameraTarget.rotation.get();
      const cameraForward = Quaternion.mulVec3(cameraRotation, Vec3.forward);
      const cameraRight = Quaternion.mulVec3(cameraRotation, Vec3.right);
      const cameraUp = Quaternion.mulVec3(cameraRotation, Vec3.up);
      
      // Get the camera target's position as the reference point
      const cameraPos = this.cameraTarget.position.get();
      
      // Calculate the current ray intersection point
      const rayOrigin = firstInteraction.worldRayOrigin;
      const rayDirection = firstInteraction.worldRayDirection;
      const currentIntersection = rayOrigin.add(rayDirection.mul(this.initialDragDepth));
      
      // Transform the intersection point to camera target's coordinate system
      const intersectionRelativeToCam = currentIntersection.sub(cameraPos);
      const intersectionInCamSpace = new Vec3(
        intersectionRelativeToCam.dot(cameraRight),
        intersectionRelativeToCam.dot(cameraUp),
        intersectionRelativeToCam.dot(cameraForward)
      );
      
      // Apply the offset (which is already in camera space)
      const targetInCamSpace = intersectionInCamSpace.add(this.dragOffset);
      
      // Transform back to world space
      const targetInWorldSpace = cameraPos
        .add(cameraRight.mul(targetInCamSpace.x))
        .add(cameraUp.mul(targetInCamSpace.y))
        .add(cameraForward.mul(targetInCamSpace.z));
      
      this.draggedEntity.position.set(targetInWorldSpace);
    } else {
      // Fallback to original world coordinate behavior
      const newPosition = firstInteraction.worldRayOrigin
        .add(firstInteraction.worldRayDirection.mul(this.initialDragDepth))
        .add(this.dragOffset);
      
      this.draggedEntity.position.set(newPosition);
    }
  }

  private onDragEnd(data: { interactionInfo: InteractionInfo[] }) {
    if (this.isDragging && this.draggedEntity) {
      //console.log(`Stopped dragging entity: ${this.draggedEntity.name.get()}`);
      this.isDragging = false;
      this.draggedEntity = undefined;
      this.dragOffset = Vec3.zero;
      this.initialDragDepth = 0;
    }
  }

  private onUpdate() {
    // Optional: Add visual feedback or continuous updates during drag
    if (this.isDragging && this.draggedEntity) {
      // Could add visual effects or smooth movement here
    }
  }
}
Component.register(GamePlayer);