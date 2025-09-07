"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
//Modified From Tellous' Original, Thank You!
class RainbowCycle extends core_1.Component {
    constructor() {
        super(...arguments);
        this.hsv = new core_1.Vec3(0, 1, 1);
    }
    start() {
        const mesh = this.entity.as(core_1.MeshEntity);
        mesh.style.tintStrength.set(1);
        mesh.style.brightness.set(1);
        this.async.setInterval(() => { this.loop(mesh); }, this.props.loopMs);
    }
    loop(mesh) {
        this.hsv.x = (this.hsv.x + this.props.colorShift) % 1;
        mesh.style.tintColor.set(core_1.Color.fromHSV(this.hsv));
    }
}
RainbowCycle.propsDefinition = {
    colorShift: { type: core_1.PropTypes.Number, default: 0.01 },
    loopMs: { type: core_1.PropTypes.Number, default: 100 }
};
core_1.Component.register(RainbowCycle);
