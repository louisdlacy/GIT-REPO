"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const camera_1 = __importDefault(require("horizon/camera"));
// See World_OwnershipManagement to manage ownership 
// This script must be set to "Local" execution mode in the editor.
class CrossScreenCrosshair extends core_1.Component {
    constructor() {
        super(...arguments);
        this.isGrabbed = false;
        this.maxDistance = 20; // Adjust maxDistance as needed
    }
    preStart() {
        this.owner = this.entity.owner.get();
        this.serverPlayer = this.world.getServerPlayer();
        this.ray = this.props.ray?.as(core_1.RaycastGizmo);
        this.ray?.owner.set(this.entity.owner.get());
        this.crosshair = this.props.crosshair;
        this.crosshair?.owner.set(this.entity.owner.get());
        if (this.owner === this.serverPlayer) {
            // The entity is owned by the server player, so end the script
            return;
        }
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabStart, this.onGrab.bind(this));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabEnd, this.onRelease.bind(this));
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, this.onUpdate.bind(this));
    }
    start() {
        // Intentionally left blank
    }
    onGrab(isRightHand, player) {
        this.isGrabbed = true;
        this.crosshair?.setVisibilityForPlayers([player], core_1.PlayerVisibilityMode.VisibleTo);
    }
    onRelease(player) {
        this.isGrabbed = false;
        this.crosshair?.setVisibilityForPlayers([], core_1.PlayerVisibilityMode.VisibleTo);
    }
    onUpdate() {
        if (this.isGrabbed) {
            const origin = camera_1.default.position.get();
            const direction = camera_1.default.forward.get();
            const rayData = this.ray?.raycast(origin, direction, { maxDistance: this.maxDistance });
            if (rayData) {
                this.crosshair?.position.set(rayData.hitPoint);
                this.crosshair?.rotation.set(core_1.Quaternion.lookRotation(rayData.normal, core_1.Vec3.up));
            }
            else {
                this.crosshair?.position.set(origin.add(direction.mul(this.maxDistance)));
                this.crosshair?.rotation.set(core_1.Quaternion.zero);
            }
        }
    }
}
CrossScreenCrosshair.propsDefinition = {
    ray: { type: core_1.PropTypes.Entity },
    crosshair: { type: core_1.PropTypes.Entity }
};
core_1.Component.register(CrossScreenCrosshair);
