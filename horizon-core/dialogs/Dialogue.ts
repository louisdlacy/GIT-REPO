import { CodeBlockEvents, Component, Entity, Player, PropTypes } from 'horizon/core';
import { RemovePromptEvent, AddPromptEvent } from './DialogueEvents';

class PromptTrigger extends Component<typeof PromptTrigger>{
  static propsDefinition = {};

  preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, this.onPlayerEnterTrigger);

    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerExitTrigger, this.onPlayerExitTrigger);
  }

  start() {

  }

  onPlayerEnterTrigger = (player: Player) => {
    //console.log("Player entered trigger", player);
    this.sendNetworkEvent(player, AddPromptEvent, { target: this.entity })
  }

  onPlayerExitTrigger = (player: Player) => {
    //console.log("Player exited trigger", player);
    this.sendNetworkEvent(player, RemovePromptEvent, {})
  }
}
Component.register(PromptTrigger);
