# TypeScript Script Lifecycle

This document describes the lifecycle of a TypeScript script and its components in Meta Horizon Worlds. Understanding the order of these events may help in debugging or optimizing your scripts.

---

## On World Load
When a world is loaded in edit mode or visit mode:
- The world snapshot is loaded, which includes script data.
- In edit mode, TypeScript scripts are transpiled if artifacts don’t exist or had prior errors.
- In visit mode, pre-existing transpilation artifacts are expected.
- All TypeScript scripts execute on all clients.
  - Top-level logic or logs are executed here.
- Script execution order is not guaranteed.
- Avoid circular dependencies in modules.
- In v2.0.0 API, rely on `preStart` (called before `start` and before networked events).
- World start event triggers `start()` for all components.

Local scripts initially run on the server but ownership can transfer later (e.g., grabbing, projectile use).

---

## TypeScript Component Lifecycle
Execution order of scripts is **non-deterministic**. Each valid script executes as soon as possible.

### Execution Order
1. **Module Execution**  
   The TypeScript module is executed and `Component.register` makes the component visible.
2. **initializeUI()**  
   (Custom UI only) Initializes custom UI components for display.
3. **preStart()**  
   Called before `start()` on each machine (v2.0.0+). Guarantees listeners are ready before `start()`.
4. **start()**  
   Executed after `preStart()`. Order not guaranteed.
5. **update loop**  
   No `update()` method exists. Use `World.Update()` or `World.PrePhysicsUpdate()` events.
   - `Update()`: after physics sim.  
   - `PrePhysicsUpdate()`: before physics sim, useful for moving platforms.  
6. **dispose()**  
   Called when:
   - Component destroyed
   - World stopped/reset
   - Ownership transferred
   - Entity despawned

### Ownership Transfer Events
- **transferOwnership**: Called before ownership is transferred, allows sending state to new owner.  
- **receiveOwnership**: Called when a component gains ownership from another client.  

### Timers
- `async.setTimeout` and `async.setInterval` trigger after given time (next frame).  
- `setInterval`: runs repeatedly.  
- `setTimeout`: runs once.  

---

## Ownership Transfer
Ownership determines which client is authority for entity state. Ownership changes occur:
- Grabbing an entity → transfers to player.  
- Attaching an entity → transfers to player.  
- Collision with another owned physical object.  

**Example Sequence (transfer from player1 → player2):**
1. `this.owner.set(player2)` called.  
2. `transferOwnership` executes.  
3. `dispose()` called on old owner.  
4. On new owner: `preStart()` (v2.0.0+), `start()`, then `receiveOwnership()`.  

---

## Timers

### Simple Timer Example
```ts
import {Component, LocalEvent} from 'horizon/core';

class MyEventExample extends Component {
  testEvent = new LocalEvent<{message: String}>('testEvent');

  start () {
    this.connectLocalEvent(
      this.entity,
      this.testEvent,
      (data: {message: String}) => {
        console.log(data.message);
      });

    this.async.setTimeout(() => {
      this.sendLocalEvent(
        this.entity,
        this.testEvent,
        {message: "My Local Event Test"}
      );
    }, 500);
  }
}
Component.register(MyEventExample);
```

### Timer Example Using a Promise
Retries listener registration up to 5 times with logging:

```ts
import {Component, LocalEvent, EventSubscription} from 'horizon/core';

class MyEventExample extends Component {
  testEvent = new LocalEvent<{message: String}>('testEvent');
  private createEventListenerPromise: Promise<boolean> | undefined = undefined;

  start () {
    this.createEventListenerPromise = new Promise((resolve, reject) => {
      let updates = 0;
      const intervalTime = 500;
      const maxUpdates = 5;

      const intervalId = this.async.setInterval(() => {
        let myEventSubScription: EventSubscription = this.connectLocalEvent(
          this.entity,
          this.testEvent,
          (data: {message: String}) => {
            console.log(data.message);
          });

        if (myEventSubScription) {
          this.async.clearInterval(intervalId);
          resolve(true);
        } else {
          updates++;
          if (updates > maxUpdates) {
            console.error(`Failed to create listener for testEvent in ${updates} tries`);
            this.async.clearInterval(intervalId);
            reject();
          }
        }
      }, intervalTime);
    });

    this.createEventListenerPromise.then(() => {
      console.log('testEvent: Event listener created');
      this.sendLocalEvent(this.entity, this.testEvent, {message: "My Local Event Test"});
    }).catch(() => {
      console.error('testEvent: Failed to create event listener');
    });
  }
}
Component.register(MyEventExample);
```

### Promise Example 2
Check if a UAB has loaded into runtime memory within 30s:

```ts
this.uabPaddleLoadPromise = new Promise((resolve, reject) => {
  let updates = 0;
  const intervalTime = 1000;
  const totalTimeInSeconds = 30 * intervalTime;
  const maxUpdates = totalTimeInSeconds / intervalTime;

  const intervalId = this.async.setInterval(() => {
    if (this.uabPaddle.as(AssetBundleGizmo).isLoaded() == true) {
      this.async.clearInterval(intervalId);
      resolve(true);
    } else {
      updates++;
      if (updates > maxUpdates) {
        console.error(`Failed to load UAB model in ${totalTimeInSeconds}s`);
        this.async.clearInterval(intervalId);
        reject();
      }
    }
  }, intervalTime);
});

this.uabPaddleLoadPromise.then(() => {
  console.log(`Loaded UAB model: ${this.uabPaddle.name.get()} for player: ${this.entity.owner.get().name.get()}`);
  this.isUabLoaded = true;
  this.uabPaddle.visible.set(true);
  this.sendNetworkBroadcastEvent(Events.growPaddleOrBall, {
    meshContainer: this.meshContainer,
    UABModel: this.uabPaddle,
    duration: this.paddleAnimDurationSeconds,
    delay: 0,
    easeType: this.paddleAnimEaseType,
    targetScale: hz.Vec3.one,
  });
}).catch(() => {
  this.isUabLoaded = false;
  console.error(`Failed to load UAB model: ${this.uabPaddle.name.get()} for player: ${this.entity.owner.get().name.get()}`);
});
```

