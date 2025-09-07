"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class PlayerFollower extends core_1.Component {
    constructor() {
        super(...arguments);
        this.speed = 0.1;
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, this.onPlayerEnterWorld.bind(this));
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, this.update.bind(this));
    }
    start() { }
    onPlayerEnterWorld(player) {
        this.target = player;
    }
    update(data) {
        if (!this.target) {
            return;
        }
        const targetPos = this.target.position.get();
        const currentPos = this.entity.position.get();
        const direction = targetPos.sub(currentPos).normalize();
        const newPos = currentPos.add(direction.mul(this.speed));
        this.entity.position.set(newPos);
    }
}
core_1.Component.register(PlayerFollower);
