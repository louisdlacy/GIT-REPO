"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class ServerOwnershipDelegation extends core_1.Component {
    preStart() {
        this.serverPlayer = this.world.getServerPlayer();
        this.child = this.props.child;
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabStart, this.onGrab.bind(this));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, this.onPlayerExitWorld.bind(this));
    }
    start() { }
    onGrab(isRightHand, player) {
        this.childOwner = this.child?.owner.get();
        this.child?.owner.set(this.childOwner);
    }
    onPlayerExitWorld(player) {
        if (this.childOwner === player) {
            this.child?.owner.set(this.serverPlayer);
        }
    }
}
ServerOwnershipDelegation.propsDefinition = {
    child: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(ServerOwnershipDelegation);
