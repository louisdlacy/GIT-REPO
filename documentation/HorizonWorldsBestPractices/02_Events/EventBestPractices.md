# Event System Best Practices for Horizon Worlds

## Table of Contents

1. [Event Types Overview](#event-types-overview)
2. [LocalEvent Best Practices](#localevent-best-practices)
3. [NetworkEvent Best Practices](#networkevent-best-practices)
4. [CodeBlockEvent Best Practices](#codeblockevent-best-practices)
5. [Event Subscription Management](#event-subscription-management)
6. [Performance Optimization](#performance-optimization)
7. [Common Patterns](#common-patterns)

## Event Types Overview

### When to Use Each Event Type

```typescript
// LocalEvent - Same client communication (fastest)
const localEvent = new LocalEvent<{ message: string }>("LocalMessage");

// NetworkEvent - Cross-client communication (serializable data only)
const networkEvent = new NetworkEvent<{ playerId: string; score: number }>(
  "PlayerScore"
);

// CodeBlockEvent - Legacy system integration (limited types)
const codeBlockEvent = new CodeBlockEvent("TriggerAction", [
  PropTypes.String,
  PropTypes.Number,
]);
```

**Use LocalEvent when:**

- Communicating between components on the same client
- Performance is critical
- You need to pass complex objects

**Use NetworkEvent when:**

- Sending data between clients
- Synchronizing game state
- Player-to-player communication

**Use CodeBlockEvent when:**

- Integrating with world scripting
- Working with legacy systems
- Limited to predefined PropTypes

## LocalEvent Best Practices

### Proper LocalEvent Definition

```typescript
// Define events in a centralized location
export const GameEvents = {
  PLAYER_DIED: new LocalEvent<{ playerId: string; cause: string }>(
    "PlayerDied"
  ),
  ITEM_COLLECTED: new LocalEvent<{
    itemId: string;
    collectorId: string;
    value: number;
  }>("ItemCollected"),
  GAME_STATE_CHANGED: new LocalEvent<{ oldState: string; newState: string }>(
    "GameStateChanged"
  ),
} as const;
```

### LocalEvent Usage Pattern

```typescript
class EventProducer extends Component<typeof EventProducer> {
  start() {
    // Send events with proper payload
    this.sendLocalEvent(this.entity, GameEvents.PLAYER_DIED, {
      playerId: "player123",
      cause: "fall_damage",
    });
  }
}

class EventConsumer extends Component<typeof EventConsumer> {
  private eventSubscriptions: EventSubscription[] = [];

  start() {
    // Subscribe to events
    const subscription = this.connectLocalEvent(
      this.entity,
      GameEvents.PLAYER_DIED,
      this.handlePlayerDied.bind(this)
    );
    this.eventSubscriptions.push(subscription);
  }

  private handlePlayerDied(data: { playerId: string; cause: string }) {
    console.log(`Player ${data.playerId} died from ${data.cause}`);
  }

  dispose() {
    // Always clean up subscriptions
    this.eventSubscriptions.forEach((sub) => sub.disconnect());
  }
}
```

## NetworkEvent Best Practices

### Serializable Data Interfaces

```typescript
// ✅ CORRECT: Serializable interface with index signature
interface PlayerUpdateData {
  playerId: string;
  position: { x: number; y: number; z: number };
  health: number;
  timestamp: number;
  [key: string]: any; // Required for NetworkEvent serialization
}

// ❌ WRONG: Missing index signature
interface BadPlayerData {
  playerId: string;
  health: number;
  // Missing [key: string]: any;
}
```

### NetworkEvent Implementation

```typescript
// Define network events with proper typing
export const NetworkEvents = {
  PLAYER_UPDATE: new NetworkEvent<PlayerUpdateData>("PlayerUpdate"),
  GAME_ACTION: new NetworkEvent<GameActionData>("GameAction"),
} as const;

class NetworkedComponent extends Component<typeof NetworkedComponent> {
  start() {
    // Listen for network events
    this.connectNetworkEvent(
      this.entity,
      NetworkEvents.PLAYER_UPDATE,
      this.handlePlayerUpdate.bind(this)
    );
  }

  private handlePlayerUpdate(data: PlayerUpdateData) {
    // Validate received data
    if (!this.isValidPlayerData(data)) {
      console.warn("Invalid player data received:", data);
      return;
    }

    this.updatePlayerState(data);
  }

  private isValidPlayerData(data: any): data is PlayerUpdateData {
    return (
      typeof data.playerId === "string" &&
      typeof data.health === "number" &&
      data.position &&
      typeof data.position.x === "number"
    );
  }

  private updatePlayerState(data: PlayerUpdateData) {
    // Update game state based on network data
  }

  private broadcastPlayerUpdate() {
    const updateData: PlayerUpdateData = {
      playerId: this.getPlayerId(),
      position: this.getSerializablePosition(),
      health: this.getCurrentHealth(),
      timestamp: Date.now(),
    };

    this.sendNetworkEvent(this.entity, NetworkEvents.PLAYER_UPDATE, updateData);
  }

  private getSerializablePosition() {
    const pos = this.entity.transform.position.get();
    return { x: pos.x, y: pos.y, z: pos.z };
  }
}
```

### NetworkEvent Optimization

```typescript
class OptimizedNetworking extends Component<typeof OptimizedNetworking> {
  private lastBroadcastTime = 0;
  private readonly BROADCAST_INTERVAL = 100; // ms
  private pendingUpdates: any[] = [];

  private shouldBroadcast(): boolean {
    const now = Date.now();
    return now - this.lastBroadcastTime >= this.BROADCAST_INTERVAL;
  }

  private queueUpdate(data: any) {
    this.pendingUpdates.push(data);

    if (this.shouldBroadcast()) {
      this.flushUpdates();
    }
  }

  private flushUpdates() {
    if (this.pendingUpdates.length === 0) return;

    // Batch multiple updates into one network event
    const batchedUpdate = {
      updates: this.pendingUpdates,
      timestamp: Date.now(),
    };

    this.sendNetworkEvent(
      this.entity,
      NetworkEvents.BATCH_UPDATE,
      batchedUpdate
    );

    this.pendingUpdates.length = 0;
    this.lastBroadcastTime = Date.now();
  }
}
```

## CodeBlockEvent Best Practices

### CodeBlockEvent Definition

```typescript
// Define with proper PropTypes
const CodeBlockEvents = {
  TRIGGER_ACTIVATED: new CodeBlockEvent<[player: string, triggerId: number]>(
    "TriggerActivated",
    [PropTypes.String, PropTypes.Number]
  ),

  SCORE_UPDATED: new CodeBlockEvent<
    [playerId: string, newScore: number, oldScore: number]
  >("ScoreUpdated", [PropTypes.String, PropTypes.Number, PropTypes.Number]),
} as const;
```

### CodeBlockEvent Usage

```typescript
class CodeBlockIntegration extends Component<typeof CodeBlockIntegration> {
  start() {
    // Connect to CodeBlock events
    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.TRIGGER_ACTIVATED,
      this.handleTriggerActivated.bind(this)
    );
  }

  private handleTriggerActivated(player: string, triggerId: number) {
    console.log(`Player ${player} activated trigger ${triggerId}`);

    // Send response back to CodeBlocks
    this.sendCodeBlockEvent(
      this.entity,
      CodeBlockEvents.SCORE_UPDATED,
      player,
      100, // new score
      50 // old score
    );
  }
}
```

## Event Subscription Management

### Subscription Lifecycle Management

```typescript
class EventManager extends Component<typeof EventManager> {
  private subscriptions = new Map<string, EventSubscription>();

  start() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Store subscriptions with descriptive keys
    this.addSubscription(
      "playerDied",
      this.connectLocalEvent(
        this.entity,
        GameEvents.PLAYER_DIED,
        this.handlePlayerDied.bind(this)
      )
    );

    this.addSubscription(
      "networkUpdate",
      this.connectNetworkEvent(
        this.entity,
        NetworkEvents.PLAYER_UPDATE,
        this.handleNetworkUpdate.bind(this)
      )
    );
  }

  private addSubscription(key: string, subscription: EventSubscription) {
    // Clean up existing subscription if it exists
    const existing = this.subscriptions.get(key);
    if (existing) {
      existing.disconnect();
    }

    this.subscriptions.set(key, subscription);
  }

  private removeSubscription(key: string) {
    const subscription = this.subscriptions.get(key);
    if (subscription) {
      subscription.disconnect();
      this.subscriptions.delete(key);
    }
  }

  dispose() {
    // Clean up all subscriptions
    this.subscriptions.forEach((sub) => sub.disconnect());
    this.subscriptions.clear();
  }
}
```

## Performance Optimization

### Event Throttling and Debouncing

```typescript
class PerformantEvents extends Component<typeof PerformantEvents> {
  private lastEventTime = 0;
  private eventQueue: any[] = [];
  private flushTimer?: any;

  // Throttle: Limit event frequency
  private throttledSend(data: any, intervalMs: number = 100) {
    const now = Date.now();
    if (now - this.lastEventTime >= intervalMs) {
      this.sendEvent(data);
      this.lastEventTime = now;
    }
  }

  // Debounce: Wait for pause in events
  private debouncedSend(data: any, delayMs: number = 200) {
    this.eventQueue.push(data);

    if (this.flushTimer) {
      this.async.clearTimeout(this.flushTimer);
    }

    this.flushTimer = this.async.setTimeout(() => {
      this.sendBatchedEvents();
    }, delayMs);
  }

  private sendBatchedEvents() {
    if (this.eventQueue.length > 0) {
      this.sendEvent({ batch: this.eventQueue });
      this.eventQueue.length = 0;
    }
  }

  private sendEvent(data: any) {
    this.sendNetworkEvent(this.entity, NetworkEvents.BATCHED_UPDATE, data);
  }
}
```

### Conditional Event Handling

```typescript
class ConditionalEvents extends Component<typeof ConditionalEvents> {
  private isEventHandlingEnabled = true;
  private eventFilters = new Set<string>();

  start() {
    this.connectLocalEvent(
      this.entity,
      GameEvents.PLAYER_DIED,
      this.conditionalHandler.bind(this)
    );
  }

  private conditionalHandler(data: any) {
    // Check if event handling is enabled
    if (!this.isEventHandlingEnabled) return;

    // Check event filters
    if (this.eventFilters.has(data.playerId)) return;

    // Process the event
    this.handlePlayerDied(data);
  }

  public enableEventHandling() {
    this.isEventHandlingEnabled = true;
  }

  public disableEventHandling() {
    this.isEventHandlingEnabled = false;
  }

  public addEventFilter(playerId: string) {
    this.eventFilters.add(playerId);
  }

  public removeEventFilter(playerId: string) {
    this.eventFilters.delete(playerId);
  }
}
```

## Common Patterns

### Event Bus Pattern

```typescript
class EventBus extends Component<typeof EventBus> {
  private static instance: EventBus;
  private eventHandlers = new Map<string, Function[]>();

  static getInstance(): EventBus {
    return EventBus.instance;
  }

  start() {
    EventBus.instance = this;
  }

  public subscribe(eventName: string, handler: Function) {
    if (!this.eventHandlers.has(eventName)) {
      this.eventHandlers.set(eventName, []);
    }
    this.eventHandlers.get(eventName)!.push(handler);
  }

  public unsubscribe(eventName: string, handler: Function) {
    const handlers = this.eventHandlers.get(eventName);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  public emit(eventName: string, data?: any) {
    const handlers = this.eventHandlers.get(eventName);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${eventName}:`, error);
        }
      });
    }
  }
}
```

### Request-Response Pattern

```typescript
interface RequestData {
  requestId: string;
  action: string;
  parameters: any;
}

interface ResponseData {
  requestId: string;
  success: boolean;
  result?: any;
  error?: string;
}

class RequestResponseHandler extends Component<typeof RequestResponseHandler> {
  private pendingRequests = new Map<string, (response: ResponseData) => void>();

  start() {
    // Listen for responses
    this.connectNetworkEvent(
      this.entity,
      NetworkEvents.RESPONSE,
      this.handleResponse.bind(this)
    );
  }

  public async sendRequest(action: string, parameters: any): Promise<any> {
    const requestId = this.generateRequestId();

    return new Promise((resolve, reject) => {
      // Store the promise resolver
      this.pendingRequests.set(requestId, (response: ResponseData) => {
        if (response.success) {
          resolve(response.result);
        } else {
          reject(new Error(response.error || "Request failed"));
        }
      });

      // Send the request
      const requestData: RequestData = {
        requestId,
        action,
        parameters,
      };

      this.sendNetworkEvent(this.entity, NetworkEvents.REQUEST, requestData);

      // Set timeout for request
      this.async.setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error("Request timeout"));
        }
      }, 5000);
    });
  }

  private handleResponse(response: ResponseData) {
    const resolver = this.pendingRequests.get(response.requestId);
    if (resolver) {
      resolver(response);
      this.pendingRequests.delete(response.requestId);
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

## Summary

1. **Choose the right event type** for your use case
2. **Always clean up subscriptions** in dispose()
3. **Use serializable interfaces** for NetworkEvents
4. **Implement proper error handling** for event processing
5. **Throttle/debounce high-frequency events** for performance
6. **Validate incoming event data** before processing
7. **Centralize event definitions** for better organization
8. **Use meaningful event names** and consistent payload structures
