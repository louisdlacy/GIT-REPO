import { BaseComponent } from 'BaseComponent';
import { Events } from 'Events';
import * as hz from 'horizon/core';

/**
 * This class is used to add a base-level of contextual information to the given NPC upon start.
 */
class InitialContext extends BaseComponent<typeof InitialContext> {
  static propsDefinition = {
    itemDescription: { type: hz.PropTypes.String }
  };

  start() {
    this.sendLocalBroadcastEvent(
      Events.onGloballyPerceivedEvent,
      { description: this.props.itemDescription });
  }
}
hz.Component.register(InitialContext);
