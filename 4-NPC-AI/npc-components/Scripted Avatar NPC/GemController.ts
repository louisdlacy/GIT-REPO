/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */


/**
  This script contains the events and methods for handling interactions with the gems, including moving them to their specified locations on the map.
  
 */

import * as hz from 'horizon/core';
import { moveGemToCourse, collectGem } from 'GameManager';

export class GemController extends hz.Component<typeof GemController> {
    static propsDefinition = {
    coursePositionRef: {type: hz.PropTypes.Entity},
  };


  private hiddenLocation = new hz.Vec3(0, -100, 0);


  start() {
    this.entity.position.set(this.hiddenLocation);

    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerCollision,
      (collidedWith: hz.Player) => {
        if(!collidedWith.name.get().includes("Merchant")) this.handleCollision(collidedWith);
      }
    )

  this.connectLocalEvent(
    this.entity,
    moveGemToCourse,
    () => {
      let gem:any = this.props.coursePositionRef;
      let refObjPos:hz.Vec3 = gem.position.get();
      this.onMoveGemToCourseEvent(refObjPos);
    });
  }

  private handleCollision(collidedWith: hz.Player): void {
    this.entity.position.set(this.hiddenLocation);
    this.entity.visible.set(false);
    // console.log("GemController.handleCollision " + this.entity.name.get() + " / " + collidedWith.name.get());
    this.sendLocalBroadcastEvent(
      collectGem,
      {gem: this.entity, collector: collidedWith},
    );
  }

  private onMoveGemToCourseEvent(gemPos: hz.Vec3): void {
    this.entity.position.set(gemPos);
    this.entity.visible.set(true);
  }

}
hz.Component.register(GemController);