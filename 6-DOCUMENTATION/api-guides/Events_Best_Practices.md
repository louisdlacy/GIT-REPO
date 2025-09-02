# Events Best Practices

## Unsubscribing from an Event
Anytime you register a listener for a broadcast, CodeBlock, or local event, an **EventSubscription** object is returned. You can use this object to unsubscribe from these events, preventing unnecessary calls. This is especially useful for broadcast events that are inactive or unnecessary.

```ts
this.eventSubscription = this.connectBroadcastEvent(
  World.onUpdate,
  (data: {deltaTime: number}) => {
    // Do an action during the Update Loop.
  }
);

// Cancel subscription logic.
if(this.eventSubscription !== null) {
  this.eventSubscription.disconnect();
  this.eventSubscription = null;
}
```

---

## Delaying Events with async.setTimeout()
When your world instance is initialized, each object’s script runs its `start()` method. If you have events sent instantly when this method is called, they may go unnoticed as other scripts may not have had time to register event listeners.

If you need to send events as soon as the world is initialized, wrap your send event logic within the `this.async.setTimeout()` function, ensuring that your scripts have enough time to initialize all listeners.

---

## Consolidating Common Events
Recreating the same events for different files is an **anti-pattern**. Instead, create a single module with all events (CodeBlocks, local, and broadcast) to reuse.

Example module:

```ts
// Module Name: 'EventContainer'
// This script contains all Events our world's code might run.
//
// import EventContainer from './EventContainer'

import { LocalEvent, CodeBlockEvent, Color, Entity, Player, PropTypes} from 'horizon/core';

const EventContainer = {
  testLocalEvent: new LocalEvent<{
    player: Player,
    entity: Entity,
  }>('testLocalEvent'),

  testBroadcastEvent: new LocalEvent<{
    color: Color,
  }>('testBroadcastEvent'),

  testCodeBlockEvent: new CodeBlockEvent<[
    caller: Entity,
    text: string,
    duration: number
    ]>('testCodeBlockEvent', [
    PropTypes.Entity,
    PropTypes.String,
    PropTypes.Number
  ]),
}

export default EventContainer;
```

---

## CodeBlock Interoperability
TypeScript allows solving technical problems that are difficult in CodeBlocks. Migrating fully can take time, but you can leverage TypeScript functionality immediately by connecting with existing CodeBlock systems through **CodeBlock events**.

Benefits:
- Implement complex calculations in TypeScript to simplify CodeBlock logic.  
- Incorporate features only available in TypeScript APIs.  
- Reuse modules to reduce redundancy.  
