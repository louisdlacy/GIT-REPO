// Copyright (c) Dave Mills (uRocketLife). Released under the MIT License.

import { AttachEvent } from "AutoAttachListByTag";
import {
  CodeBlockEvents,
  Component,
  Entity,
  NetworkEvent,
  Player,
  PropTypes,
  Vec3,
  World,
} from "horizon/core";
import { sysEvents } from "sysEvents";
import { assertAllNullablePropsSet } from "sysHelper";
import { addAmountEvent } from "UI_SimpleButtonEvent";
import { UI_SpriteAnimator } from "UI_SpriteAnimator";

//region event defined
export const CustomInputEvent = new NetworkEvent<{ action: string; pressed: boolean }>(
  "CustomInputEvent"
);

//region Player Tracker Class
/**
 * Tracks the local player's position/aiming state and drives a `UI_SpriteAnimator`
 * so a 2D sprite avatar appears to follow, idle, walk, and face the correct direction.
 * Also listens for lightweight input events (e.g., `attack`) and for trigger volumes
 * to apply damage to nearby NPCs.
 *
 */
export class PlayerTracker extends Component<typeof PlayerTracker> {
  static propsDefinition = {
    //reference to child sprite animator
    spriteAnimator: { type: PropTypes.Entity },
    //attack trigger
    trigger: { type: PropTypes.Entity },
    //who to send point updates to
    addPointRecipient: { type: PropTypes.Entity },
  };

  //reference to player in control
  player: Player | null = null;
  //a hard code reference to propsDefinition 'spriteAnimator'
  private spriteAnimator: UI_SpriteAnimator | null = null;
  //used to store entities in attack trigger
  entitiesInAttackTrigger: Entity[] = [];

  //region preStart()
  preStart() {
    assertAllNullablePropsSet(this, this.entity.name.get());

    this.spriteAnimator = this.props.spriteAnimator?.getComponents(UI_SpriteAnimator)[0] || null;

    this.updateCount = Math.random() * 10;
    this.connectLocalBroadcastEvent(World.onUpdate, this.update.bind(this));

    //region attachEvent
    //AttachEvent comes from PlayerAttacher
    this.connectNetworkEvent(this.entity, AttachEvent, (data) => {
      this.player = data.player;
      console.log(`Auto triggering camera change for player`);
      const panPositionOffset = new Vec3(0, 1, -6);
      const raceDelay = 1000;
      //Set new cam mode after a 'raceDelay' to prevent race-conditions missing the call
      this.async.setTimeout(() => {
        this.sendNetworkEvent(data.player, sysEvents.OnSetCameraModePan, {
          panSpeed: 1.0,
          positionOffset: panPositionOffset,
        });
        //not used atm but could be useful in future
        // this.sendNetworkEvent(data.player, sysEvents.OnSetCameraCollisionEnabled, {
        //   enabled: false,
        // });
      }, raceDelay);
    });

    //region enterTrigger event
    //tracks when npcs enter the trigger defined in propsDefinition
    this.connectCodeBlockEvent(
      this.props.trigger!,
      CodeBlockEvents.OnEntityEnterTrigger,
      (enteredBy) => {
        const tags = enteredBy.tags.get();
        if (tags.includes("npc")) {
          console.log("NPC entered trigger");
          //stores all entities in trigger
          this.entitiesInAttackTrigger.push(enteredBy);

          this.sendNetworkEvent(enteredBy, sysEvents.damageEvent, {
            damage: 10,
            source: this.entity,
          });
          if (this.props.addPointRecipient && this.player) {
            this.async.setTimeout(() => {
              this.sendNetworkEvent(this.props.addPointRecipient!, addAmountEvent, {
                player: this.player!,
                amount: 10,
              });
            }, 500);
          }
        }
      }
    );

    //region exitTrigger event
    //tracks when npcs exit the trigger defined in propsDefinition
    this.connectCodeBlockEvent(
      this.props.trigger!,
      CodeBlockEvents.OnEntityExitTrigger,
      (exitedBy) => {
        const tags = exitedBy.tags.get();
        if (tags.includes("npc")) {
          this.entitiesInAttackTrigger.splice(this.entitiesInAttackTrigger.indexOf(exitedBy), 1);
        }
      }
    );

    //region custom input event
    this.connectNetworkEvent(this.entity, CustomInputEvent, (data) => {
      console.log("Attack input received: " + data.pressed);
      switch (data.action) {
        case "attack":
          if (this.player) {
            this.spriteAnimator?.tryPlaySprite("Mon1", "Attack");
            this.entitiesInAttackTrigger.forEach((entity) => {
              this.sendNetworkEvent(entity, sysEvents.damageEvent, {
                damage: 10,
                source: this.entity,
              });
              if (this.props.addPointRecipient) {
                this.sendNetworkEvent(this.props.addPointRecipient!, addAmountEvent, {
                  player: this.player!,
                  amount: 10,
                });
              }
            });
          }
          break;
        case "aim":
          break;
      }
    });
  }

  //region start()
  start() {}

  private prevPlayerPos: Vec3 = new Vec3(0, 0, 0);
  private isPlusXFacing: boolean = true;

  //used to track and skip updates
  updateCount: number = 0;

  //region update()
  update() {
    if (!this.player) return;

    //used to skip most updates so CUI isn't updating as often
    // Assuming World.onUpdate runs at 60 updates per second
    this.updateCount += 1;
    if (this.updateCount < 12) return; // 60 / 12 = 5 updates per second
    this.updateCount = 0;

    //get player position
    const pos = this.player.position.get();
    const roundingFactor = 10;
    //round player position to nearest 0.1
    const curPlayerPos = new Vec3(
      Math.round(pos.x * roundingFactor) / roundingFactor,
      Math.round(pos.y * roundingFactor) / roundingFactor,
      Math.round(pos.z * roundingFactor) / roundingFactor
    );

    //determine is players position is equal to previous Position
    const isIdle = curPlayerPos.equals(this.prevPlayerPos);

    //buffer to prevent jittering when player is close to turning point
    const buffer = 0.4;
    //face the character left of right
    //determine if the current x position is greater than the previous one
    if (this.isPlusXFacing && curPlayerPos.x < this.prevPlayerPos?.x - buffer) {
      this.isPlusXFacing = false;
    } else if (!this.isPlusXFacing && curPlayerPos.x > this.prevPlayerPos?.x + buffer) {
      this.isPlusXFacing = true;
    }

    //send the updates to the sprite animator
    if (this.spriteAnimator) {
      //player is jumping
      // if (curPlayerPos.y > 2){
      //   this.spriteAnimator.tryPlaySprite("Mon1", "Jump");
      // }
      //move the sprite and if player jumps add to the z axis to simulate jump
      this.spriteAnimator.moveSprite(
        curPlayerPos.add(new Vec3(0, 0, curPlayerPos.y * 5)),
        isIdle,
        this.isPlusXFacing
      );
    } else {
      this.spriteAnimator = this.props.spriteAnimator?.getComponents(UI_SpriteAnimator)[0] || null;
    }

    //store the current player position as the last player position
    this.prevPlayerPos = curPlayerPos;
  }
}
Component.register(PlayerTracker);
