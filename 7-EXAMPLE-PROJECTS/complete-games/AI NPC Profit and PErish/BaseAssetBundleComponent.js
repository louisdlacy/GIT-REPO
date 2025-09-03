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
exports.BaseAssetBundleComponent = exports.AssetBundleParameterType = void 0;
const BaseComponent_1 = require("BaseComponent");
const unity_asset_bundles_1 = require("horizon/unity_asset_bundles");
const GC = __importStar(require("./GameConsts"));
const Events_1 = require("./Events");
const INTERVAL_ASSETBUNDLE_TIMER = "abTimer";
const INTERVAL_ASSETBUNDLE = 0.1;
const INTERVAL_ASSETBUNDLE_TIMEOUT = 5;
const EPI = 0.01;
var AssetBundleParameterType;
(function (AssetBundleParameterType) {
    AssetBundleParameterType[AssetBundleParameterType["Boolean"] = 0] = "Boolean";
    AssetBundleParameterType[AssetBundleParameterType["Integer"] = 1] = "Integer";
    AssetBundleParameterType[AssetBundleParameterType["Float"] = 2] = "Float";
    AssetBundleParameterType[AssetBundleParameterType["Trigger"] = 3] = "Trigger";
})(AssetBundleParameterType || (exports.AssetBundleParameterType = AssetBundleParameterType = {}));
/**
 * This class helps manage linksto the Unity Asset Bundles.
 */
class BaseAssetBundleComponent extends BaseComponent_1.BaseComponent {
    constructor() {
        super(...arguments);
        this.initCallbacks = [];
        this.assetBundleGizmo = null;
        this.cachedValues = new Map();
        this.pauseAnimation = false;
        this.prefabs = [];
    }
    start() {
        super.start();
        this.initAssetBundle();
        // Connect to UAB animation events
        this.connectNetworkBroadcastEvent(unity_asset_bundles_1.unityAnimationEvent, (data) => {
            if (bigintIdsMatch(this.entity.id, data.entityId)) {
                this.handleAnimationEvent(data.eventName);
            }
        });
        this.connectLocalBroadcastEvent(Events_1.Events.onStartUabAnimation, () => {
            this.startUabAnimation();
        });
    }
    // Initialize asset bundle
    initAssetBundle() {
        this.assetBundleGizmo = this.entity.as(unity_asset_bundles_1.AssetBundleGizmo);
        this.startInterval(INTERVAL_ASSETBUNDLE_TIMER, INTERVAL_ASSETBUNDLE, INTERVAL_ASSETBUNDLE_TIMEOUT, {
            checkToEnd: () => {
                return this.assetBundleGizmo != null && this.assetBundleGizmo.isLoaded();
            },
            onEnd: (endedByCondition) => {
                if (endedByCondition) {
                    this.onAssetBundleLoaded();
                }
                else {
                    console.error(`Asset bundle failed to load ${this.entity.name.get()}`);
                }
            }
        });
    }
    // Loads UAB values for easy access
    onAssetBundleLoaded() {
        this.log("UAB INITIALIZED", GC.CONSOLE_LOG_UAB);
        this.assetBundleRoot = this.assetBundleGizmo.getRoot();
        this.prefabs = this.assetBundleGizmo.getPrefabNames();
        for (let callback of this.initCallbacks) {
            callback();
        }
    }
    // Add callback to be called when asset bundle is loaded
    addAssetBundleLoadedCallback(callback) {
        this.initCallbacks.push(callback);
    }
    // Check if it is actually possible to apply a change to an asset bundle animation parameter
    isSafeToUpdate() {
        return this.assetBundleRoot != undefined && this.entity.visible.get();
    }
    // Check wheter update is possible and necessary
    shouldUpdate(paramName, value, force = false) {
        if (!this.isSafeToUpdate() || this.pauseAnimation) {
            return false;
        }
        if (force) {
            return true;
        }
        if (value === undefined) {
            return true;
        }
        if (this.cachedValues.has(paramName)) {
            return this.cachedValues.get(paramName).value !== value;
        }
        return true;
    }
    loadPrefab(name) {
        this.assetBundleGizmo.loadPrefab(name);
    }
    // Set asset bundle value
    setAnimationParameter(paramType, paramName, value, force = false) {
        if (this.shouldUpdate(paramName, value, force)) {
            // Set value based on parameter type
            switch (paramType) {
                case AssetBundleParameterType.Boolean:
                    this.assetBundleRoot.setAnimationParameterBool(paramName, value);
                    this.cachedValues.set(paramName, { value: value, type: AssetBundleParameterType.Boolean });
                    break;
                case AssetBundleParameterType.Integer:
                    this.assetBundleRoot.setAnimationParameterInteger(paramName, value);
                    this.cachedValues.set(paramName, { value: value, type: AssetBundleParameterType.Integer });
                    break;
                case AssetBundleParameterType.Float:
                    // Epsilon value is necessary to make sure very small values are set to 0 otherwise animation events will keep on triggering
                    if (Math.abs(value) <= EPI) {
                        value = 0;
                    }
                    this.assetBundleRoot.setAnimationParameterFloat(paramName, value);
                    this.cachedValues.set(paramName, { value: value, type: AssetBundleParameterType.Float });
                    break;
                case AssetBundleParameterType.Trigger:
                    this.assetBundleRoot.setAnimationParameterTrigger(paramName);
                    break;
            }
        }
    }
    /**
     /**
      * Triggers the underlying asset bundle gizmo to update a given material.
      * @param objectName - The name of the object whose material is to be updated.
      * @param materialName - The name of the new material to apply.
      */
    setMaterial(objectName, materialName) {
        let obj = this.assetBundleGizmo?.getReference(objectName, false);
        if (obj) {
            obj.setMaterial(materialName);
        }
        else {
            this.log(`UAB reference object not found: ${objectName}`);
        }
    }
    /**
     * The signature used to handle animation events.
     * This method is intended to be optionally implemented by child classes.
     * @param eventName - The name of the animation event to handle.
     */
    handleAnimationEvent(eventName) {
        this.log(`handleAnimationEvent ${eventName}`, GC.CONSOLE_LOG_ANIMATION_EVENTS);
    }
    /**
     * Starts the Unity Asset Bundle (UAB) animation by setting all cached animation parameters.
     */
    startUabAnimation() {
        this.cachedValues.forEach((item, key) => {
            this.setAnimationParameter(item.type, key, item.value, true);
        });
    }
}
exports.BaseAssetBundleComponent = BaseAssetBundleComponent;
/*
 * ID comparison function to work around the fact that Horizon Worlds is suffering from number precision loss
 * Any number over 10 digits will lose 3 digits and then be compared.
 * A bit of a nasty solution to overcome this Horizon Worlds bug for the moment.
 */
function bigintIdsMatch(id1, id2) {
    let threshold = 9999999999; // 10 digits
    let id1number = Number(id1);
    let id2number = Number(id2);
    if (id1number > threshold) {
        id1number = Math.floor(id1number / 1000);
    }
    if (id2number > threshold) {
        id2number = Math.floor(id2number / 1000);
    }
    return id1number == id2number;
}
