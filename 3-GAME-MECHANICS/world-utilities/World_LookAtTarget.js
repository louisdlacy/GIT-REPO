"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class LookAtTarget extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, this.onPlayerEnter.bind(this));
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, this.update.bind(this));
    }
    start() { }
    onPlayerEnter(player) {
        this.target = player;
    }
    update() {
        if (this.target) {
            // Get the player's position and the entity's position
            const playerPos = this.target.position.get();
            const entityPos = this.entity.position.get();
            // Calculate the direction to look at
            const direction = playerPos.sub(entityPos).normalize();
            // Set the entity's rotation to look at the player
            this.entity.rotation.set(core_1.Quaternion.lookRotation(direction, core_1.Vec3.up));
        }
    }
}
core_1.Component.register(LookAtTarget);
