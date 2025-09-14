# Math and Vector Operations Best Practices for Horizon Worlds

## Table of Contents

1. [Vec3 Operations](#vec3-operations)
2. [Quaternion Operations](#quaternion-operations)
3. [Color Operations](#color-operations)
4. [Mathematical Utilities](#mathematical-utilities)
5. [Performance Optimization](#performance-optimization)
6. [Common Calculations](#common-calculations)
7. [Best Practices](#best-practices)

## Vec3 Operations

### Basic Vec3 Usage

```typescript
class Vec3Operations extends Component<typeof Vec3Operations> {
  start() {
    // Creating Vec3 instances
    const position = new Vec3(10, 5, 0);
    const direction = new Vec3(1, 0, 0);
    const zero = Vec3.zero();
    const one = Vec3.one();
    const up = Vec3.up();
    const forward = Vec3.forward();
    const right = Vec3.right();

    // Basic operations
    this.demonstrateBasicOperations(position, direction);
  }

  private demonstrateBasicOperations(pos: Vec3, dir: Vec3) {
    // Addition and subtraction
    const newPos = pos.add(dir.scale(5)); // Move 5 units in direction
    const offset = pos.subtract(Vec3.zero()); // Get position relative to origin

    // Scaling
    const scaled = dir.scale(2.5); // Scale direction vector
    const normalized = dir.normalize(); // Get unit vector

    // Distance calculations
    const distance = pos.distanceTo(Vec3.zero());
    const sqrDistance = pos.sqrDistanceTo(Vec3.zero()); // More efficient

    // Dot and cross products
    const dotProduct = dir.dot(Vec3.up());
    const crossProduct = dir.cross(Vec3.up());

    console.log(`Distance: ${distance}, Dot: ${dotProduct}`);
  }
}
```

### Advanced Vec3 Operations

```typescript
class AdvancedVec3 extends Component<typeof AdvancedVec3> {
  // Linear interpolation between vectors
  private lerpVectors(from: Vec3, to: Vec3, t: number): Vec3 {
    // Clamp t between 0 and 1
    t = Math.max(0, Math.min(1, t));

    return from.clone().lerp(to, t);
  }

  // Smooth interpolation (ease-in-out)
  private smoothLerp(from: Vec3, to: Vec3, t: number): Vec3 {
    // Apply smoothstep function to t
    const smoothT = t * t * (3 - 2 * t);
    return this.lerpVectors(from, to, smoothT);
  }

  // Vector projection
  private projectVectorOntoPlane(vector: Vec3, planeNormal: Vec3): Vec3 {
    const normalizedPlane = planeNormal.normalize();
    const dotProduct = vector.dot(normalizedPlane);
    const projection = normalizedPlane.scale(dotProduct);

    return vector.subtract(projection);
  }

  // Reflect vector off a surface
  private reflectVector(incident: Vec3, normal: Vec3): Vec3 {
    const normalizedNormal = normal.normalize();
    const dotProduct = incident.dot(normalizedNormal);

    return incident.subtract(normalizedNormal.scale(2 * dotProduct));
  }

  // Find closest point on line to a point
  private closestPointOnLine(
    point: Vec3,
    lineStart: Vec3,
    lineEnd: Vec3
  ): Vec3 {
    const lineDir = lineEnd.subtract(lineStart);
    const lineLength = lineDir.magnitude();

    if (lineLength === 0) return lineStart.clone();

    const normalizedDir = lineDir.normalize();
    const toPoint = point.subtract(lineStart);
    const projectionLength = toPoint.dot(normalizedDir);

    // Clamp to line segment
    const clampedLength = Math.max(0, Math.min(lineLength, projectionLength));

    return lineStart.add(normalizedDir.scale(clampedLength));
  }

  // Check if point is within bounds
  private isPointInBounds(point: Vec3, min: Vec3, max: Vec3): boolean {
    return (
      point.x >= min.x &&
      point.x <= max.x &&
      point.y >= min.y &&
      point.y <= max.y &&
      point.z >= min.z &&
      point.z <= max.z
    );
  }
}
```

### Vec3 Performance Optimization

```typescript
class OptimizedVec3 extends Component<typeof OptimizedVec3> {
  private vectorPool: Vec3[] = [];
  private readonly POOL_SIZE = 50;

  start() {
    // Pre-allocate vector pool
    for (let i = 0; i < this.POOL_SIZE; i++) {
      this.vectorPool.push(new Vec3(0, 0, 0));
    }
  }

  // Borrow vector from pool
  private borrowVector(x: number = 0, y: number = 0, z: number = 0): Vec3 {
    if (this.vectorPool.length > 0) {
      const vec = this.vectorPool.pop()!;
      vec.x = x;
      vec.y = y;
      vec.z = z;
      return vec;
    }

    // Pool exhausted, create new vector
    return new Vec3(x, y, z);
  }

  // Return vector to pool
  private returnVector(vec: Vec3) {
    if (this.vectorPool.length < this.POOL_SIZE) {
      this.vectorPool.push(vec);
    }
  }

  // In-place operations to avoid allocations
  private moveTowardsInPlace(current: Vec3, target: Vec3, maxDistance: number) {
    const direction = this.borrowVector();
    direction.copy(target).subtract(current);

    const distance = direction.magnitude();

    if (distance <= maxDistance) {
      current.copy(target);
    } else {
      direction.normalize().scale(maxDistance);
      current.add(direction);
    }

    this.returnVector(direction);
  }

  // Batch vector operations
  private batchNormalize(vectors: Vec3[]) {
    vectors.forEach((vec) => {
      const mag = vec.magnitude();
      if (mag > 0) {
        vec.scale(1 / mag);
      }
    });
  }
}
```

## Quaternion Operations

### Basic Quaternion Usage

```typescript
class QuaternionOperations extends Component<typeof QuaternionOperations> {
  start() {
    // Creating quaternions
    const identity = Quaternion.identity();
    const eulerRotation = Quaternion.fromEuler(45, 0, 0, EulerOrder.XYZ);
    const axisAngle = Quaternion.fromAxisAngle(Vec3.up(), Math.PI / 4);
    const lookRotation = Quaternion.lookAt(
      Vec3.zero(),
      Vec3.forward(),
      Vec3.up()
    );

    this.demonstrateRotations();
  }

  private demonstrateRotations() {
    const currentRotation = this.entity.transform.rotation.get();

    // Rotate around Y axis by 90 degrees
    const yRotation = Quaternion.fromAxisAngle(Vec3.up(), Math.PI / 2);
    const newRotation = currentRotation.multiply(yRotation);

    // Apply rotation
    this.entity.transform.rotation.set(newRotation);

    // Get forward direction from rotation
    const forward = newRotation.multiplyVec3(Vec3.forward());
    console.log(`Forward direction: ${forward.toString()}`);
  }
}
```

### Advanced Quaternion Operations

```typescript
class AdvancedQuaternion extends Component<typeof AdvancedQuaternion> {
  // Smooth rotation interpolation
  private slerpRotation(
    from: Quaternion,
    to: Quaternion,
    t: number
  ): Quaternion {
    // Ensure shortest path
    let dot = from.dot(to);

    // If dot product is negative, negate one quaternion to take shorter path
    if (dot < 0) {
      to = new Quaternion(-to.x, -to.y, -to.z, -to.w);
      dot = -dot;
    }

    return from.slerp(to, t);
  }

  // Look at target smoothly
  private smoothLookAt(target: Vec3, speed: number = 0.1) {
    const currentPos = this.entity.transform.position.get();
    const direction = target.subtract(currentPos).normalize();

    const targetRotation = Quaternion.lookAt(Vec3.zero(), direction, Vec3.up());
    const currentRotation = this.entity.transform.rotation.get();

    const newRotation = this.slerpRotation(
      currentRotation,
      targetRotation,
      speed
    );
    this.entity.transform.rotation.set(newRotation);
  }

  // Rotate around point
  private rotateAroundPoint(pivot: Vec3, axis: Vec3, angle: number) {
    const position = this.entity.transform.position.get();
    const rotation = this.entity.transform.rotation.get();

    // Get relative position
    const relativePos = position.subtract(pivot);

    // Create rotation quaternion
    const rotationQuat = Quaternion.fromAxisAngle(axis, angle);

    // Rotate relative position
    const newRelativePos = rotationQuat.multiplyVec3(relativePos);

    // Apply new position and rotation
    this.entity.transform.position.set(pivot.add(newRelativePos));
    this.entity.transform.rotation.set(rotation.multiply(rotationQuat));
  }

  // Convert quaternion to Euler angles (in degrees)
  private quaternionToEuler(quat: Quaternion): Vec3 {
    const test = quat.x * quat.y + quat.z * quat.w;

    if (test > 0.499) {
      // singularity at north pole
      return new Vec3((2 * Math.atan2(quat.x, quat.w) * 180) / Math.PI, 90, 0);
    }

    if (test < -0.499) {
      // singularity at south pole
      return new Vec3(
        (-2 * Math.atan2(quat.x, quat.w) * 180) / Math.PI,
        -90,
        0
      );
    }

    const sqx = quat.x * quat.x;
    const sqy = quat.y * quat.y;
    const sqz = quat.z * quat.z;

    const yaw = Math.atan2(
      2 * quat.y * quat.w - 2 * quat.x * quat.z,
      1 - 2 * sqy - 2 * sqz
    );
    const pitch = Math.asin(2 * test);
    const roll = Math.atan2(
      2 * quat.x * quat.w - 2 * quat.y * quat.z,
      1 - 2 * sqx - 2 * sqz
    );

    return new Vec3(
      (roll * 180) / Math.PI,
      (pitch * 180) / Math.PI,
      (yaw * 180) / Math.PI
    );
  }
}
```

## Color Operations

### Color Manipulation

```typescript
class ColorOperations extends Component<typeof ColorOperations> {
  start() {
    // Creating colors
    const red = new Color(1, 0, 0, 1);
    const green = Color.green();
    const blue = Color.blue();
    const white = Color.white();
    const black = Color.black();
    const transparent = new Color(1, 1, 1, 0);

    this.demonstrateColorOperations();
  }

  private demonstrateColorOperations() {
    const baseColor = new Color(0.5, 0.8, 0.2, 1);

    // Color interpolation
    const targetColor = Color.red();
    const lerpedColor = baseColor.lerp(targetColor, 0.5);

    // Brightness adjustment
    const brighterColor = this.adjustBrightness(baseColor, 1.5);
    const darkerColor = this.adjustBrightness(baseColor, 0.5);

    // Saturation adjustment
    const saturatedColor = this.adjustSaturation(baseColor, 2.0);
    const desaturatedColor = this.adjustSaturation(baseColor, 0.5);

    console.log(`Original: ${baseColor.toString()}`);
    console.log(`Lerped: ${lerpedColor.toString()}`);
  }

  private adjustBrightness(color: Color, factor: number): Color {
    return new Color(
      Math.min(1, color.r * factor),
      Math.min(1, color.g * factor),
      Math.min(1, color.b * factor),
      color.a
    );
  }

  private adjustSaturation(color: Color, saturation: number): Color {
    // Convert to HSV, adjust saturation, convert back
    const hsv = this.rgbToHsv(color);
    hsv.y = Math.min(1, hsv.y * saturation);
    return this.hsvToRgb(hsv.x, hsv.y, hsv.z, color.a);
  }

  private rgbToHsv(color: Color): Vec3 {
    const max = Math.max(color.r, color.g, color.b);
    const min = Math.min(color.r, color.g, color.b);
    const delta = max - min;

    let h = 0;
    const s = max === 0 ? 0 : delta / max;
    const v = max;

    if (delta !== 0) {
      if (max === color.r) {
        h = ((color.g - color.b) / delta) % 6;
      } else if (max === color.g) {
        h = (color.b - color.r) / delta + 2;
      } else {
        h = (color.r - color.g) / delta + 4;
      }
      h /= 6;
    }

    return new Vec3(h, s, v);
  }

  private hsvToRgb(h: number, s: number, v: number, a: number = 1): Color {
    const c = v * s;
    const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
    const m = v - c;

    let r = 0,
      g = 0,
      b = 0;

    if (h < 1 / 6) {
      r = c;
      g = x;
      b = 0;
    } else if (h < 2 / 6) {
      r = x;
      g = c;
      b = 0;
    } else if (h < 3 / 6) {
      r = 0;
      g = c;
      b = x;
    } else if (h < 4 / 6) {
      r = 0;
      g = x;
      b = c;
    } else if (h < 5 / 6) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }

    return new Color(r + m, g + m, b + m, a);
  }

  // Create gradient between colors
  private createGradient(
    startColor: Color,
    endColor: Color,
    steps: number
  ): Color[] {
    const gradient: Color[] = [];

    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      gradient.push(startColor.lerp(endColor, t));
    }

    return gradient;
  }
}
```

## Mathematical Utilities

### Common Math Functions

```typescript
class MathUtils extends Component<typeof MathUtils> {
  // Clamping values
  private clampValue(value: number, min: number, max: number): number {
    return clamp(value, min, max);
  }

  // Remapping values from one range to another
  private remapValue(
    value: number,
    fromMin: number,
    fromMax: number,
    toMin: number,
    toMax: number
  ): number {
    const normalized = (value - fromMin) / (fromMax - fromMin);
    return toMin + normalized * (toMax - toMin);
  }

  // Smoothstep interpolation
  private smoothstep(edge0: number, edge1: number, x: number): number {
    const t = this.clampValue((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  // Ping-pong value between 0 and length
  private pingPong(value: number, length: number): number {
    const t = value / length;
    return length * Math.abs(2 * (t - Math.floor(t + 0.5)));
  }

  // Wrap angle to [-180, 180] degrees
  private wrapAngle(angle: number): number {
    angle = angle % 360;
    if (angle > 180) angle -= 360;
    if (angle < -180) angle += 360;
    return angle;
  }

  // Get shortest angle between two angles
  private deltaAngle(current: number, target: number): number {
    let delta = this.wrapAngle(target - current);
    return delta;
  }

  // Exponential moving average
  private exponentialMovingAverage(
    currentAverage: number,
    newValue: number,
    alpha: number
  ): number {
    return alpha * newValue + (1 - alpha) * currentAverage;
  }

  // Calculate intersection of two lines in 2D
  private lineIntersection(
    p1: Vec3,
    p2: Vec3, // First line
    p3: Vec3,
    p4: Vec3 // Second line
  ): Vec3 | null {
    const x1 = p1.x,
      y1 = p1.z;
    const x2 = p2.x,
      y2 = p2.z;
    const x3 = p3.x,
      y3 = p3.z;
    const x4 = p4.x,
      y4 = p4.z;

    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    if (Math.abs(denom) < 0.0001) {
      return null; // Lines are parallel
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;

    return new Vec3(x1 + t * (x2 - x1), 0, y1 + t * (y2 - y1));
  }
}
```

## Performance Optimization

### Math Performance Tips

```typescript
class MathPerformance extends Component<typeof MathPerformance> {
  private readonly SQRT_CACHE = new Map<number, number>();
  private readonly TRIG_CACHE = new Map<number, { sin: number; cos: number }>();

  // Use squared distance when possible to avoid sqrt
  private isWithinRange(pos1: Vec3, pos2: Vec3, range: number): boolean {
    const sqrDistance = pos1.sqrDistanceTo(pos2);
    return sqrDistance <= range * range;
  }

  // Cache expensive calculations
  private cachedSqrt(value: number): number {
    if (this.SQRT_CACHE.has(value)) {
      return this.SQRT_CACHE.get(value)!;
    }

    const result = Math.sqrt(value);
    this.SQRT_CACHE.set(value, result);
    return result;
  }

  // Approximate sin/cos for performance-critical code
  private fastSinCos(angleRadians: number): { sin: number; cos: number } {
    // Normalize angle to [0, 2π]
    const normalizedAngle = angleRadians % (2 * Math.PI);

    if (this.TRIG_CACHE.has(normalizedAngle)) {
      return this.TRIG_CACHE.get(normalizedAngle)!;
    }

    const result = {
      sin: Math.sin(normalizedAngle),
      cos: Math.cos(normalizedAngle),
    };

    this.TRIG_CACHE.set(normalizedAngle, result);
    return result;
  }

  // Use integer math when possible
  private fastFloor(value: number): number {
    return value | 0; // Bitwise OR for fast floor (positive numbers only)
  }

  // Batch vector operations
  private batchVectorOperations(vectors: Vec3[], operation: (v: Vec3) => void) {
    // Process in chunks to avoid blocking
    const CHUNK_SIZE = 100;
    let index = 0;

    const processChunk = () => {
      const endIndex = Math.min(index + CHUNK_SIZE, vectors.length);

      for (let i = index; i < endIndex; i++) {
        operation(vectors[i]);
      }

      index = endIndex;

      if (index < vectors.length) {
        // Continue processing next frame
        this.async.setTimeout(processChunk, 0);
      }
    };

    processChunk();
  }
}
```

## Common Calculations

### Game-Specific Math

```typescript
class GameMath extends Component<typeof GameMath> {
  // Calculate trajectory for projectile
  private calculateTrajectory(
    startPos: Vec3,
    targetPos: Vec3,
    gravity: number = 9.81,
    initialSpeed: number = 20
  ): { velocity: Vec3; time: number } {
    const displacement = targetPos.subtract(startPos);
    const horizontalDistance = new Vec3(
      displacement.x,
      0,
      displacement.z
    ).magnitude();
    const verticalDistance = displacement.y;

    // Calculate time of flight
    const discriminant =
      initialSpeed * initialSpeed * initialSpeed * initialSpeed -
      gravity *
        (gravity * horizontalDistance * horizontalDistance +
          2 * verticalDistance * initialSpeed * initialSpeed);

    if (discriminant < 0) {
      // Target unreachable
      return { velocity: Vec3.zero(), time: 0 };
    }

    const time = Math.sqrt(
      (initialSpeed * initialSpeed - Math.sqrt(discriminant)) / gravity
    );

    const velocityXZ = horizontalDistance / time;
    const velocityY = (verticalDistance + 0.5 * gravity * time * time) / time;

    const direction = new Vec3(displacement.x, 0, displacement.z).normalize();
    const velocity = new Vec3(
      direction.x * velocityXZ,
      velocityY,
      direction.z * velocityXZ
    );

    return { velocity, time };
  }

  // Calculate field of view checking
  private isInFieldOfView(
    observerPos: Vec3,
    observerForward: Vec3,
    targetPos: Vec3,
    fovAngleDegrees: number
  ): boolean {
    const toTarget = targetPos.subtract(observerPos).normalize();
    const dot = observerForward.normalize().dot(toTarget);
    const angleDegrees = (Math.acos(dot) * 180) / Math.PI;

    return angleDegrees <= fovAngleDegrees / 2;
  }

  // Calculate spring physics
  private calculateSpringForce(
    currentPos: Vec3,
    targetPos: Vec3,
    velocity: Vec3,
    springConstant: number = 50,
    damping: number = 5
  ): Vec3 {
    const displacement = targetPos.subtract(currentPos);
    const springForce = displacement.scale(springConstant);
    const dampingForce = velocity.scale(-damping);

    return springForce.add(dampingForce);
  }

  // Calculate orbit position
  private calculateOrbitPosition(
    center: Vec3,
    radius: number,
    angle: number,
    axis: Vec3 = Vec3.up()
  ): Vec3 {
    const rotation = Quaternion.fromAxisAngle(axis, angle);
    const localPos = new Vec3(radius, 0, 0);
    const worldPos = rotation.multiplyVec3(localPos);

    return center.add(worldPos);
  }

  // Calculate bezier curve point
  private calculateBezierPoint(
    p0: Vec3,
    p1: Vec3,
    p2: Vec3,
    p3: Vec3,
    t: number
  ): Vec3 {
    const oneMinusT = 1 - t;
    const oneMinusTSq = oneMinusT * oneMinusT;
    const oneMinusTCu = oneMinusTSq * oneMinusT;
    const tSq = t * t;
    const tCu = tSq * t;

    return p0
      .scale(oneMinusTCu)
      .add(p1.scale(3 * oneMinusTSq * t))
      .add(p2.scale(3 * oneMinusT * tSq))
      .add(p3.scale(tCu));
  }
}
```

## Best Practices

### Math Best Practices Summary

```typescript
class MathBestPractices extends Component<typeof MathBestPractices> {
  // ✅ DO: Use appropriate precision for comparisons
  private isApproximatelyEqual(
    a: number,
    b: number,
    epsilon: number = 0.0001
  ): boolean {
    return Math.abs(a - b) < epsilon;
  }

  // ✅ DO: Normalize vectors before using them for direction
  private moveInDirection(direction: Vec3, speed: number) {
    const normalizedDirection = direction.normalize();
    const velocity = normalizedDirection.scale(speed);
    // Use velocity...
  }

  // ✅ DO: Use clone() to avoid modifying original vectors
  private safeVectorOperation(originalVector: Vec3): Vec3 {
    return originalVector.clone().scale(2).add(Vec3.up());
  }

  // ✅ DO: Cache expensive calculations
  private memoizedCalculation() {
    // Implementation shown in previous examples
  }

  // ❌ DON'T: Perform expensive operations every frame
  tick() {
    // DON'T do this every frame:
    // const distance = this.entity.transform.position.get().distanceTo(target);

    // DO this instead: cache and update periodically
    if (this.shouldUpdateDistance()) {
      this.updateCachedDistance();
    }
  }

  private shouldUpdateDistance(): boolean {
    return Date.now() - this.lastDistanceUpdate > 100; // Update every 100ms
  }
}
```

## Summary

1. **Use appropriate precision** for floating-point comparisons
2. **Cache expensive calculations** like sqrt, sin, cos operations
3. **Prefer squared distance** over distance when possible
4. **Normalize vectors** before using them for direction calculations
5. **Use clone()** to avoid unintended modifications
6. **Batch operations** when processing many vectors
7. **Consider object pooling** for frequently created vectors
8. **Use in-place operations** when the original object can be modified
9. **Validate inputs** to math functions to prevent NaN/infinity
10. **Choose the right interpolation method** for your use case
