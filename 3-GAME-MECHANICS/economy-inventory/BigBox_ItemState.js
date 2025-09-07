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
exports.BigBox_ItemState = void 0;
const hz = __importStar(require("horizon/core"));
/**
 * Stores the state of an instance of an item
 */
class BigBox_ItemState {
    constructor(info, player) {
        this.equipped = false;
        this.grabbable = null;
        this.loadingInProgress = false;
        this.info = info;
        this.player = player;
        if (info.props.model) {
            this.loadingInProgress = true;
            info.world.spawnAsset(info.props.model, new hz.Vec3(0, -100, 0)).then((entities) => {
                let spawned = entities[0];
                spawned.owner.set(player);
                this.grabbable = spawned.as(hz.GrabbableEntity);
                spawned.visible.set(false);
                this.loadingInProgress = false;
                if (this.equipped) {
                    this.equip();
                }
            });
        }
    }
    equip() {
        if (this.grabbable && this.grabbable.interactionMode.get() === hz.EntityInteractionMode.Grabbable) {
            this.grabbable.visible.set(true);
            this.grabbable.forceHold(this.player, hz.Handedness.Right, false); // currently does not support Horizon's build-in dropping
            this.equipped = true;
        }
        else if (this.loadingInProgress) { // queue an equip
            this.equipped = true;
        }
    }
    unequip() {
        if (this.grabbable) { // note: if we call this before item spawn, the item will be orphaned
            this.grabbable.forceRelease();
            this.grabbable.position.set(new hz.Vec3(0, -100, 0));
            this.grabbable.visible.set(false);
        }
        this.equipped = false;
    }
    dispose() {
        if (this.grabbable) {
            this.info.world.deleteAsset(this.grabbable);
            this.equipped = false;
        }
    }
}
exports.BigBox_ItemState = BigBox_ItemState;
/**
 * Componentize this script so it can be imported via an asset
 */
class ItemStateComponent extends hz.Component {
    start() {
    }
}
hz.Component.register(ItemStateComponent);
