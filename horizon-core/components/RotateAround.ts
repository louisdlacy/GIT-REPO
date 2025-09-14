import { Component, PropTypes, World, Quaternion, Vec3, degreesToRadians, Entity } from 'horizon/core';

export class RotateAround extends Component<typeof RotateAround> {
  static propsDefinition = {
    // Degrees per second, like Unity's RotateAround angle parameter applied over time
    rotationSpeed: { type: PropTypes.Number, default: 90.0 },
  // Entity whose position is the world-space pivot to rotate around
  pivotEntity: { type: PropTypes.Entity as unknown as Entity },
    // World-space axis to rotate around (equivalent to Unity's axis)
    axis: { type: PropTypes.Vec3, default: new Vec3(0, 1, 0) },
  };

  // Track initial offset from pivot and cumulative rotation
  private _initialOffset: Vec3 | null = null;
  private _cumulativeAngleRad: number = 0.0;
  private _lastPivotId: bigint | null = null;

  override preStart() {
    this.connectLocalBroadcastEvent(
      World.onUpdate,
      (data) => this.onUpdate(data.deltaTime)
    );
  }

  override start() {
    // Initialization logic can go here if needed.
  }

  private onUpdate(deltaTime: number) {
    // Unity-like Transform.RotateAround that preserves the initial offset from the pivot
    const axis = this.props.axis;
    const axisMagSq = axis.x * axis.x + axis.y * axis.y + axis.z * axis.z;

    // Resolve pivot
    const pivotEnt = this.props.pivotEntity as Entity | undefined;
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
    const angleDeltaRad = degreesToRadians(angleDeg);
    if (angleDeltaRad !== 0 && axisMagSq !== 0) {
      this._cumulativeAngleRad += angleDeltaRad;
    }

    // Compute absolute rotated offset using the initial offset
    let rotatedOffset: Vec3;
    if (axisMagSq !== 0 && this._initialOffset) {
      const axisNorm = axis.normalize();
      const qAbs = Quaternion.fromAxisAngle(axisNorm, this._cumulativeAngleRad);
      rotatedOffset = Quaternion.mulVec3(qAbs, this._initialOffset);
    } else {
      // If axis is zero, keep raw offset unrotated
      rotatedOffset = this._initialOffset!;
    }

    // Position follows pivot + rotated initial offset every frame
    const newPos = rotatedOffset.add(pivot);
    this.entity.position.set(newPos);

    // Rotate orientation only by the per-frame delta, if applicable
    if (angleDeltaRad !== 0 && axisMagSq !== 0) {
      const axisNorm = axis.normalize();
      const qDelta = Quaternion.fromAxisAngle(axisNorm, angleDeltaRad);
      const currentRot = this.entity.rotation.get();
      const newRot = Quaternion.mul(qDelta, currentRot);
      this.entity.rotation.set(newRot);
    }
  }
}

Component.register(RotateAround);