# Properties Best Practices for Horizon Worlds

## Table of Contents

1. [HorizonProperty Fundamentals](#horizonproperty-fundamentals)
2. [Property Type Management](#property-type-management)
3. [Bridge Call Optimization](#bridge-call-optimization)
4. [Property Caching Strategies](#property-caching-strategies)
5. [Networking and Synchronization](#networking-and-synchronization)
6. [Property Validation](#property-validation)
7. [Advanced Property Patterns](#advanced-property-patterns)

## HorizonProperty Fundamentals

### Basic Property Usage

```typescript
class PropertyManager extends Component<typeof PropertyManager> {
  static propsDefinition = {
    stringProperty: { type: PropTypes.String, default: "default" },
    numberProperty: { type: PropTypes.Number, default: 0 },
    booleanProperty: { type: PropTypes.Boolean, default: false },
    entityProperty: { type: PropTypes.Entity },
    assetProperty: { type: PropTypes.Asset },
  };

  private propertyCache = new Map<string, any>();
  private lastUpdateTimes = new Map<string, number>();

  start() {
    this.initializeProperties();
    this.setupPropertyValidation();
  }

  private initializeProperties() {
    // Cache initial property values
    this.cacheProperty("stringProperty", this.props.stringProperty!);
    this.cacheProperty("numberProperty", this.props.numberProperty!);
    this.cacheProperty("booleanProperty", this.props.booleanProperty!);

    console.log("Properties initialized and cached");
  }

  private cacheProperty(name: string, value: any) {
    this.propertyCache.set(name, value);
    this.lastUpdateTimes.set(name, Date.now());
  }

  // Safe property getter with fallback
  public getProperty<T>(name: string, fallback: T): T {
    const cached = this.propertyCache.get(name);
    if (cached !== undefined) {
      return cached as T;
    }

    // Try to get from props if not cached
    try {
      const propValue = (this.props as any)[name];
      if (propValue !== undefined) {
        this.cacheProperty(name, propValue);
        return propValue as T;
      }
    } catch (error) {
      console.error(`Failed to get property ${name}:`, error);
    }

    return fallback;
  }

  // Safe property setter with validation
  public setProperty<T>(name: string, value: T): boolean {
    if (!this.validatePropertyValue(name, value)) {
      console.error(`Invalid value for property ${name}:`, value);
      return false;
    }

    try {
      // Update props if it exists
      if ((this.props as any)[name] !== undefined) {
        (this.props as any)[name] = value;
      }

      // Update cache
      this.cacheProperty(name, value);

      return true;
    } catch (error) {
      console.error(`Failed to set property ${name}:`, error);
      return false;
    }
  }

  private validatePropertyValue(name: string, value: any): boolean {
    // Get property type from props definition
    const propDef = (this.constructor as any).propsDefinition?.[name];
    if (!propDef) return true; // Allow unknown properties

    switch (propDef.type) {
      case PropTypes.String:
        return typeof value === "string";
      case PropTypes.Number:
        return typeof value === "number" && !isNaN(value);
      case PropTypes.Boolean:
        return typeof value === "boolean";
      case PropTypes.Entity:
        return (
          value === null || value === undefined || typeof value === "object"
        );
      case PropTypes.Asset:
        return (
          value === null || value === undefined || typeof value === "object"
        );
      default:
        return true;
    }
  }

  // Get property with type safety
  public getTypedProperty<T>(name: string, type: PropTypes, fallback: T): T {
    const value = this.getProperty(name, fallback);

    if (!this.validatePropertyType(value, type)) {
      console.warn(`Property ${name} type mismatch, using fallback`);
      return fallback;
    }

    return value;
  }

  private validatePropertyType(value: any, expectedType: PropTypes): boolean {
    switch (expectedType) {
      case PropTypes.String:
        return typeof value === "string";
      case PropTypes.Number:
        return typeof value === "number";
      case PropTypes.Boolean:
        return typeof value === "boolean";
      default:
        return true;
    }
  }
}
```

### Property Arrays and Complex Types

```typescript
class ComplexPropertyManager extends Component<typeof ComplexPropertyManager> {
  static propsDefinition = {
    stringArray: { type: PropTypes.StringArray, default: [] },
    numberArray: { type: PropTypes.NumberArray, default: [] },
    entityArray: { type: PropTypes.EntityArray, default: [] },
    vec3Array: { type: PropTypes.Vec3Array, default: [] },
    colorArray: { type: PropTypes.ColorArray, default: [] },
  };

  private arrayCache = new Map<string, any[]>();

  start() {
    this.initializeArrays();
  }

  private initializeArrays() {
    this.cacheArray("stringArray", this.props.stringArray!);
    this.cacheArray("numberArray", this.props.numberArray!);
    this.cacheArray("entityArray", this.props.entityArray!);
    this.cacheArray("vec3Array", this.props.vec3Array!);
    this.cacheArray("colorArray", this.props.colorArray!);
  }

  private cacheArray(name: string, array: any[]) {
    // Deep copy for arrays to prevent reference issues
    this.arrayCache.set(name, [...array]);
  }

  // Safe array operations
  public getArrayProperty<T>(name: string): T[] {
    const cached = this.arrayCache.get(name);
    if (cached) {
      return [...cached] as T[]; // Return copy to prevent external modification
    }

    try {
      const propArray = (this.props as any)[name] || [];
      this.cacheArray(name, propArray);
      return [...propArray] as T[];
    } catch (error) {
      console.error(`Failed to get array property ${name}:`, error);
      return [];
    }
  }

  public setArrayProperty<T>(name: string, array: T[]): boolean {
    if (!Array.isArray(array)) {
      console.error(`Value for ${name} must be an array`);
      return false;
    }

    try {
      // Update props
      (this.props as any)[name] = [...array];

      // Update cache
      this.cacheArray(name, array);

      return true;
    } catch (error) {
      console.error(`Failed to set array property ${name}:`, error);
      return false;
    }
  }

  // Array modification methods
  public addToArray<T>(name: string, item: T): boolean {
    const currentArray = this.getArrayProperty<T>(name);
    currentArray.push(item);
    return this.setArrayProperty(name, currentArray);
  }

  public removeFromArray<T>(name: string, item: T): boolean {
    const currentArray = this.getArrayProperty<T>(name);
    const index = currentArray.indexOf(item);

    if (index === -1) return false;

    currentArray.splice(index, 1);
    return this.setArrayProperty(name, currentArray);
  }

  public clearArray(name: string): boolean {
    return this.setArrayProperty(name, []);
  }

  // Vec3 array specific operations
  public getVec3Array(): Vec3[] {
    return this.getArrayProperty<Vec3>("vec3Array");
  }

  public addVec3(position: Vec3): boolean {
    return this.addToArray("vec3Array", position.clone());
  }

  public getClosestVec3(target: Vec3): Vec3 | null {
    const vec3Array = this.getVec3Array();
    if (vec3Array.length === 0) return null;

    let closest = vec3Array[0];
    let minDistance = target.distanceTo(closest);

    for (let i = 1; i < vec3Array.length; i++) {
      const distance = target.distanceTo(vec3Array[i]);
      if (distance < minDistance) {
        minDistance = distance;
        closest = vec3Array[i];
      }
    }

    return closest;
  }

  // Entity array specific operations
  public getEntityArray(): Entity[] {
    return this.getArrayProperty<Entity>("entityArray").filter(
      (e) => e && !e.disposed
    );
  }

  public addEntity(entity: Entity): boolean {
    if (!entity || entity.disposed) return false;
    return this.addToArray("entityArray", entity);
  }

  public removeEntity(entity: Entity): boolean {
    return this.removeFromArray("entityArray", entity);
  }

  public cleanupEntityArray(): number {
    const currentArray = this.getArrayProperty<Entity>("entityArray");
    const validEntities = currentArray.filter((e) => e && !e.disposed);
    const removedCount = currentArray.length - validEntities.length;

    if (removedCount > 0) {
      this.setArrayProperty("entityArray", validEntities);
    }

    return removedCount;
  }
}
```

## Property Type Management

### Type-Safe Property Wrapper

```typescript
interface PropertyWrapper<T> {
  get(): T;
  set(value: T): boolean;
  validate(value: T): boolean;
  reset(): void;
}

class TypedProperty<T> implements PropertyWrapper<T> {
  private cachedValue: T;
  private validator: (value: T) => boolean;
  private defaultValue: T;

  constructor(
    private component: Component<any>,
    private propertyName: string,
    defaultValue: T,
    validator?: (value: T) => boolean
  ) {
    this.defaultValue = defaultValue;
    this.validator = validator || (() => true);
    this.cachedValue = this.getFromProps() || defaultValue;
  }

  private getFromProps(): T | undefined {
    try {
      return (this.component.props as any)[this.propertyName];
    } catch {
      return undefined;
    }
  }

  private setToProps(value: T): boolean {
    try {
      (this.component.props as any)[this.propertyName] = value;
      return true;
    } catch (error) {
      console.error(`Failed to set property ${this.propertyName}:`, error);
      return false;
    }
  }

  get(): T {
    return this.cachedValue;
  }

  set(value: T): boolean {
    if (!this.validate(value)) {
      console.error(`Invalid value for ${this.propertyName}:`, value);
      return false;
    }

    this.cachedValue = value;
    return this.setToProps(value);
  }

  validate(value: T): boolean {
    return this.validator(value);
  }

  reset(): void {
    this.set(this.defaultValue);
  }
}

class TypedPropertyManager extends Component<typeof TypedPropertyManager> {
  static propsDefinition = {
    health: { type: PropTypes.Number, default: 100 },
    playerName: { type: PropTypes.String, default: "Unknown" },
    isActive: { type: PropTypes.Boolean, default: true },
    targetEntity: { type: PropTypes.Entity },
  };

  private healthProperty: TypedProperty<number>;
  private nameProperty: TypedProperty<string>;
  private activeProperty: TypedProperty<boolean>;
  private targetProperty: TypedProperty<Entity | undefined>;

  start() {
    this.initializeTypedProperties();
  }

  private initializeTypedProperties() {
    // Health with validation
    this.healthProperty = new TypedProperty(
      this,
      "health",
      100,
      (value) => value >= 0 && value <= 100
    );

    // Name with validation
    this.nameProperty = new TypedProperty(
      this,
      "playerName",
      "Unknown",
      (value) => value.length > 0 && value.length <= 50
    );

    // Boolean property
    this.activeProperty = new TypedProperty(this, "isActive", true);

    // Entity property with null check
    this.targetProperty = new TypedProperty(
      this,
      "targetEntity",
      undefined,
      (value) => value === undefined || (value && !value.disposed)
    );
  }

  // Type-safe getters
  public getHealth(): number {
    return this.healthProperty.get();
  }

  public getName(): string {
    return this.nameProperty.get();
  }

  public isActive(): boolean {
    return this.activeProperty.get();
  }

  public getTarget(): Entity | undefined {
    return this.targetProperty.get();
  }

  // Type-safe setters
  public setHealth(health: number): boolean {
    return this.healthProperty.set(health);
  }

  public setName(name: string): boolean {
    return this.nameProperty.set(name);
  }

  public setActive(active: boolean): boolean {
    return this.activeProperty.set(active);
  }

  public setTarget(entity: Entity | undefined): boolean {
    return this.targetProperty.set(entity);
  }

  // Utility methods
  public damageHealth(damage: number): number {
    const currentHealth = this.getHealth();
    const newHealth = Math.max(0, currentHealth - damage);
    this.setHealth(newHealth);
    return newHealth;
  }

  public healHealth(healing: number): number {
    const currentHealth = this.getHealth();
    const newHealth = Math.min(100, currentHealth + healing);
    this.setHealth(newHealth);
    return newHealth;
  }

  public hasValidTarget(): boolean {
    const target = this.getTarget();
    return target !== undefined && !target.disposed;
  }
}
```

## Bridge Call Optimization

### Efficient Bridge Call Management

```typescript
class BridgeCallOptimizer extends Component<typeof BridgeCallOptimizer> {
  private bridgeCallQueue: Array<() => void> = [];
  private bridgeCallLimiter = new Map<string, number>();
  private readonly BRIDGE_CALL_COOLDOWN = 100; // ms between similar calls
  private readonly MAX_QUEUE_SIZE = 50;

  // Debounced bridge calls
  private debouncedCalls = new Map<string, any>();

  public debouncedBridgeCall(
    key: string,
    callback: () => void,
    delay: number = 200
  ): void {
    // Clear existing timeout for this key
    const existingTimeout = this.debouncedCalls.get(key);
    if (existingTimeout) {
      this.async.clearTimeout(existingTimeout);
    }

    // Set new timeout
    const timeout = this.async.setTimeout(() => {
      callback();
      this.debouncedCalls.delete(key);
    }, delay);

    this.debouncedCalls.set(key, timeout);
  }

  // Throttled bridge calls
  public throttledBridgeCall(
    key: string,
    callback: () => void,
    interval: number = 100
  ): boolean {
    const now = Date.now();
    const lastCall = this.bridgeCallLimiter.get(key) || 0;

    if (now - lastCall < interval) {
      return false; // Call was throttled
    }

    this.bridgeCallLimiter.set(key, now);
    callback();
    return true;
  }

  // Batched bridge calls
  public batchBridgeCall(callback: () => void): void {
    if (this.bridgeCallQueue.length >= this.MAX_QUEUE_SIZE) {
      console.warn("Bridge call queue is full, dropping call");
      return;
    }

    this.bridgeCallQueue.push(callback);

    // Process queue on next frame
    if (this.bridgeCallQueue.length === 1) {
      this.async.setTimeout(() => this.processBridgeCallQueue(), 0);
    }
  }

  private processBridgeCallQueue(): void {
    const calls = [...this.bridgeCallQueue];
    this.bridgeCallQueue.length = 0;

    calls.forEach((call, index) => {
      try {
        call();
      } catch (error) {
        console.error(`Bridge call ${index} failed:`, error);
      }
    });
  }

  // Property update optimization
  public optimizedPropertyUpdate<T>(
    propertyName: string,
    newValue: T,
    updateCallback: (value: T) => void
  ): void {
    const key = `property_${propertyName}`;

    this.debouncedBridgeCall(
      key,
      () => {
        updateCallback(newValue);
      },
      50
    );
  }

  // Efficient property synchronization
  public syncProperties(properties: Array<{ name: string; value: any }>): void {
    this.batchBridgeCall(() => {
      properties.forEach((prop) => {
        try {
          (this.props as any)[prop.name] = prop.value;
        } catch (error) {
          console.error(`Failed to sync property ${prop.name}:`, error);
        }
      });
    });
  }

  // Smart property update with change detection
  private lastPropertyValues = new Map<string, any>();

  public smartPropertyUpdate<T>(
    propertyName: string,
    newValue: T,
    updateCallback: (value: T) => void,
    compareFunction?: (a: T, b: T) => boolean
  ): boolean {
    const lastValue = this.lastPropertyValues.get(propertyName);

    // Use custom comparison or default equality check
    const hasChanged = compareFunction
      ? !compareFunction(lastValue, newValue)
      : lastValue !== newValue;

    if (!hasChanged) {
      return false; // No update needed
    }

    this.lastPropertyValues.set(propertyName, newValue);

    this.optimizedPropertyUpdate(propertyName, newValue, updateCallback);
    return true;
  }

  // Bulk property updates with validation
  public bulkUpdateProperties(updates: Record<string, any>): void {
    const validUpdates: Array<{ name: string; value: any }> = [];

    Object.entries(updates).forEach(([name, value]) => {
      // Validate property exists and value is valid
      if (this.validatePropertyUpdate(name, value)) {
        validUpdates.push({ name, value });
      }
    });

    if (validUpdates.length > 0) {
      this.syncProperties(validUpdates);
    }
  }

  private validatePropertyUpdate(name: string, value: any): boolean {
    // Check if property exists in component
    const propDef = (this.constructor as any).propsDefinition?.[name];
    return propDef !== undefined;
  }

  dispose() {
    // Clear all pending operations
    this.debouncedCalls.forEach((timeout) => this.async.clearTimeout(timeout));
    this.debouncedCalls.clear();
    this.bridgeCallQueue.length = 0;
    this.bridgeCallLimiter.clear();
    this.lastPropertyValues.clear();
  }
}
```

## Property Caching Strategies

### Advanced Property Cache

```typescript
interface CacheEntry<T> {
  value: T;
  timestamp: number;
  accessCount: number;
  dirty: boolean;
}

class PropertyCache extends Component<typeof PropertyCache> {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly CACHE_TTL = 5000; // 5 seconds
  private readonly MAX_CACHE_SIZE = 100;
  private readonly CLEANUP_INTERVAL = 10000; // 10 seconds

  start() {
    this.startCacheCleanup();
  }

  private startCacheCleanup(): void {
    const cleanup = () => {
      this.cleanupExpiredEntries();
      this.evictLeastUsedEntries();
      this.async.setTimeout(cleanup, this.CLEANUP_INTERVAL);
    };

    cleanup();
  }

  // Get with caching
  public getCachedProperty<T>(
    key: string,
    fetcher: () => T,
    ttl: number = this.CACHE_TTL
  ): T {
    const entry = this.cache.get(key);
    const now = Date.now();

    // Check if cached entry is valid
    if (entry && now - entry.timestamp < ttl && !entry.dirty) {
      entry.accessCount++;
      return entry.value;
    }

    // Fetch new value
    const value = fetcher();

    // Cache the value
    this.setCacheEntry(key, value);

    return value;
  }

  private setCacheEntry<T>(key: string, value: T): void {
    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      accessCount: 1,
      dirty: false,
    };

    this.cache.set(key, entry);
  }

  // Invalidate cache entry
  public invalidateProperty(key: string): void {
    const entry = this.cache.get(key);
    if (entry) {
      entry.dirty = true;
    }
  }

  // Batch invalidation
  public invalidateProperties(keys: string[]): void {
    keys.forEach((key) => this.invalidateProperty(key));
  }

  // Set with cache invalidation
  public setCachedProperty<T>(key: string, value: T): void {
    this.setCacheEntry(key, value);
  }

  // Get with timeout fallback
  public getCachedPropertyWithTimeout<T>(
    key: string,
    fetcher: () => Promise<T>,
    timeout: number = 1000,
    fallback: T
  ): Promise<T> {
    const entry = this.cache.get(key);
    const now = Date.now();

    // Return cached value if valid
    if (entry && now - entry.timestamp < this.CACHE_TTL && !entry.dirty) {
      entry.accessCount++;
      return Promise.resolve(entry.value);
    }

    // Fetch with timeout
    return Promise.race([
      fetcher().then((value) => {
        this.setCacheEntry(key, value);
        return value;
      }),
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), timeout)
      ),
    ]).catch(() => {
      console.warn(`Property fetch timeout for ${key}, using fallback`);
      return fallback;
    });
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > this.CACHE_TTL) {
        expiredKeys.push(key);
      }
    });

    expiredKeys.forEach((key) => this.cache.delete(key));

    if (expiredKeys.length > 0) {
      console.log(`Cleaned up ${expiredKeys.length} expired cache entries`);
    }
  }

  private evictLeastUsedEntries(): void {
    if (this.cache.size <= this.MAX_CACHE_SIZE) return;

    // Sort by access count (ascending)
    const entries = Array.from(this.cache.entries()).sort(
      (a, b) => a[1].accessCount - b[1].accessCount
    );

    // Remove least used entries
    const toRemove = this.cache.size - this.MAX_CACHE_SIZE;
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }

    console.log(`Evicted ${toRemove} least used cache entries`);
  }

  // Cache statistics
  public getCacheStats(): { size: number; hitRate: number } {
    let totalAccess = 0;
    this.cache.forEach((entry) => {
      totalAccess += entry.accessCount;
    });

    return {
      size: this.cache.size,
      hitRate: totalAccess / this.cache.size || 0,
    };
  }

  dispose() {
    this.cache.clear();
  }
}
```

## Networking and Synchronization

### Property Synchronization Manager

```typescript
class PropertySyncManager extends Component<typeof PropertySyncManager> {
  private syncedProperties = new Set<string>();
  private pendingUpdates = new Map<string, any>();
  private lastSyncTime = 0;
  private readonly SYNC_INTERVAL = 100; // ms

  start() {
    this.startSyncLoop();
  }

  // Register property for automatic synchronization
  public registerSyncProperty(propertyName: string): void {
    this.syncedProperties.add(propertyName);
    console.log(`Registered ${propertyName} for synchronization`);
  }

  public unregisterSyncProperty(propertyName: string): void {
    this.syncedProperties.delete(propertyName);
    this.pendingUpdates.delete(propertyName);
  }

  // Queue property update for synchronization
  public queuePropertyUpdate(propertyName: string, value: any): void {
    if (!this.syncedProperties.has(propertyName)) {
      console.warn(`Property ${propertyName} is not registered for sync`);
      return;
    }

    this.pendingUpdates.set(propertyName, value);
  }

  private startSyncLoop(): void {
    const sync = () => {
      this.processPendingUpdates();
      this.async.setTimeout(sync, this.SYNC_INTERVAL);
    };

    sync();
  }

  private processPendingUpdates(): void {
    if (this.pendingUpdates.size === 0) return;

    const updates = Array.from(this.pendingUpdates.entries());
    this.pendingUpdates.clear();
    this.lastSyncTime = Date.now();

    // Send updates via NetworkEvent
    this.sendLocalEvent(this.entity, "PropertySync", {
      updates,
      timestamp: this.lastSyncTime,
    });
  }

  // Handle incoming property sync
  public handlePropertySync(data: {
    updates: Array<[string, any]>;
    timestamp: number;
  }): void {
    // Prevent processing old updates
    if (data.timestamp <= this.lastSyncTime) return;

    data.updates.forEach(([propertyName, value]) => {
      if (this.syncedProperties.has(propertyName)) {
        try {
          (this.props as any)[propertyName] = value;
        } catch (error) {
          console.error(`Failed to sync property ${propertyName}:`, error);
        }
      }
    });
  }

  // Selective property sync for specific players
  public syncPropertyToPlayers(
    propertyName: string,
    value: any,
    players: Player[]
  ): void {
    if (!this.syncedProperties.has(propertyName)) return;

    this.sendNetworkEvent(
      this.entity,
      "PlayerPropertySync",
      { property: propertyName, value, timestamp: Date.now() },
      players
    );
  }

  // Batch property sync
  public syncPropertiesToPlayers(
    properties: Record<string, any>,
    players: Player[]
  ): void {
    const validProperties: Record<string, any> = {};

    Object.entries(properties).forEach(([name, value]) => {
      if (this.syncedProperties.has(name)) {
        validProperties[name] = value;
      }
    });

    if (Object.keys(validProperties).length > 0) {
      this.sendNetworkEvent(
        this.entity,
        "BatchPropertySync",
        { properties: validProperties, timestamp: Date.now() },
        players
      );
    }
  }

  // Property conflict resolution
  public resolvePropertyConflict(
    propertyName: string,
    localValue: any,
    remoteValue: any,
    remoteTimestamp: number
  ): any {
    // Simple last-write-wins strategy
    if (remoteTimestamp > this.lastSyncTime) {
      return remoteValue;
    }

    return localValue;
  }
}
```

## Property Validation

### Comprehensive Property Validator

```typescript
interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

class PropertyValidator extends Component<typeof PropertyValidator> {
  private validationRules = new Map<string, ValidationRule<any>[]>();
  private validationErrors = new Map<string, string[]>();

  // Add validation rule for property
  public addRule<T>(
    propertyName: string,
    validator: (value: T) => boolean,
    message: string
  ): void {
    const rules = this.validationRules.get(propertyName) || [];
    rules.push({ validate: validator, message });
    this.validationRules.set(propertyName, rules);
  }

  // Add common validation rules
  public addNumericRange(propertyName: string, min: number, max: number): void {
    this.addRule(
      propertyName,
      (value: number) => value >= min && value <= max,
      `Value must be between ${min} and ${max}`
    );
  }

  public addStringLength(
    propertyName: string,
    minLength: number,
    maxLength: number
  ): void {
    this.addRule(
      propertyName,
      (value: string) => value.length >= minLength && value.length <= maxLength,
      `String length must be between ${minLength} and ${maxLength}`
    );
  }

  public addRequired(propertyName: string): void {
    this.addRule(
      propertyName,
      (value: any) => value !== null && value !== undefined && value !== "",
      "Value is required"
    );
  }

  public addArrayLength(
    propertyName: string,
    minLength: number,
    maxLength: number
  ): void {
    this.addRule(
      propertyName,
      (value: any[]) =>
        Array.isArray(value) &&
        value.length >= minLength &&
        value.length <= maxLength,
      `Array length must be between ${minLength} and ${maxLength}`
    );
  }

  public addEntityValid(propertyName: string): void {
    this.addRule(
      propertyName,
      (value: Entity) => value && !value.disposed,
      "Entity must be valid and not disposed"
    );
  }

  // Validate single property
  public validateProperty<T>(propertyName: string, value: T): boolean {
    const rules = this.validationRules.get(propertyName);
    if (!rules) return true;

    const errors: string[] = [];

    rules.forEach((rule) => {
      try {
        if (!rule.validate(value)) {
          errors.push(rule.message);
        }
      } catch (error) {
        errors.push(`Validation error: ${error}`);
      }
    });

    if (errors.length > 0) {
      this.validationErrors.set(propertyName, errors);
      return false;
    }

    this.validationErrors.delete(propertyName);
    return true;
  }

  // Validate all properties
  public validateAllProperties(): boolean {
    let allValid = true;
    this.validationErrors.clear();

    this.validationRules.forEach((rules, propertyName) => {
      try {
        const value = (this.props as any)[propertyName];
        if (!this.validateProperty(propertyName, value)) {
          allValid = false;
        }
      } catch (error) {
        this.validationErrors.set(propertyName, [
          `Property access error: ${error}`,
        ]);
        allValid = false;
      }
    });

    return allValid;
  }

  // Get validation errors for property
  public getPropertyErrors(propertyName: string): string[] {
    return this.validationErrors.get(propertyName) || [];
  }

  // Get all validation errors
  public getAllErrors(): Record<string, string[]> {
    const errors: Record<string, string[]> = {};
    this.validationErrors.forEach((errorList, propertyName) => {
      errors[propertyName] = [...errorList];
    });
    return errors;
  }

  // Conditional validation
  public addConditionalRule<T>(
    propertyName: string,
    condition: () => boolean,
    validator: (value: T) => boolean,
    message: string
  ): void {
    this.addRule(
      propertyName,
      (value: T) => !condition() || validator(value),
      `${message} (when condition is met)`
    );
  }

  // Cross-property validation
  public addCrossPropertyRule(
    properties: string[],
    validator: (values: any[]) => boolean,
    message: string
  ): void {
    properties.forEach((propertyName) => {
      this.addRule(
        propertyName,
        () => {
          const values = properties.map((prop) => (this.props as any)[prop]);
          return validator(values);
        },
        message
      );
    });
  }

  // Custom validation with async support
  public async validatePropertyAsync<T>(
    propertyName: string,
    value: T,
    asyncValidator: (value: T) => Promise<boolean>,
    errorMessage: string
  ): Promise<boolean> {
    try {
      const isValid = await asyncValidator(value);

      if (!isValid) {
        const errors = this.validationErrors.get(propertyName) || [];
        errors.push(errorMessage);
        this.validationErrors.set(propertyName, errors);
        return false;
      }

      return true;
    } catch (error) {
      const errors = this.validationErrors.get(propertyName) || [];
      errors.push(`Async validation error: ${error}`);
      this.validationErrors.set(propertyName, errors);
      return false;
    }
  }
}
```

## Advanced Property Patterns

### Property Observer Pattern

```typescript
interface PropertyObserver<T> {
  onPropertyChanged(oldValue: T, newValue: T): void;
}

class ObservableProperty<T> {
  private observers: PropertyObserver<T>[] = [];
  private _value: T;

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    const oldValue = this._value;
    this._value = newValue;
    this.notifyObservers(oldValue, newValue);
  }

  addObserver(observer: PropertyObserver<T>): void {
    this.observers.push(observer);
  }

  removeObserver(observer: PropertyObserver<T>): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  private notifyObservers(oldValue: T, newValue: T): void {
    this.observers.forEach((observer) => {
      try {
        observer.onPropertyChanged(oldValue, newValue);
      } catch (error) {
        console.error("Observer notification error:", error);
      }
    });
  }
}

class PropertyObserverManager
  extends Component<typeof PropertyObserverManager>
  implements PropertyObserver<any>
{
  private observableProperties = new Map<string, ObservableProperty<any>>();

  // Create observable property
  public createObservableProperty<T>(
    name: string,
    initialValue: T
  ): ObservableProperty<T> {
    const observable = new ObservableProperty(initialValue);
    observable.addObserver(this);
    this.observableProperties.set(name, observable);
    return observable;
  }

  // Handle property changes
  onPropertyChanged(oldValue: any, newValue: any): void {
    console.log(`Property changed: ${oldValue} -> ${newValue}`);

    // Trigger component-specific logic
    this.handlePropertyChange(oldValue, newValue);
  }

  protected handlePropertyChange(oldValue: any, newValue: any): void {
    // Override in derived classes for specific behavior
  }

  // Property binding
  public bindProperty<T>(
    propertyName: string,
    getter: () => T,
    setter: (value: T) => void
  ): void {
    const observable = this.observableProperties.get(propertyName);
    if (!observable) return;

    // Sync observable to property
    observable.addObserver({
      onPropertyChanged: (oldValue, newValue) => setter(newValue),
    });

    // Initial sync
    setter(observable.value);
  }

  dispose() {
    this.observableProperties.forEach((observable) => {
      observable.removeObserver(this);
    });
    this.observableProperties.clear();
  }
}
```

### Property State Machine

```typescript
enum PropertyState {
  Uninitialized = "uninitialized",
  Loading = "loading",
  Loaded = "loaded",
  Error = "error",
  Updating = "updating",
}

interface PropertyStateMachine<T> {
  state: PropertyState;
  value?: T;
  error?: string;
  lastUpdated?: number;
}

class StatefulPropertyManager extends Component<
  typeof StatefulPropertyManager
> {
  private propertyStates = new Map<string, PropertyStateMachine<any>>();
  private stateTransitions = new Map<
    string,
    (oldState: PropertyState, newState: PropertyState) => void
  >();

  // Initialize property state
  public initializeProperty<T>(propertyName: string, initialValue?: T): void {
    const state: PropertyStateMachine<T> = {
      state:
        initialValue !== undefined
          ? PropertyState.Loaded
          : PropertyState.Uninitialized,
      value: initialValue,
      lastUpdated: Date.now(),
    };

    this.propertyStates.set(propertyName, state);
  }

  // Set property with state management
  public setPropertyWithState<T>(
    propertyName: string,
    value: T,
    setState?: PropertyState
  ): void {
    const state = this.propertyStates.get(propertyName);
    if (!state) {
      this.initializeProperty(propertyName, value);
      return;
    }

    const oldState = state.state;
    state.value = value;
    state.state = setState || PropertyState.Loaded;
    state.lastUpdated = Date.now();
    state.error = undefined;

    this.onStateTransition(propertyName, oldState, state.state);
  }

  // Get property with state
  public getPropertyWithState<T>(
    propertyName: string
  ): PropertyStateMachine<T> | undefined {
    return this.propertyStates.get(propertyName);
  }

  // Set property error state
  public setPropertyError(propertyName: string, error: string): void {
    const state = this.propertyStates.get(propertyName);
    if (!state) return;

    const oldState = state.state;
    state.state = PropertyState.Error;
    state.error = error;
    state.lastUpdated = Date.now();

    this.onStateTransition(propertyName, oldState, PropertyState.Error);
  }

  // Set property loading state
  public setPropertyLoading(propertyName: string): void {
    const state = this.propertyStates.get(propertyName);
    if (!state) {
      this.initializeProperty(propertyName);
      return;
    }

    const oldState = state.state;
    state.state = PropertyState.Loading;
    state.lastUpdated = Date.now();

    this.onStateTransition(propertyName, oldState, PropertyState.Loading);
  }

  // Register state transition callback
  public onStateTransition(
    propertyName: string,
    oldState: PropertyState,
    newState: PropertyState
  ): void {
    const callback = this.stateTransitions.get(propertyName);
    if (callback) {
      callback(oldState, newState);
    }

    // Global state transition logging
    console.log(`Property ${propertyName}: ${oldState} -> ${newState}`);
  }

  public registerStateTransition(
    propertyName: string,
    callback: (oldState: PropertyState, newState: PropertyState) => void
  ): void {
    this.stateTransitions.set(propertyName, callback);
  }

  // Async property loading
  public async loadPropertyAsync<T>(
    propertyName: string,
    loader: () => Promise<T>
  ): Promise<T | undefined> {
    this.setPropertyLoading(propertyName);

    try {
      const value = await loader();
      this.setPropertyWithState(propertyName, value, PropertyState.Loaded);
      return value;
    } catch (error) {
      this.setPropertyError(propertyName, error.toString());
      return undefined;
    }
  }

  // Check if property is in specific state
  public isPropertyInState(
    propertyName: string,
    state: PropertyState
  ): boolean {
    const propertyState = this.propertyStates.get(propertyName);
    return propertyState?.state === state;
  }

  // Get all properties in specific state
  public getPropertiesInState(state: PropertyState): string[] {
    const properties: string[] = [];

    this.propertyStates.forEach((propertyState, name) => {
      if (propertyState.state === state) {
        properties.push(name);
      }
    });

    return properties;
  }
}
```

## Summary

1. **Use property caching** to reduce bridge call overhead
2. **Implement type-safe property wrappers** for better validation
3. **Debounce and throttle** frequent property updates
4. **Batch property operations** for better performance
5. **Validate property values** before setting them
6. **Use property observers** for reactive programming patterns
7. **Implement proper error handling** for property operations
8. **Cache property values** with appropriate TTL and cleanup
9. **Sync properties efficiently** across network boundaries
10. **Use state machines** for complex property lifecycle management
