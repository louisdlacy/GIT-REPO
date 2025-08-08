import { arrow_Data } from "Arrow_Data";
import { events } from "Events_Data";
import { Component, Entity } from "horizon/core";


class ArrowManager_Entity extends Component<typeof ArrowManager_Entity> {
  static propsDefinition = {};

  preStart() {
    this.connectNetworkEvent(this.entity, events.networked.requestArrow, (payload: { requester: Entity }) => { this.arrowRequested(payload.requester); });
  }

  start() {

  }

  arrowRequested(requester: Entity) {
    const index = (arrow_Data.lastIndex + 1) % arrow_Data.arrows.length;
    arrow_Data.lastIndex = index;
    
    const arrow = arrow_Data.arrows[index];

    this.sendNetworkEvent(requester, events.networked.yourArrowIs, { arrow: arrow });
  }
}
Component.register(ArrowManager_Entity);