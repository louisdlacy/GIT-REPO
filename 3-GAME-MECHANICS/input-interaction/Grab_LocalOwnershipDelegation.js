"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
// This script must be set to "Local" execution mode in the editor.
class LocalOwnershipDelegation extends core_1.Component {
    //Be aware that ownership transfer on Local entities are transfered on grab
    preStart() {
        this.owner = this.entity.owner.get();
        this.serverPlayer = this.world.getServerPlayer();
        this.child = this.props.child;
        this.child?.owner.set(this.owner);
        if (this.owner === this.serverPlayer) {
            // The entity is owned by the server player, so end the script
            return;
        }
        //Optionally, transfer ownership back to server on release.
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabEnd, this.onRelease.bind(this));
    }
    onRelease() {
        this.child?.owner.set(this.serverPlayer);
    }
    start() { }
}
LocalOwnershipDelegation.propsDefinition = {
    child: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(LocalOwnershipDelegation);
