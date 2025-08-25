# Broadcast Events

A broadcast event is a type of local event that notifies all objects subscribed to the same event without directly referencing them. This enables your code to be less dependent on knowing which objects should receive the event, reducing code complexity. Like local events, broadcast events are performed synchronously, but the execution order is random and can only be received by listeners registered on the same client.

## Event Behavior: Local vs. Server Execution
- By default, all scripts run on the server when attached to an object in the world.  
- If a script runs locally, local and broadcast events are only received by scripts running on the same client.  
- If a local/broadcast event is sent from a **server script**, only server scripts receive it.  
- If a local/broadcast event is sent from a **client script**, only scripts owned by that client receive it.  

If your scripts need communication between local and server, use **CodeBlock events** instead.

> **Warning**: Maintaining broadcast event subscriptions can slow event messaging as more subscriptions are added. If objects no longer need to listen for broadcast events, unsubscribe to improve performance.

## Creating a Broadcast Event
Local events are used to create custom broadcast events, following the same process as local events:

```ts
broadcastEvent = new MyLocalEvent<{message: String}>('broadcastEvent');
```

## Sending Broadcast Events
Use `this.sendBroadcastEvent`.

**Parameters:**
- **Event**: The LocalEvent to send.  
- **Data**: Event parameters.  

## Subscribing to Broadcast Events
Use `this.connectBroadcastEvent`.

**Parameters:**
- **Event**: The LocalEvent to handle.  
- **Callback**: Function called when event is received.  

**Returns:**  
- **EventSubscription**: Handler to control subscription.  

## Example
```ts
import { Component, LocalEvent } from 'horizon/core';

class BroadcastEventExample extends Component {
  testEvent = new LocalEvent<{message: String}>('testEvent');

  start() {
    // Register to receive the Broadcast event.
    this.connectLocalBroadcastEvent(
      this.testEvent,
      (data: {message: String}) => {
        console.log(data.message);
      }
    );

    // Delay by 500 milliseconds to ensure listeners are ready.
    this.async.setTimeout(() => {
      this.sendLocalBroadcastEvent(
        this.testEvent,
        {message: "Broadcast Test"}
      );
    }, 500);
  }
}

Component.register(BroadcastEventExample);
```
