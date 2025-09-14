import * as hz from 'horizon/core';
import { Pool } from 'PoolUtils';

export const objPoolSpawnTriggerEvent = new hz.LocalEvent<{position: hz.Vec3}>('objPoolSpawnEvent');
export const objPoolDespawnTriggerEvent = new hz.LocalEvent<{}>('objPoolDespawnEvent');

const OBJECT_POOL_SIZE = 100;
const HIDDEN_POSITION = new hz.Vec3(-100, -100, 100); // somewhere far away
const ASSET_ROTATION = hz.Quaternion.fromEuler(new hz.Vec3(-90, 0, 90));

export const DISPLAY_CONSOLE_OBJECTPOOLING: Boolean = true;

class ObjectPooling extends hz.Component<typeof ObjectPooling> {
  static propsDefinition = {
    assetToSpawn: {type: hz.PropTypes.Asset},
  };

  private objectPool: Pool<hz.Entity> = new Pool<hz.Entity>();
  // objList is used to keep track of objects we have taken out from the pool for usage.
  private objList: hz.Entity[] = new Array<hz.Entity>();

  preStart() {
    if (DISPLAY_CONSOLE_OBJECTPOOLING) {
      console.log("ObjectPooling: Object Pooling script called");
    };
    if(this.props.assetToSpawn) {
      this.prePopulatObjectPool(this.props.assetToSpawn, OBJECT_POOL_SIZE);
    } else {
      if (DISPLAY_CONSOLE_OBJECTPOOLING) {
        console.error("ObjectPooling: assetToSpawn is not specified. Unable to prepopulate object pool");
      };
    }

    this.connectLocalEvent(this.entity, objPoolSpawnTriggerEvent, (data: {position: hz.Vec3})=>{
      if (DISPLAY_CONSOLE_OBJECTPOOLING) {
        console.log('ObjectPooling: objPoolSpawnTriggerEvent called');
      };
      for(let i = 0; i < OBJECT_POOL_SIZE; i++) {
        const obj = this.objectPool.getNextAvailable();
        if(obj == null) return;
        obj.position.set(this.getRandomSpawnPosition(data.position));
        obj.visible.set(true);
        this.objList.push(obj); // Keep track of objs/entities we are currently using
      }
    });

    this.connectLocalEvent(this.entity, objPoolDespawnTriggerEvent, () => {
      if (DISPLAY_CONSOLE_OBJECTPOOLING) {
        console.log('ObjectPooling: objPoolDespawnTriggerEvent is called');
      };
      if(this.objList.length == 0) return;

      // In object pooling, we are not deleting the asset. We simple recycle it back to
      // the objectPool to be used again
      this.objList.forEach(obj => {
        obj.position.set(HIDDEN_POSITION);
      });
      this.objList.splice(0, this.objList.length);
      if (DISPLAY_CONSOLE_OBJECTPOOLING) {
        console.log('ObjectPooling: after despawning, objList size='+this.objList.length);
      };
      // Reset our object pool
      this.objectPool.resetAvailability();
    });
  }

  start() {}

  private prePopulatObjectPool(asset:hz.Asset, numOfObjects: number): void {
    if (DISPLAY_CONSOLE_OBJECTPOOLING) {
      console.log('ObjectPooling: Pre populating object pool');
    };
    for (let i = 0; i < numOfObjects; i++) {
      this.world.spawnAsset(asset, HIDDEN_POSITION, ASSET_ROTATION).then(spawnedObjects => {
        spawnedObjects.forEach(obj => {
          this.objectPool.addToPool(obj);
          obj.visible.set(false)
        }, this);
        if (DISPLAY_CONSOLE_OBJECTPOOLING) {
          console.log("ObjectPooling: object pool size: "+ this.objectPool.all.length);
        };
      });
    }
  }

  // Helper method to get random spawn position from provided initial position
  private getRandomSpawnPosition(initialPosition: hz.Vec3): hz.Vec3 {
    const pos = initialPosition.clone();
    pos.x += Math.random()*3;
    pos.y += Math.random()*2;
    pos.z += Math.random()*2;

    return pos;
  }
}
hz.Component.register(ObjectPooling);
