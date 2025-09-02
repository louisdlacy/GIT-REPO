# Physics Best Practices for Horizon Worlds

## Table of Contents

1. [PhysicalEntity Basics](#physicalentity-basics)
2. [Force Application](#force-application)
3. [Collision Detection](#collision-detection)
4. [Physics Properties](#physics-properties)
5. [Performance Optimization](#performance-optimization)
6. [Common Physics Patterns](#common-physics-patterns)
7. [Advanced Techniques](#advanced-techniques)

## PhysicalEntity Basics

### Creating and Managing PhysicalEntities

```typescript
class PhysicsBasics extends Component<typeof PhysicsBasics> {
  static propsDefinition = {
    mass: { type: PropTypes.Number, default: 1.0 },
    useGravity: { type: PropTypes.Boolean, default: true },
    isKinematic: { type: PropTypes.Boolean, default: false },
  };

  start() {
    // Ensure entity is a PhysicalEntity
    if (!(this.entity instanceof PhysicalEntity)) {
      console.error("Entity must be a PhysicalEntity for physics operations");
      return;
    }

    this.setupPhysics();
  }

  private setupPhysics() {
    const physicsEntity = this.entity as PhysicalEntity;

    // Set basic physics properties
    physicsEntity.physics.mass.set(this.props.mass!);
    physicsEntity.physics.useGravity.set(this.props.useGravity!);
    physicsEntity.physics.isKinematic.set(this.props.isKinematic!);

    // Set drag for realistic movement
    physicsEntity.physics.drag.set(0.1);
    physicsEntity.physics.angularDrag.set(0.1);

    console.log("Physics setup complete");
  }

  private getPhysicsEntity(): PhysicalEntity | null {
    return this.entity instanceof PhysicalEntity ? this.entity : null;
  }
}
```

### Physics Property Management

```typescript
class PhysicsProperties extends Component<typeof PhysicsProperties> {
  private physicsEntity?: PhysicalEntity;

  start() {
    this.physicsEntity = this.entity as PhysicalEntity;
    this.configurePhysicsProperties();
  }

  private configurePhysicsProperties() {
    if (!this.physicsEntity) return;

    const physics = this.physicsEntity.physics;

    // Mass affects how the object responds to forces
    physics.mass.set(2.0);

    // Gravity affects how the object falls
    physics.useGravity.set(true);

    // Kinematic objects don't respond to forces but can move via transform
    physics.isKinematic.set(false);

    // Drag simulates air resistance
    physics.drag.set(0.05); // Linear drag
    physics.angularDrag.set(0.05); // Rotational drag

    // Freeze position/rotation on specific axes
    physics.freezePositionX.set(false);
    physics.freezePositionY.set(false);
    physics.freezePositionZ.set(false);
    physics.freezeRotationX.set(false);
    physics.freezeRotationY.set(false);
    physics.freezeRotationZ.set(false);
  }

  // Dynamic property adjustment
  private adjustMassBasedOnSize() {
    if (!this.physicsEntity) return;

    const scale = this.physicsEntity.transform.scale.get();
    const volume = scale.x * scale.y * scale.z;
    const density = 1.0; // kg per cubic unit

    this.physicsEntity.physics.mass.set(volume * density);
  }

  // Enable/disable physics temporarily
  private togglePhysics(enabled: boolean) {
    if (!this.physicsEntity) return;

    if (enabled) {
      this.physicsEntity.physics.isKinematic.set(false);
      this.physicsEntity.physics.useGravity.set(true);
    } else {
      this.physicsEntity.physics.isKinematic.set(true);
      this.physicsEntity.physics.useGravity.set(false);
    }
  }
}
```

## Force Application

### Different Types of Force Application

```typescript
class ForceApplication extends Component<typeof ForceApplication> {
  private physicsEntity?: PhysicalEntity;

  start() {
    this.physicsEntity = this.entity as PhysicalEntity;
    this.demonstrateForces();
  }

  private demonstrateForces() {
    if (!this.physicsEntity) return;

    // Impulse - instant velocity change (good for jumps, explosions)
    this.applyJumpForce();

    // Continuous force - gradual acceleration (good for movement, wind)
    this.applyContinuousMovement();

    // Force at position - creates rotation (good for impacts)
    this.applyTorqueEffect();
  }

  private applyJumpForce() {
    if (!this.physicsEntity) return;

    const jumpForce = new Vec3(0, 10, 0); // Upward force

    // Apply impulse for instant effect
    this.physicsEntity.physics.addForce(jumpForce, PhysicsForceMode.Impulse);
  }

  private applyContinuousMovement() {
    if (!this.physicsEntity) return;

    const moveForce = new Vec3(5, 0, 0); // Forward force

    // Apply continuous force (call repeatedly)
    this.physicsEntity.physics.addForce(moveForce, PhysicsForceMode.Force);
  }

  private applyTorqueEffect() {
    if (!this.physicsEntity) return;

    const impactPosition = new Vec3(0, 1, 0); // Above center
    const impactForce = new Vec3(10, 0, 0); // Sideways force

    // Apply force at specific position to create rotation
    this.physicsEntity.physics.addForceAtPosition(
      impactForce,
      impactPosition,
      PhysicsForceMode.Impulse
    );
  }

  // Controlled movement with physics
  private moveWithPhysics(direction: Vec3, speed: number) {
    if (!this.physicsEntity) return;

    const currentVelocity = this.physicsEntity.physics.velocity.get();
    const targetVelocity = direction.normalize().scale(speed);

    // Calculate force needed to reach target velocity
    const velocityChange = targetVelocity.subtract(currentVelocity);
    const mass = this.physicsEntity.physics.mass.get();
    const force = velocityChange.scale(mass);

    this.physicsEntity.physics.addForce(force, PhysicsForceMode.Force);
  }

  // Apply spring force towards target
  private applySpringForce(targetPosition: Vec3, springStrength: number = 50) {
    if (!this.physicsEntity) return;

    const currentPosition = this.physicsEntity.transform.position.get();
    const displacement = targetPosition.subtract(currentPosition);
    const springForce = displacement.scale(springStrength);

    // Add damping to prevent oscillation
    const velocity = this.physicsEntity.physics.velocity.get();
    const dampingForce = velocity.scale(-5); // Damping coefficient

    const totalForce = springForce.add(dampingForce);
    this.physicsEntity.physics.addForce(totalForce, PhysicsForceMode.Force);
  }
}
```

### Advanced Force Techniques

```typescript
class AdvancedForces extends Component<typeof AdvancedForces> {
  private physicsEntity?: PhysicalEntity;
  private forceAccumulator = new Vec3(0, 0, 0);

  start() {
    this.physicsEntity = this.entity as PhysicalEntity;
  }

  // Accumulate forces and apply once per physics update
  private accumulateForce(force: Vec3) {
    this.forceAccumulator.add(force);
  }

  private applyAccumulatedForces() {
    if (!this.physicsEntity || this.forceAccumulator.equals(Vec3.zero()))
      return;

    this.physicsEntity.physics.addForce(
      this.forceAccumulator,
      PhysicsForceMode.Force
    );
    this.forceAccumulator = new Vec3(0, 0, 0); // Reset accumulator
  }

  // Wind force simulation
  private applyWindForce(
    windDirection: Vec3,
    windStrength: number,
    turbulence: number = 0
  ) {
    if (!this.physicsEntity) return;

    let force = windDirection.normalize().scale(windStrength);

    // Add turbulence
    if (turbulence > 0) {
      const turbulenceForce = new Vec3(
        (Math.random() - 0.5) * turbulence,
        (Math.random() - 0.5) * turbulence,
        (Math.random() - 0.5) * turbulence
      );
      force = force.add(turbulenceForce);
    }

    this.accumulateForce(force);
  }

  // Magnetic force simulation
  private applyMagneticForce(
    magnetPosition: Vec3,
    magnetStrength: number,
    isAttraction: boolean = true
  ) {
    if (!this.physicsEntity) return;

    const position = this.physicsEntity.transform.position.get();
    const direction = magnetPosition.subtract(position);
    const distance = direction.magnitude();

    if (distance < 0.1) return; // Avoid division by zero

    // Inverse square law
    const forceMagnitude = magnetStrength / (distance * distance);
    let force = direction.normalize().scale(forceMagnitude);

    if (!isAttraction) {
      force = force.scale(-1); // Repulsion
    }

    this.accumulateForce(force);
  }

  // Orbital force (keeps object in orbit around center)
  private applyOrbitalForce(centerPosition: Vec3, orbitalSpeed: number) {
    if (!this.physicsEntity) return;

    const position = this.physicsEntity.transform.position.get();
    const radius = position.subtract(centerPosition);
    const distance = radius.magnitude();

    if (distance < 0.1) return;

    // Calculate centripetal force needed for circular orbit
    const mass = this.physicsEntity.physics.mass.get();
    const centripetalForce = (mass * orbitalSpeed * orbitalSpeed) / distance;

    const force = radius.normalize().scale(-centripetalForce);
    this.accumulateForce(force);
  }

  tick() {
    // Apply all accumulated forces once per frame
    this.applyAccumulatedForces();
  }
}
```

## Collision Detection

### Basic Collision Handling

```typescript
class CollisionHandling extends Component<typeof CollisionHandling> {
  private physicsEntity?: PhysicalEntity;
  private collisionSubscriptions: EventSubscription[] = [];

  start() {
    this.physicsEntity = this.entity as PhysicalEntity;
    this.setupCollisionEvents();
  }

  private setupCollisionEvents() {
    if (!this.physicsEntity) return;

    // Listen for collision events
    const enterSub = this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnTriggerEnter,
      this.handleCollisionEnter.bind(this)
    );

    const exitSub = this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnTriggerExit,
      this.handleCollisionExit.bind(this)
    );

    this.collisionSubscriptions.push(enterSub, exitSub);
  }

  private handleCollisionEnter(other: Entity) {
    console.log(`Collision entered with: ${other.name.get()}`);

    // Handle different collision types
    if (other.hasTag("player")) {
      this.handlePlayerCollision(other);
    } else if (other.hasTag("projectile")) {
      this.handleProjectileCollision(other);
    } else if (other.hasTag("pickup")) {
      this.handlePickupCollision(other);
    }
  }

  private handleCollisionExit(other: Entity) {
    console.log(`Collision exited with: ${other.name.get()}`);
  }

  private handlePlayerCollision(player: Entity) {
    // Bounce the player away
    if (player instanceof PhysicalEntity) {
      const direction = this.getCollisionDirection(player);
      const bounceForce = direction.scale(10);
      player.physics.addForce(bounceForce, PhysicsForceMode.Impulse);
    }
  }

  private handleProjectileCollision(projectile: Entity) {
    // Destroy projectile and apply impact force
    if (this.physicsEntity && projectile instanceof PhysicalEntity) {
      const projectileVelocity = projectile.physics.velocity.get();
      const impactForce = projectileVelocity.scale(2);

      this.physicsEntity.physics.addForce(
        impactForce,
        PhysicsForceMode.Impulse
      );

      // Remove projectile
      projectile.dispose();
    }
  }

  private handlePickupCollision(pickup: Entity) {
    // Collect the pickup
    pickup.dispose();
    console.log("Pickup collected!");
  }

  private getCollisionDirection(other: Entity): Vec3 {
    if (!this.physicsEntity) return Vec3.zero();

    const myPos = this.physicsEntity.transform.position.get();
    const otherPos = other.transform.position.get();

    return myPos.subtract(otherPos).normalize();
  }

  dispose() {
    this.collisionSubscriptions.forEach((sub) => sub.disconnect());
  }
}
```

### Advanced Collision Response

```typescript
class AdvancedCollisions extends Component<typeof AdvancedCollisions> {
  private physicsEntity?: PhysicalEntity;
  private collisionCooldowns = new Map<string, number>();

  start() {
    this.physicsEntity = this.entity as PhysicalEntity;
  }

  private handleCollisionWithCooldown(
    other: Entity,
    cooldownMs: number = 1000
  ) {
    const otherId = other.id.toString();
    const now = Date.now();

    // Check cooldown
    const lastCollision = this.collisionCooldowns.get(otherId) || 0;
    if (now - lastCollision < cooldownMs) {
      return; // Still in cooldown
    }

    this.collisionCooldowns.set(otherId, now);
    this.processCollision(other);
  }

  private processCollision(other: Entity) {
    if (!this.physicsEntity) return;

    // Calculate collision properties
    const collisionData = this.calculateCollisionData(other);

    if (collisionData) {
      this.applyCollisionResponse(collisionData);
    }
  }

  private calculateCollisionData(other: Entity) {
    if (!this.physicsEntity || !(other instanceof PhysicalEntity)) return null;

    const myPos = this.physicsEntity.transform.position.get();
    const otherPos = other.transform.position.get();
    const myVel = this.physicsEntity.physics.velocity.get();
    const otherVel = other.physics.velocity.get();
    const myMass = this.physicsEntity.physics.mass.get();
    const otherMass = other.physics.mass.get();

    const collisionNormal = otherPos.subtract(myPos).normalize();
    const relativeVelocity = myVel.subtract(otherVel);
    const impactSpeed = relativeVelocity.dot(collisionNormal);

    return {
      other,
      normal: collisionNormal,
      impactSpeed,
      myMass,
      otherMass,
      myVelocity: myVel,
      otherVelocity: otherVel,
    };
  }

  private applyCollisionResponse(data: any) {
    if (!this.physicsEntity) return;

    const restitution = 0.8; // Bounciness factor

    // Calculate impulse using conservation of momentum
    const impulse = (2 * data.impactSpeed) / (data.myMass + data.otherMass);

    // Apply forces
    const myImpulse = data.normal.scale(
      -impulse * data.otherMass * restitution
    );
    const otherImpulse = data.normal.scale(impulse * data.myMass * restitution);

    this.physicsEntity.physics.addForce(myImpulse, PhysicsForceMode.Impulse);

    if (data.other instanceof PhysicalEntity) {
      data.other.physics.addForce(otherImpulse, PhysicsForceMode.Impulse);
    }
  }

  // Collision prediction for fast-moving objects
  private predictCollision(other: Entity, deltaTime: number): boolean {
    if (!this.physicsEntity || !(other instanceof PhysicalEntity)) return false;

    const myPos = this.physicsEntity.transform.position.get();
    const otherPos = other.transform.position.get();
    const myVel = this.physicsEntity.physics.velocity.get();
    const otherVel = other.physics.velocity.get();

    // Predict positions after deltaTime
    const myFuturePos = myPos.add(myVel.scale(deltaTime));
    const otherFuturePos = otherPos.add(otherVel.scale(deltaTime));

    // Simple sphere collision check (assume radius of 1)
    const distance = myFuturePos.distanceTo(otherFuturePos);
    return distance < 2; // Combined radius
  }
}
```

## Physics Properties

### Dynamic Property Adjustment

```typescript
class DynamicPhysics extends Component<typeof DynamicPhysics> {
  private physicsEntity?: PhysicalEntity;
  private originalMass: number = 1;

  start() {
    this.physicsEntity = this.entity as PhysicalEntity;
    this.originalMass = this.physicsEntity.physics.mass.get();
  }

  // Temporarily change mass for special effects
  private temporaryMassChange(newMass: number, durationMs: number) {
    if (!this.physicsEntity) return;

    this.physicsEntity.physics.mass.set(newMass);

    this.async.setTimeout(() => {
      if (this.physicsEntity) {
        this.physicsEntity.physics.mass.set(this.originalMass);
      }
    }, durationMs);
  }

  // Smooth mass transition
  private smoothMassTransition(targetMass: number, durationMs: number) {
    if (!this.physicsEntity) return;

    const startMass = this.physicsEntity.physics.mass.get();
    const startTime = Date.now();

    const updateMass = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      const currentMass = startMass + (targetMass - startMass) * progress;
      this.physicsEntity!.physics.mass.set(currentMass);

      if (progress < 1) {
        this.async.setTimeout(updateMass, 16);
      }
    };

    updateMass();
  }

  // Adaptive physics based on speed
  private adaptivePhysics() {
    if (!this.physicsEntity) return;

    const velocity = this.physicsEntity.physics.velocity.get();
    const speed = velocity.magnitude();

    // Increase drag at high speeds for terminal velocity
    const adaptiveDrag = Math.min(0.1 + speed * 0.01, 0.5);
    this.physicsEntity.physics.drag.set(adaptiveDrag);

    // Reduce mass for very fast objects to prevent tunneling
    if (speed > 20) {
      this.physicsEntity.physics.mass.set(this.originalMass * 0.5);
    } else {
      this.physicsEntity.physics.mass.set(this.originalMass);
    }
  }

  // Conditional gravity
  private conditionalGravity(condition: boolean) {
    if (!this.physicsEntity) return;

    this.physicsEntity.physics.useGravity.set(condition);

    if (!condition) {
      // Add slight upward force to counteract any remaining gravity
      const antiGravity = new Vec3(0, 1, 0);
      this.physicsEntity.physics.addForce(antiGravity, PhysicsForceMode.Force);
    }
  }

  tick() {
    this.adaptivePhysics();
  }
}
```

## Performance Optimization

### Physics Performance Best Practices

```typescript
class PhysicsOptimization extends Component<typeof PhysicsOptimization> {
  private physicsEntity?: PhysicalEntity;
  private lastPhysicsUpdate = 0;
  private readonly PHYSICS_UPDATE_INTERVAL = 16; // ~60fps
  private forceQueue: Array<{ force: Vec3; mode: PhysicsForceMode }> = [];

  start() {
    this.physicsEntity = this.entity as PhysicalEntity;
    this.optimizePhysicsSettings();
  }

  private optimizePhysicsSettings() {
    if (!this.physicsEntity) return;

    // Disable physics when not needed
    const position = this.physicsEntity.transform.position.get();
    const velocity = this.physicsEntity.physics.velocity.get();

    // Put object to sleep if it's stationary
    if (velocity.magnitude() < 0.1) {
      this.physicsEntity.physics.sleep();
    }
  }

  // Batch force applications
  private queueForce(
    force: Vec3,
    mode: PhysicsForceMode = PhysicsForceMode.Force
  ) {
    this.forceQueue.push({ force, mode });
  }

  private processForceQueue() {
    if (!this.physicsEntity || this.forceQueue.length === 0) return;

    // Combine similar force types
    const forceModeGroups = new Map<PhysicsForceMode, Vec3>();

    this.forceQueue.forEach((item) => {
      const existing = forceModeGroups.get(item.mode) || Vec3.zero();
      forceModeGroups.set(item.mode, existing.add(item.force));
    });

    // Apply combined forces
    forceModeGroups.forEach((combinedForce, mode) => {
      this.physicsEntity!.physics.addForce(combinedForce, mode);
    });

    this.forceQueue.length = 0;
  }

  // Conditional physics updates
  private shouldUpdatePhysics(): boolean {
    const now = Date.now();
    return now - this.lastPhysicsUpdate >= this.PHYSICS_UPDATE_INTERVAL;
  }

  // Distance-based LOD for physics
  private updatePhysicsLOD(playerPosition: Vec3) {
    if (!this.physicsEntity) return;

    const myPosition = this.physicsEntity.transform.position.get();
    const distance = myPosition.distanceTo(playerPosition);

    if (distance > 100) {
      // Very far: disable physics completely
      this.physicsEntity.physics.isKinematic.set(true);
      this.physicsEntity.physics.useGravity.set(false);
    } else if (distance > 50) {
      // Far: reduce physics accuracy
      this.physicsEntity.physics.drag.set(1.0); // High drag for stability
      this.physicsEntity.physics.useGravity.set(true);
      this.physicsEntity.physics.isKinematic.set(false);
    } else {
      // Near: full physics
      this.physicsEntity.physics.drag.set(0.1);
      this.physicsEntity.physics.useGravity.set(true);
      this.physicsEntity.physics.isKinematic.set(false);
    }
  }

  // Memory-efficient collision tracking
  private readonly MAX_COLLISION_HISTORY = 10;
  private collisionHistory: Array<{ entity: string; time: number }> = [];

  private trackCollision(entity: Entity) {
    this.collisionHistory.push({
      entity: entity.id.toString(),
      time: Date.now(),
    });

    // Keep only recent collisions
    if (this.collisionHistory.length > this.MAX_COLLISION_HISTORY) {
      this.collisionHistory.shift();
    }
  }

  tick() {
    if (this.shouldUpdatePhysics()) {
      this.processForceQueue();
      this.lastPhysicsUpdate = Date.now();
    }
  }
}
```

## Common Physics Patterns

### Physics-Based Movement Controller

```typescript
class PhysicsController extends Component<typeof PhysicsController> {
  static propsDefinition = {
    moveSpeed: { type: PropTypes.Number, default: 10 },
    jumpForce: { type: PropTypes.Number, default: 15 },
    airControl: { type: PropTypes.Number, default: 0.5 },
  };

  private physicsEntity?: PhysicalEntity;
  private isGrounded = false;
  private moveInput = new Vec3(0, 0, 0);

  start() {
    this.physicsEntity = this.entity as PhysicalEntity;
    this.setupGroundDetection();
  }

  private setupGroundDetection() {
    // Use raycast to detect ground
    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnTriggerEnter,
      (other: Entity) => {
        if (other.hasTag("ground")) {
          this.isGrounded = true;
        }
      }
    );

    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnTriggerExit,
      (other: Entity) => {
        if (other.hasTag("ground")) {
          this.isGrounded = false;
        }
      }
    );
  }

  public move(direction: Vec3) {
    this.moveInput = direction.normalize();
  }

  public jump() {
    if (!this.physicsEntity || !this.isGrounded) return;

    const jumpForce = new Vec3(0, this.props.jumpForce!, 0);
    this.physicsEntity.physics.addForce(jumpForce, PhysicsForceMode.Impulse);
    this.isGrounded = false;
  }

  tick() {
    this.applyMovement();
  }

  private applyMovement() {
    if (!this.physicsEntity || this.moveInput.equals(Vec3.zero())) return;

    const controlFactor = this.isGrounded ? 1.0 : this.props.airControl!;
    const force = this.moveInput.scale(this.props.moveSpeed! * controlFactor);

    // Apply only horizontal movement force
    const horizontalForce = new Vec3(force.x, 0, force.z);
    this.physicsEntity.physics.addForce(
      horizontalForce,
      PhysicsForceMode.Force
    );
  }
}
```

### Spring System

```typescript
class SpringSystem extends Component<typeof SpringSystem> {
  static propsDefinition = {
    springStrength: { type: PropTypes.Number, default: 50 },
    damping: { type: PropTypes.Number, default: 5 },
    targetEntity: { type: PropTypes.Entity },
  };

  private physicsEntity?: PhysicalEntity;

  start() {
    this.physicsEntity = this.entity as PhysicalEntity;
  }

  tick() {
    this.updateSpring();
  }

  private updateSpring() {
    if (!this.physicsEntity || !this.props.targetEntity) return;

    const currentPos = this.physicsEntity.transform.position.get();
    const targetPos = this.props.targetEntity.transform.position.get();
    const velocity = this.physicsEntity.physics.velocity.get();

    // Calculate spring force
    const displacement = targetPos.subtract(currentPos);
    const springForce = displacement.scale(this.props.springStrength!);

    // Calculate damping force
    const dampingForce = velocity.scale(-this.props.damping!);

    // Apply combined force
    const totalForce = springForce.add(dampingForce);
    this.physicsEntity.physics.addForce(totalForce, PhysicsForceMode.Force);
  }

  // Create spring connection between two entities
  public static connectWithSpring(
    entityA: PhysicalEntity,
    entityB: PhysicalEntity,
    springStrength: number = 50,
    damping: number = 5
  ) {
    const springComponent = entityA.addComponent(SpringSystem, {
      springStrength,
      damping,
      targetEntity: entityB,
    });

    return springComponent;
  }
}
```

## Advanced Techniques

### Custom Physics Simulation

```typescript
class CustomPhysics extends Component<typeof CustomPhysics> {
  private physicsEntity?: PhysicalEntity;
  private customVelocity = new Vec3(0, 0, 0);
  private customAcceleration = new Vec3(0, 0, 0);
  private useCustomPhysics = false;

  start() {
    this.physicsEntity = this.entity as PhysicalEntity;
  }

  // Override built-in physics with custom simulation
  public enableCustomPhysics() {
    if (!this.physicsEntity) return;

    this.useCustomPhysics = true;
    this.physicsEntity.physics.isKinematic.set(true); // Disable built-in physics
    this.physicsEntity.physics.useGravity.set(false);
  }

  public disableCustomPhysics() {
    if (!this.physicsEntity) return;

    this.useCustomPhysics = false;
    this.physicsEntity.physics.isKinematic.set(false);
    this.physicsEntity.physics.useGravity.set(true);
  }

  private simulateCustomPhysics(deltaTime: number) {
    if (!this.physicsEntity || !this.useCustomPhysics) return;

    // Update velocity based on acceleration
    this.customVelocity.add(this.customAcceleration.scale(deltaTime));

    // Update position based on velocity
    const currentPos = this.physicsEntity.transform.position.get();
    const newPos = currentPos.add(this.customVelocity.scale(deltaTime));
    this.physicsEntity.transform.position.set(newPos);

    // Apply custom drag
    this.customVelocity.scale(0.99);
  }

  public addCustomForce(force: Vec3, mass: number = 1) {
    const acceleration = force.scale(1 / mass);
    this.customAcceleration.add(acceleration);
  }

  tick() {
    if (this.useCustomPhysics) {
      const deltaTime = 1 / 60; // Assume 60fps
      this.simulateCustomPhysics(deltaTime);
      this.customAcceleration = new Vec3(0, 0, 0); // Reset acceleration
    }
  }
}
```

### Physics-Based Animations

```typescript
class PhysicsAnimations extends Component<typeof PhysicsAnimations> {
  private physicsEntity?: PhysicalEntity;

  start() {
    this.physicsEntity = this.entity as PhysicalEntity;
  }

  // Animate to position using physics
  public animateToPosition(targetPos: Vec3, duration: number = 1000) {
    if (!this.physicsEntity) return;

    const startPos = this.physicsEntity.transform.position.get();
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Calculate target velocity for smooth animation
      const currentPos = this.physicsEntity!.transform.position.get();
      const remainingDistance = targetPos.subtract(currentPos);
      const timeRemaining = (duration - elapsed) / 1000;

      if (timeRemaining > 0 && progress < 1) {
        const targetVelocity = remainingDistance.scale(1 / timeRemaining);
        const currentVelocity = this.physicsEntity!.physics.velocity.get();
        const velocityDifference = targetVelocity.subtract(currentVelocity);

        // Apply force to reach target velocity
        const mass = this.physicsEntity!.physics.mass.get();
        const force = velocityDifference.scale(mass * 10); // Adjust multiplier as needed

        this.physicsEntity!.physics.addForce(force, PhysicsForceMode.Force);

        this.async.setTimeout(animate, 16);
      } else {
        // Ensure exact final position
        this.physicsEntity!.transform.position.set(targetPos);
        this.physicsEntity!.physics.velocity.set(Vec3.zero());
      }
    };

    animate();
  }

  // Orbit animation using physics
  public startOrbit(center: Vec3, radius: number, speed: number) {
    if (!this.physicsEntity) return;

    // Position entity at orbit radius
    const orbitPos = center.add(new Vec3(radius, 0, 0));
    this.physicsEntity.transform.position.set(orbitPos);

    // Apply initial tangential velocity
    const tangentialVelocity = new Vec3(0, 0, speed);
    this.physicsEntity.physics.velocity.set(tangentialVelocity);

    // Continuously apply centripetal force
    const applyOrbitForce = () => {
      if (!this.physicsEntity) return;

      const currentPos = this.physicsEntity.transform.position.get();
      const toCenter = center.subtract(currentPos).normalize();
      const mass = this.physicsEntity.physics.mass.get();
      const currentSpeed = this.physicsEntity.physics.velocity
        .get()
        .magnitude();

      // F = mv²/r
      const centripetalForce = (mass * currentSpeed * currentSpeed) / radius;
      const force = toCenter.scale(centripetalForce);

      this.physicsEntity.physics.addForce(force, PhysicsForceMode.Force);

      this.async.setTimeout(applyOrbitForce, 16);
    };

    applyOrbitForce();
  }
}
```

## Summary

1. **Understand PhysicalEntity requirements** before applying physics
2. **Use appropriate force modes** for different effects (Impulse vs Force)
3. **Batch force applications** for better performance
4. **Implement proper collision handling** with cooldowns and validation
5. **Optimize physics for distance** using LOD techniques
6. **Cache physics properties** to avoid frequent bridge calls
7. **Use spring systems** for natural movement and connections
8. **Consider custom physics** for special effects or unique behaviors
9. **Validate entities** before performing physics operations
10. **Clean up physics subscriptions** in dispose() methods
