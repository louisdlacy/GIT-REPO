# Error Log & Best Practices - Component Implementation Errors

## Horizon Worlds Component Implementation Best Practices

### Missing Method Implementation and Props Errors

**Common Errors**:

- `Property 'methodName' does not exist on type 'ComponentClass'`
- `Cannot assign to 'propName' because it is a read-only property`
- `Property has no initializer and is not definitely assigned in the constructor`
- `'"horizon/core"' has no exported member named 'Teams'. Did you mean 'ITeam'?`
- `Property 'OnPlayerJoinWorld' does not exist on type 'CodeBlockEvents'`
- `Property 'OnChatMessage' does not exist on type 'CodeBlockEvents'`

**Problem**:
Missing method implementations, incorrect property access patterns, and using non-existent APIs leading to runtime failures and incomplete component functionality.

**Common Causes**:

1. **Missing method implementations**:

```typescript
// ❌ WRONG: Calling methods that don't exist
export class CTFBaseDefenseManager extends Component<
  typeof CTFBaseDefenseManager
> {
  preStart() {
    this.connectLocalEvent(this.entity, "Flag.Stolen", (data: any) => {
      this.handleFlagStolen(data.team, data.thief); // Method doesn't exist
    });
  }

  // Missing implementation
  // private handleFlagStolen(team: string, thief: Player): void { ... }
}
```

2. **Read-only props mutation**:

```typescript
// ❌ WRONG: Trying to mutate read-only props
export class CTFMasterController extends Component<typeof CTFMasterController> {
  private toggleDebugMode(): void {
    this.props.enableDebugMode = !this.props.enableDebugMode; // Cannot assign to read-only
  }
}
```

3. **Uninitialized required properties**:

```typescript
// ❌ WRONG: Properties without initialization
export class CTFMasterController extends Component<typeof CTFMasterController> {
  private worldInstance: World; // No initializer and not definitely assigned

  preStart() {
    this.worldInstance = this.entity.getWorld(); // getWorld doesn't exist
  }
}
```

4. **Non-existent import members**:

```typescript
// ❌ WRONG: Importing non-existent types
import { Component, Teams, Binding, DerivedBinding } from "horizon/core";
// Teams doesn't exist (should be ITeam)
// Binding should be imported from horizon/ui
// DerivedBinding doesn't exist
```

5. **Non-existent CodeBlock events**:

```typescript
// ❌ WRONG: Using non-existent events
this.connectCodeBlockEvent(
  this.entity,
  CodeBlockEvents.OnPlayerJoinWorld,
  (player) => {
    // OnPlayerJoinWorld doesn't exist - should be OnPlayerEnterWorld
  }
);

this.connectCodeBlockEvent(
  this.entity,
  CodeBlockEvents.OnChatMessage,
  (player, message) => {
    // OnChatMessage doesn't exist in CodeBlockEvents
  }
);
```

**Solutions**:

### 1. Complete Method Implementation Pattern

```typescript
// ✅ CORRECT: Implement all referenced methods
export class CTFBaseDefenseManager extends Component<
  typeof CTFBaseDefenseManager
> {
  preStart() {
    this.connectLocalEvent(
      this.entity,
      TeamPlayerJoinedEvent,
      (data: { player: Player; team: string }) => {
        this.handlePlayerJoined(data.player, data.team);
      }
    );

    this.connectLocalEvent(
      this.entity,
      FlagStolenEvent,
      (data: { team: string; thief: Player }) => {
        this.handleFlagStolen(data.team, data.thief);
      }
    );
  }

  // ✅ Implement all referenced methods
  private handlePlayerJoined(player: Player, team: string): void {
    // Add player to team tracking
    this.updateTeamRoster(team, player);
    this.updateBaseDefenseForTeam(team);
  }

  private handleFlagStolen(team: string, thief: Player): void {
    // Handle base intrusion alert
    this.triggerIntrusionAlert(team, thief);
    this.notifyDefenders(team, thief);
  }

  private updateTeamRoster(team: string, player: Player): void {
    // Implementation for team roster updates
  }

  private triggerIntrusionAlert(team: string, intruder: Player): void {
    // Implementation for intrusion alerts
  }
}
```

### 2. Props Pattern - State Management Alternative

```typescript
// ✅ CORRECT: Use local state instead of mutating props
export class CTFMasterController extends Component<typeof CTFMasterController> {
  static propsDefinition = {
    initialDebugMode: PropTypes.Boolean,
  } as const;

  // Local state for mutable values
  private isDebugModeEnabled: boolean = false;
  private debugModeBinding = new Binding<boolean>(false);

  preStart() {
    // Initialize from props
    this.isDebugModeEnabled = this.props.initialDebugMode ?? false;
    this.debugModeBinding.set(this.isDebugModeEnabled);
  }

  private toggleDebugMode(): void {
    // ✅ Mutate local state, not props
    this.isDebugModeEnabled = !this.isDebugModeEnabled;
    this.debugModeBinding.set(this.isDebugModeEnabled);
  }
}
```

### 3. Property Initialization Patterns

```typescript
// ✅ CORRECT: Proper property initialization
export class CTFMasterController extends Component<typeof CTFMasterController> {
  // Option 1: Initialize with default value
  private worldReference: World | null = null;

  // Option 2: Use definite assignment assertion (if you're sure it will be assigned)
  private gameManagers!: Map<string, Component>;

  // Option 3: Optional property
  private worldInstance?: World;

  preStart() {
    // ✅ Initialize in preStart instead of using getWorld()
    this.gameManagers = new Map();
    this.worldReference = null; // Will be set through other means
  }
}
```

### 4. Correct Import Patterns

```typescript
// ✅ CORRECT: Use proper imports
import {
  Component,
  PropTypes,
  Player,
  World,
  CodeBlockEvents,
  LocalEvent,
  Color,
  Vec3,
  Entity,
} from "horizon/core";
import { Binding } from "horizon/ui"; // Binding from UI module
import { ITeam } from "horizon/core"; // Use ITeam instead of Teams

// ✅ Create LocalEvent objects for custom events
export const TeamPlayerJoinedEvent = new LocalEvent<{
  player: Player;
  team: string;
}>("Team.PlayerJoined");
export const FlagStolenEvent = new LocalEvent<{ team: string; thief: Player }>(
  "Flag.Stolen"
);
export const FlagReturnedEvent = new LocalEvent<{ team: string }>(
  "Flag.Returned"
);
```

### 5. Correct CodeBlock Event Usage

```typescript
// ✅ CORRECT: Use existing CodeBlock events
export class CTFMasterController extends Component<typeof CTFMasterController> {
  preStart() {
    // ✅ Use OnPlayerEnterWorld instead of OnPlayerJoinWorld
    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnPlayerEnterWorld,
      (player: Player) => {
        this.handlePlayerEntered(player);
      }
    );

    // ✅ Use OnPlayerExitWorld instead of OnPlayerLeaveWorld
    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnPlayerExitWorld,
      (player: Player) => {
        this.handlePlayerExited(player);
      }
    );

    // ✅ For chat, use custom events or UI components
    // CodeBlockEvents.OnChatMessage doesn't exist
  }

  private handlePlayerEntered(player: Player): void {
    // Handle player entering the world
  }

  private handlePlayerExited(player: Player): void {
    // Handle player leaving the world
  }
}
```

### 6. Method Signature Completion Pattern

```typescript
// ✅ CORRECT: Complete method signature implementation
export class CTFBaseDefenseManager extends Component<
  typeof CTFBaseDefenseManager
> {
  // Define all methods called in event handlers
  private getAllActivePlayers(): Player[] {
    // Return array of active players
    return Array.from(this.connectedPlayers.values()).filter(
      (player) => player.isConnected
    );
  }

  private getPlayerTeam(player: Player): string {
    // Return player's team
    return this.playerTeams.get(player.id) || "none";
  }

  private removePlayerFromAllIntrusions(player: Player): void {
    // Remove player from intrusion tracking
    this.currentIntrusions.forEach((intrusion, team) => {
      intrusion.intruders = intrusion.intruders.filter(
        (p) => p.id !== player.id
      );
    });
  }

  private handleAllClear(team: string): void {
    // Handle all-clear state for team base
    this.clearIntrusionAlerts(team);
    this.resetDefenseLevel(team);
  }

  private updateAlertVisuals(baseZone: any, alertLevel: number): void {
    // Update visual alert indicators
  }

  private updateAlertAudio(baseZone: any, alertLevel: number): void {
    // Update audio alert indicators
  }
}
```

**Best Practices**:

1. **Implementation-First Development**:

```typescript
// ✅ Define method signatures before using them
export class GameComponent extends Component<typeof GameComponent> {
  // Define all methods that will be called
  private initializeGameState(): void {
    /* TODO */
  }
  private handlePlayerAction(player: Player, action: string): void {
    /* TODO */
  }
  private updateGameLogic(): void {
    /* TODO */
  }

  preStart() {
    // Use methods knowing they exist
    this.initializeGameState();
  }
}
```

2. **Props vs State Separation**:

```typescript
// ✅ Props for configuration, local state for runtime
static propsDefinition = {
  maxPlayers: PropTypes.Number,
  gameMode: PropTypes.String
} as const;

// Local state for values that change during runtime
private currentPlayers: Map<string, Player> = new Map();
private gamePhase: GamePhase = GamePhase.WAITING;
```

3. **Import Validation**:

```typescript
// ✅ Always check Horizon Worlds documentation for available exports
// Use TypeScript IntelliSense to verify imports
// Common corrections:
// - Teams → ITeam
// - Binding from horizon/ui (not horizon/core)
// - No DerivedBinding (use computed methods)
```

4. **Event System Validation**:

```typescript
// ✅ Verify CodeBlock events exist before using
// Available events include:
// - OnPlayerEnterWorld / OnPlayerExitWorld
// - OnPlayerEnterTrigger / OnPlayerExitTrigger
// - OnGrabStart / OnGrabEnd
// Not available:
// - OnPlayerJoinWorld / OnPlayerLeaveWorld
// - OnChatMessage
```

**Testing Checklist**:

- [ ] All referenced methods have implementations
- [ ] No mutation of read-only props
- [ ] All properties properly initialized or marked optional
- [ ] Imports use correct module sources (horizon/core vs horizon/ui)
- [ ] Only existing CodeBlock events are used
- [ ] Custom LocalEvent objects created for custom events
- [ ] Type-safe method signatures with proper parameter types
- [ ] Complete component lifecycle implementation
- [ ] Error handling for all component operations
