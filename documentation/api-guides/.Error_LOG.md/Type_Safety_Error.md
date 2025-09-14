# Error Log & Best Practices - Type Safety Errors

## Horizon Worlds TypeScript Best Practices

### Type Safety and Compilation Errors

**Common Errors**:

- `Property 'attachTo' does not exist on type 'AttachableEntity'`
- `Property 'distance' does not exist on type 'typeof Vec3'`
- `Property 'getWorld' does not exist on type 'Entity'`
- `Parameter 'item' implicitly has an 'any' type`
- `Object is of type 'unknown'`
- `Argument of type 'unknown' is not assignable to parameter of type 'Player'`

**Problem**:
Using non-existent API methods, missing type annotations, or unsafe type assumptions leading to compilation failures and runtime errors.

**Common Causes**:

1. **Non-existent Entity API methods**:

```typescript
// ❌ WRONG: Using non-existent attachTo method
const flagEntity = this.entity as AttachableEntity;
flagEntity.attachTo(player); // Property 'attachTo' does not exist

// ❌ WRONG: Using non-existent getWorld method
const world = this.entity.getWorld(); // Property 'getWorld' does not exist
```

2. **Non-existent Vec3 methods**:

```typescript
// ❌ WRONG: Using non-existent Vec3.distance method
const distance = Vec3.distance(playerPosition, flagData.position);
// Property 'distance' does not exist on type 'typeof Vec3'
```

3. **Missing type annotations in callbacks**:

```typescript
// ❌ WRONG: Implicit any types in forEach
this.currentFlags.forEach((flag, team) => {
  // Parameter 'flag' implicitly has an 'any' type
  // Parameter 'team' implicitly has an 'any' type
  flag.update(); // Unsafe access
});

// ❌ WRONG: Binding element implicit any types
private activePlayersBinding = new DerivedBinding([this.playersBinding],
  ([players]) => players.size // Binding element 'players' implicitly has an 'any' type
);
```

4. **Unknown object property access**:

```typescript
// ❌ WRONG: Unsafe property access on unknown objects
const handlePlayerData = (data: unknown) => {
  const playerId = data.player.id; // Object is of type 'unknown'
  const position = data.position.x; // Object is of type 'unknown'
};

// ❌ WRONG: Spread operator on unknown types
const updateIntrusionData = (intrusionData: unknown, updates: any) => {
  return {
    ...intrusionData, // Spread types may only be created from object types
    ...updates,
  };
};
```

5. **Unsafe type assertions**:

```typescript
// ❌ WRONG: Unsafe casting without validation
const player = someObject as Player; // Could be null or wrong type
player.getName(); // Potential runtime error
```

**Solutions**:

### 1. Entity API Alternatives (Recommended)

```typescript
// ✅ CORRECT: Use position.set() instead of attachTo()
private attachFlagToPlayer(flag: Entity, player: Player): void {
  const playerPos = player.entity.position.get();
  const offset = new Vec3(0, 1, 0); // Flag above player
  flag.position.set(Vec3.add(playerPos, offset));
}

// ✅ CORRECT: Use available entity properties
private getEntityPosition(entity: Entity): Vec3 {
  return entity.position.get(); // Use available position property
}

// ✅ CORRECT: Alternative attachment using movement
private followPlayer(flag: Entity, player: Player): void {
  const playerPos = player.entity.position.get();
  const flagPos = flag.position.get();
  const direction = Vec3.subtract(playerPos, flagPos);
  const distance = Vec3.magnitude(direction);

  if (distance > 0.1) {
    const normalizedDirection = Vec3.scale(direction, 1 / distance);
    const speed = 5.0;
    const newPos = Vec3.add(flagPos, Vec3.scale(normalizedDirection, speed * Time.deltaTime));
    flag.position.set(newPos);
  }
}
```

### 2. Vec3 Distance Calculation Alternative

```typescript
// ✅ CORRECT: Manual distance calculation
private calculateDistance(pos1: Vec3, pos2: Vec3): number {
  const diff = Vec3.subtract(pos1, pos2);
  return Vec3.magnitude(diff);
}

// ✅ CORRECT: Distance check with built-in methods
private isPlayerNearFlag(player: Player, flagPosition: Vec3, maxDistance: number): boolean {
  const playerPos = player.entity.position.get();
  const distance = this.calculateDistance(playerPos, flagPosition);
  return distance <= maxDistance;
}
```

### 3. Type-Safe Callback Patterns

```typescript
// ✅ CORRECT: Explicit type annotations for forEach
private currentFlags = new Map<TeamType, FlagData>();

private updateAllFlags(): void {
  this.currentFlags.forEach((flag: FlagData, team: TeamType) => {
    // Types are explicit and safe
    flag.lastUpdate = Date.now();
    this.updateFlagUI(team, flag);
  });
}

// ✅ CORRECT: Type-safe array operations
private getActivePlayers(): Player[] {
  return this.players.filter((player: Player) => {
    return player.isConnected && player.isActive;
  });
}

// ✅ CORRECT: Binding element type annotations
private createActivePlayersBinding(): Binding<number> {
  return new DerivedBinding([this.playersBinding],
    ([players]: [Map<string, Player>]) => players.size // Explicit type annotation
  );
}
```

### 4. Type Guards and Validation

```typescript
// ✅ CORRECT: Type guards for unknown data
interface PlayerEventData {
  player: Player;
  position: Vec3;
  team?: TeamType;
}

private isPlayerEventData(data: unknown): data is PlayerEventData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'player' in data &&
    'position' in data
  );
}

private handlePlayerEvent(data: unknown): void {
  if (this.isPlayerEventData(data)) {
    // Now data is typed as PlayerEventData
    const playerId = data.player.getName();
    const position = data.position;
    const team = data.team || TeamType.NONE;
  } else {
    console.error('Invalid player event data:', data);
  }
}

// ✅ CORRECT: Safe object spread with type validation
interface IntrusionData {
  intruders: Player[];
  alertLevel: number;
  lastIntrusionTime: number;
  isActive: boolean;
}

private updateIntrusionData(intrusionData: unknown, updates: Partial<IntrusionData>): IntrusionData | null {
  if (this.isIntrusionData(intrusionData)) {
    return {
      ...intrusionData, // Now safe to spread
      ...updates
    };
  }
  return null;
}

private isIntrusionData(data: unknown): data is IntrusionData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'intruders' in data &&
    'alertLevel' in data &&
    'lastIntrusionTime' in data &&
    'isActive' in data
  );
}
```

### 5. Safe Type Assertions

```typescript
// ✅ CORRECT: Validation before type assertion
private getPlayerFromEntity(entity: Entity): Player | null {
  const owner = entity.owner.get();
  if (owner && owner instanceof Player) {
    return owner;
  }
  return null;
}

// ✅ CORRECT: Optional chaining for safe access
private getPlayerName(entity: Entity): string {
  const player = this.getPlayerFromEntity(entity);
  return player?.getName() || 'Unknown Player';
}
```

**Best Practices**:

1. **API Method Verification**:

```typescript
// ✅ Always verify API methods exist before use
// Check Horizon Worlds documentation for available methods
// Use TypeScript IntelliSense to see available properties
```

2. **Type-Safe Collections**:

```typescript
// ✅ Explicit typing for collections
private players = new Map<string, Player>();
private teams = new Map<TeamType, TeamData>();
private flags = new Map<TeamType, FlagData>();

// ✅ Type-safe iteration
private processTeams(): void {
  for (const [teamType, teamData] of this.teams) {
    // teamType is TeamType, teamData is TeamData
    this.updateTeamScore(teamType, teamData.score);
  }
}
```

3. **Error Handling**:

```typescript
// ✅ Comprehensive error handling
private safeEntityOperation<T>(
  operation: () => T,
  fallback: T,
  context: string
): T {
  try {
    return operation();
  } catch (error) {
    console.error(`Error in ${context}:`, error);
    return fallback;
  }
}
```

4. **Type Utilities**:

```typescript
// ✅ Custom type utilities for common patterns
type NonNullable<T> = T extends null | undefined ? never : T;
type EntityWithPosition = Entity & { position: { get(): Vec3; set(pos: Vec3): void } };

// ✅ Type-safe entity helpers
private isEntityWithPosition(entity: Entity): entity is EntityWithPosition {
  return entity && 'position' in entity && entity.position &&
         typeof entity.position.get === 'function';
}
```

5. **Documentation Comments**:

```typescript
// ✅ Document workarounds and limitations
/**
 * Calculates distance between two Vec3 positions.
 * Note: Vec3.distance() doesn't exist in Horizon Worlds API 2.0,
 * so we use Vec3.magnitude(Vec3.subtract()) instead.
 */
private calculateDistance(pos1: Vec3, pos2: Vec3): number {
  const diff = Vec3.subtract(pos1, pos2);
  return Vec3.magnitude(diff);
}
```

**Testing Checklist**:

- [ ] No usage of non-existent API methods (attachTo, getWorld, Vec3.distance)
- [ ] All callback parameters have explicit type annotations
- [ ] Unknown data validated with type guards before use
- [ ] Type assertions include null/undefined checks
- [ ] Collections use explicit generic types
- [ ] Error handling for all potentially unsafe operations
- [ ] TypeScript compilation passes with no errors
- [ ] Runtime type validation for external data
- [ ] Documentation for API workarounds and limitations
