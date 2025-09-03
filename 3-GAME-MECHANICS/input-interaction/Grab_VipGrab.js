"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class VipGrab extends core_1.Component {
    constructor() {
        super(...arguments);
        this.vipList = [
            'Tellous'
        ];
    }
    preStart() {
        this.grabbable = this.entity.as(core_1.GrabbableEntity);
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabStart, this.onGrab.bind(this));
    }
    start() {
        // Intentionally left blank
    }
    onGrab(isRightHand, player) {
        // Check if the player is in the VIP list
        if (this.vipList.includes(player.name.get())) {
            // Allow the player to grab the object
            console.log('VIP Grab: Allowed');
        }
        else {
            // Prevent the player from grabbing the object
            console.log('VIP Grab: Not allowed');
            this.grabbable?.forceRelease();
        }
    }
}
core_1.Component.register(VipGrab);
