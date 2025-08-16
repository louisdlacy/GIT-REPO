# Performance Best Practices for Horizon Worlds

## Table of Contents

1. [Performance Fundamentals](#performance-fundamentals)
2. [Component Optimization](#component-optimization)
3. [Event System Performance](#event-system-performance)
4. [Memory Management](#memory-management)
5. [Network Optimization](#network-optimization)
6. [Rendering Performance](#rendering-performance)
7. [Script Execution Optimization](#script-execution-optimization)
8. [Profiling and Debugging](#profiling-and-debugging)
9. [Common Performance Pitfalls](#common-performance-pitfalls)

## Performance Fundamentals

### Frame Rate and Performance Targets

```typescript
// Performance monitoring component
class PerformanceMonitor extends Component<typeof PerformanceMonitor> {
  private frameCount: number = 0;
  private lastFrameTime: number = 0;
  private fpsHistory: number[] = [];
  private readonly MAX_FPS_HISTORY = 60;

  start() {
    this.connectLocalBroadcastEvent("onFrameUpdate", this.onFrameUpdate);
  }

  private onFrameUpdate() {
    const currentTime = Date.now();
    if (this.lastFrameTime > 0) {
      const deltaTime = currentTime - this.lastFrameTime;
      const fps = 1000 / deltaTime;
      this.updateFPSHistory(fps);
    }
    this.lastFrameTime = currentTime;
    this.frameCount++;
  }

  private updateFPSHistory(fps: number) {
    this.fpsHistory.push(fps);
    if (this.fpsHistory.length > this.MAX_FPS_HISTORY) {
      this.fpsHistory.shift();
    }

    // Alert if FPS drops below threshold
    if (fps < 30) {
      console.warn(`Low FPS detected: ${fps.toFixed(2)}`);
    }
  }

  public getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 0;
    const sum = this.fpsHistory.reduce((a, b) => a + b, 0);
    return sum / this.fpsHistory.length;
  }
}
Component.register(PerformanceMonitor);
```

### Performance Budget Guidelines

```typescript
class PerformanceBudget {
  // Target performance metrics for Horizon Worlds
  static readonly TARGET_FPS = 60;
  static readonly MIN_FPS = 30;
  static readonly MAX_FRAME_TIME_MS = 16.67; // 60 FPS
  static readonly MAX_SCRIPT_EXECUTION_TIME_MS = 5;
  static readonly MAX_NETWORK_CALLS_PER_FRAME = 10;
  static readonly MAX_ENTITIES_PER_WORLD = 1000;
  static readonly MAX_COMPONENTS_PER_ENTITY = 20;

  static validatePerformance(metrics: PerformanceMetrics): boolean {
    return (
      metrics.fps >= this.MIN_FPS &&
      metrics.frameTime <= this.MAX_FRAME_TIME_MS &&
      metrics.scriptTime <= this.MAX_SCRIPT_EXECUTION_TIME_MS
    );
  }
}

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  scriptTime: number;
  networkCalls: number;
  entityCount: number;
}
```

## Component Optimization

### Efficient Component Lifecycle Management

```typescript
class OptimizedComponent extends Component<typeof OptimizedComponent> {
  private isActive: boolean = false;
  private updateInterval: number = 100; // ms
  private lastUpdate: number = 0;
  private cachedData: Map<string, any> = new Map();

  preStart() {
    // Minimize work in preStart
    this.isActive = true;
  }

  start() {
    // Use throttled updates instead of every frame
    this.connectLocalBroadcastEvent("onUpdate", this.throttledUpdate);

    // Cache frequently accessed data
    this.cacheFrequentData();
  }

  private throttledUpdate = () => {
    const now = Date.now();
    if (now - this.lastUpdate < this.updateInterval) {
      return;
    }

    this.lastUpdate = now;
    this.performUpdate();
  };

  private performUpdate() {
    if (!this.isActive) return;

    // Actual update logic here
    this.updateLogic();
  }

  private cacheFrequentData() {
    // Cache data that doesn't change often
    this.cachedData.set("entityPosition", this.entity.transform.position);
    this.cachedData.set("entityRotation", this.entity.transform.rotation);
  }

  private updateLogic() {
    // Use cached data when possible
    const position = this.cachedData.get("entityPosition");
    // Perform minimal calculations
  }

  dispose() {
    this.isActive = false;
    this.cachedData.clear();
    super.dispose();
  }
}
Component.register(OptimizedComponent);
```

### Component Pooling Pattern

```typescript
class ComponentPool<T extends Component<any>> {
  private pool: T[] = [];
  private activeComponents: Set<T> = new Set();
  private maxPoolSize: number = 50;

  constructor(private componentClass: new () => T) {}

  acquire(): T {
    let component = this.pool.pop();
    if (!component) {
      component = new this.componentClass();
    }

    this.activeComponents.add(component);
    return component;
  }

  release(component: T) {
    if (this.activeComponents.has(component)) {
      this.activeComponents.delete(component);

      // Reset component state
      this.resetComponent(component);

      if (this.pool.length < this.maxPoolSize) {
        this.pool.push(component);
      }
    }
  }

  private resetComponent(component: T) {
    // Reset component to default state
    component.dispose();
  }

  getActiveCount(): number {
    return this.activeComponents.size;
  }
}

// Usage example
class PooledProjectile extends Component<typeof PooledProjectile> {
  static pool = new ComponentPool(PooledProjectile);

  private velocity: Vec3 = Vec3.zero;
  private lifetime: number = 5000;
  private startTime: number = 0;

  static create(): PooledProjectile {
    return this.pool.acquire();
  }

  initialize(velocity: Vec3, lifetime: number = 5000) {
    this.velocity = velocity;
    this.lifetime = lifetime;
    this.startTime = Date.now();
  }

  start() {
    this.connectLocalBroadcastEvent("onUpdate", this.updateProjectile);
  }

  private updateProjectile = () => {
    if (Date.now() - this.startTime > this.lifetime) {
      this.destroy();
      return;
    }

    // Update position
    const deltaTime = 16.67 / 1000; // Assume 60 FPS
    const movement = this.velocity.multiply(deltaTime);
    this.entity.transform.position =
      this.entity.transform.position.add(movement);
  };

  destroy() {
    PooledProjectile.pool.release(this);
  }
}
Component.register(PooledProjectile);
```

## Event System Performance

### Efficient Event Handling

```typescript
class EfficientEventManager extends Component<typeof EfficientEventManager> {
  private eventQueue: Array<{ type: string; data: any }> = [];
  private eventHandlers: Map<string, Function[]> = new Map();
  private processingBatch: boolean = false;

  start() {
    // Process events in batches instead of individually
    this.connectLocalBroadcastEvent("onUpdate", this.processBatchedEvents);
  }

  // Batch events for processing
  queueEvent(type: string, data: any) {
    this.eventQueue.push({ type, data });

    // Prevent queue from growing too large
    if (this.eventQueue.length > 100) {
      console.warn("Event queue overflow, processing immediately");
      this.processBatchedEvents();
    }
  }

  private processBatchedEvents = () => {
    if (this.processingBatch || this.eventQueue.length === 0) {
      return;
    }

    this.processingBatch = true;

    // Process events in batches to spread load
    const batchSize = Math.min(10, this.eventQueue.length);
    const batch = this.eventQueue.splice(0, batchSize);

    for (const event of batch) {
      this.processEvent(event.type, event.data);
    }

    this.processingBatch = false;
  };

  private processEvent(type: string, data: any) {
    const handlers = this.eventHandlers.get(type);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${type}:`, error);
        }
      }
    }
  }

  addEventListener(type: string, handler: Function) {
    if (!this.eventHandlers.has(type)) {
      this.eventHandlers.set(type, []);
    }
    this.eventHandlers.get(type)!.push(handler);
  }

  removeEventListener(type: string, handler: Function) {
    const handlers = this.eventHandlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }
}
Component.register(EfficientEventManager);
```

### Debounced Event Handling

```typescript
class DebouncedEventHandler extends Component<typeof DebouncedEventHandler> {
  private debounceTimers: Map<string, number> = new Map();
  private throttleLastCall: Map<string, number> = new Map();

  // Debounce function calls to prevent excessive execution
  debounce(key: string, func: Function, delay: number = 100) {
    const existingTimer = this.debounceTimers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timer = setTimeout(() => {
      func();
      this.debounceTimers.delete(key);
    }, delay);

    this.debounceTimers.set(key, timer);
  }

  // Throttle function calls to limit frequency
  throttle(key: string, func: Function, interval: number = 100): boolean {
    const now = Date.now();
    const lastCall = this.throttleLastCall.get(key) || 0;

    if (now - lastCall >= interval) {
      this.throttleLastCall.set(key, now);
      func();
      return true;
    }
    return false;
  }

  // Example usage for input handling
  start() {
    this.connectLocalBroadcastEvent("onInputChanged", this.handleInputChanged);
    this.connectLocalBroadcastEvent("onPlayerMove", this.handlePlayerMove);
  }

  private handleInputChanged = (data: any) => {
    // Debounce input validation to avoid constant checks
    this.debounce(
      "inputValidation",
      () => {
        this.validateInput(data);
      },
      300
    );
  };

  private handlePlayerMove = (data: any) => {
    // Throttle position updates
    this.throttle(
      "positionUpdate",
      () => {
        this.updatePlayerPosition(data);
      },
      50
    );
  };

  private validateInput(data: any) {
    // Expensive validation logic
    console.log("Validating input:", data);
  }

  private updatePlayerPosition(data: any) {
    // Position update logic
    console.log("Updating position:", data);
  }

  dispose() {
    // Clean up timers
    this.debounceTimers.forEach((timer) => clearTimeout(timer));
    this.debounceTimers.clear();
    super.dispose();
  }
}
Component.register(DebouncedEventHandler);
```

## Memory Management

### Object Pooling and Reuse

```typescript
class ObjectPool<T> {
  private objects: T[] = [];
  private createFn: () => T;
  private resetFn: (obj: T) => void;
  private maxSize: number;

  constructor(
    createFn: () => T,
    resetFn: (obj: T) => void,
    maxSize: number = 100
  ) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.maxSize = maxSize;
  }

  acquire(): T {
    if (this.objects.length > 0) {
      return this.objects.pop()!;
    }
    return this.createFn();
  }

  release(obj: T) {
    if (this.objects.length < this.maxSize) {
      this.resetFn(obj);
      this.objects.push(obj);
    }
  }

  clear() {
    this.objects.length = 0;
  }

  size(): number {
    return this.objects.length;
  }
}

// Usage example with Vec3 objects
class VectorPool {
  private static pool = new ObjectPool<Vec3>(
    () => Vec3.zero,
    (vec) => vec.set(0, 0, 0),
    200
  );

  static acquire(): Vec3 {
    return this.pool.acquire();
  }

  static release(vec: Vec3) {
    this.pool.release(vec);
  }

  static clear() {
    this.pool.clear();
  }
}

class MemoryEfficientComponent extends Component<
  typeof MemoryEfficientComponent
> {
  private tempVectors: Vec3[] = [];

  start() {
    this.connectLocalBroadcastEvent("onUpdate", this.efficientUpdate);
  }

  private efficientUpdate = () => {
    // Use pooled vectors instead of creating new ones
    const tempPos = VectorPool.acquire();
    const tempVel = VectorPool.acquire();

    try {
      // Use the vectors for calculations
      tempPos.set(1, 2, 3);
      tempVel.set(0.1, 0.2, 0.3);

      const result = tempPos.add(tempVel);

      // Use result...
    } finally {
      // Always return to pool
      VectorPool.release(tempPos);
      VectorPool.release(tempVel);
    }
  };

  dispose() {
    // Clean up any remaining references
    this.tempVectors.length = 0;
    super.dispose();
  }
}
Component.register(MemoryEfficientComponent);
```

### Memory Leak Prevention

```typescript
class MemoryLeakPrevention extends Component<typeof MemoryLeakPrevention> {
  private intervalIds: number[] = [];
  private timeoutIds: number[] = [];
  private eventListeners: Array<{
    element: any;
    event: string;
    handler: Function;
  }> = [];
  private weakRefs: WeakSet<object> = new WeakSet();

  start() {
    this.setupManagedTimers();
    this.setupWeakReferences();
  }

  // Managed timer creation
  createInterval(callback: Function, interval: number): number {
    const id = setInterval(callback, interval);
    this.intervalIds.push(id);
    return id;
  }

  createTimeout(callback: Function, delay: number): number {
    const id = setTimeout(() => {
      callback();
      // Auto-remove from tracking
      const index = this.timeoutIds.indexOf(id);
      if (index > -1) {
        this.timeoutIds.splice(index, 1);
      }
    }, delay);
    this.timeoutIds.push(id);
    return id;
  }

  // Managed event listener addition
  addManagedEventListener(element: any, event: string, handler: Function) {
    element.addEventListener(event, handler);
    this.eventListeners.push({ element, event, handler });
  }

  // Use WeakSet for temporary object references
  addWeakReference(obj: object) {
    this.weakRefs.add(obj);
  }

  private setupManagedTimers() {
    // Example of proper timer management
    this.createInterval(() => {
      this.performPeriodicCleanup();
    }, 30000); // 30 seconds
  }

  private setupWeakReferences() {
    // Use weak references for objects we don't own
    const externalObject = this.world.getServerPlayer();
    if (externalObject) {
      this.addWeakReference(externalObject);
    }
  }

  private performPeriodicCleanup() {
    // Periodic cleanup of unused resources
    console.log("Performing memory cleanup");

    // Force garbage collection hint (if available)
    if ((global as any).gc) {
      (global as any).gc();
    }
  }

  dispose() {
    // Clean up all managed resources
    this.intervalIds.forEach((id) => clearInterval(id));
    this.timeoutIds.forEach((id) => clearTimeout(id));

    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });

    // Clear arrays
    this.intervalIds.length = 0;
    this.timeoutIds.length = 0;
    this.eventListeners.length = 0;

    super.dispose();
  }
}
Component.register(MemoryLeakPrevention);
```

## Network Optimization

### Efficient Network Calls

```typescript
class NetworkOptimizer extends Component<typeof NetworkOptimizer> {
  private requestQueue: Array<{ url: string; data: any; callback: Function }> =
    [];
  private rateLimiter: Map<string, number> = new Map();
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 60000; // 1 minute
  private readonly MAX_REQUESTS_PER_SECOND = 10;

  start() {
    this.connectLocalBroadcastEvent("onUpdate", this.processNetworkQueue);
  }

  // Batch network requests
  queueNetworkRequest(url: string, data: any, callback: Function) {
    // Check cache first
    const cached = this.getCachedResponse(url);
    if (cached) {
      callback(cached);
      return;
    }

    // Check rate limit
    if (!this.checkRateLimit(url)) {
      console.warn(`Rate limit exceeded for ${url}`);
      return;
    }

    this.requestQueue.push({ url, data, callback });
  }

  private processNetworkQueue = () => {
    if (this.requestQueue.length === 0) return;

    // Process requests in batches
    const batchSize = Math.min(3, this.requestQueue.length);
    const batch = this.requestQueue.splice(0, batchSize);

    batch.forEach((request) => {
      this.makeNetworkCall(request.url, request.data, request.callback);
    });
  };

  private makeNetworkCall(url: string, data: any, callback: Function) {
    // Simulated network call
    setTimeout(() => {
      const response = { status: "success", data: "response" };

      // Cache the response
      this.cacheResponse(url, response);

      callback(response);
    }, 100);
  }

  private getCachedResponse(url: string): any {
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private cacheResponse(url: string, data: any) {
    this.cache.set(url, { data, timestamp: Date.now() });

    // Limit cache size
    if (this.cache.size > 100) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }

  private checkRateLimit(url: string): boolean {
    const now = Date.now();
    const lastRequest = this.rateLimiter.get(url) || 0;
    const timeSinceLastRequest = now - lastRequest;

    if (timeSinceLastRequest < 1000 / this.MAX_REQUESTS_PER_SECOND) {
      return false;
    }

    this.rateLimiter.set(url, now);
    return true;
  }

  dispose() {
    this.requestQueue.length = 0;
    this.cache.clear();
    this.rateLimiter.clear();
    super.dispose();
  }
}
Component.register(NetworkOptimizer);
```

### Data Synchronization Optimization

```typescript
class SyncOptimizer extends Component<typeof SyncOptimizer> {
  private dirtyFlags: Map<string, boolean> = new Map();
  private lastSyncTime: Map<string, number> = new Map();
  private syncInterval: number = 100; // ms
  private batchedUpdates: Map<string, any> = new Map();

  start() {
    this.connectLocalBroadcastEvent("onUpdate", this.processSyncUpdates);
    this.connectNetworkEvent("dataUpdate", this.handleDataUpdate);
  }

  // Mark data as dirty for synchronization
  markDirty(key: string, data: any) {
    this.dirtyFlags.set(key, true);
    this.batchedUpdates.set(key, data);
  }

  private processSyncUpdates = () => {
    const now = Date.now();
    const updatesToSync: Map<string, any> = new Map();

    // Check which data needs syncing
    for (const [key, isDirty] of this.dirtyFlags) {
      if (isDirty && this.shouldSync(key, now)) {
        updatesToSync.set(key, this.batchedUpdates.get(key));
        this.dirtyFlags.set(key, false);
        this.lastSyncTime.set(key, now);
      }
    }

    // Send batched updates
    if (updatesToSync.size > 0) {
      this.sendBatchedUpdate(updatesToSync);
    }
  };

  private shouldSync(key: string, now: number): boolean {
    const lastSync = this.lastSyncTime.get(key) || 0;
    return now - lastSync >= this.syncInterval;
  }

  private sendBatchedUpdate(updates: Map<string, any>) {
    const batchData = Object.fromEntries(updates);
    this.sendNetworkEvent("batchedUpdate", batchData);
  }

  private handleDataUpdate = (data: any) => {
    // Process incoming updates efficiently
    for (const [key, value] of Object.entries(data)) {
      this.applyUpdate(key, value);
    }
  };

  private applyUpdate(key: string, value: any) {
    // Apply update with minimal processing
    console.log(`Applying update for ${key}:`, value);
  }

  dispose() {
    this.dirtyFlags.clear();
    this.lastSyncTime.clear();
    this.batchedUpdates.clear();
    super.dispose();
  }
}
Component.register(SyncOptimizer);
```

## Rendering Performance

### LOD (Level of Detail) Management

```typescript
class LODManager extends Component<typeof LODManager> {
  private lodLevels: Map<string, number> = new Map();
  private distanceThresholds = [10, 25, 50, 100]; // Distance thresholds for LOD levels
  private lastUpdateTime: number = 0;
  private updateFrequency: number = 500; // Update LOD every 500ms

  start() {
    this.connectLocalBroadcastEvent("onUpdate", this.updateLOD);
  }

  private updateLOD = () => {
    const now = Date.now();
    if (now - this.lastUpdateTime < this.updateFrequency) {
      return;
    }

    this.lastUpdateTime = now;
    this.calculateLODLevels();
  };

  private calculateLODLevels() {
    const playerPosition = this.getPlayerPosition();
    const entities = this.world.getEntitiesWithComponents([
      "Mesh",
      "Transform",
    ]);

    entities.forEach((entity) => {
      const distance = this.calculateDistance(
        playerPosition,
        entity.transform.position
      );
      const lodLevel = this.determineLODLevel(distance);

      this.applyLOD(entity, lodLevel);
    });
  }

  private determineLODLevel(distance: number): number {
    for (let i = 0; i < this.distanceThresholds.length; i++) {
      if (distance <= this.distanceThresholds[i]) {
        return i;
      }
    }
    return this.distanceThresholds.length; // Furthest LOD
  }

  private applyLOD(entity: any, lodLevel: number) {
    const entityId = entity.id;
    const currentLOD = this.lodLevels.get(entityId);

    if (currentLOD === lodLevel) {
      return; // No change needed
    }

    this.lodLevels.set(entityId, lodLevel);

    switch (lodLevel) {
      case 0: // Highest quality
        this.setHighQualityLOD(entity);
        break;
      case 1: // Medium quality
        this.setMediumQualityLOD(entity);
        break;
      case 2: // Low quality
        this.setLowQualityLOD(entity);
        break;
      default: // Invisible/Culled
        this.setCulledLOD(entity);
        break;
    }
  }

  private setHighQualityLOD(entity: any) {
    entity.setVisible(true);
    entity.setDetailLevel("high");
    entity.setShadowCasting(true);
  }

  private setMediumQualityLOD(entity: any) {
    entity.setVisible(true);
    entity.setDetailLevel("medium");
    entity.setShadowCasting(true);
  }

  private setLowQualityLOD(entity: any) {
    entity.setVisible(true);
    entity.setDetailLevel("low");
    entity.setShadowCasting(false);
  }

  private setCulledLOD(entity: any) {
    entity.setVisible(false);
    entity.setShadowCasting(false);
  }

  private getPlayerPosition(): Vec3 {
    const player = this.world.getLocalPlayer();
    return player ? player.position : Vec3.zero;
  }

  private calculateDistance(pos1: Vec3, pos2: Vec3): number {
    return pos1.distanceTo(pos2);
  }
}
Component.register(LODManager);
```

### Frustum Culling and Occlusion

```typescript
class RenderingOptimizer extends Component<typeof RenderingOptimizer> {
  private visibleEntities: Set<string> = new Set();
  private culledEntities: Set<string> = new Set();
  private frustumUpdateInterval: number = 100; // ms
  private lastFrustumUpdate: number = 0;

  start() {
    this.connectLocalBroadcastEvent("onUpdate", this.updateVisibility);
    this.connectLocalBroadcastEvent("onCameraMove", this.onCameraMove);
  }

  private updateVisibility = () => {
    const now = Date.now();
    if (now - this.lastFrustumUpdate < this.frustumUpdateInterval) {
      return;
    }

    this.lastFrustumUpdate = now;
    this.performFrustumCulling();
  };

  private performFrustumCulling() {
    const camera = this.getCameraInfo();
    const renderableEntities = this.getRenderableEntities();

    renderableEntities.forEach((entity) => {
      const isVisible = this.isInFrustum(entity, camera);
      const entityId = entity.id;

      if (isVisible && !this.visibleEntities.has(entityId)) {
        // Entity became visible
        this.makeVisible(entity);
        this.visibleEntities.add(entityId);
        this.culledEntities.delete(entityId);
      } else if (!isVisible && this.visibleEntities.has(entityId)) {
        // Entity became hidden
        this.makeHidden(entity);
        this.visibleEntities.delete(entityId);
        this.culledEntities.add(entityId);
      }
    });
  }

  private isInFrustum(entity: any, camera: CameraInfo): boolean {
    const bounds = this.getEntityBounds(entity);
    return this.frustumContainsBounds(camera.frustum, bounds);
  }

  private getEntityBounds(entity: any): BoundingBox {
    // Calculate entity bounding box
    const position = entity.transform.position;
    const scale = entity.transform.scale;

    return {
      min: position.subtract(scale.multiply(0.5)),
      max: position.add(scale.multiply(0.5)),
    };
  }

  private frustumContainsBounds(
    frustum: Frustum,
    bounds: BoundingBox
  ): boolean {
    // Simplified frustum-bounds intersection test
    // In practice, this would be more complex
    return true; // Placeholder
  }

  private makeVisible(entity: any) {
    entity.setVisible(true);
    entity.setRenderingEnabled(true);
  }

  private makeHidden(entity: any) {
    entity.setVisible(false);
    entity.setRenderingEnabled(false);
  }

  private onCameraMove = () => {
    // Immediately update when camera moves significantly
    this.lastFrustumUpdate = 0;
  };

  private getCameraInfo(): CameraInfo {
    // Get current camera information
    return {
      position: Vec3.zero,
      direction: Vec3.forward,
      frustum: {} as Frustum,
    };
  }

  private getRenderableEntities(): any[] {
    return this.world.getEntitiesWithComponents(["Mesh", "Transform"]);
  }

  getVisibilityStats(): { visible: number; culled: number } {
    return {
      visible: this.visibleEntities.size,
      culled: this.culledEntities.size,
    };
  }
}

interface CameraInfo {
  position: Vec3;
  direction: Vec3;
  frustum: Frustum;
}

interface Frustum {
  // Frustum plane definitions
}

interface BoundingBox {
  min: Vec3;
  max: Vec3;
}

Component.register(RenderingOptimizer);
```

## Script Execution Optimization

### Async Processing and Coroutines

```typescript
class AsyncProcessor extends Component<typeof AsyncProcessor> {
  private taskQueue: Array<{ task: Function; priority: number }> = [];
  private isProcessing: boolean = false;
  private maxTasksPerFrame: number = 5;
  private currentFrameTasks: number = 0;

  start() {
    this.connectLocalBroadcastEvent("onUpdate", this.processAsyncTasks);
  }

  // Add task with priority (lower number = higher priority)
  addTask(task: Function, priority: number = 0) {
    this.taskQueue.push({ task, priority });

    // Sort by priority
    this.taskQueue.sort((a, b) => a.priority - b.priority);
  }

  private processAsyncTasks = () => {
    this.currentFrameTasks = 0;

    while (
      this.taskQueue.length > 0 &&
      this.currentFrameTasks < this.maxTasksPerFrame
    ) {
      const { task } = this.taskQueue.shift()!;

      try {
        task();
        this.currentFrameTasks++;
      } catch (error) {
        console.error("Error in async task:", error);
      }
    }
  };

  // Coroutine-like async processing
  async processLargeDataset(
    data: any[],
    processChunk: Function,
    chunkSize: number = 10
  ) {
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);

      // Process chunk
      processChunk(chunk);

      // Yield control back to the engine
      await this.yield();
    }
  }

  private yield(): Promise<void> {
    return new Promise((resolve) => {
      this.addTask(resolve, 0);
    });
  }

  // Time-sliced operation
  async timeSlicedOperation(operation: Function, maxTimeMs: number = 5) {
    const startTime = Date.now();

    while (Date.now() - startTime < maxTimeMs) {
      const shouldContinue = operation();
      if (!shouldContinue) {
        break;
      }
    }

    // If we need to continue, schedule for next frame
    if (Date.now() - startTime >= maxTimeMs) {
      await this.yield();
      return this.timeSlicedOperation(operation, maxTimeMs);
    }
  }

  getQueueLength(): number {
    return this.taskQueue.length;
  }
}
Component.register(AsyncProcessor);
```

### Lazy Loading and Initialization

```typescript
class LazyLoader extends Component<typeof LazyLoader> {
  private loadedResources: Map<string, any> = new Map();
  private loadingPromises: Map<string, Promise<any>> = new Map();
  private resourceDependencies: Map<string, string[]> = new Map();

  // Lazy property initialization
  private _expensiveCalculation?: number;
  get expensiveCalculation(): number {
    if (this._expensiveCalculation === undefined) {
      this._expensiveCalculation = this.performExpensiveCalculation();
    }
    return this._expensiveCalculation;
  }

  // Lazy resource loading
  async loadResource(resourceId: string): Promise<any> {
    // Check if already loaded
    if (this.loadedResources.has(resourceId)) {
      return this.loadedResources.get(resourceId);
    }

    // Check if currently loading
    if (this.loadingPromises.has(resourceId)) {
      return this.loadingPromises.get(resourceId);
    }

    // Start loading
    const loadPromise = this.performResourceLoad(resourceId);
    this.loadingPromises.set(resourceId, loadPromise);

    try {
      const resource = await loadPromise;
      this.loadedResources.set(resourceId, resource);
      this.loadingPromises.delete(resourceId);
      return resource;
    } catch (error) {
      this.loadingPromises.delete(resourceId);
      throw error;
    }
  }

  // Load resources with dependencies
  async loadWithDependencies(resourceId: string): Promise<any> {
    const dependencies = this.resourceDependencies.get(resourceId) || [];

    // Load all dependencies first
    await Promise.all(dependencies.map((dep) => this.loadResource(dep)));

    // Then load the main resource
    return this.loadResource(resourceId);
  }

  // Preload critical resources
  async preloadCriticalResources(resourceIds: string[]) {
    const loadPromises = resourceIds.map((id) => this.loadResource(id));

    // Load in parallel but handle errors gracefully
    const results = await Promise.allSettled(loadPromises);

    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          `Failed to preload ${resourceIds[index]}:`,
          result.reason
        );
      }
    });
  }

  private performExpensiveCalculation(): number {
    // Simulate expensive calculation
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.random();
    }
    return result;
  }

  private async performResourceLoad(resourceId: string): Promise<any> {
    // Simulate async resource loading
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id: resourceId, data: "loaded" });
      }, 100);
    });
  }

  // Unload unused resources
  unloadResource(resourceId: string) {
    this.loadedResources.delete(resourceId);
    this.loadingPromises.delete(resourceId);
  }

  // Get memory usage info
  getMemoryUsage(): { loaded: number; loading: number } {
    return {
      loaded: this.loadedResources.size,
      loading: this.loadingPromises.size,
    };
  }

  dispose() {
    this.loadedResources.clear();
    this.loadingPromises.clear();
    this.resourceDependencies.clear();
    super.dispose();
  }
}
Component.register(LazyLoader);
```

## Profiling and Debugging

### Performance Profiler

```typescript
class PerformanceProfiler extends Component<typeof PerformanceProfiler> {
  private profiles: Map<string, ProfileData> = new Map();
  private activeProfiles: Map<string, number> = new Map();
  private frameProfiler: FrameProfiler = new FrameProfiler();

  start() {
    this.connectLocalBroadcastEvent("onUpdate", this.updateProfiler);
  }

  // Start profiling a section
  startProfile(name: string) {
    this.activeProfiles.set(name, performance.now());
  }

  // End profiling a section
  endProfile(name: string) {
    const startTime = this.activeProfiles.get(name);
    if (startTime === undefined) {
      console.warn(`No active profile found for: ${name}`);
      return;
    }

    const duration = performance.now() - startTime;
    this.activeProfiles.delete(name);

    this.recordProfileData(name, duration);
  }

  // Profile a function call
  profileFunction<T>(name: string, fn: () => T): T {
    this.startProfile(name);
    try {
      return fn();
    } finally {
      this.endProfile(name);
    }
  }

  // Profile an async function
  async profileAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.startProfile(name);
    try {
      return await fn();
    } finally {
      this.endProfile(name);
    }
  }

  private recordProfileData(name: string, duration: number) {
    let profile = this.profiles.get(name);
    if (!profile) {
      profile = {
        name,
        totalTime: 0,
        callCount: 0,
        averageTime: 0,
        minTime: Number.MAX_VALUE,
        maxTime: 0,
        lastTime: 0,
      };
      this.profiles.set(name, profile);
    }

    profile.totalTime += duration;
    profile.callCount++;
    profile.averageTime = profile.totalTime / profile.callCount;
    profile.minTime = Math.min(profile.minTime, duration);
    profile.maxTime = Math.max(profile.maxTime, duration);
    profile.lastTime = duration;
  }

  private updateProfiler = () => {
    this.frameProfiler.update();
  };

  // Get performance report
  getPerformanceReport(): PerformanceReport {
    const profiles = Array.from(this.profiles.values());
    const frameStats = this.frameProfiler.getStats();

    return {
      profiles: profiles.sort((a, b) => b.totalTime - a.totalTime),
      frameStats,
      memoryUsage: this.getMemoryUsage(),
    };
  }

  // Log performance summary
  logPerformanceSummary() {
    const report = this.getPerformanceReport();

    console.log("=== Performance Summary ===");
    console.log(`Frame Stats: ${report.frameStats.averageFPS.toFixed(2)} FPS`);
    console.log(`Memory Usage: ${report.memoryUsage.used.toFixed(2)} MB`);

    console.log("\nTop Performance Bottlenecks:");
    report.profiles.slice(0, 5).forEach((profile) => {
      console.log(
        `${profile.name}: ${profile.averageTime.toFixed(2)}ms avg (${
          profile.callCount
        } calls)`
      );
    });
  }

  private getMemoryUsage(): MemoryUsage {
    // Simplified memory usage calculation
    return {
      used: this.profiles.size * 1024, // Placeholder
      total: 1024 * 1024 * 100, // 100MB placeholder
    };
  }

  dispose() {
    this.profiles.clear();
    this.activeProfiles.clear();
    super.dispose();
  }
}

class FrameProfiler {
  private frameTimes: number[] = [];
  private lastFrameTime: number = 0;
  private readonly MAX_FRAME_HISTORY = 60;

  update() {
    const now = performance.now();
    if (this.lastFrameTime > 0) {
      const frameTime = now - this.lastFrameTime;
      this.frameTimes.push(frameTime);

      if (this.frameTimes.length > this.MAX_FRAME_HISTORY) {
        this.frameTimes.shift();
      }
    }
    this.lastFrameTime = now;
  }

  getStats(): FrameStats {
    if (this.frameTimes.length === 0) {
      return { averageFPS: 0, averageFrameTime: 0 };
    }

    const averageFrameTime =
      this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    const averageFPS = 1000 / averageFrameTime;

    return { averageFPS, averageFrameTime };
  }
}

interface ProfileData {
  name: string;
  totalTime: number;
  callCount: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  lastTime: number;
}

interface FrameStats {
  averageFPS: number;
  averageFrameTime: number;
}

interface MemoryUsage {
  used: number;
  total: number;
}

interface PerformanceReport {
  profiles: ProfileData[];
  frameStats: FrameStats;
  memoryUsage: MemoryUsage;
}

Component.register(PerformanceProfiler);
```

## Common Performance Pitfalls

### Anti-Patterns to Avoid

```typescript
// ❌ BAD: Creating objects in update loops
class BadPerformanceExample extends Component<typeof BadPerformanceExample> {
  start() {
    this.connectLocalBroadcastEvent("onUpdate", this.badUpdate);
  }

  private badUpdate = () => {
    // ❌ Creating new objects every frame
    const newVector = new Vec3(1, 2, 3);
    const newArray = [];
    const newObject = {};

    // ❌ Expensive operations in update loop
    const result = this.expensiveCalculation();

    // ❌ Multiple DOM queries
    const elements = this.findAllElementsOfType("button");
    elements.forEach((el) => this.processElement(el));

    // ❌ Synchronous network calls
    this.makeNetworkCall();
  };

  private expensiveCalculation(): number {
    // Expensive calculation
    return 0;
  }

  private findAllElementsOfType(type: string): any[] {
    // Expensive DOM traversal
    return [];
  }

  private processElement(element: any) {
    // Processing logic
  }

  private makeNetworkCall() {
    // Synchronous network call
  }
}

// ✅ GOOD: Optimized version
class GoodPerformanceExample extends Component<typeof GoodPerformanceExample> {
  // ✅ Reuse objects
  private reusableVector: Vec3 = Vec3.zero;
  private reusableArray: any[] = [];

  // ✅ Cache expensive calculations
  private cachedResult?: number;
  private lastCalculationTime: number = 0;
  private calculationCacheDuration: number = 1000; // 1 second

  // ✅ Cache DOM queries
  private cachedElements?: any[];
  private lastElementQuery: number = 0;
  private elementCacheDuration: number = 5000; // 5 seconds

  start() {
    this.connectLocalBroadcastEvent("onUpdate", this.optimizedUpdate);
  }

  private optimizedUpdate = () => {
    // ✅ Reuse existing objects
    this.reusableVector.set(1, 2, 3);
    this.reusableArray.length = 0; // Clear array efficiently

    // ✅ Use cached calculation
    const result = this.getCachedCalculation();

    // ✅ Use cached elements
    const elements = this.getCachedElements();
    if (elements) {
      elements.forEach((el) => this.processElement(el));
    }

    // ✅ Queue async network calls
    this.queueNetworkCall();
  };

  private getCachedCalculation(): number {
    const now = Date.now();
    if (
      !this.cachedResult ||
      now - this.lastCalculationTime > this.calculationCacheDuration
    ) {
      this.cachedResult = this.expensiveCalculation();
      this.lastCalculationTime = now;
    }
    return this.cachedResult;
  }

  private getCachedElements(): any[] {
    const now = Date.now();
    if (
      !this.cachedElements ||
      now - this.lastElementQuery > this.elementCacheDuration
    ) {
      this.cachedElements = this.findAllElementsOfType("button");
      this.lastElementQuery = now;
    }
    return this.cachedElements;
  }

  private expensiveCalculation(): number {
    // Expensive calculation
    return 0;
  }

  private findAllElementsOfType(type: string): any[] {
    // Expensive DOM traversal
    return [];
  }

  private processElement(element: any) {
    // Processing logic
  }

  private queueNetworkCall() {
    // Queue async network call
    setTimeout(() => {
      // Actual network call
    }, 0);
  }
}

Component.register(GoodPerformanceExample);
```

### Performance Testing Utilities

```typescript
class PerformanceTester extends Component<typeof PerformanceTester> {
  start() {
    this.runPerformanceTests();
  }

  private async runPerformanceTests() {
    console.log("Starting performance tests...");

    // Test 1: Object creation performance
    await this.testObjectCreation();

    // Test 2: Array manipulation performance
    await this.testArrayOperations();

    // Test 3: Function call performance
    await this.testFunctionCalls();

    // Test 4: Memory usage test
    await this.testMemoryUsage();

    console.log("Performance tests completed.");
  }

  private async testObjectCreation() {
    const iterations = 10000;

    // Test object literal creation
    const start1 = performance.now();
    for (let i = 0; i < iterations; i++) {
      const obj = { x: i, y: i * 2, z: i * 3 };
    }
    const time1 = performance.now() - start1;

    // Test class instantiation
    const start2 = performance.now();
    for (let i = 0; i < iterations; i++) {
      const vec = new Vec3(i, i * 2, i * 3);
    }
    const time2 = performance.now() - start2;

    console.log(`Object Creation Test:
            Object literals: ${time1.toFixed(2)}ms
            Class instances: ${time2.toFixed(2)}ms`);
  }

  private async testArrayOperations() {
    const size = 10000;
    const array = new Array(size).fill(0).map((_, i) => i);

    // Test forEach vs for loop
    const start1 = performance.now();
    array.forEach((item) => item * 2);
    const time1 = performance.now() - start1;

    const start2 = performance.now();
    for (let i = 0; i < array.length; i++) {
      array[i] * 2;
    }
    const time2 = performance.now() - start2;

    console.log(`Array Operations Test:
            forEach: ${time1.toFixed(2)}ms
            for loop: ${time2.toFixed(2)}ms`);
  }

  private async testFunctionCalls() {
    const iterations = 100000;

    // Test direct function calls
    const start1 = performance.now();
    for (let i = 0; i < iterations; i++) {
      this.directFunction(i);
    }
    const time1 = performance.now() - start1;

    // Test indirect function calls
    const fn = this.directFunction.bind(this);
    const start2 = performance.now();
    for (let i = 0; i < iterations; i++) {
      fn(i);
    }
    const time2 = performance.now() - start2;

    console.log(`Function Call Test:
            Direct calls: ${time1.toFixed(2)}ms
            Indirect calls: ${time2.toFixed(2)}ms`);
  }

  private directFunction(value: number): number {
    return value * 2;
  }

  private async testMemoryUsage() {
    const initialMemory = this.getMemoryUsage();

    // Create many objects
    const objects = [];
    for (let i = 0; i < 10000; i++) {
      objects.push({
        id: i,
        data: new Array(100).fill(i),
        timestamp: Date.now(),
      });
    }

    const afterCreation = this.getMemoryUsage();

    // Clear objects
    objects.length = 0;

    // Force garbage collection (if available)
    if ((global as any).gc) {
      (global as any).gc();
    }

    const afterCleanup = this.getMemoryUsage();

    console.log(`Memory Usage Test:
            Initial: ${initialMemory.toFixed(2)} MB
            After creation: ${afterCreation.toFixed(2)} MB
            After cleanup: ${afterCleanup.toFixed(2)} MB`);
  }

  private getMemoryUsage(): number {
    // Simplified memory usage calculation
    return Math.random() * 100; // Placeholder
  }
}
Component.register(PerformanceTester);
```

## Performance Monitoring Dashboard

```typescript
class PerformanceDashboard extends Component<typeof PerformanceDashboard> {
  private metrics: PerformanceMetrics = {
    fps: 0,
    frameTime: 0,
    scriptTime: 0,
    networkCalls: 0,
    entityCount: 0,
    memoryUsage: 0,
  };

  private updateInterval: number = 1000; // Update every second
  private lastUpdate: number = 0;

  start() {
    this.connectLocalBroadcastEvent("onUpdate", this.updateDashboard);
    this.createPerformanceUI();
  }

  private updateDashboard = () => {
    const now = Date.now();
    if (now - this.lastUpdate < this.updateInterval) {
      return;
    }

    this.lastUpdate = now;
    this.collectMetrics();
    this.updateUI();
    this.checkPerformanceThresholds();
  };

  private collectMetrics() {
    this.metrics.fps = this.calculateFPS();
    this.metrics.frameTime = this.calculateFrameTime();
    this.metrics.scriptTime = this.calculateScriptTime();
    this.metrics.networkCalls = this.getNetworkCallCount();
    this.metrics.entityCount = this.getEntityCount();
    this.metrics.memoryUsage = this.getMemoryUsage();
  }

  private calculateFPS(): number {
    // Calculate current FPS
    return 60; // Placeholder
  }

  private calculateFrameTime(): number {
    // Calculate frame time in milliseconds
    return 16.67; // Placeholder for 60 FPS
  }

  private calculateScriptTime(): number {
    // Calculate script execution time
    return 2.5; // Placeholder
  }

  private getNetworkCallCount(): number {
    // Get network calls per second
    return 5; // Placeholder
  }

  private getEntityCount(): number {
    // Get total entity count
    return this.world.getAllEntities().length;
  }

  private getMemoryUsage(): number {
    // Get memory usage in MB
    return 45.2; // Placeholder
  }

  private createPerformanceUI() {
    // Create UI elements for performance display
    console.log("Creating performance dashboard UI");
  }

  private updateUI() {
    // Update UI with current metrics
    console.log("Performance Metrics:", this.metrics);
  }

  private checkPerformanceThresholds() {
    const warnings = [];

    if (this.metrics.fps < PerformanceBudget.MIN_FPS) {
      warnings.push(`Low FPS: ${this.metrics.fps}`);
    }

    if (this.metrics.frameTime > PerformanceBudget.MAX_FRAME_TIME_MS) {
      warnings.push(`High frame time: ${this.metrics.frameTime}ms`);
    }

    if (
      this.metrics.scriptTime > PerformanceBudget.MAX_SCRIPT_EXECUTION_TIME_MS
    ) {
      warnings.push(`High script time: ${this.metrics.scriptTime}ms`);
    }

    if (warnings.length > 0) {
      console.warn("Performance warnings:", warnings);
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }
}

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  scriptTime: number;
  networkCalls: number;
  entityCount: number;
  memoryUsage: number;
}

Component.register(PerformanceDashboard);
```

## Summary

This comprehensive performance guide covers:

1. **Performance Fundamentals** - Frame rate targets and monitoring
2. **Component Optimization** - Efficient lifecycle management and pooling
3. **Event System Performance** - Batched and debounced event handling
4. **Memory Management** - Object pooling and leak prevention
5. **Network Optimization** - Request batching and caching
6. **Rendering Performance** - LOD management and culling
7. **Script Execution Optimization** - Async processing and lazy loading
8. **Profiling and Debugging** - Performance measurement tools
9. **Common Pitfalls** - Anti-patterns and best practices

Key takeaways for Horizon Worlds performance:

- Target 60 FPS with graceful degradation to 30 FPS minimum
- Use object pooling for frequently created/destroyed objects
- Batch network requests and cache responses
- Implement LOD systems for complex scenes
- Profile regularly and optimize bottlenecks
- Avoid expensive operations in update loops
- Use async processing for heavy computations
