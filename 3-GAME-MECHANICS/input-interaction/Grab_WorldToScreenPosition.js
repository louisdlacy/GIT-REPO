"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const camera_1 = __importDefault(require("horizon/camera"));
// See World_OwnershipManagement to manage ownership 
// This script must be set to "Local" execution mode in the editor.
class WorldToScreenPosition extends core_1.Component {
    preStart() {
        this.owner = this.entity.owner.get();
        this.serverPlayer = this.world.getServerPlayer();
        if (this.owner === this.serverPlayer) {
            // The entity is owned by the server player, so end the script
            return;
        }
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabStart, this.OnGrab.bind(this));
    }
    start() { }
    OnGrab(isRightHand, player) {
        const position = this.entity.position.get();
        camera_1.default.convertWorldToScreenPoint(position);
        console.log("WorldToScreenPosition", position);
    }
}
core_1.Component.register(WorldToScreenPosition);
