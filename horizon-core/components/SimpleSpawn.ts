import * as hz from 'horizon/core';

export const spawnTriggerEvent = new hz.LocalEvent<{position: hz.Vec3}>('spawnEvent');
export const despawnTriggerEvent = new hz.LocalEvent<{}>('despawnEvent');

const MAX_SPAWN_OBJECTS = 100;
const ASSET_ROTATION = hz.Quaternion.fromEuler(new hz.Vec3(-90, 0, 90));

export const DISPLAY_CONSOLE_SIMPLESPAWN: Boolean = true;

class SimpleSpawn extends hz.Component<typeof SimpleSpawn> {
  static propsDefinition = {
    assetToSpawn: {type: hz.PropTypes.Asset},
  };

  objList: hz.Entity[] = new Array<hz.Entity>();

  preStart() {
    this.connectLocalEvent(this.entity, spawnTriggerEvent, (data: {position: hz.Vec3}) =>{
      if (DISPLAY_CONSOLE_SIMPLESPAWN) {
        console.log("SimpleSpawn: spawnEvent is called with objList size="+this.objList.length);
      };
      if (this.objList.length >= MAX_SPAWN_OBJECTS) {
        if (DISPLAY_CONSOLE_SIMPLESPAWN) {
          console.log('SimpleSpawn:Unable to spawn more objects. Reached max='+MAX_SPAWN_OBJECTS);
        };
        return;
      }
      if (this.objList.length > 0) {
        if (DISPLAY_CONSOLE_SIMPLESPAWN) {
          console.warn('SimpleSpawn:Spawning is still in progress. We wont trigger another spawn');
        };
        return;
      }
      if (this.props.assetToSpawn == undefined) {
        if (DISPLAY_CONSOLE_SIMPLESPAWN) {
          console.error("SimpleSpawn:assetToSpawn not defined, unable to spawn asset");
        };
        return;
      }

      for(let i = 0; i < MAX_SPAWN_OBJECTS; i++) {
        if (this.objList.length < MAX_SPAWN_OBJECTS) {
          this.world.spawnAsset(this.props.assetToSpawn, this.getRandomSpawnPosition(data.position), ASSET_ROTATION).then(spawnedObjects => {
            if (DISPLAY_CONSOLE_SIMPLESPAWN) {
              console.log("SimpleSpawn: assets spawned: " + (i+1).toString())
            };
            if (this.objList == null) return;
            spawnedObjects.forEach(obj => {
              this.objList.push(obj);
            }, this);
          });
        }
      };
      if (DISPLAY_CONSOLE_SIMPLESPAWN) {
        console.log('SimpleSpawn: spawnning complete. objList size='+this.objList.length);
      };
    });

    this.connectLocalEvent(this.entity, despawnTriggerEvent, () => {
      if (DISPLAY_CONSOLE_SIMPLESPAWN) {
        console.log('SimpleSpawn: despawnTriggerEvent is called');
      };
      if (this.objList.length == 0) return;

      // In this example, we are removing all the entities from the objList.
      // In your world, you can selectively despawn some entities based on different logics (out of bound, hit, etc.)
      this.objList.forEach(obj => {
        this.world.deleteAsset(obj, true);
      });
      this.objList.splice(0, this.objList.length);
      if (DISPLAY_CONSOLE_SIMPLESPAWN) {
        console.log('SimpleSpawn: after despawning, objList size='+this.objList.length);
      };
    });
  }

  start() {}

  // Helper method to get random spawn position from provided initial position
  private getRandomSpawnPosition(initialPosition: hz.Vec3): hz.Vec3 {
    const pos = initialPosition.clone();
    pos.x += Math.random()*3;
    pos.y += Math.random()*2;
    pos.z += Math.random()*2;

    return pos;
  }
}
hz.Component.register(SimpleSpawn);
