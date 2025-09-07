"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class HolsterItem extends core_1.Component {
    preStart() {
        this.attachable = this.entity.as(core_1.AttachableEntity);
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabEnd, this.onRelease.bind(this));
    }
    onRelease(player) {
        const anchor = core_1.AttachablePlayerAnchor.Head;
        this.attachable?.attachToPlayer(player, anchor);
    }
    start() { }
}
core_1.Component.register(HolsterItem);
