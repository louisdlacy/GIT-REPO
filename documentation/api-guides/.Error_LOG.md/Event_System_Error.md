# Error Log & Best Practices - Event System Errors

## Horizon Worlds Event Handling Best Practices

### Event System Usage Errors

**Common Errors**:

- `Argument of type 'string' is not assignable to parameter of type 'LocalEvent<any>'`
- `Property 'OnKeyPress' does not exist on type 'CodeBlockEvents'`
- Runtime errors from invalid event data
- Memory leaks from untracked event listeners

**Problem**:
Using incorrect event types, invalid event names, or missing event data validation leading to runtime failures and memory issues.

**Common Causes**:

1. **String event names instead of LocalEvent objects**:

```typescript
// ❌ WRONG: Using string instead of LocalEvent object
this.connectLocalEvent(this.entity, "Flag.Stolen", (data) => {
  // Argument of type 'string' is not assignable to parameter of type 'LocalEvent<any>'
});

this.connectLocalEvent(this.entity, "Team.PlayerJoined", (data) => {
  // Same error - strings not allowed
});
```

2. **Non-existent CodeBlock events**:

```typescript
// ❌ WRONG: These events don't exist in Horizon Worlds
this.connectCodeBlockEvent(
  this.entity,
  CodeBlockEvents.OnPlayerJoinWorld,
  (player) => {
    // Property 'OnPlayerJoinWorld' does not exist - should be OnPlayerEnterWorld
  }
);

this.connectCodeBlockEvent(
  this.entity,
  CodeBlockEvents.OnPlayerLeaveWorld,
  (player) => {
    // Property 'OnPlayerLeaveWorld' does not exist - should be OnPlayerExitWorld
  }
);

this.connectCodeBlockEvent(
  this.entity,
  CodeBlockEvents.OnPlayerEliminated,
  (player) => {
    // Property 'OnPlayerEliminated' does not exist - no built-in elimination event
  }
);
```

3. **Missing proper LocalEvent definitions**:

```typescript
// ❌ WRONG: Events not properly defined as LocalEvent objects
// Using raw strings leads to type errors
```

4. **Incorrect event data types**:

```typescript
// ❌ WRONG: Using 'any' instead of proper typing
this.connectLocalEvent(this.entity, SomeEvent, (data: any) => {
  // No type safety, potential runtime errors
});
```

**Solutions**:

### 1. Proper LocalEvent Definition Pattern

```typescript
// ✅ CORRECT: Define proper LocalEvent objects with typed data
const FlagEvents = {
  Stolen: new LocalEvent<{ player: Player; team: string }>("Flag.Stolen"),
  Returned: new LocalEvent<{ player: Player; team: string }>("Flag.Returned"),
  Captured: new LocalEvent<{ player: Player; team: string; score: number }>(
    "Flag.Captured"
  ),
};

const TeamEvents = {
  PlayerJoined: new LocalEvent<{ player: Player; team: string }>(
    "Team.PlayerJoined"
  ),
  PlayerLeft: new LocalEvent<{ player: Player; team: string }>(
    "Team.PlayerLeft"
  ),
  ScoreChanged: new LocalEvent<{ team: string; score: number }>(
    "Team.ScoreChanged"
  ),
};

const GameStateEvents = {
  GameStarting: new LocalEvent<{ countdown: number }>("GameState.Starting"),
  GameStarted: new LocalEvent<{}>("GameState.Started"),
  GameEnded: new LocalEvent<{ winningTeam: string; reason: string }>(
    "GameState.Ended"
  ),
};

// ✅ CORRECT: Use LocalEvent objects in connections
this.connectLocalEvent(
  this.entity,
  FlagEvents.Stolen,
  (data: { player: Player; team: string }) => {
    // Properly typed data parameter
    this.onFlagStolen(data.player, data.team);
  }
);

this.connectLocalEvent(
  this.entity,
  TeamEvents.PlayerJoined,
  (data: { player: Player; team: string }) => {
    this.onPlayerJoinedTeam(data.player, data.team);
  }
);
```

### 2. Correct CodeBlock Events Pattern

```typescript
// ✅ CORRECT: Use existing CodeBlock events
this.connectCodeBlockEvent(
  this.entity,
  CodeBlockEvents.OnPlayerEnterWorld,
  (player: Player) => {
    this.onPlayerJoinedWorld(player);
  }
);

this.connectCodeBlockEvent(
  this.entity,
  CodeBlockEvents.OnPlayerExitWorld,
  (player: Player) => {
    this.onPlayerLeftWorld(player);
  }
);

// ✅ CORRECT: Use trigger-based events
this.connectCodeBlockEvent(
  this.entity,
  CodeBlockEvents.OnPlayerEnterTrigger,
  (player: Player) => {
    this.onPlayerEnteredArea(player);
  }
);

this.connectCodeBlockEvent(
  this.entity,
  CodeBlockEvents.OnPlayerExitTrigger,
  (player: Player) => {
    this.onPlayerExitedArea(player);
  }
);

// ✅ NOTE: For elimination events, use custom LocalEvents
const CombatEvents = {
  PlayerEliminated: new LocalEvent<{ player: Player; eliminator?: Player }>(
    "Combat.PlayerEliminated"
  ),
};
```

### 3. Event Emission Pattern

```typescript
// ✅ CORRECT: Emit events with proper data
onFlagStolen(player: Player, team: string) {
  // Emit typed event
  this.sendLocalEvent(this.entity, FlagEvents.Stolen, { player, team });
}

onScoreChanged(team: string, newScore: number) {
  this.sendLocalEvent(this.entity, TeamEvents.ScoreChanged, {
    team,
    score: newScore
  });
}
```

// ✅ CORRECT: Use only available CodeBlock events
// Available events include:
// - OnPlayerEnterTrigger
// - OnPlayerExitTrigger
// - OnEntityEnterTrigger
// - OnEntityExitTrigger
// - OnPlayerUseGizmo
// - OnPlayerStopUsingGizmo

this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
this.handlePlayerEnter(player);
});

// ✅ For input handling, use UI components instead
Pressable({
onPress: () => {
this.handleUserInput();
},
children: [
Text({ text: 'Click me instead of key press' })
]
});

````

### 3. Safe Event Handling Pattern
```typescript
// ✅ CORRECT: Always validate event data
this.connectLocalEvent(this.entity, GameEvents.FlagStolen, (data) => {
  // Validate data structure
  if (!this.validateFlagEventData(data)) {
    console.warn('Invalid flag event data received:', data);
    return;
  }

  try {
    this.handleFlagStolen(data);
  } catch (error) {
    console.error('Error handling flag stolen event:', error);
  }
});

private validateFlagEventData(data: any): data is {team: string, thief: Player} {
  return data &&
         typeof data.team === 'string' &&
         data.thief &&
         typeof data.thief.name === 'string';
}
````

### 4. Event Cleanup Pattern

```typescript
// ✅ CORRECT: Track and cleanup event listeners
private eventCleanup: (() => void)[] = [];

preStart() {
  // Track cleanup functions
  const cleanup1 = this.connectLocalEvent(
    this.entity,
    GameEvents.PlayerJoined,
    this.handlePlayerJoined.bind(this)
  );
  this.eventCleanup.push(cleanup1);

  const cleanup2 = this.connectNetworkEvent(
    this.entity,
    NetworkEvents.DataUpdate,
    this.handleDataUpdate.bind(this)
  );
  this.eventCleanup.push(cleanup2);
}

dispose() {
  // Clean up all event listeners
  this.eventCleanup.forEach(cleanup => cleanup?.());
  this.eventCleanup = [];
  super.dispose?.();
}
```

**Best Practices**:

1. **Event Definition Structure**:

```typescript
// ✅ Organize events by category
const UIEvents = {
  // UI-related events
  ShowDialog: new LocalEvent<{ message: string }>("UI.ShowDialog"),
  HideDialog: new LocalEvent<{}>("UI.HideDialog"),
};

const GameplayEvents = {
  // Gameplay-related events
  PlayerScored: new LocalEvent<{ player: Player; points: number }>(
    "Game.PlayerScored"
  ),
  RoundEnded: new LocalEvent<{ winner: string }>("Game.RoundEnded"),
};
```

2. **Type-Safe Event Interfaces**:

```typescript
// ✅ Define proper interfaces for event data
interface PlayerEventData {
  player: Player;
  timestamp: number;
  [key: string]: any; // Required for SerializableState if used with NetworkEvent
}

interface ScoreEventData {
  team: string;
  score: number;
  previousScore: number;
}

const Events = {
  PlayerEvent: new LocalEvent<PlayerEventData>("Player.Event"),
  ScoreEvent: new LocalEvent<ScoreEventData>("Score.Event"),
};
```

3. **Error-Safe Event Handling**:

```typescript
// ✅ Generic error-safe event handler wrapper
private safeEventHandler<T>(
  handler: (data: T) => void,
  validator: (data: any) => data is T,
  context: string
) {
  return (data: any) => {
    if (!validator(data)) {
      console.warn(`Invalid event data in ${context}:`, data);
      return;
    }

    try {
      handler(data);
    } catch (error) {
      console.error(`Error in ${context}:`, error);
    }
  };
}
```

4. **Alternative Input Handling**:

```typescript
// ✅ Instead of key events, use UI-based input
class InputHandler extends UIComponent<typeof InputHandler> {
  static propsDefinition = {
    onToggle: { type: PropTypes.Function },
  };

  initializeUI() {
    return Pressable({
      onPress: () => {
        this.props.onToggle?.();
      },
      children: [Text({ text: "Toggle (M)" })],
    });
  }
}
```

**Testing Checklist**:

- [ ] All events defined as LocalEvent objects, not strings
- [ ] Event data interfaces defined with proper types
- [ ] Event handlers include data validation
- [ ] Error handling implemented for all event handlers
- [ ] Event cleanup implemented in dispose() method
- [ ] No usage of non-existent CodeBlock events
- [ ] Alternative input methods used instead of key events
- [ ] SerializableState compatibility for NetworkEvents
