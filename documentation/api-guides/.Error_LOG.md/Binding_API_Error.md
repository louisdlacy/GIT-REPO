# Error Log & Best Practices - Binding API Errors

## Horizon Worlds Binding System Best Practices

### Binding API Usage Errors

**Common Errors**:

- `Property 'value' does not exist on type 'Binding<T>'`
- `Property 'get' does not exist on type 'Binding<T>'`
- Memory leaks from undisposed bindings
- Incorrect binding update patterns

**Problem**:
Using incorrect API methods for reading and writing binding values, leading to runtime errors and memory issues.

**Common Causes**:

1. **Incorrect value access**:

```typescript
// ❌ WRONG: Using .value property for writes
this.gameStateBinding.value = GameState.ACTIVE; // Property doesn't exist
this.gameConfigBinding.value = config; // Property doesn't exist
```

2. **Incorrect value reading**:

```typescript
// ❌ WRONG: Using .value property for reads
const currentState = this.gameStateBinding.value;   // Property doesn't exist
if (this.isGameReadyBinding.value) { ... }          // Property doesn't exist
```

3. **DerivedBinding usage errors**:

```typescript
// ❌ WRONG: DerivedBinding doesn't exist in Horizon Worlds API 2.0
import { Binding, DerivedBinding } from "horizon/core"; // DerivedBinding doesn't exist

private stolenFlagsBinding = new DerivedBinding([this.flagsBinding],
  ([flags]) => Array.from(flags.values()).filter(flag => flag.state === FlagState.STOLEN)
); // Cannot find name 'DerivedBinding'
```

4. **Complex derived binding issues**:

```typescript
// ❌ WRONG: Complex multi-dependency derives often fail
private timeBinding = Binding.derive([this.startTimeBinding, this.configBinding],
  ([startTime, config]) => { ... });  // Type errors and complexity issues
```

5. **Missing local state management**:

```typescript
// ❌ WRONG: Trying to read from bindings for logic
if (this.currentGameState !== GameState.ACTIVE) {
  // Can't access binding values directly for conditional logic
}
```

**Solutions**:

### 1. Correct Binding Update Pattern

```typescript
// ✅ CORRECT: Use .set() method to update values
this.gameStateBinding.set(GameState.ACTIVE);
this.gameConfigBinding.set(config);
this.playerStatsBinding.set(statsMap);

// ✅ CORRECT: Use functional updates
this.scoreBinding.set((prev) => prev + points);
```

### 2. DerivedBinding Replacement (NEW Pattern)

```typescript
// ✅ CORRECT: Replace DerivedBinding with computed public methods
export class CTFGameStateManager extends Component<typeof CTFGameStateManager> {
  // Local state for logic + binding for UI
  private currentFlags = new Map<TeamType, FlagData>();
  private flagsBinding = new Binding<Map<TeamType, FlagData>>(new Map());

  // Computed properties instead of DerivedBinding
  public getStolenFlags(): FlagData[] {
    return Array.from(this.currentFlags.values()).filter(
      (flag) => flag.state === FlagState.STOLEN
    );
  }

  public getDroppedFlags(): FlagData[] {
    return Array.from(this.currentFlags.values()).filter(
      (flag) => flag.state === FlagState.DROPPED
    );
  }

  public getHomeFlags(): FlagData[] {
    return Array.from(this.currentFlags.values()).filter(
      (flag) => flag.state === FlagState.HOME
    );
  }

  // Update both local state and binding
  private updateFlagState(team: TeamType, newState: FlagState): void {
    const flag = this.currentFlags.get(team);
    if (flag) {
      flag.state = newState;
      this.currentFlags.set(team, flag);
      this.flagsBinding.set(new Map(this.currentFlags)); // Sync to UI
    }
  }
}
```

### 3. Maintain Local State for Logic

```typescript
// ✅ CORRECT: Keep local state for reads, bindings for UI
private currentGameState: GameState = GameState.WAITING;
private currentConfig: GameConfig = defaultConfig;

// Update both local state and binding
updateGameState(newState: GameState) {
  this.currentGameState = newState;        // For logic
  this.gameStateBinding.set(newState);     // For UI
}

// Use local state for conditionals
if (this.currentGameState === GameState.ACTIVE) {
  // Logic based on local state
}
```

### 4. Simplified Derived Bindings

```typescript
// ✅ CORRECT: Use simple bindings and manual updates
private gameTimeRemainingBinding = new Binding<number>(0);

updateDerivedBindings() {
  // Calculate derived values manually
  const timeRemaining = this.calculateTimeRemaining();
  this.gameTimeRemainingBinding.set(timeRemaining);
}
```

### 5. Pattern: Binding + Local State Architecture

```typescript
export class GameManager extends Component {
  // Local state (for logic)
  private currentGameState: GameState = GameState.WAITING;
  private gameStartTime: number = 0;

  // Bindings (for UI)
  private gameStateBinding = new Binding<GameState>(GameState.WAITING);
  private gameTimeBinding = new Binding<number>(0);

  // Update method that syncs both
  private updateGameState(newState: GameState) {
    this.currentGameState = newState;
    this.gameStateBinding.set(newState);
    this.updateDerivedBindings();
  }

  private updateDerivedBindings() {
    if (this.currentGameState === GameState.ACTIVE) {
      const elapsed = Date.now() - this.gameStartTime;
      this.gameTimeBinding.set(elapsed);
    }
  }
}
```

Text({
text: this.myBinding.derive(value => `Current: ${value}`)
});

// Option 2: Direct binding usage in UI
Text({
text: this.myBinding
});

// Option 3: For complex logic, maintain separate state
private currentValue = 'initial';

private updateValue(newValue: string): void {
this.currentValue = newValue;
this.myBinding.set(newValue);
}

````

### 3. Proper Binding Disposal Pattern
```typescript
// ✅ CORRECT: Always implement disposal
dispose() {
  // Clean up all bindings
  this.myBinding.dispose?.();
  this.otherBinding.dispose?.();
  super.dispose?.();
}
````

### 4. Derived Bindings for Computed Values

```typescript
// ✅ CORRECT: For computed/calculated values
private statusMessage = new DerivedBinding(
  [this.flagStatusBinding, this.teamNameBinding],
  ([status, team]) => `${team} flag is ${status}`
);
```

**Best Practices**:

1. **Creation Pattern**:

```typescript
// ✅ Proper binding creation with type safety
private myBinding = new Binding<string>('defaultValue');
private countBinding = new Binding<number>(0);
private visibleBinding = new Binding<boolean>(false);
```

2. **DerivedBinding Replacement Pattern**:

```typescript
// ✅ Use computed methods instead of DerivedBinding
public getFilteredItems(): Item[] {
  return Array.from(this.currentItems.values()).filter(item => item.isActive);
}

// ✅ Update derived values when base values change
private updateItemState(id: string, newState: ItemState): void {
  this.currentItems.set(id, newState);
  this.itemsBinding.set(new Map(this.currentItems)); // Sync to UI
  // Derived values are automatically fresh when called
}
```

3. **Update Pattern**:

```typescript
// ✅ Always use .set() for updates
this.myBinding.set("newValue");

// ✅ For conditional updates
if (condition) {
  this.statusBinding.set("active");
} else {
  this.statusBinding.set("inactive");
}
```

4. **Complex State Management**:

```typescript
// ✅ Maintain parallel state for complex operations
private currentCount = 0;
private countBinding = new Binding<number>(0);

private incrementCount(): void {
  this.currentCount += 1;
  this.countBinding.set(this.currentCount);
}
```

5. **Error Handling**:

```typescript
// ✅ Safe binding updates with error handling
private safeUpdateBinding<T>(binding: Binding<T>, value: T, context: string): void {
  try {
    binding.set(value);
  } catch (error) {
    console.error(`Error updating binding in ${context}:`, error);
  }
}
```

6. **Cleanup Pattern**:

```typescript
// ✅ Track all bindings for cleanup
private allBindings: Binding<any>[] = [];

preStart() {
  this.myBinding = new Binding<string>('');
  this.allBindings.push(this.myBinding);
}

dispose() {
  this.allBindings.forEach(binding => binding.dispose?.());
  this.allBindings = [];
  super.dispose?.();
}
```

**Testing Checklist**:

- [ ] All binding updates use `.set()` method
- [ ] No usage of `.value` or `.get()` properties/methods
- [ ] No imports of `DerivedBinding` (doesn't exist in Horizon Worlds)
- [ ] All bindings have disposal in `dispose()` method
- [ ] Complex state uses parallel variables when needed
- [ ] Computed properties used instead of DerivedBinding
- [ ] Error handling for binding operations
- [ ] Type safety maintained for all bindings
