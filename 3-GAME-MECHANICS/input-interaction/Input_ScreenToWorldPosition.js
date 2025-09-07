"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
// See World_OwnershipManagement to manage ownership 
// This script must be set to "Local" execution mode in the editor.
class ScreenToWorldPosition extends core_1.Component {
    preStart() {
        this.owner = this.entity.owner.get();
        this.serverPlayer = this.world.getServerPlayer();
        this.ray = this.props.ray?.as(core_1.RaycastGizmo);
        this.ray?.owner.set(this.owner);
        if (this.owner === this.serverPlayer) {
            // The entity is owned by the server player, so end the script
            return;
        }
        this.owner.enterFocusedInteractionMode();
        this.connectLocalBroadcastEvent(core_1.PlayerControls.onFocusedInteractionInputStarted, this.onInteraction.bind(this));
    }
    start() { }
    onInteraction(data) {
        const firstInteraction = data.interactionInfo[0];
        if (!firstInteraction) {
            return;
        }
        const origin = firstInteraction.worldRayOrigin;
        const direction = firstInteraction.worldRayDirection;
        // Create a ray from the screen position
        const ray = this.ray?.raycast(origin, direction);
        if (ray) {
            if (ray.targetType === core_1.RaycastTargetType.Entity) {
                // The ray hit an entity
                console.log('Hit entity:', ray.target.name.get());
            }
            else if (ray.targetType === core_1.RaycastTargetType.Player) {
                // The ray hit a player
                console.log('Hit player:', ray.target.name.get());
            }
            else {
                // The ray hit the world
                console.log('Hit world');
            }
            console.log('Ray hit position:', ray.hitPoint);
        }
    }
}
ScreenToWorldPosition.propsDefinition = {
    ray: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(ScreenToWorldPosition);
