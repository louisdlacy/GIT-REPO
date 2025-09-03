"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class ParticleFXTest_Entity extends core_1.Component {
    constructor() {
        super(...arguments);
        this.hue = 0;
    }
    start() {
        this.async.setInterval(() => { this.loop(); }, 100);
    }
    loop() {
        this.hue += this.props.hueStep;
        this.entity.as(core_1.ParticleGizmo).setVFXParameterValue('ParticleColor', getArrayFromColor(core_1.Color.fromHSV(new core_1.Vec3(this.hue, 1, 1)), this.props.opacity));
    }
}
ParticleFXTest_Entity.propsDefinition = {
    opacity: { type: core_1.PropTypes.Number, default: 1 },
    hueStep: { type: core_1.PropTypes.Number, default: 0.001 },
};
core_1.Component.register(ParticleFXTest_Entity);
function getArrayFromColor(color, opacity) {
    return [color.r, color.g, color.b, opacity];
}
