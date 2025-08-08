import * as hz from 'horizon/core';

class ResetWorldTrigger extends hz.Component<typeof ResetWorldTrigger> {

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (enteredBy: hz.Player) => {

      console.log("reset: ");

      this.world.reset();

    });
  }
}
hz.Component.register(ResetWorldTrigger);
