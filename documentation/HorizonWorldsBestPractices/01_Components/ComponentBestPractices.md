# Component Best Practices for Horizon Worlds

## Table of Contents

1. [Component Definition](#component-definition)
2. [Props Management](#props-management)
3. [Lifecycle Methods](#lifecycle-methods)
4. [Component Registration](#component-registration)
5. [Performance Considerations](#performance-considerations)
6. [Common Patterns](#common-patterns)

## Component Definition

### Basic Component Structure

```typescript
import { Component, PropTypes } from "horizon/core";

class MyComponent extends Component<typeof MyComponent> {
  static propsDefinition = {
    // Define your props here with proper types
    speed: { type: PropTypes.Number, default: 1.0 },
    target: { type: PropTypes.Entity },
    isActive: { type: PropTypes.Boolean, default: true },
  };

  start() {
    // Initialize component
  }

  tick() {
    // Update logic (called every frame)
  }
}

// Always register your component
Component.register(MyComponent);
```

### Props Definition Best Practices

✅ **DO:**

```typescript
static propsDefinition = {
  // Use descriptive names
  movementSpeed: { type: PropTypes.Number, default: 5.0 },
  targetEntity: { type: PropTypes.Entity },

  // Provide sensible defaults
  enableLogging: { type: PropTypes.Boolean, default: false },

  // Use arrays for multiple values
  waypoints: { type: PropTypes.Vec3Array, default: [] },

  // Group related properties with clear naming
  ui_showHealthBar: { type: PropTypes.Boolean, default: true },
  ui_healthBarColor: { type: PropTypes.Color, default: new Color(1, 0, 0) },
};
```

❌ **DON'T:**

```typescript
static propsDefinition = {
  // Unclear names
  s: { type: PropTypes.Number },
  t: { type: PropTypes.Entity },

  // Missing defaults for optional properties
  someFlag: { type: PropTypes.Boolean },

  // No type safety
  data: { type: PropTypes.String },
};
```

## Lifecycle Methods

### Method Order and Usage

```typescript
class LifecycleComponent extends Component<typeof LifecycleComponent> {
  // 1. Constructor - avoid if possible, use start() instead

  // 2. start() - Main initialization
  start() {
    // Set up initial state
    // Connect to events
    // Cache expensive lookups
    console.log("Component initialized");
  }

  // 3. tick() - Frame updates (use sparingly)
  tick() {
    // Only include essential per-frame logic
    // Consider using timers instead for periodic updates
  }

  // 4. dispose() - Cleanup
  dispose() {
    // Disconnect event listeners
    // Clear timers and intervals
    // Release resources
    console.log("Component cleaned up");
  }
}
```

### Performance-Conscious Lifecycle

```typescript
class OptimizedComponent extends Component<typeof OptimizedComponent> {
  private updateTimer?: any;
  private cachedTargets: Entity[] = [];

  start() {
    // Cache expensive operations
    this.cacheTargets();

    // Use timers instead of tick() when possible
    this.updateTimer = this.async.setInterval(() => {
      this.periodicUpdate();
    }, 100); // Update every 100ms instead of every frame
  }

  private cacheTargets() {
    // Cache entity lookups to avoid repeated bridge calls
    this.cachedTargets = this.world.getEntitiesByTag("target");
  }

  private periodicUpdate() {
    // Batch operations when possible
    this.cachedTargets.forEach((target) => {
      // Do bulk operations
    });
  }

  dispose() {
    if (this.updateTimer) {
      this.async.clearInterval(this.updateTimer);
    }
  }
}
```

## Component Registration

### Proper Registration Pattern

```typescript
// At the end of each component file
Component.register(MyComponent);

// For exported components, register after definition
export class ExportedComponent extends Component<typeof ExportedComponent> {
  // ... component definition
}
Component.register(ExportedComponent);
```

### Multiple Components in One File

```typescript
class ComponentA extends Component<typeof ComponentA> {
  // ... definition
}

class ComponentB extends Component<typeof ComponentB> {
  // ... definition
}

// Register all at the end
Component.register(ComponentA);
Component.register(ComponentB);
```

## Performance Considerations

### Bridge Call Optimization

```typescript
class PerformantComponent extends Component<typeof PerformantComponent> {
  private cachedPosition?: Vec3;
  private positionUpdateTime = 0;

  start() {
    // Cache frequently accessed properties
    this.updatePositionCache();
  }

  private updatePositionCache() {
    // Only update cache when needed
    const now = Date.now();
    if (now - this.positionUpdateTime > 16) {
      // ~60fps
      this.cachedPosition = this.entity.transform.position.get().clone();
      this.positionUpdateTime = now;
    }
  }

  getPosition(): Vec3 {
    this.updatePositionCache();
    return this.cachedPosition!.clone();
  }
}
```

### Efficient Event Handling

```typescript
class EventComponent extends Component<typeof EventComponent> {
  private subscriptions: EventSubscription[] = [];

  start() {
    // Store subscriptions for cleanup
    const sub1 = this.connectLocalEvent(
      this.entity,
      myEvent,
      this.handleEvent.bind(this)
    );
    this.subscriptions.push(sub1);
  }

  private handleEvent(data: any) {
    // Process event efficiently
  }

  dispose() {
    // Clean up all subscriptions
    this.subscriptions.forEach((sub) => sub.disconnect());
    this.subscriptions.length = 0;
  }
}
```

## Common Patterns

### State Management Pattern

```typescript
interface ComponentState {
  isActive: boolean;
  currentPhase: "idle" | "active" | "completing";
  progress: number;
}

class StatefulComponent extends Component<typeof StatefulComponent> {
  private state: ComponentState = {
    isActive: false,
    currentPhase: "idle",
    progress: 0,
  };

  private setState(newState: Partial<ComponentState>) {
    this.state = { ...this.state, ...newState };
    this.onStateChanged();
  }

  private onStateChanged() {
    // React to state changes
    console.log("State changed:", this.state);
  }
}
```

### Component Communication Pattern

```typescript
// Define events for component communication
const ComponentEvents = {
  ACTION_COMPLETED: new LocalEvent<{ componentId: string; result: any }>(
    "ComponentActionCompleted"
  ),
  REQUEST_ACTION: new LocalEvent<{ targetId: string; action: string }>(
    "ComponentRequestAction"
  ),
};

class CommunicatingComponent extends Component<typeof CommunicatingComponent> {
  start() {
    // Listen for requests
    this.connectLocalEvent(
      this.entity,
      ComponentEvents.REQUEST_ACTION,
      this.handleActionRequest.bind(this)
    );
  }

  private handleActionRequest(data: { targetId: string; action: string }) {
    if (data.targetId === this.entity.id.toString()) {
      this.performAction(data.action);
    }
  }

  private performAction(action: string) {
    // Perform the action
    const result = `Completed action: ${action}`;

    // Notify completion
    this.sendLocalEvent(this.entity, ComponentEvents.ACTION_COMPLETED, {
      componentId: this.entity.id.toString(),
      result,
    });
  }
}
```

### Error Handling Pattern

```typescript
class RobustComponent extends Component<typeof RobustComponent> {
  start() {
    try {
      this.initialize();
    } catch (error) {
      console.error("Component initialization failed:", error);
      this.fallbackInitialization();
    }
  }

  private initialize() {
    // Main initialization logic
    if (!this.props.targetEntity) {
      throw new Error("Target entity is required");
    }

    // Continue with setup...
  }

  private fallbackInitialization() {
    // Graceful degradation
    console.warn("Using fallback initialization");
  }

  private safeOperation(operation: () => void, errorMessage: string) {
    try {
      operation();
    } catch (error) {
      console.error(errorMessage, error);
    }
  }
}
```

## Summary

1. **Always register components** after definition
2. **Use descriptive prop names** with proper types and defaults
3. **Cache expensive operations** to minimize bridge calls
4. **Clean up resources** in dispose() method
5. **Use timers over tick()** for performance
6. **Handle errors gracefully** with try-catch blocks
7. **Follow consistent naming conventions**
8. **Document complex component interactions**
