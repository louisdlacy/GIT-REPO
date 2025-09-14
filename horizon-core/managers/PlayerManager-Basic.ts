// Meant to be used in conjunction with an Asset Pool Gizmo
// This is a basic player manager component that can be used to handle events sent to the player.

import * as hz from 'horizon/core';

// Define the network events that this player manager will handle
export const PMEvents = {
  exampleEvent: new hz.NetworkEvent<{}>('exampleEvent')
}

class PlayerManager_Basic extends hz.Component<typeof PlayerManager_Basic> {
  static propsDefinition = {};

  // A private variable to hold the owner of this player manager
  owner: hz.Player | undefined;

  start() {
    //set the owner of this entity
    this.owner = this.entity.owner.get();

    //confirm the owner is a player, exit if not
    if (this.owner === this.world.getServerPlayer()) {
      return;
    }

    //looks like we have a real player, lets connect to the network events
    console.log('PlayerManager_Basic: Player manager', this.entity.id, ' started for', this.owner.name.get());
    this.connectNetworkEvent(this.owner, PMEvents.exampleEvent, () => this.exampleEvent());
  }

  exampleEvent() {
    console.log('exampleEvent triggered on,', this.entity.id);
  }
}
hz.Component.register(PlayerManager_Basic);



/***********************************************************************************************
****************************You can have more than 1 script per file.***************************
******Below is just a test script for the trigger to prove the Player Manager script works******
***********************************************************************************************/


class testScript extends hz.Component<typeof testScript> {
  static propsDefinition = {};

  preStart(): void {
    // Connect to the trigger enter event and send the network event to the player
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
      this.sendNetworkEvent(player, PMEvents.exampleEvent, {});
    });
  }

  start() {

  }
}
hz.Component.register(testScript);