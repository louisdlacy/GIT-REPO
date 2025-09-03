"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class RainbowCycle extends core_1.Component {
    constructor() {
        super(...arguments);
        this.hue = 0;
        this.speed = 0;
    }
    preStart() {
        this.mesh = this.props.mesh?.as(core_1.MeshEntity);
        this.speed = this.props.colorRateOfChange;
        this.mesh?.style.tintStrength.set(1); // Set the tint strength to 1 for full effect
        this.async.setInterval(() => { this.cycle(); }, 1000 * this.props.intervalTime);
    }
    start() { }
    cycle() {
        // Increment the hue value based on deltaTime
        this.hue = (this.hue + this.speed) % 1; // Wrap around at 1
        // Convert HSV to RGB and set the color
        const color = core_1.Color.fromHSV(new core_1.Vec3(this.hue, 1, 1)); // Full saturation and value
        this.mesh?.style.tintColor.set(color);
    }
}
RainbowCycle.propsDefinition = {
    mesh: { type: core_1.PropTypes.Entity },
    colorRateOfChange: { type: core_1.PropTypes.Number, default: 0.05 },
    intervalTime: { type: core_1.PropTypes.Number, default: 0.01 }
};
core_1.Component.register(RainbowCycle);
