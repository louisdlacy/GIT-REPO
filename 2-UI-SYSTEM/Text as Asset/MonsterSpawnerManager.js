"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
const hz = __importStar(require("horizon/core"));
exports.Events = {
    set_skills: new hz.LocalEvent('answeredQuestion'),
    set_name: new hz.LocalEvent('answeredQuestion'),
    set_hp: new hz.LocalEvent('answeredQuestion'),
    set_color: new hz.LocalEvent('answeredQuestion'),
};
class MonsterSpawnerManager extends hz.Component {
    constructor() {
        super(...arguments);
        this.allMonsterData = null;
        this.spawnLoc = hz.Vec3.zero;
    }
    // called on world start
    async start() {
        let asset;
        if (this.props.textAsset) {
            asset = this.props.textAsset;
        }
        this.spawnLoc = this.entity.position.get();
        // following is to move Y coordinate up a bit to compensate for different positioning for trimesh assets
        this.spawnLoc.y = this.spawnLoc.y + 0.26;
        // console.log("[MonsterSpawnerManager] spawnLoc: " + this.spawnLoc.toString());
        asset.fetchAsData().then((output) => {
            console.warn(asset.id + " \n" + asset.versionId);
            this.allMonsterData = this.handleExtractAssetContentData(output);
            if (this.allMonsterData) {
                console.log("[MonsterSpawnerManager] Monster data fetched from JSON.");
            }
            else {
                console.error("[MonsterSpawnerManager] Unable to extract monster data from JSON!");
            }
            this.handleUpdateAssetDetails(asset);
            let i = 0;
            this.allMonsterData?.forEach((monsterData) => {
                this.handleSpawnMonster(monsterData);
                i = i + 1;
            });
            console.log("[MonsterSpawnerManager] " + i.toString() + " monster records parsed.");
        });
    }
    handleUpdateAssetDetails(asset) {
        this.props.assetDetailsTextGizmo.as(hz.TextGizmo)?.text.set("Asset ID: " + asset.id + "\nVersion ID: " + asset.versionId);
    }
    handleExtractAssetContentData(output) {
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
            return output.asJSON();
        }
    }
    handleSpawnMonster(monsterData) {
        let controller = new hz.SpawnController(this.props.monsterAssetTemplate, this.getNextSpawn(), hz.Quaternion.one, hz.Vec3.one);
        controller.spawn().then(() => {
            const spawnedEntity = controller.rootEntities.get()[0].as(hz.Entity);
            if (spawnedEntity) {
                console.log("[MonsterSpawnerManager] Entity spawned.");
            }
            else {
                console.error("[MonsterSpawnerManager] Entity failed to spawn!");
            }
            this.sendLocalEvent(spawnedEntity, exports.Events.set_skills, { skills: monsterData.skills });
            this.sendLocalEvent(spawnedEntity, exports.Events.set_name, { name: monsterData.name });
            this.sendLocalEvent(spawnedEntity, exports.Events.set_hp, { hp: monsterData.hp });
            this.sendLocalEvent(spawnedEntity, exports.Events.set_color, { color: new hz.Color(monsterData.color[0], monsterData.color[1], monsterData.color[2]) });
        });
    }
    //simple script to get the location to spawn the monster in a grid pattern
    getNextSpawn() {
        const nextSpawn = this.spawnLoc;
        this.spawnLoc.x += 3;
        if (this.spawnLoc.x >= this.entity.position.get().x + 3 * 4) {
            this.spawnLoc.x = this.entity.position.get().x;
            this.spawnLoc.z += 3;
        }
        return nextSpawn;
    }
}
MonsterSpawnerManager.propsDefinition = {
    textAsset: { type: hz.PropTypes.Asset },
    monsterAssetTemplate: { type: hz.PropTypes.Asset },
    assetDetailsTextGizmo: { type: hz.PropTypes.Entity }
};
hz.Component.register(MonsterSpawnerManager);
class Monster extends hz.Component {
    constructor() {
        super(...arguments);
        this.skills = [];
        this.hpTextGizmo = null;
    }
    preStart() {
        this.hpTextGizmo = this.props.hp.as(hz.TextGizmo);
        this.connectLocalEvent(this.entity, exports.Events.set_name, (data) => {
            if (!data || !data.name) {
                return;
            }
            let modelBrightness = 1.0;
            let modelTintStrength = 1.0;
            switch (data.name) {
                case "sphere":
                    this.props.modelSphere.as(hz.MeshEntity).visible.set(true);
                    this.props.modelSphere.as(hz.MeshEntity).collidable.set(true);
                    this.props.modelCube.as(hz.MeshEntity).visible.set(false);
                    this.props.modelCube.as(hz.MeshEntity).collidable.set(false);
                    this.props.modelPyramid.as(hz.MeshEntity).visible.set(false);
                    this.props.modelPyramid.as(hz.MeshEntity).collidable.set(false);
                    this.props.modelSphere.as(hz.MeshEntity).style.brightness.set(modelBrightness);
                    this.props.modelSphere.as(hz.MeshEntity).style.brightness.set(modelTintStrength);
                    break;
                case "cube":
                    this.props.modelSphere.as(hz.MeshEntity).visible.set(false);
                    this.props.modelSphere.as(hz.MeshEntity).collidable.set(false);
                    this.props.modelCube.as(hz.MeshEntity).visible.set(true);
                    this.props.modelCube.as(hz.MeshEntity).collidable.set(true);
                    this.props.modelPyramid.as(hz.MeshEntity).visible.set(false);
                    this.props.modelPyramid.as(hz.MeshEntity).collidable.set(false);
                    this.props.modelCube.as(hz.MeshEntity).style.brightness.set(modelBrightness);
                    this.props.modelCube.as(hz.MeshEntity).style.brightness.set(modelTintStrength);
                    break;
                case "pyramid":
                    this.props.modelSphere.as(hz.MeshEntity).visible.set(false);
                    this.props.modelSphere.as(hz.MeshEntity).collidable.set(false);
                    this.props.modelCube.as(hz.MeshEntity).visible.set(false);
                    this.props.modelCube.as(hz.MeshEntity).collidable.set(false);
                    this.props.modelPyramid.as(hz.MeshEntity).visible.set(true);
                    this.props.modelPyramid.as(hz.MeshEntity).collidable.set(true);
                    this.props.modelPyramid.as(hz.MeshEntity).style.brightness.set(modelBrightness);
                    this.props.modelPyramid.as(hz.MeshEntity).style.brightness.set(modelTintStrength);
                    break;
                default:
                    this.props.modelSphere.as(hz.MeshEntity).visible.set(false);
                    this.props.modelSphere.as(hz.MeshEntity).collidable.set(false);
                    this.props.modelCube.as(hz.MeshEntity).visible.set(false);
                    this.props.modelCube.as(hz.MeshEntity).collidable.set(false);
                    this.props.modelPyramid.as(hz.MeshEntity).visible.set(false);
                    this.props.modelPyramid.as(hz.MeshEntity).collidable.set(false);
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
        this.connectLocalEvent(this.entity, exports.Events.set_hp, (data) => {
            if (!data || !data.hp) {
                return;
            }
            this.hpTextGizmo.text.set(data.hp.toString());
        });
        this.connectLocalEvent(this.entity, exports.Events.set_color, (data) => {
            if (!data || !data.color) {
                return;
            }
            this.hpTextGizmo.color.set(data.color);
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
        this.connectLocalEvent(this.entity, exports.Events.set_skills, (data) => { this.skills = data.skills; });
    }
    start() { }
}
Monster.propsDefinition = {
    modelSphere: { type: hz.PropTypes.Entity },
    modelCube: { type: hz.PropTypes.Entity },
    modelPyramid: { type: hz.PropTypes.Entity },
    hp: { type: hz.PropTypes.Entity },
};
hz.Component.register(Monster);
