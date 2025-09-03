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
exports.DISPLAY_CONSOLE_SIMPLESPAWN = exports.despawnTriggerEvent = exports.spawnTriggerEvent = void 0;
const hz = __importStar(require("horizon/core"));
exports.spawnTriggerEvent = new hz.LocalEvent('spawnEvent');
exports.despawnTriggerEvent = new hz.LocalEvent('despawnEvent');
const MAX_SPAWN_OBJECTS = 100;
const ASSET_ROTATION = hz.Quaternion.fromEuler(new hz.Vec3(-90, 0, 90));
exports.DISPLAY_CONSOLE_SIMPLESPAWN = true;
class SimpleSpawn extends hz.Component {
    constructor() {
        super(...arguments);
        this.objList = new Array();
    }
    preStart() {
        this.connectLocalEvent(this.entity, exports.spawnTriggerEvent, (data) => {
            if (exports.DISPLAY_CONSOLE_SIMPLESPAWN) {
                console.log("SimpleSpawn: spawnEvent is called with objList size=" + this.objList.length);
            }
            ;
            if (this.objList.length >= MAX_SPAWN_OBJECTS) {
                if (exports.DISPLAY_CONSOLE_SIMPLESPAWN) {
                    console.log('SimpleSpawn:Unable to spawn more objects. Reached max=' + MAX_SPAWN_OBJECTS);
                }
                ;
                return;
            }
            if (this.objList.length > 0) {
                if (exports.DISPLAY_CONSOLE_SIMPLESPAWN) {
                    console.warn('SimpleSpawn:Spawning is still in progress. We wont trigger another spawn');
                }
                ;
                return;
            }
            if (this.props.assetToSpawn == undefined) {
                if (exports.DISPLAY_CONSOLE_SIMPLESPAWN) {
                    console.error("SimpleSpawn:assetToSpawn not defined, unable to spawn asset");
                }
                ;
                return;
            }
            for (let i = 0; i < MAX_SPAWN_OBJECTS; i++) {
                if (this.objList.length < MAX_SPAWN_OBJECTS) {
                    this.world.spawnAsset(this.props.assetToSpawn, this.getRandomSpawnPosition(data.position), ASSET_ROTATION).then(spawnedObjects => {
                        if (exports.DISPLAY_CONSOLE_SIMPLESPAWN) {
                            console.log("SimpleSpawn: assets spawned: " + (i + 1).toString());
                        }
                        ;
                        if (this.objList == null)
                            return;
                        spawnedObjects.forEach(obj => {
                            this.objList.push(obj);
                        }, this);
                    });
                }
            }
            ;
            if (exports.DISPLAY_CONSOLE_SIMPLESPAWN) {
                console.log('SimpleSpawn: spawnning complete. objList size=' + this.objList.length);
            }
            ;
        });
        this.connectLocalEvent(this.entity, exports.despawnTriggerEvent, () => {
            if (exports.DISPLAY_CONSOLE_SIMPLESPAWN) {
                console.log('SimpleSpawn: despawnTriggerEvent is called');
            }
            ;
            if (this.objList.length == 0)
                return;
            // In this example, we are removing all the entities from the objList.
            // In your world, you can selectively despawn some entities based on different logics (out of bound, hit, etc.)
            this.objList.forEach(obj => {
                this.world.deleteAsset(obj, true);
            });
            this.objList.splice(0, this.objList.length);
            if (exports.DISPLAY_CONSOLE_SIMPLESPAWN) {
                console.log('SimpleSpawn: after despawning, objList size=' + this.objList.length);
            }
            ;
        });
    }
    start() { }
    // Helper method to get random spawn position from provided initial position
    getRandomSpawnPosition(initialPosition) {
        const pos = initialPosition.clone();
        pos.x += Math.random() * 3;
        pos.y += Math.random() * 2;
        pos.z += Math.random() * 2;
        return pos;
    }
}
SimpleSpawn.propsDefinition = {
    assetToSpawn: { type: hz.PropTypes.Asset },
};
hz.Component.register(SimpleSpawn);
