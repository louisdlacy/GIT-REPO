import * as hz from 'horizon/core';
import { Pool } from 'PoolUtils';

export const objPoolSpawnControllerSpawnEvent = new hz.LocalEvent<{position: hz.Vec3}>('objPoolSpawnControllerSpawnEvent');
export const objPoolSpawnControllerDespawnEvent = new hz.LocalEvent<{}>('objPoolSpawnControllerDespawnEvent');

const ASSET_COUNT_MAX:number = 500; // This value is used here as a safeguard for the maximum number of permitted assets to be loaded in SpawnControllers. You can change it to another value if preferred.
const ASSET_ROTATION_SC:hz.Quaternion = hz.Quaternion.fromEuler(new hz.Vec3(-90, 0, 90));

export const DISPLAY_CONSOLE_SPAWNCONTROLLER: Boolean = true;

class SpawnControllerManager extends hz.Component<typeof SpawnControllerManager> {
  static propsDefinition = {
    spawnCount: {type: hz.PropTypes.Number, default:1},
    assetToSpawn: {type: hz.PropTypes.Asset},
  };

  // spawnControllerPool array holds the set of SpawnController objects, which are loaded in preStart() with instances of the asset.
  spawnControllerPool: Pool<hz.SpawnController> = new Pool<hz.SpawnController>();

  // spawnControllerList is used to keep track of objects we have taken out from the pool for usage.
  spawnControllerList: hz.SpawnController[] = new Array<hz.SpawnController>();

  preStart() {
    let object_pool_size_sc: number = this.props.spawnCount;
    if (DISPLAY_CONSOLE_SPAWNCONTROLLER) {
      console.log("SpawnController: Load SpawnControllers in SpawnController staging");
    };

    // Data validation checks
    if (DISPLAY_CONSOLE_SPAWNCONTROLLER) {
      console.log("SpawnController: Init SpawnControllers");
    };
    if ((this.props.spawnCount) && (this.props.assetToSpawn)) {
      if ((this.props.spawnCount < 1) || (this.props.spawnCount > ASSET_COUNT_MAX)) { // spawnCount must be greater than 0 and less than the ASSET_COUNT_MAX safeguard.
        if (DISPLAY_CONSOLE_SPAWNCONTROLLER) {
          console.log("SpawnController: spawnCount must be greater than 0 and less than " + ASSET_COUNT_MAX.toString() + ".");
        };
        return;
      } else {
        // init: load assets into the Pool and into the world
        let thisScale: hz.Vec3 = this.entity.scale.get();
        for (let i = 0; i < object_pool_size_sc; i++) {
            let thisPos: hz.Vec3 = this.getRandomSpawnPosition(this.entity.position.get());
            let sc: hz.SpawnController = new hz.SpawnController(this.props.assetToSpawn, thisPos, ASSET_ROTATION_SC, thisScale);
            this.spawnControllerPool.addToPool(sc);
            /*
              The load() method loads the SpawnController assets into runtime memory, so that they can be quickly accessed as needed. Doing this in the preStart() method
              means that the assets are loaded before players enter the world.
              You can call spawn() without load() first. spawn() performs the load() operation if it has not been done yet. However, there may be a disruptive
              performance hit as the assets are being loaded at runtime.
            */
              sc.load().then(() => {
                if (DISPLAY_CONSOLE_SPAWNCONTROLLER) {
                  console.log("Loaded SpawnController #" + i.toString());
                };
              }).catch(() => {
                if (DISPLAY_CONSOLE_SPAWNCONTROLLER) {
                  console.error("SpawnController: Error loading SpawnController #" + i.toString() + "!");
                };
              });
        }
        this.spawnControllerPool.resetAvailability();
        if (DISPLAY_CONSOLE_SPAWNCONTROLLER) {
          console.log("SpawnController: spawnControllerPool loaded with " + (object_pool_size_sc).toString() + " assets.");
        };
      }
    } else { // one or more of the script properties has not been specified.
      if (!this.props.assetToSpawn) {
        if (DISPLAY_CONSOLE_SPAWNCONTROLLER) {
          console.error("SpawnController: assetToSpawn is not specified. Unable to prepopulate object pool");
        };
      } else if (!this.props.spawnCount) {
        if (DISPLAY_CONSOLE_SPAWNCONTROLLER) {
          console.error("SpawnController: spawnCount is not specified correctly. Unable to prepopulate object pool");
        };
      }
      return;
    }

    // listener for the trigger event sent when the player enters the spawning trigger volume. When triggered, spawn assets.
    this.connectLocalEvent(this.entity, objPoolSpawnControllerSpawnEvent, (data: {position: hz.Vec3})=>{
      if (DISPLAY_CONSOLE_SPAWNCONTROLLER) {
        console.log('SpawnController: objPoolSpawnTriggerEvent called');
      };
      for(let i = 0; i < object_pool_size_sc; i++) {
        const obj = this.spawnControllerPool.getNextAvailable();
        if(obj == null) return;
        /*
         Following call spawns in the entity obj, which has already been loaded into memory.
         spawnError and spawnState are enums. You can check the different enums in the code: 
           hz.SpawnError.None, 
           hz.SpawnError.ExceedsCapacity, 
           hz.SpawnError.Cancelled, 
           hz.SpawnError.InvalidAsset, 
           hz.SpawnError.UnauthorizedContent, 
           hz.SpawnError.InvalidParams, 
           hz.SpawnError.Unknown
          then/catch blocks are used to gate actions on success (then) and to log spawn errors (catch).
        */
        obj.spawn().then(() => {
          if (DISPLAY_CONSOLE_SPAWNCONTROLLER) {
            console.log("SpawnController: object #" + i.toString() + " spawned with state: " + hz.SpawnState[obj.currentState.get()]);
          };
        }).catch(() => {
          if (DISPLAY_CONSOLE_SPAWNCONTROLLER) {
            console.error("SpawnController: Error spawning object #" + i.toString() + "! Error code: " + hz.SpawnError[obj.spawnError.get()]);
          };
        });
        this.spawnControllerList.push(obj); // Keep track of objs/entities we are currently using
      };
      if (DISPLAY_CONSOLE_SPAWNCONTROLLER) {
        console.log("SpawnController: count of spawned assets: " + this.spawnControllerList.length.toString());
      };
    });

    // listener for the trigger event sent when the player exits the spawning trigger volume. When triggered, unload (despawn) assets.
    this.connectLocalEvent(this.entity, objPoolSpawnControllerDespawnEvent, () => {
      if (DISPLAY_CONSOLE_SPAWNCONTROLLER) {
        console.log('SpawnController: objPoolDespawnTriggerEvent is called');
      };
      if(this.spawnControllerList.length == 0) return;

      // In object pooling, we are not deleting the asset. We simple unload it and move it back back to
      // the spawnControllerPool to be used again.
      this.spawnControllerList.forEach(obj => {
        obj.unload();
        this.spawnControllerPool.addToPool(obj);
      });

      // Reset our object pool.
      this.spawnControllerPool.resetAvailability();
      this.spawnControllerList = []; // since we are removing all of the assets from the list, assets were not removed while they were migrated to the pool. Kind of a hack.
      if (DISPLAY_CONSOLE_SPAWNCONTROLLER) {
        console.log('SpawnController: after despawning, spawnControllerList size=' + this.spawnControllerList.length);
      };
    });
  }

  start() {}

  dispose() {
    for(let i = 0; i < this.spawnControllerList.length; i++) {
      const obj = this.spawnControllerPool.getNextAvailable();
      if(obj == null) return;
      this.spawnControllerPool.removeFromPool(obj);
      obj.dispose();
    }
    this.spawnControllerPool.resetAvailability();
    this.spawnControllerList = [];
    if (DISPLAY_CONSOLE_SPAWNCONTROLLER) {
      console.log("SpawnController: SpawnController arrays destroyed.");
    };
  };

  // Helper method to get random spawn position from provided initial position
  private getRandomSpawnPosition(initialPosition: hz.Vec3): hz.Vec3 {
    const pos = initialPosition.clone();
    pos.x += Math.random()*3;
    pos.y += Math.random()*2;
    pos.z += Math.random()*2;
    return pos;
  }
};

hz.Component.register(SpawnControllerManager);
