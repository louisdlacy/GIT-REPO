import * as hz from 'horizon/core';
/*
Here's an example of the JSON data that will be passed in:
[
  {
    "name": "cube",
    "hp": 150,
    "skills": ["shout", "roll", "smash"],
    "color": [0.9, 0.1, 0.3]
  },
  {
    "name": "sphere",
    "hp": 100,
    "skills": ["roll", "bounce", "spin"],
    "color": [0.2, 0.8, 0.5]
  }
]
*/

interface MonsterJSONData {
    name: "cube" | "sphere" | "pyramid";
    hp: number;
    skills: string[];
    color: [number, number, number];
}

export const Events = {
    set_skills: new hz.LocalEvent<{ skills: string[]; }>('answeredQuestion'),
    set_name: new hz.LocalEvent<{ name: string; }>('answeredQuestion'),
    set_hp: new hz.LocalEvent<{ hp: number; }>('answeredQuestion'),
    set_color: new hz.LocalEvent<{ color: hz.Color; }>('answeredQuestion'),
}

class MonsterSpawnerManager extends hz.Component<typeof MonsterSpawnerManager> {
    static propsDefinition = {
        textAsset: { type: hz.PropTypes.Asset },
        monsterAssetTemplate: { type: hz.PropTypes.Asset },
        assetDetailsTextGizmo: { type: hz.PropTypes.Entity }
    };

    allMonsterData: MonsterJSONData[] | null = null;
    spawnLoc = hz.Vec3.zero;

    // called on world start
    async start() {

        let asset: hz.Asset;
        if (this.props.textAsset) {
            asset = this.props.textAsset;
        }
        this.spawnLoc =  this.entity.position.get();
        // following is to move Y coordinate up a bit to compensate for different positioning for trimesh assets
        this.spawnLoc.y = this.spawnLoc.y + 0.26;

        // console.log("[MonsterSpawnerManager] spawnLoc: " + this.spawnLoc.toString());

        asset!.fetchAsData().then((output: hz.AssetContentData) => {
            console.warn(asset.id + " \n" + asset.versionId);
            this.allMonsterData = this.handleExtractAssetContentData(output);
            if (this.allMonsterData) {
              console.log("[MonsterSpawnerManager] Monster data fetched from JSON.")
            } else {
              console.error("[MonsterSpawnerManager] Unable to extract monster data from JSON!")
            }
            this.handleUpdateAssetDetails(asset);

            let i : number = 0;
            this.allMonsterData?.forEach((monsterData) => {
                this.handleSpawnMonster(monsterData);
                i = i + 1;
              });
            console.log("[MonsterSpawnerManager] " + i.toString() + " monster records parsed.")
        })
    }

    handleUpdateAssetDetails(asset: hz.Asset) {
        this.props.assetDetailsTextGizmo!.as(hz.TextGizmo)?.text.set("Asset ID: " + asset.id + "\nVersion ID: " + asset.versionId);
    }

    handleExtractAssetContentData(output: hz.AssetContentData) {
        var text = output.asText();
        console.log("[MonsterSpawnerManager] Total text length: ", text.length);
        console.log("[MonsterSpawnerManager] First 10 characters of the text for verification: ", text.substring(0, 10));
        console.log("[MonsterSpawnerManager] ==================================");

        var jsobj = output.asJSON();
        if (jsobj == null || jsobj == undefined) {
            console.error("[MonsterSpawnerManager] null jsobj");
            return null;
        }
        else {

           return output.asJSON<MonsterJSONData[]>();
        }
    }

    handleSpawnMonster(monsterData: MonsterJSONData) {

        let controller = new hz.SpawnController(this.props.monsterAssetTemplate!, this.getNextSpawn(), hz.Quaternion.one, hz.Vec3.one);
        controller.spawn().then(() => {
            const spawnedEntity = controller.rootEntities.get()[0].as(hz.Entity)!;
            if (spawnedEntity) {
              console.log("[MonsterSpawnerManager] Entity spawned." )
            } else {
              console.error("[MonsterSpawnerManager] Entity failed to spawn!" )
            }
            this.sendLocalEvent(spawnedEntity, Events.set_skills, { skills: monsterData.skills });
            this.sendLocalEvent(spawnedEntity, Events.set_name, { name: monsterData.name });
            this.sendLocalEvent(spawnedEntity, Events.set_hp, { hp: monsterData.hp });
            this.sendLocalEvent(spawnedEntity, Events.set_color, { color: new hz.Color(monsterData.color[0], monsterData.color[1], monsterData.color[2]) });
        })
    }

    //simple script to get the location to spawn the monster in a grid pattern
    getNextSpawn(){
        const nextSpawn =  this.spawnLoc;
        this.spawnLoc.x += 3;
        if(this.spawnLoc.x >= this.entity.position.get().x + 3*4){
            this.spawnLoc.x = this.entity.position.get().x;
            this.spawnLoc.z += 3;
        }

        return nextSpawn;
    }

}
hz.Component.register(MonsterSpawnerManager);



class Monster extends hz.Component<typeof Monster> {
  static propsDefinition = {
    modelSphere: { type: hz.PropTypes.Entity },
    modelCube: { type: hz.PropTypes.Entity },
    modelPyramid: { type: hz.PropTypes.Entity },
    hp: { type: hz.PropTypes.Entity },
  };

  skills: string[] = [];
  hpTextGizmo: hz.TextGizmo | null = null;


    preStart() {

    this.hpTextGizmo = this.props.hp!.as(hz.TextGizmo);

    this.connectLocalEvent(this.entity, Events.set_name, (data) => {

      if(!data || !data.name){
        return;
      }
      let modelBrightness: number = 1.0;
      let modelTintStrength: number = 1.0;

      switch(data.name){
        case "sphere":
          this.props.modelSphere!.as(hz.MeshEntity).visible.set(true);
          this.props.modelSphere!.as(hz.MeshEntity).collidable.set(true);

          this.props.modelCube!.as(hz.MeshEntity).visible.set(false);
          this.props.modelCube!.as(hz.MeshEntity).collidable.set(false);

          this.props.modelPyramid!.as(hz.MeshEntity).visible.set(false);
          this.props.modelPyramid!.as(hz.MeshEntity).collidable.set(false);

          this.props.modelSphere!.as(hz.MeshEntity).style.brightness.set(modelBrightness);
          this.props.modelSphere!.as(hz.MeshEntity).style.brightness.set(modelTintStrength);

          break;
        case "cube":
          this.props.modelSphere!.as(hz.MeshEntity).visible.set(false);
          this.props.modelSphere!.as(hz.MeshEntity).collidable.set(false);

          this.props.modelCube!.as(hz.MeshEntity).visible.set(true);
          this.props.modelCube!.as(hz.MeshEntity).collidable.set(true);

          this.props.modelPyramid!.as(hz.MeshEntity).visible.set(false);
          this.props.modelPyramid!.as(hz.MeshEntity).collidable.set(false);

          this.props.modelCube!.as(hz.MeshEntity).style.brightness.set(modelBrightness);
          this.props.modelCube!.as(hz.MeshEntity).style.brightness.set(modelTintStrength);

          break;
        case "pyramid":
          this.props.modelSphere!.as(hz.MeshEntity).visible.set(false);
          this.props.modelSphere!.as(hz.MeshEntity).collidable.set(false);

          this.props.modelCube!.as(hz.MeshEntity).visible.set(false);
          this.props.modelCube!.as(hz.MeshEntity).collidable.set(false);

          this.props.modelPyramid!.as(hz.MeshEntity).visible.set(true);
          this.props.modelPyramid!.as(hz.MeshEntity).collidable.set(true);

          this.props.modelPyramid!.as(hz.MeshEntity).style.brightness.set(modelBrightness);
          this.props.modelPyramid!.as(hz.MeshEntity).style.brightness.set(modelTintStrength);

          break;
        default:
          this.props.modelSphere!.as(hz.MeshEntity).visible.set(false);
          this.props.modelSphere!.as(hz.MeshEntity).collidable.set(false);

          this.props.modelCube!.as(hz.MeshEntity).visible.set(false);
          this.props.modelCube!.as(hz.MeshEntity).collidable.set(false);

          this.props.modelPyramid!.as(hz.MeshEntity).visible.set(false);
          this.props.modelPyramid!.as(hz.MeshEntity).collidable.set(false);

          break;
      }

      /*
      switch(data.name){
        case "sphere":
          this.props.modelSphere!.visible.set(true);
          this.props.modelCube!.visible.set(false);
          this.props.modelPyramid!.visible.set(false);
          break;
        case "cube":
          this.props.modelSphere!.visible.set(false);
          this.props.modelCube!.visible.set(true);
          this.props.modelPyramid!.visible.set(false);
          break;
        case "pyramid":
        default:
          this.props.modelSphere!.visible.set(false);
          this.props.modelCube!.visible.set(false);
          this.props.modelPyramid!.visible.set(true);
          break;
      }
  */
    });
    this.connectLocalEvent(this.entity, Events.set_hp, (data) => {
      if(!data || !data.hp){
        return;
      }
      this.hpTextGizmo!.text.set(data.hp.toString());});

    this.connectLocalEvent(this.entity, Events.set_color, (data) => {

      if(!data || !data.color){
        return;
      }

      this.hpTextGizmo!.color.set(data.color);
      //      this.hpTextGizmo!.as(hz.MeshEntity).style.tintColor.set(data.color);


      this.props.modelSphere?.as(hz.MeshEntity).style.tintColor.set(data.color);
      this.props.modelPyramid?.as(hz.MeshEntity).style.tintColor.set(data.color);
      this.props.modelCube?.as(hz.MeshEntity).style.tintColor.set(data.color);

      /*

      this.props.modelSphere?.color.set(data.color);
      this.props.modelPyramid?.color.set(data.color);
      this.props.modelCube?.color.set(data.color);
*/
    });

    this.connectLocalEvent(this.entity, Events.set_skills, (data) => {this.skills = data.skills;});

  }
  start(){}
}
hz.Component.register(Monster);
