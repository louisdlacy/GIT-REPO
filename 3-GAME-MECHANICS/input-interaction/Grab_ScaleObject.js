"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class ScaleObject extends core_1.Component {
    constructor() {
        super(...arguments);
        this.startScale = core_1.Vec3.zero;
        this.doubleScale = core_1.Vec3.zero;
    }
    preStart() {
        this.startScale = this.entity.scale.get();
        this.doubleScale = this.startScale.mul(2);
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabStart, this.onGrab.bind(this));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnGrabEnd, this.onRelease.bind(this));
    }
    start() { }
    onGrab() {
        this.entity.scale.set(this.doubleScale);
    }
    onRelease() {
        this.entity.scale.set(this.startScale);
    }
}
core_1.Component.register(ScaleObject);
