"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
// See World_OwnershipManagement to manage ownership 
// This script must be set to "Local" execution mode in the editor.
class StartFocusedInteraction extends core_1.Component {
    preStart() {
        this.owner = this.entity.owner.get();
        this.serverPlayer = this.world.getServerPlayer();
        if (this.owner === this.serverPlayer) {
            // The entity is owned by the server player, so end the script
            return;
        }
        this.owner.enterFocusedInteractionMode();
    }
    start() { }
}
core_1.Component.register(StartFocusedInteraction);
