"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class RainbowCycle extends core_1.Component {
    constructor() {
        super(...arguments);
        this.hue = 0;
        this.speed = 0.9; // Speed of the color change. For best results, keep it low.
    }
    preStart() {
        this.mesh = this.entity.as(core_1.MeshEntity);
        this.mesh.style.tintStrength.set(1); // Set the tint strength to 1 for full effect
        this.async.setInterval(() => { this.cycle(); }, 50 // Update every second. Increase for slower cycles
        );
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
core_1.Component.register(RainbowCycle);
