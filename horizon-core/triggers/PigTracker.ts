// Copyright (c) Dave Mills (uRocketLife). Released under the MIT License.

import { Component, PropTypes, CodeBlockEvents, Player, World, Vec3 } from "horizon/core";
import { sysEvents } from "sysEvents";
import { assertAllNullablePropsSet } from "sysHelper";
import { UI_SpriteAnimator } from "UI_SpriteAnimator";

export class PigTracker extends Component<typeof PigTracker> {
  static propsDefinition = {
    enabled: { type: PropTypes.Boolean, default: true },
    spriteAnimator: { type: PropTypes.Entity },
    trigger: { type: PropTypes.Entity },
    oscillationOn: { type: PropTypes.Boolean, default: true },
    offset: { type: PropTypes.Vec3, default: new Vec3(1, 0, 0) },
    duration: { type: PropTypes.Number, default: 1 },
  };

  preStart() {
    if (!this.props.enabled) return;
    assertAllNullablePropsSet(this, this.entity.name.get());

 
    this.connectCodeBlockEvent(
      this.props.trigger!,
      CodeBlockEvents.OnPlayerEnterTrigger,
      (player: Player) => {
        // console.log("Pig was eaten");
      }
    );

    this.updateCount = this.updateCount = Math.random() * 10;
    this.connectLocalBroadcastEvent(World.onUpdate, (data) => {
      this.update();
      if (this.props.oscillationOn) {
        this.oscillate(data);
      }
    });

    this.connectNetworkEvent(this.entity, sysEvents.damageEvent, (data) => {
      this.sendNetworkEvent(this.props.spriteAnimator!, sysEvents.damageEvent, {
        damage: 10,
        source: this.entity,
      });
      this.async.setTimeout(() => {
        this.respawnToNewPosition();
      }, 1000);
    });
  }

  start() {
    if (!this.props.enabled) return;

    //setup for oscillation
    this.initialPosition = this.entity.position.get();
    this.alphaInc = 1 / this.props.duration!;

    this.props.spriteAnimator?.getComponents(UI_SpriteAnimator)[0]?.tryPlaySprite("Pig", "Run");
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

    const buffer = 0.4;
    //determine if the current x position is greater than the previous one
    if (this.isPlusXFacing && curEntityPos.x < this.prevEntityPos?.x - buffer) {
      this.isPlusXFacing = false;
    } else if (!this.isPlusXFacing && curEntityPos.x > this.prevEntityPos?.x + buffer) {
      this.isPlusXFacing = true;
    }

    this.props.spriteAnimator?.getComponents(UI_SpriteAnimator)[0]?.moveSprite(curEntityPos, false, this.isPlusXFacing);
    this.prevEntityPos = curEntityPos;
  }

  initialPosition!: Vec3;
  alpha: number = 0;
  alphaInc!: number;
  direction: number = 1;

  oscillate(data: { deltaTime: number }) {
    this.alpha += this.alphaInc * this.direction * data.deltaTime;
    if (this.alpha >= 1) {
      this.alpha = 1;
      this.direction *= -1;
    } else if (this.alpha <= 0) {
      this.alpha = 0;
      this.direction *= -1;
    }
    const newPosition = Vec3.lerp(
      this.initialPosition,
      this.initialPosition.add(this.props.offset!),
      this.alpha
    );

    this.entity.position.set(newPosition);
  }

  public respawnToNewPosition() {
    const randPosX = Math.random() * 80 - 80 / 2;
    const randPosZ = Math.random() * 80 - 80 / 2;
    const newPos = new Vec3(randPosX, 0, randPosZ);

    this.entity.position.set(newPos);
    this.initialPosition = newPos;
  }
}
Component.register(PigTracker);
