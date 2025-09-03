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
exports.DISPLAY_CONSOLE_OBJECTPOOLING = exports.objPoolDespawnTriggerEvent = exports.objPoolSpawnTriggerEvent = void 0;
const hz = __importStar(require("horizon/core"));
const PoolUtils_1 = require("PoolUtils");
exports.objPoolSpawnTriggerEvent = new hz.LocalEvent('objPoolSpawnEvent');
exports.objPoolDespawnTriggerEvent = new hz.LocalEvent('objPoolDespawnEvent');
const OBJECT_POOL_SIZE = 100;
const HIDDEN_POSITION = new hz.Vec3(-100, -100, 100); // somewhere far away
const ASSET_ROTATION = hz.Quaternion.fromEuler(new hz.Vec3(-90, 0, 90));
exports.DISPLAY_CONSOLE_OBJECTPOOLING = true;
class ObjectPooling extends hz.Component {
    constructor() {
        super(...arguments);
        this.objectPool = new PoolUtils_1.Pool();
        // objList is used to keep track of objects we have taken out from the pool for usage.
        this.objList = new Array();
    }
    preStart() {
        if (exports.DISPLAY_CONSOLE_OBJECTPOOLING) {
            console.log("ObjectPooling: Object Pooling script called");
        }
        ;
        if (this.props.assetToSpawn) {
            this.prePopulatObjectPool(this.props.assetToSpawn, OBJECT_POOL_SIZE);
        }
        else {
            if (exports.DISPLAY_CONSOLE_OBJECTPOOLING) {
                console.error("ObjectPooling: assetToSpawn is not specified. Unable to prepopulate object pool");
            }
            ;
        }
        this.connectLocalEvent(this.entity, exports.objPoolSpawnTriggerEvent, (data) => {
            if (exports.DISPLAY_CONSOLE_OBJECTPOOLING) {
                console.log('ObjectPooling: objPoolSpawnTriggerEvent called');
            }
            ;
            for (let i = 0; i < OBJECT_POOL_SIZE; i++) {
                const obj = this.objectPool.getNextAvailable();
                if (obj == null)
                    return;
                obj.position.set(this.getRandomSpawnPosition(data.position));
                obj.visible.set(true);
                this.objList.push(obj); // Keep track of objs/entities we are currently using
            }
        });
        this.connectLocalEvent(this.entity, exports.objPoolDespawnTriggerEvent, () => {
            if (exports.DISPLAY_CONSOLE_OBJECTPOOLING) {
                console.log('ObjectPooling: objPoolDespawnTriggerEvent is called');
            }
            ;
            if (this.objList.length == 0)
                return;
            // In object pooling, we are not deleting the asset. We simple recycle it back to
            // the objectPool to be used again
            this.objList.forEach(obj => {
                obj.position.set(HIDDEN_POSITION);
            });
            this.objList.splice(0, this.objList.length);
            if (exports.DISPLAY_CONSOLE_OBJECTPOOLING) {
                console.log('ObjectPooling: after despawning, objList size=' + this.objList.length);
            }
            ;
            // Reset our object pool
            this.objectPool.resetAvailability();
        });
    }
    start() { }
    prePopulatObjectPool(asset, numOfObjects) {
        if (exports.DISPLAY_CONSOLE_OBJECTPOOLING) {
            console.log('ObjectPooling: Pre populating object pool');
        }
        ;
        for (let i = 0; i < numOfObjects; i++) {
            this.world.spawnAsset(asset, HIDDEN_POSITION, ASSET_ROTATION).then(spawnedObjects => {
                spawnedObjects.forEach(obj => {
                    this.objectPool.addToPool(obj);
                    obj.visible.set(false);
                }, this);
                if (exports.DISPLAY_CONSOLE_OBJECTPOOLING) {
                    console.log("ObjectPooling: object pool size: " + this.objectPool.all.length);
                }
                ;
            });
        }
    }
    // Helper method to get random spawn position from provided initial position
    getRandomSpawnPosition(initialPosition) {
        const pos = initialPosition.clone();
        pos.x += Math.random() * 3;
        pos.y += Math.random() * 2;
        pos.z += Math.random() * 2;
        return pos;
    }
}
ObjectPooling.propsDefinition = {
    assetToSpawn: { type: hz.PropTypes.Asset },
};
hz.Component.register(ObjectPooling);
