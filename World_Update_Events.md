# World Update Events

World events are broadcast events that notify your scripts between each rendered frame on the player’s headset. This returns the delta time, which is the duration in milliseconds since the last update. Using Delta Time, your scripts can provide smooth motion for animation and physics. 

To enable your scripts to run logic during the update loop, subscribe to the `World.onUpdate` or `World.onPrePhysicsUpdate` event to handle running your code at different stages of the update loop.

## Subscribe to World Update Events
To subscribe to World Update events, use the `this.connectLocalBroadcastEvent` function.

**Parameters:**
- **Event**: The LocalEvent to handle (from the World class).
- **Callback**: The function to call when the event is received.

**Returns:**  
- **EventSubscription**: A handler to control the event subscription.

## Example
```ts
import { Component, World } from 'horizon/core';

class WorldUpdateEventExample extends Component {
  start() {
    this.connectLocalBroadcastEvent(
      World.onUpdate,
      (data: {deltaTime: number}) => {
        // Perform an action during the Update step.
      }
    );
   
    this.connectLocalBroadcastEvent(
      World.onPrePhysicsUpdate, 
      (data: {deltaTime: number}) => {
        // Perform an action during the Pre-Physics Update step.
      }
    );
  }
}

Component.register(WorldUpdateEventExample);
```
