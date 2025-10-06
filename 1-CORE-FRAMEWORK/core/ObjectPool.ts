// Copyright (c) Dave Mills (uRocketLife). Released under the MIT License.

import { LocalEvent, Vec3, Quaternion, Component, PropTypes, Entity, Asset, PhysicalEntity } from "horizon/core";
import { assertAllNullablePropsSet, debugLog } from "sysHelper";
import { objectPoolRequest, objectPoolResponse, Pool, returnObjectsToPool, returnObjectToPool } from "sysObjectPoolUtil";

const HIDDEN_POSITION = new Vec3(-100, -100, 100); // somewhere far away
const ASSET_ROTATION = Quaternion.fromEuler(new Vec3(-90, 0, 90));

class ObjectPool extends Component<typeof ObjectPool> {
  static propsDefinition = {
    enabled: {
      type: PropTypes.Boolean,
      default: true,
    },
    showDebugs: {
      type: PropTypes.Boolean,
      default: false,
    },
    assetToSpawn: { type: PropTypes.Asset },
    poolSize: { type: PropTypes.Number, default: 50 },
  };

  private objectPool: Pool<Entity> = new Pool<Entity>();

  preStart(): void {
    if (!this.props.enabled) return;
    assertAllNullablePropsSet(this, this.entity.name.get());

    this.connectNetworkBroadcastEvent(
      objectPoolRequest,
      (data: { requesterEntity: Entity; assetId: string; amount: number }) => {
        const requester = data.requesterEntity;
        const asset = new Asset(BigInt(data.assetId));
        console.log("Props asset is " + this.props.assetToSpawn?.id.toString() + " incoming assetId: " + asset.id.toString());
        if (this.props.assetToSpawn?.id.toString() !== data.assetId) {
          debugLog(this.props.showDebugs, "ObjectPooling: assetToSpawn is not the same as requested objType");
          return;
        }
        debugLog(this.props.showDebugs, "ObjectPooling: objPoolSpawnTriggerEvent called");
        //if amount is less than available objects in pool, return the amount requested
        let miniPool = new Array<Entity>();
        for (let i = 0; i < data.amount; i++) {
          const obj = this.objectPool.getNextAvailable();
          if (obj == null) return;

          this.objectPool.removeFromPool(obj);
          this.activateObject(obj);
          miniPool.push(obj);
        }
        this.sendNetworkEvent(requester, objectPoolResponse, { response: miniPool });
      }
    );

    this.connectNetworkEvent(this.entity, returnObjectToPool, (data: { obj: Entity }) => {
      this.deactivateObject(data.obj);
      this.objectPool.addToPool(data.obj);
      this.objectPool.resetAvailability();
    });

    this.connectNetworkBroadcastEvent(returnObjectsToPool, (data: { objs: Entity[] }) => {
      data.objs.forEach((obj) => {
        this.deactivateObject(obj);
        this.objectPool.addToPool(obj);
      });
      this.objectPool.resetAvailability();
    });
  }

  start() {
    if (!this.props.enabled) return;

    if (this.props.assetToSpawn && this.props.enabled) {
      this.prePopulatObjectPool(this.props.assetToSpawn, this.props.poolSize);
    } else {
      debugLog(
        this.props.showDebugs,
        "ObjectPooling: assetToSpawn is not specified. Unable to prepopulate object pool"
      );
    }
  }

  private prePopulatObjectPool(asset: Asset, numOfObjects: number): void {
    debugLog(this.props.showDebugs, "ObjectPooling: Pre populating object pool with size: " + numOfObjects);

    for (let i = 0; i < numOfObjects; i++) {
      this.world.spawnAsset(asset, HIDDEN_POSITION, ASSET_ROTATION).then((spawnedObjects) => {
        spawnedObjects.forEach((obj) => {
          this.objectPool.addToPool(obj);
          this.deactivateObject(obj);
        }, this);
      });
    }
  }

  deactivateObject(obj: Entity): void {
    console.log("Deactivating object and returning to pool");
    this.activateObject(obj, false);
  }

  activateObject(obj: Entity, activate: boolean = true): void {
    if (!activate) {
      obj.position.set(HIDDEN_POSITION);
      obj.rotation.set(ASSET_ROTATION);
    }
    obj.visible.set(activate);
    const physicalEntity = obj.as(PhysicalEntity);
    physicalEntity.gravityEnabled.set(activate);
    physicalEntity.collidable.set(activate);
    physicalEntity.zeroVelocity();
  }
}
Component.register(ObjectPool);
