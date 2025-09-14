# Error Log & Best Practices - Component Structure Errors

## Horizon Worlds Component Architecture Best Practices

### Component Structure Errors

**Common Errors**:
- Missing `static propsDefinition` in UIComponent classes
- Incorrect component inheritance patterns
- Missing lifecycle method implementations
- Improper entity ownership validation

**Problem**:
Component classes not following required structure patterns, leading to runtime initialization failures and type errors.

**Common Causes**:

1. **Missing propsDefinition**:
```typescript
// ❌ WRONG: Missing required static property
export class MyUIComponent extends UIComponent<typeof MyUIComponent> {
  // Missing static propsDefinition - causes runtime error
}
```

2. **Incorrect entity ownership access**:
```typescript
// ❌ WRONG: No validation of entity ownership
const player = this.entity.owner.get();
if (data.player.id === player.id) { // Could crash if no owner
  // Handle logic
}
```

3. **Missing lifecycle implementations**:
```typescript
// ❌ WRONG: No cleanup or initialization
export class MyComponent extends Component<typeof MyComponent> {
  // No preStart(), start(), or dispose() methods
}
```

**Solutions**:

### 1. Proper UIComponent Structure
```typescript
// ✅ CORRECT: Complete UIComponent structure
export class MyUIComponent extends UIComponent<typeof MyUIComponent> {
  static propsDefinition = {
    // Define props even if empty
    title: { type: PropTypes.String, default: "Default Title" },
    visible: { type: PropTypes.Boolean, default: true },
    // Add any other props as needed
  };

  // Optional: Define component dimensions
  panelWidth = 400;
  panelHeight = 300;

  preStart() {
    this.setupEventListeners();
    this.initializeBindings();
  }

  start() {
    // Component fully initialized
    this.updateInitialState();
  }

  dispose() {
    this.cleanupBindings();
    this.cleanupEventListeners();
    super.dispose?.();
  }

  initializeUI() {
    return View({
      children: [
        // UI content
      ]
    });
  }
}

// ✅ Register the component
UIComponent.register(MyUIComponent);
```

### 2. Proper Component Structure
```typescript
// ✅ CORRECT: Complete Component structure
export class MyComponent extends Component<typeof MyComponent> {
  static propsDefinition = {
    maxPlayers: { type: PropTypes.Number, default: 8 },
    gameMode: { type: PropTypes.String, default: "classic" },
    enableFeature: { type: PropTypes.Boolean, default: true },
    targetEntity: { type: PropTypes.Entity }, // No default for required entity
  };

  // Private state
  private isInitialized = false;
  private gameState = "waiting";

  preStart() {
    this.validateProps();
    this.setupEventListeners();
  }

  start() {
    this.isInitialized = true;
    this.startGameLogic();
  }

  dispose() {
    this.cleanupResources();
    super.dispose?.();
  }

  private validateProps(): void {
    if (!this.props.targetEntity) {
      throw new Error("MyComponent requires a targetEntity prop");
    }
  }
}
```

### 3. Safe Entity Ownership Pattern
```typescript
// ✅ CORRECT: Always validate entity ownership
private handlePlayerEvent(data: any): void {
  const player = this.entity.owner.get();
  if (!player) {
    console.warn('Component has no player owner');
    return;
  }

  if (!data || !data.player) {
    console.warn('Invalid player event data:', data);
    return;
  }

  if (data.player.id === player.id) {
    this.handleOwnPlayerEvent(data);
  } else {
    this.handleOtherPlayerEvent(data);
  }
}
```

### 4. Proper Lifecycle Management
```typescript
// ✅ CORRECT: Complete lifecycle implementation
export class GameManager extends Component<typeof GameManager> {
  static propsDefinition = {
    gameConfig: { type: PropTypes.Entity }
  };

  private eventCleanup: (() => void)[] = [];
  private bindings: Binding<any>[] = [];
  private isActive = false;

  preStart() {
    this.logDebug('GameManager initializing...');
    this.validateConfiguration();
    this.setupEventSystem();
  }

  start() {
    this.logDebug('GameManager starting...');
    this.isActive = true;
    this.initializeGame();
  }

  dispose() {
    this.logDebug('GameManager disposing...');
    this.isActive = false;
    
    // Clean up in reverse order of creation
    this.eventCleanup.forEach(cleanup => cleanup?.());
    this.bindings.forEach(binding => binding.dispose?.());
    
    this.eventCleanup = [];
    this.bindings = [];
    
    super.dispose?.();
  }

  private validateConfiguration(): void {
    if (!this.props.gameConfig) {
      throw new Error('GameManager requires gameConfig entity');
    }
  }
}
```

**Best Practices**:

1. **Props Definition Template**:
```typescript
// ✅ Standard props definition structure
static propsDefinition = {
  // Strings
  title: { type: PropTypes.String, default: "" },
  
  // Numbers
  maxValue: { type: PropTypes.Number, default: 100 },
  
  // Booleans
  enabled: { type: PropTypes.Boolean, default: true },
  
  // Entities (usually no default - required)
  targetEntity: { type: PropTypes.Entity },
  
  // Colors
  primaryColor: { type: PropTypes.Color, default: Color.white },
  
  // Vectors
  position: { type: PropTypes.Vec3, default: Vec3.zero },
  
  // Arrays (if supported)
  // items: { type: PropTypes.Array, default: [] },
};
```

2. **Resource Tracking Pattern**:
```typescript
// ✅ Track all resources for cleanup
private resources = {
  bindings: [] as Binding<any>[],
  eventCleanup: [] as (() => void)[],
  timers: [] as (() => void)[],
  intervals: [] as (() => void)[]
};

private addBinding<T>(binding: Binding<T>): Binding<T> {
  this.resources.bindings.push(binding);
  return binding;
}

private addEventCleanup(cleanup: () => void): void {
  this.resources.eventCleanup.push(cleanup);
}

dispose() {
  // Clean up all tracked resources
  Object.values(this.resources).forEach(resourceArray => {
    resourceArray.forEach(resource => {
      if (typeof resource === 'function') {
        resource();
      } else if (resource?.dispose) {
        resource.dispose();
      }
    });
  });
  
  super.dispose?.();
}
```

3. **Error Handling Pattern**:
```typescript
// ✅ Safe component operations
private safeExecute<T>(
  operation: () => T, 
  fallback: T, 
  context: string
): T {
  if (!this.isActive) {
    console.warn(`${context}: Component not active`);
    return fallback;
  }

  try {
    return operation();
  } catch (error) {
    console.error(`${context}: Operation failed:`, error);
    return fallback;
  }
}

// Usage
private updateGameState(newState: string): void {
  this.safeExecute(
    () => {
      this.gameState = newState;
      this.notifyStateChange();
    },
    undefined,
    'updateGameState'
  );
}
```

**Testing Checklist**:
- [ ] All component classes have `static propsDefinition`
- [ ] Entity ownership validated before access
- [ ] preStart(), start(), and dispose() methods implemented
- [ ] All resources tracked and cleaned up in dispose()
- [ ] Props validation implemented where needed
- [ ] Error handling for all component operations
- [ ] Logging for lifecycle events
- [ ] Component registration for UIComponents
