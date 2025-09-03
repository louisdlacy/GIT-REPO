"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class RelativeTransform extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, this.onPlayerEnterWorld.bind(this));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitWorld, this.onPlayerExitWorld.bind(this));
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, this.onUpdate.bind(this));
    }
    start() { }
    onPlayerEnterWorld(player) {
        this.player = player;
    }
    onPlayerExitWorld(player) {
        if (this.player === player) {
            this.player = undefined;
        }
    }
    onUpdate() {
        if (!this.player) {
            return;
        }
        this.entity.moveRelativeToPlayer(this.player, core_1.PlayerBodyPartType.RightHand, core_1.Vec3.zero);
        this.entity.rotateRelativeToPlayer(this.player, core_1.PlayerBodyPartType.RightHand, core_1.Quaternion.zero);
    }
}
core_1.Component.register(RelativeTransform);
