import { arrow_Data } from "Arrow_Data";
import { Component } from "horizon/core";


class Arrow_Entity extends Component<typeof Arrow_Entity> {
  static propsDefinition = {};

  preStart() {
    arrow_Data.arrows.push(this.entity);
  }

  start() {

  }
}
Component.register(Arrow_Entity);