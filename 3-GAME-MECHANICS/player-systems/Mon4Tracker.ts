// Copyright (c) Dave Mills (uRocketLife). Released under the MIT License.

import { Component, PropTypes, CodeBlockEvents, Player, World, Vec3 } from "horizon/core";
import { sysEvents } from "sysEvents";
import { assertAllNullablePropsSet } from "sysHelper";
import { UI_SpriteAnimator } from "UI_SpriteAnimator";

class Mon4Tracker extends Component<typeof Mon4Tracker> {
 static propsDefinition = {
  enabled: { type: PropTypes.Boolean, default: true },
    spriteAnimator: { type: PropTypes.Entity },
    trigger: { type: PropTypes.Entity },
 
  };

  preStart() {
    if (!this.props.enabled) return;
    assertAllNullablePropsSet(this, this.entity.name.get());

    this.connectCodeBlockEvent(
      this.props.trigger!,
      CodeBlockEvents.OnPlayerEnterTrigger,
      (player: Player) => {
        console.log("Pig was eaten");
      }
    );

    this.connectNetworkEvent(this.entity, sysEvents.damageEvent, (data) => {
      this.sendNetworkEvent(this.props.spriteAnimator!, sysEvents.damageEvent, {
        damage: 10,
        source: this.entity,
      });
    });

    this.updateCount = this.updateCount = Math.random() * 10;
    this.connectLocalBroadcastEvent(World.onUpdate, this.update.bind(this));
  }

  start() {
    if (!this.props.enabled) return;
  }

  private prevEntityPos: Vec3 = new Vec3(0, -10, 0);
    private isPlusXFacing: boolean = true;
  updateCount: number = 0;

  update() {
    // Assuming World.onUpdate runs at 60 updates per second
    this.updateCount += 1;
    if (this.updateCount < 10) return; // 60 / 10 = 6 updates per second
    this.updateCount = 0;

    const pos = this.entity.position.get();
    const curEntityPos = new Vec3(Math.round(pos.x), Math.round(pos.y), Math.round(pos.z));

    if (curEntityPos.equals(this.prevEntityPos)) return;

        const buffer = .4;
    //determine if the current x position is greater than the previous one
    if (this.isPlusXFacing && curEntityPos.x < (this.prevEntityPos?.x - buffer)) {
      this.isPlusXFacing = false;
    } else if (!this.isPlusXFacing && curEntityPos.x > (this.prevEntityPos?.x + buffer)) {
      this.isPlusXFacing = true;
    }

    this.props.spriteAnimator!.getComponents(UI_SpriteAnimator)[0].moveSprite(curEntityPos, false, this.isPlusXFacing);
    this.prevEntityPos = curEntityPos;
  }
}
Component.register(Mon4Tracker);