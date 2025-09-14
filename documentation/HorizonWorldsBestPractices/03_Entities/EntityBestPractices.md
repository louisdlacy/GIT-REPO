# Entity and Transform Best Practices for Horizon Worlds

## Table of Contents

1. [Entity Hierarchy Management](#entity-hierarchy-management)
2. [Transform Operations](#transform-operations)
3. [Entity Lifecycle](#entity-lifecycle)
4. [Component Attachment](#component-attachment)
5. [Entity Queries and Searches](#entity-queries-and-searches)
6. [Performance Optimization](#performance-optimization)
7. [Common Patterns](#common-patterns)

## Entity Hierarchy Management

### Proper Parent-Child Relationships

```typescript
class EntityHierarchy extends Component<typeof EntityHierarchy> {
  start() {
    // Get parent and children safely
    const parent = this.entity.parent.get();
    const children = this.entity.children.get();

    if (parent) {
      console.log(`Entity has parent: ${parent.name.get()}`);
    }

    // Iterate through children safely
    children.forEach((child, index) => {
      console.log(`Child ${index}: ${child.name.get()}`);
    });
  }

  private reorganizeHierarchy() {
    // Cache entity references before hierarchy changes
    const targetParent = this.findEntityByName("NewParent");
    const childEntities = this.entity.children.get();

    if (targetParent) {
      // Batch hierarchy changes for performance
      childEntities.forEach((child) => {
        child.parent.set(targetParent);
      });
    }
  }

  private findEntityByName(name: string): Entity | null {
    // Use entity queries instead of traversing hierarchy
    const entities = this.world.getEntitiesByTag("searchable");
    return entities.find((entity) => entity.name.get() === name) || null;
  }
}
```

### Safe Entity Access Patterns

```typescript
class SafeEntityAccess extends Component<typeof SafeEntityAccess> {
  private validateEntity(entity: Entity | null): entity is Entity {
    return entity !== null && entity !== undefined;
  }

  private safeGetEntityProperty<T>(
    entity: Entity | null,
    getter: (e: Entity) => T,
    defaultValue: T
  ): T {
    if (!this.validateEntity(entity)) {
      return defaultValue;
    }

    try {
      return getter(entity);
    } catch (error) {
      console.warn("Error accessing entity property:", error);
      return defaultValue;
    }
  }

  start() {
    const parent = this.entity.parent.get();

    // Safe property access with fallbacks
    const parentName = this.safeGetEntityProperty(
      parent,
      (e) => e.name.get(),
      "Unknown"
    );

    const parentPosition = this.safeGetEntityProperty(
      parent,
      (e) => e.transform.position.get(),
      new Vec3(0, 0, 0)
    );
  }
}
```

## Transform Operations

### Efficient Transform Manipulation

```typescript
class TransformOperations extends Component<typeof TransformOperations> {
  private cachedTransform?: Transform;
  private lastTransformUpdate = 0;

  start() {
    // Cache transform reference
    this.cachedTransform = this.entity.transform;
  }

  // Position Operations
  private moveToPosition(targetPosition: Vec3, smooth: boolean = false) {
    if (!this.cachedTransform) return;

    if (smooth) {
      this.smoothMoveToPosition(targetPosition);
    } else {
      this.cachedTransform.position.set(targetPosition);
    }
  }

  private smoothMoveToPosition(targetPosition: Vec3) {
    const currentPos = this.cachedTransform!.position.get();
    const duration = 1000; // 1 second
    const startTime = Date.now();

    const updatePosition = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Lerp between current and target position
      const newPos = currentPos.clone().lerp(targetPosition, progress);
      this.cachedTransform!.position.set(newPos);

      if (progress < 1) {
        this.async.setTimeout(updatePosition, 16); // ~60fps
      }
    };

    updatePosition();
  }

  // Rotation Operations
  private rotateTowards(targetDirection: Vec3) {
    const currentRotation = this.cachedTransform!.rotation.get();
    const targetRotation = Quaternion.lookAt(
      Vec3.zero(),
      targetDirection,
      Vec3.up()
    );

    // Smooth rotation using slerp
    const newRotation = currentRotation.slerp(targetRotation, 0.1);
    this.cachedTransform!.rotation.set(newRotation);
  }

  // Scale Operations
  private scaleUniformly(scale: number) {
    const scaleVec = new Vec3(scale, scale, scale);
    this.cachedTransform!.scale.set(scaleVec);
  }

  private scaleOverTime(
    startScale: number,
    endScale: number,
    durationMs: number
  ) {
    const startTime = Date.now();

    const updateScale = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      const currentScale = startScale + (endScale - startScale) * progress;
      this.scaleUniformly(currentScale);

      if (progress < 1) {
        this.async.setTimeout(updateScale, 16);
      }
    };

    updateScale();
  }
}
```

### Transform Space Conversions

```typescript
class SpaceConversions extends Component<typeof SpaceConversions> {
  // Convert between world and local space
  private worldToLocalPosition(worldPos: Vec3): Vec3 {
    const transform = this.entity.transform;
    const worldMatrix = transform.getWorldMatrix();
    const inverseMatrix = worldMatrix.inverse();
    return inverseMatrix.multiplyVec3(worldPos);
  }

  private localToWorldPosition(localPos: Vec3): Vec3 {
    const transform = this.entity.transform;
    const worldMatrix = transform.getWorldMatrix();
    return worldMatrix.multiplyVec3(localPos);
  }

  // Direction conversions
  private transformDirection(direction: Vec3, fromLocal: boolean = true): Vec3 {
    const rotation = this.entity.transform.rotation.get();

    if (fromLocal) {
      // Local to world direction
      return rotation.multiplyVec3(direction);
    } else {
      // World to local direction
      return rotation.conjugate().multiplyVec3(direction);
    }
  }

  // Get relative position between entities
  private getRelativePosition(targetEntity: Entity): Vec3 {
    const myPos = this.entity.transform.position.get();
    const targetPos = targetEntity.transform.position.get();
    return targetPos.subtract(myPos);
  }
}
```

## Entity Lifecycle

### Entity Creation and Destruction

```typescript
class EntityLifecycle extends Component<typeof EntityLifecycle> {
  private managedEntities: Entity[] = [];

  start() {
    this.createManagedEntities();
  }

  private createManagedEntities() {
    // Create entities with proper tracking
    for (let i = 0; i < 5; i++) {
      const newEntity = this.world.createEntity();
      newEntity.name.set(`ManagedEntity_${i}`);
      newEntity.transform.position.set(new Vec3(i * 2, 0, 0));

      // Track created entities
      this.managedEntities.push(newEntity);

      // Set up entity with components
      this.setupEntityComponents(newEntity);
    }
  }

  private setupEntityComponents(entity: Entity) {
    try {
      // Add components safely
      entity.addComponent(SomeComponent, {
        // Component props
      });
    } catch (error) {
      console.error("Failed to add component:", error);
    }
  }

  private destroyEntity(entity: Entity) {
    try {
      // Remove from tracking
      const index = this.managedEntities.indexOf(entity);
      if (index > -1) {
        this.managedEntities.splice(index, 1);
      }

      // Clean up entity
      entity.dispose();
    } catch (error) {
      console.error("Failed to destroy entity:", error);
    }
  }

  dispose() {
    // Clean up all managed entities
    this.managedEntities.forEach((entity) => {
      try {
        entity.dispose();
      } catch (error) {
        console.error("Error disposing entity:", error);
      }
    });
    this.managedEntities.length = 0;
  }
}
```

### Entity State Management

```typescript
interface EntityState {
  isActive: boolean;
  health: number;
  lastUpdateTime: number;
}

class EntityStateManager extends Component<typeof EntityStateManager> {
  private entityStates = new Map<string, EntityState>();

  private getEntityState(entity: Entity): EntityState {
    const id = entity.id.toString();

    if (!this.entityStates.has(id)) {
      this.entityStates.set(id, {
        isActive: true,
        health: 100,
        lastUpdateTime: Date.now(),
      });
    }

    return this.entityStates.get(id)!;
  }

  private updateEntityState(entity: Entity, updates: Partial<EntityState>) {
    const id = entity.id.toString();
    const currentState = this.getEntityState(entity);

    const newState = {
      ...currentState,
      ...updates,
      lastUpdateTime: Date.now(),
    };

    this.entityStates.set(id, newState);
    this.onEntityStateChanged(entity, newState);
  }

  private onEntityStateChanged(entity: Entity, state: EntityState) {
    // React to state changes
    if (!state.isActive) {
      entity.setVisibility(false);
    }

    if (state.health <= 0) {
      this.handleEntityDeath(entity);
    }
  }

  private handleEntityDeath(entity: Entity) {
    // Handle entity death logic
    this.updateEntityState(entity, { isActive: false });
  }
}
```

## Component Attachment

### Safe Component Management

```typescript
class ComponentManager extends Component<typeof ComponentManager> {
  private attachComponentSafely<T extends Component<any>>(
    entity: Entity,
    componentClass: any,
    props?: any
  ): T | null {
    try {
      // Check if component already exists
      const existing = entity.getComponent(componentClass);
      if (existing) {
        console.warn(
          `Component ${componentClass.name} already exists on entity`
        );
        return existing as T;
      }

      // Add component with props
      return entity.addComponent(componentClass, props) as T;
    } catch (error) {
      console.error(`Failed to add component ${componentClass.name}:`, error);
      return null;
    }
  }

  private removeComponentSafely<T extends Component<any>>(
    entity: Entity,
    componentClass: any
  ): boolean {
    try {
      const component = entity.getComponent(componentClass);
      if (component) {
        entity.removeComponent(componentClass);
        return true;
      }
    } catch (error) {
      console.error(
        `Failed to remove component ${componentClass.name}:`,
        error
      );
    }
    return false;
  }

  private getComponentSafely<T extends Component<any>>(
    entity: Entity,
    componentClass: any
  ): T | null {
    try {
      return (entity.getComponent(componentClass) as T) || null;
    } catch (error) {
      console.error(`Failed to get component ${componentClass.name}:`, error);
      return null;
    }
  }
}
```

## Entity Queries and Searches

### Efficient Entity Finding

```typescript
class EntityQueries extends Component<typeof EntityQueries> {
  private entityCache = new Map<string, Entity[]>();
  private cacheTimeout = 5000; // 5 seconds
  private lastCacheUpdate = new Map<string, number>();

  private getEntitiesByTagCached(tag: string): Entity[] {
    const now = Date.now();
    const lastUpdate = this.lastCacheUpdate.get(tag) || 0;

    // Check if cache is still valid
    if (now - lastUpdate < this.cacheTimeout && this.entityCache.has(tag)) {
      return this.entityCache.get(tag)!;
    }

    // Update cache
    const entities = this.world.getEntitiesByTag(tag);
    this.entityCache.set(tag, entities);
    this.lastCacheUpdate.set(tag, now);

    return entities;
  }

  private findNearestEntity(
    entities: Entity[],
    referencePosition: Vec3
  ): Entity | null {
    if (entities.length === 0) return null;

    let nearest: Entity | null = null;
    let nearestDistance = Infinity;

    entities.forEach((entity) => {
      const distance = referencePosition.distanceTo(
        entity.transform.position.get()
      );

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = entity;
      }
    });

    return nearest;
  }

  private findEntitiesInRadius(
    entities: Entity[],
    center: Vec3,
    radius: number
  ): Entity[] {
    return entities.filter((entity) => {
      const distance = center.distanceTo(entity.transform.position.get());
      return distance <= radius;
    });
  }

  private findEntitiesByPredicate(
    entities: Entity[],
    predicate: (entity: Entity) => boolean
  ): Entity[] {
    return entities.filter(predicate);
  }

  // Usage examples
  start() {
    const enemies = this.getEntitiesByTagCached("enemy");
    const playerPos = this.entity.transform.position.get();

    // Find nearest enemy
    const nearestEnemy = this.findNearestEntity(enemies, playerPos);

    // Find enemies within 10 units
    const nearbyEnemies = this.findEntitiesInRadius(enemies, playerPos, 10);

    // Find active enemies
    const activeEnemies = this.findEntitiesByPredicate(enemies, (entity) => {
      const component = entity.getComponent(EnemyComponent);
      return component && component.isActive;
    });
  }
}
```

## Performance Optimization

### Transform Caching and Batching

```typescript
class TransformOptimizer extends Component<typeof TransformOptimizer> {
  private transformCache = new Map<
    string,
    {
      position: Vec3;
      rotation: Quaternion;
      scale: Vec3;
      timestamp: number;
    }
  >();

  private readonly CACHE_DURATION = 16; // ~60fps cache duration

  private getCachedTransform(entity: Entity) {
    const id = entity.id.toString();
    const now = Date.now();
    const cached = this.transformCache.get(id);

    if (cached && now - cached.timestamp < this.CACHE_DURATION) {
      return cached;
    }

    // Update cache
    const transform = entity.transform;
    const newCache = {
      position: transform.position.get().clone(),
      rotation: transform.rotation.get().clone(),
      scale: transform.scale.get().clone(),
      timestamp: now,
    };

    this.transformCache.set(id, newCache);
    return newCache;
  }

  private batchTransformUpdates(
    updates: Array<{ entity: Entity; position?: Vec3; rotation?: Quaternion }>
  ) {
    // Group updates by type for efficiency
    const positionUpdates: Array<{ entity: Entity; position: Vec3 }> = [];
    const rotationUpdates: Array<{ entity: Entity; rotation: Quaternion }> = [];

    updates.forEach((update) => {
      if (update.position) {
        positionUpdates.push({
          entity: update.entity,
          position: update.position,
        });
      }
      if (update.rotation) {
        rotationUpdates.push({
          entity: update.entity,
          rotation: update.rotation,
        });
      }
    });

    // Apply all position updates
    positionUpdates.forEach((update) => {
      update.entity.transform.position.set(update.position);
    });

    // Apply all rotation updates
    rotationUpdates.forEach((update) => {
      update.entity.transform.rotation.set(update.rotation);
    });
  }
}
```

## Common Patterns

### Entity Pool Pattern

```typescript
class EntityPool extends Component<typeof EntityPool> {
  private availableEntities: Entity[] = [];
  private activeEntities: Entity[] = [];
  private readonly POOL_SIZE = 20;

  start() {
    this.initializePool();
  }

  private initializePool() {
    for (let i = 0; i < this.POOL_SIZE; i++) {
      const entity = this.world.createEntity();
      entity.setVisibility(false);
      this.availableEntities.push(entity);
    }
  }

  public borrowEntity(): Entity | null {
    if (this.availableEntities.length === 0) {
      console.warn("Entity pool exhausted");
      return null;
    }

    const entity = this.availableEntities.pop()!;
    this.activeEntities.push(entity);
    entity.setVisibility(true);

    return entity;
  }

  public returnEntity(entity: Entity) {
    const index = this.activeEntities.indexOf(entity);
    if (index > -1) {
      this.activeEntities.splice(index, 1);
      this.availableEntities.push(entity);

      // Reset entity state
      entity.setVisibility(false);
      entity.transform.position.set(Vec3.zero());
      entity.transform.rotation.set(Quaternion.identity());
      entity.transform.scale.set(Vec3.one());
    }
  }

  dispose() {
    // Clean up all entities
    [...this.availableEntities, ...this.activeEntities].forEach((entity) => {
      entity.dispose();
    });
  }
}
```

### Entity Factory Pattern

```typescript
interface EntityConfiguration {
  name: string;
  position: Vec3;
  rotation?: Quaternion;
  scale?: Vec3;
  components?: Array<{ type: any; props: any }>;
  tags?: string[];
}

class EntityFactory extends Component<typeof EntityFactory> {
  public createEntity(config: EntityConfiguration): Entity {
    const entity = this.world.createEntity();

    // Set basic properties
    entity.name.set(config.name);
    entity.transform.position.set(config.position);

    if (config.rotation) {
      entity.transform.rotation.set(config.rotation);
    }

    if (config.scale) {
      entity.transform.scale.set(config.scale);
    }

    // Add tags
    if (config.tags) {
      config.tags.forEach((tag) => entity.addTag(tag));
    }

    // Add components
    if (config.components) {
      config.components.forEach((comp) => {
        try {
          entity.addComponent(comp.type, comp.props);
        } catch (error) {
          console.error(`Failed to add component ${comp.type.name}:`, error);
        }
      });
    }

    return entity;
  }

  // Predefined entity types
  public createProjectile(position: Vec3, direction: Vec3): Entity {
    return this.createEntity({
      name: "Projectile",
      position,
      rotation: Quaternion.lookAt(Vec3.zero(), direction, Vec3.up()),
      tags: ["projectile", "physics"],
      components: [
        { type: ProjectileComponent, props: { speed: 10, direction } },
      ],
    });
  }

  public createPickup(position: Vec3, itemType: string): Entity {
    return this.createEntity({
      name: `Pickup_${itemType}`,
      position,
      tags: ["pickup", "interactable"],
      components: [{ type: PickupComponent, props: { itemType, value: 100 } }],
    });
  }
}
```

## Summary

1. **Cache entity and transform references** to minimize bridge calls
2. **Validate entities before accessing properties** to prevent errors
3. **Use entity pools** for frequently created/destroyed objects
4. **Batch transform operations** when updating multiple entities
5. **Implement proper cleanup** in dispose() methods
6. **Use meaningful entity names and tags** for easier debugging
7. **Consider entity hierarchies carefully** for performance
8. **Cache entity queries** when results don't change frequently
