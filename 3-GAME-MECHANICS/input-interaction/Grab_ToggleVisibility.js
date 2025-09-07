"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class ToggleVisibility extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabStart, this.onGrab.bind(this));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabEnd, this.onRelease.bind(this));
    }
    start() {
        // Intentionally left blank
    }
    onGrab() {
        this.entity.visible.set(false);
    }
    onRelease() {
        this.entity.visible.set(true);
    }
}
core_1.Component.register(ToggleVisibility);
