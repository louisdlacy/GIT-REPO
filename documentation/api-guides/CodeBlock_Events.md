# CodeBlock Events

CodeBlock events enable your TypeScript code to send and receive events from CodeBlock or TypeScript scripts. These events communicate asynchronously with all players in the world by default. This ensures the server manages world behavior consistently for all users.

CodeBlock events restrict you to calling CodeBlock-specific functions, such as communicating between components with objects owned by different players or listening for events sent to specific players. This means that CodeBlock events can only process the basic data types available in CodeBlock scripts, such as numbers, strings, and entities.

## Creating a custom CodeBlock event
To create a custom CodeBlock event:
1. Specify the parameter names and types that are sent by the event.
2. Specify an event name.
3. List the PropTypes for each parameter.

Example:
```ts
sendEvent = new CodeBlockEvent<[player_name: string, player_id: number]>('testSendEvent', [PropTypes.String, PropTypes.Number]);
```

## Sending CodeBlock events
Use `Component.sendCodeBlockEvent`.

## Subscribing to CodeBlock events
Use `Component.connectCodeBlockEvent`.

---

## Example - Sending to CodeBlocks
```ts
import { Component, CodeBlockEvent, Entity, PropTypes } from 'horizon/core';

class CodeBlockEvent_CB extends Component<typeof CodeBlockEvent_CB> {
  static propsDefinition= {
    target: {type: PropTypes.Entity},
  };

  sendEvent = new CodeBlockEvent<[player_name: String, player_id: Number]>('sendEvent', [PropTypes.String, PropTypes.Number]);
  receiveEvent = new CodeBlockEvent<[score: Number]>('receiveEvent', [PropTypes.Number]);

  start() {
    // Register for CodeBlock events.
    this.connectCodeBlockEvent(
      this.entity,
      this.receiveEvent,
      (score: Number) => {
        console.log(score);
      });

    // Delay to ensure listeners are ready.
    this.async.setTimeout(() => {
      this.sendCodeBlockEvent(
        this.props.target!,
        this.sendEvent,
        "Player One",
        123
      );
    }, 500);
  }
}
Component.register(CodeBlockEvent_CB);
```

---

## Example - Sending to TypeScript
```ts
import { Component, CodeBlockEvent, Entity, PropTypes } from 'horizon/core';

class CodeBlockEvent_TS extends Component {
  sendEvent = new CodeBlockEvent<[player_name: String, player_id: Number]>('sendEvent', [PropTypes.String, PropTypes.Number]);

  start () {
    // Register to receive CodeBlock event.
    this.connectCodeBlockEvent(
      this.entity,
      this.sendEvent,
      (player_name: String, score: Number) => {
        console.log(player_name + ": " + score);
      });

    // Delay to ensure listeners are ready.
    this.async.setTimeout(() => {
      this.sendCodeBlockEvent(
        this.entity,
        this.sendEvent,
        "Player One",
        123
      );
    }, 500);
  }
}
Component.register(CodeBlockEvent_TS);
```

---

## Example - Sending an event to a Player
```ts
import * as hz from 'horizon/core';

class CodeBlockEvent_Player extends hz.Component {
  sendEvent = new hz.CodeBlockEvent<[msg: string]>('sendEvent', [hz.PropTypes.String]);
  playerList: hz.Player[] = [];

  start() {
    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerEnterWorld,
      (player: hz.Player) => {
        this.playerList.push(player);
        this.connectCodeBlockEvent(
          player,
          this.sendEvent,
          (msg: string) => {
            console.log(msg);
          });
      }
    );

    this.async.setInterval(() => {
      this.playerList.forEach(player => {
        this.sendCodeBlockEvent(
          player,
          this.sendEvent,
          "Hello " + player.name.get() + "!"
        );
      });
    }, 5000);
  }
}
```

---

## Built-in CodeBlock Events
Common built-in events include:
- **OnPlayerEnterTrigger**: player enters trigger area.
- **OnPlayerExitTrigger**: player exits trigger area.
- **OnEntityEnterTrigger**: entity enters trigger area.
- **OnEntityExitTrigger**: entity exits trigger area.
- **OnPlayerCollision**: player collision occurs.
- **OnEntityCollision**: entity collision occurs.
- **OnPlayerEnterWorld** / **OnPlayerExitWorld**.
- **OnGrabStart** / **OnGrabEnd** / **OnMultiGrabStart** / **OnMultiGrabEnd**.
- **OnIndexTriggerDown/Up**, **OnButton1Down/Up**, **OnButton2Down/Up**.
- **OnAttachStart/End**.
- **OnProjectileLaunched**, **OnProjectileHitPlayer**, **OnProjectileHitEntity**.
- **OnItemPurchaseSucceeded/Failed**.
- **OnPlayerConsumeSucceeded/Failed**.
- **OnPlayerSpawnedItem**.
- **OnAchievementComplete**.
- **OnAssetSpawned/Despawned/SpawnFailed**.
- **OnAudioCompleted**.

## Example - Built-in Events
```ts
import { Component, CodeBlockEvents, Player } from 'horizon/core';

class BuiltInEventExample extends Component {
  start() {
    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnIndexTriggerDown,
      (player: Player) => {
        // Action on Index Trigger down.
      }
    );
    
    this.connectCodeBlockEvent(
      this.entity,
      CodeBlockEvents.OnGrabEnd,
      (player: Player) => {
        // Action on Grab End.
      }
    );
  }
}
Component.register(BuiltInEventExample);
```
