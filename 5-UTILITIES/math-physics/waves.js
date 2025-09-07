"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class OceanWater extends core_1.Component {
    constructor() {
        super(...arguments);
        this.waterLevel = 0;
        this.phase = 0;
    }
    preStart() {
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, this.update.bind(this));
        this.waterLevel = this.entity.position.get().y + this.props.amplitude;
    }
    start() { }
    update(data) {
        this.phase += this.props.speed * data.deltaTime;
        const yPos = Math.sin(this.phase) * this.props.amplitude + this.waterLevel;
        const currScale = core_1.Vec3.one.sub(core_1.Vec3.one.mul(Math.cos(this.phase) * this.props.scalingAmplitude));
        this.entity.position.set(new core_1.Vec3(0, yPos, 0));
        this.entity.scale.set(currScale);
    }
}
OceanWater.propsDefinition = {
    speed: { type: core_1.PropTypes.Number, default: 0.1 },
    amplitude: { type: core_1.PropTypes.Number, default: 0.1 },
    scalingAmplitude: { type: core_1.PropTypes.Number, default: 0.006 },
};
core_1.Component.register(OceanWater);
