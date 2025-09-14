// Copyright (c) Dave Mills (uRocketLife). Released under the MIT License.

import {
  Vec3,
  Component,
  PropTypes,
  Entity,
  PhysicalEntity,
  PhysicsForceMode,
  Player,
  Color,
  World,
} from "horizon/core";
import { damageEvent } from "InteractionController";
import { assertAllNullablePropsSet, debugLog, getEntityListByTag } from "sysHelper";
import { objectPoolRequest, objectPoolResponse, returnObjectsToPool } from "sysObjectPoolUtil";
import { addAmountEvent, simpleButtonEvent } from "UI_SimpleButtonEvent";

/**
 * The Target script works in conjuction with interactionController to receive raycasts from player input.
 * Because this target is tagged "item" and "damageable", it will receive damageEvents from interactionController when the player taps on it.
 * The Target script also works with the ObjectPool script to spawn debris when hit.
 */
class Target extends Component<typeof Target> {
  static propsDefinition = {
    showDebugs: { type: PropTypes.Boolean, default: false },

    debrisToSpawn: { type: PropTypes.Asset },
    explosionForce: { type: PropTypes.Number, default: 2.5 },
    randRange: { type: PropTypes.Vec3, default: new Vec3(0, 1, 0) },

    oscillationEnabled: { type: PropTypes.Boolean, default: true },
    oscillationRange: { type: PropTypes.Vec3, default: new Vec3(0, 1, 0) },
    moveDuration: { type: PropTypes.Number, default: 1 },
  };

  initialPosition!: Vec3;
  alpha: number = 0;
  alphaInc!: number;
  direction: number = 1;
  oscillationEnabled: boolean = false;
  oscillationOffset!: Vec3;
  spawnPosition!: Vec3;

  uiProgressBarEntity!: Entity;

  //region preStart()
  preStart() {
    assertAllNullablePropsSet(this, this.entity.name.get());

    this.uiProgressBarEntity = this.world.getEntitiesWithTags(["UI_ProgressBar"])[0];
    if (!this.uiProgressBarEntity) {
      debugLog(this.props.showDebugs, "No UI_ProgressBar entity found with tag 'UI_ProgressBar'");
    }
  

    this.connectNetworkEvent(this.entity, simpleButtonEvent, (data) => {
      this.spawnDebris();
    });

    //RECEIVE POOL RESPONSE
    this.connectNetworkEvent(this.entity, objectPoolResponse, (data: { response: Entity[] }) => {
      this.objectPoolResponse(data);
    });

    this.connectNetworkEvent(this.entity, damageEvent, (data) => {
      this.sendNetworkEvent(this.uiProgressBarEntity, addAmountEvent, { player: data.player, amount: 12 });
      this.entity.visible.set(false);
      this.entity.collidable.set(false);
      this.oscillationEnabled = false;
      this.spawnDebris();
      this.async.setTimeout(() => {
        this.spawnTarget();
      }, 3000); //respawn after 3 seconds
    });

    this.connectLocalBroadcastEvent(World.onUpdate, this.oscillate.bind(this));
  }

  //region start()
  start() {
    this.initialPosition = this.entity.position.get();
    this.spawnTarget();
  }

  //region spawnDebris()
  spawnDebris() {
    debugLog(this.props.showDebugs, `ObjectPool request event triggered from ${this.entity.name.get()}`);

    //SEND POOL REQUEST
    this.sendNetworkBroadcastEvent(objectPoolRequest, {
      requesterEntity: this.entity,
      assetId: this.props.debrisToSpawn!.id.toString(),
      amount: 10,
    });
  }

  //region spawnTarget()
  spawnTarget() {
    //calculate a random spawn position within the defined range
    const randomSpawnOffset = new Vec3(
      (Math.random() - 0.5) * this.props.randRange!.x * 2,
      (Math.random() - 0.5) * this.props.randRange!.y * 2,
      (Math.random() - 0.5) * this.props.randRange!.z * 2
    );
    const spawnPos = this.initialPosition.add(randomSpawnOffset);
    this.spawnPosition = new Vec3(spawnPos.x, spawnPos.y, spawnPos.z);

    this.calcMoveIncrement();
    // Spawn the target at the start position
    this.entity.position.set(this.spawnPosition);

    //if oscillation is enabled, calculate a random offset for the oscillation
    if (this.props.oscillationEnabled) {
      this.oscillationOffset = new Vec3(
        (Math.random() - 0.5) * this.props.oscillationRange!.x * 2,
        (Math.random() - 0.5) * this.props.oscillationRange!.y * 2,
        (Math.random() - 0.5) * this.props.oscillationRange!.z * 2
      );
      this.oscillationEnabled = true;
    }
    //make the target visible and collidable again
    this.entity.visible.set(true);
    this.entity.collidable.set(true);
  }

  //region calcMoveIncrement()
  calcMoveIncrement() {
    this.alphaInc = 1 / this.props.moveDuration!;
  }

  //region objectPoolResponse()
  //spawn the debris with some random upward force
  objectPoolResponse(data: { response: Entity[] }) {
    debugLog(this.props.showDebugs, "Object Pool Response Received with " + data.response.length + " entities");
    data.response.forEach((obj, index) => {
      //for every other one change color to white
      if (index % 2 === 0) {
        const red = new Color(1, 0.07, 0);
        obj.color.set(red); // Change color to red
      } else {
        const white = new Color(1, 1, 1);
        obj.color.set(white); // Change color to white
      }

      //move debris from hidden to target position
      obj.position.set(this.entity.position.get().add(new Vec3(0, 0.25, 0)));
      //zero out any latent velocity, then apply physics to debris 
      const physicalEntity = obj.as(PhysicalEntity);
      physicalEntity.zeroVelocity();
      physicalEntity.gravityEnabled.set(true);
      //choose a random upward force vector
      const forceVector = getRandomForceVectorAboveHorizontal(this.props.explosionForce, this.props.explosionForce);
      physicalEntity.applyForce(forceVector, PhysicsForceMode.VelocityChange);
    });

    //store the spawned items so we can return them to the pool later
    let spawnedItems = data.response;
    //after a delay hide and return the items to the pool
    this.async.setTimeout(() => {
      this.sendNetworkBroadcastEvent(returnObjectsToPool, { objs: spawnedItems });
    }, 5 * 1000); //return to pool after 5 seconds
  }

  //region oscillate()
  oscillate(data: { deltaTime: number }) {
    if (!this.oscillationEnabled) return;

    //calculate the percentage of the way through the move from 0 to 1
    this.alpha += this.alphaInc * this.direction * data.deltaTime;
    if (this.alpha >= 1) {
      this.alpha = 1;
      this.direction *= -1;
    } else if (this.alpha <= 0) {
      this.alpha = 0;
      this.direction *= -1;
    }
    //lerp between start and end position based on alpha
    const newPosition = Vec3.lerp(this.spawnPosition, this.spawnPosition.add(this.oscillationOffset), this.alpha);
    //apply the new position
    this.entity.position.set(newPosition);
  }
}
Component.register(Target);

//region RandForce()
function getRandomForceVectorAboveHorizontal(minForce: number, maxForce: number): Vec3 {
  const angle = Math.random() * Math.PI * 2; // random angle in radians
  // const inclination = Math.random() * Math.PI / 2; // random inclination between 0 and 90 degrees
  const inclination = (Math.random() * Math.PI) / 2; // random inclination between 0 and 90 degrees
  const force = Math.random() * (maxForce - minForce) + minForce; // random force between minForce and maxForce

  const x = force * Math.sin(inclination) * Math.cos(angle);
  const y = force * Math.cos(inclination);
  const z = force * Math.sin(inclination) * Math.sin(angle);

  return new Vec3(x, y, z);
}
