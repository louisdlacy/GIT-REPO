"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RotateAround = void 0;
const core_1 = require("horizon/core");
class RotateAround extends core_1.Component {
    constructor() {
        super(...arguments);
        // Track initial offset from pivot and cumulative rotation
        this._initialOffset = null;
        this._cumulativeAngleRad = 0.0;
        this._lastPivotId = null;
    }
    preStart() {
        this.connectLocalBroadcastEvent(core_1.World.onUpdate, (data) => this.onUpdate(data.deltaTime));
    }
    start() {
        // Initialization logic can go here if needed.
    }
    onUpdate(deltaTime) {
        // Unity-like Transform.RotateAround that preserves the initial offset from the pivot
        const axis = this.props.axis;
        const axisMagSq = axis.x * axis.x + axis.y * axis.y + axis.z * axis.z;
        // Resolve pivot
        const pivotEnt = this.props.pivotEntity;
        if (!pivotEnt || !pivotEnt.exists()) {
            return; // need a valid pivot entity
        }
        const pivot = pivotEnt.position.get();
        // Initialize or reinitialize baseline if pivot entity changed
        if (this._lastPivotId !== pivotEnt.id || this._initialOffset === null) {
            const currentPos = this.entity.position.get();
            this._initialOffset = currentPos.sub(pivot);
            this._cumulativeAngleRad = 0.0;
            this._lastPivotId = pivotEnt.id;
        }
        // Advance cumulative rotation by this frame's delta
        const angleDeg = this.props.rotationSpeed * deltaTime;
        const angleDeltaRad = (0, core_1.degreesToRadians)(angleDeg);
        if (angleDeltaRad !== 0 && axisMagSq !== 0) {
            this._cumulativeAngleRad += angleDeltaRad;
        }
        // Compute absolute rotated offset using the initial offset
        let rotatedOffset;
        if (axisMagSq !== 0 && this._initialOffset) {
            const axisNorm = axis.normalize();
            const qAbs = core_1.Quaternion.fromAxisAngle(axisNorm, this._cumulativeAngleRad);
            rotatedOffset = core_1.Quaternion.mulVec3(qAbs, this._initialOffset);
        }
        else {
            // If axis is zero, keep raw offset unrotated
            rotatedOffset = this._initialOffset;
        }
        // Position follows pivot + rotated initial offset every frame
        const newPos = rotatedOffset.add(pivot);
        this.entity.position.set(newPos);
        // Rotate orientation only by the per-frame delta, if applicable
        if (angleDeltaRad !== 0 && axisMagSq !== 0) {
            const axisNorm = axis.normalize();
            const qDelta = core_1.Quaternion.fromAxisAngle(axisNorm, angleDeltaRad);
            const currentRot = this.entity.rotation.get();
            const newRot = core_1.Quaternion.mul(qDelta, currentRot);
            this.entity.rotation.set(newRot);
        }
    }
}
exports.RotateAround = RotateAround;
RotateAround.propsDefinition = {
    // Degrees per second, like Unity's RotateAround angle parameter applied over time
    rotationSpeed: { type: core_1.PropTypes.Number, default: 90.0 },
    // Entity whose position is the world-space pivot to rotate around
    pivotEntity: { type: core_1.PropTypes.Entity },
    // World-space axis to rotate around (equivalent to Unity's axis)
    axis: { type: core_1.PropTypes.Vec3, default: new core_1.Vec3(0, 1, 0) },
};
core_1.Component.register(RotateAround);
