"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class ShowToMobileOnly extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabStart, this.onGrab.bind(this));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabEnd, this.onRelease.bind(this));
    }
    start() {
        // Intentionally left blank
    }
    onGrab(isRightHand, player) {
        const device = player.deviceType.get();
        if (device === core_1.PlayerDeviceType.Mobile) {
            this.entity.visible.set(true);
            console.log('Mobile device detected, showing entity.');
        }
        else if (device === core_1.PlayerDeviceType.Desktop) {
            this.entity.visible.set(false);
            console.log('Desktop device detected, hiding entity.');
        }
        else if (device === core_1.PlayerDeviceType.VR) {
            this.entity.visible.set(false);
            console.log('VR device detected, hiding entity.');
        }
        else {
            this.entity.visible.set(false);
            console.log('Unknown device detected, hiding entity.');
        }
    }
    onRelease(player) {
        this.entity.visible.set(false);
    }
}
core_1.Component.register(ShowToMobileOnly);
