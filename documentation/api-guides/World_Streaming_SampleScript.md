# Example Script: SublevelEntity API

```ts
import { Component, PropTypes, Entity, CodeBlockEvents } from 'horizon/core';
import { SublevelEntity } from 'horizon/world_streaming';

class TestSublevelAPI extends Component {
  static propsDefinition = {
    sublevel: {type: PropTypes.Entity},
    state: {type: 'number', default: 0}, // States: Unloaded, Loaded, Active, Pause, Hide
  };

  start() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, async (player) => {
      var sublevel = this.props.sublevel?.as(SublevelEntity);
      var state = this.props.state;

      if (sublevel == null || sublevel == undefined) {
        console.log("The sublevel entity was either null or invalid.");
        return;
      }

      console.log("Sublevel Trigger entered. Setting state " + state + ". Current: " + sublevel.currentState.get() + ", Target: " + sublevel.targetState.get());
      switch(state) {
        case 0: sublevel.unload().then(()=>console.log("Unloaded!")); break;
        case 1: sublevel.load().then(()=>console.log("Loaded!")); break;
        case 2: sublevel.activate().then(()=>console.log("Activated!")); break;
        case 3: sublevel.pause().then(()=>console.log("Paused!")); break;
        case 4: sublevel.hide().then(()=>console.log("Hidden!")); break;
        default: console.log("Invalid state: " + state); break;
      }
    });
  }
}
Component.register(TestSublevelAPI);
```
