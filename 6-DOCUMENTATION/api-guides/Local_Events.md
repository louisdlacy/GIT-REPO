# Local Events

Local events enable your TypeScript code to send and receive events from objects running TypeScript logic. These events are limited to scripts running on the same device, but can accept basic inputs, such as numbers, strings, entities, and custom class definitions. This provides greater control over the information these scripts can process.

## Differences from Code Block Events
- Local events are synchronous and block code execution until the event callback is complete.
- Local events are tracked by the instantiated object rather than the names or payloads of the event. We recommend reusing the same event object between scripts.
- Local events are only received by listeners registered on the same client.

## Creating a Local Event
To create a custom local event:
1. Specify the parameters and types that are sent by the event.
2. Specify an event name.

Example:
```ts
sendEvent = new LocalEvent<{message: String}>('sendEvent');
```

## Sending Local Events
Use `Component.sendLocalEvent` function.

**Parameters:**
- **Target Entity**: The object that receives this event.
- **Event**: The LocalEvent to send.
- **Data**: The event parameters to send.

## Subscribing to Local Events
Use `Component.connectLocalEvent` function.

**Parameters:**
- **Target Entity**: The object to subscribe to.
- **Event**: The LocalEvent to handle.
- **Callback**: Function to call when event is received.

**Returns:**  
- **EventSubscription**: Handler to control subscription.

## Example
```ts
import {Component, LocalEvent} from 'horizon/core';

class MyEventExample extends Component {
  testEvent = new LocalEvent<{message: String}>('testEvent');

  start () {
    // Register to receive Local Event.
    this.connectLocalEvent (
      this.entity,
      this.testEvent,
      (data: {message: String}) => {
        console.log(data.message);
      });

    // Delay by 500 milliseconds to ensure listeners are ready.
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

*Note: Code execution in Meta Horizon Worlds is non-deterministic. The register code may not complete before the send event executes. For a robust solution, use Promises.*

## Event Behavior: Local vs. Server Execution
- By default, all scripts run on the **server**.  
- If script runs **locally**, local/broadcast events are only received on the same client.  
- If a local/broadcast event is sent from a server script, only server scripts receive it.  
- If a local/broadcast event is sent from a client script, only scripts on that client receive it.  

If your scripts need to communicate between local and server, use **CodeBlock events** instead.
