"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class ConnectedLine extends core_1.Component {
    constructor() {
        super(...arguments);
        this.startPosition = core_1.Vec3.zero;
        this.lineScale = core_1.Vec3.zero;
    }
    preStart() {
        this.line = this.props.line;
        this.lineScale = this.line?.scale.get() ?? core_1.Vec3.one;
        this.startPosition = this.line?.position.get() ?? core_1.Vec3.zero;
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, this.onUpdate.bind(this));
    }
    start() { }
    onUpdate() {
        const endPosition = this.entity.position.get();
        const midPoint = this.startPosition.add(endPosition).mul(0.5);
        this.line?.position.set(midPoint);
        //Assumes your line object is 1 meter long on Z axis
        const lineLength = this.startPosition.distance(endPosition);
        const newScale = new core_1.Vec3(this.lineScale.x, this.lineScale.y, lineLength);
        this.line?.scale.set(newScale);
        const direction = endPosition.sub(this.startPosition).normalize();
        const rotation = core_1.Quaternion.lookRotation(direction, core_1.Vec3.up);
        this.line?.rotation.set(rotation);
    }
}
ConnectedLine.propsDefinition = {
    line: { type: core_1.PropTypes.Entity }
};
core_1.Component.register(ConnectedLine);
