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
const hz = __importStar(require("horizon/core"));
const core_1 = require("horizon/core");
const Kitchen_1 = require("Kitchen");
const PurchaseableItem_1 = require("PurchaseableItem");
class Oven extends PurchaseableItem_1.PurchaseableItem {
    constructor() {
        super(...arguments);
        this.owner = undefined;
        this.purchased = false;
        this.bakeRemaining = -1;
        this.bakeIntervalDelayS = 0.1;
        this.bakeIntervalId = -1;
    }
    preStart() {
        super.preStart();
        if (this.props.trigger !== undefined && this.props.trigger !== null) {
            this.connectCodeBlockEvent(this.props.trigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
                this.onPlayerEnterTrigger(player);
            });
        }
        this.connectLocalEvent(this.entity, Kitchen_1.KitchenEvents.SetOvenOwner, ({ owner, purchased }) => {
            this.setOwner(owner);
            this.setPurchased(purchased);
        });
    }
    start() {
        super.start();
    }
    reset() {
        this.setPurchased(false);
        if (this.bakeRemaining > 0) {
            this.async.clearInterval(this.bakeIntervalId);
            this.bakeIntervalId = -1;
            this.bakeRemaining = -1;
        }
        this.clearOwner();
    }
    onPlayerEnterTrigger(player) {
        if (this.owner === player) {
            if (!this.purchased) {
                this.onAttemptPurchase(player);
            }
            else {
                this.attemptPieBake();
            }
        }
    }
    setOwner(owner) {
        if (owner === undefined || owner === null) {
            this.reset();
            return;
        }
        this.owner = owner;
        this.connectCodeBlockEvent(this.owner, hz.CodeBlockEvents.OnItemPurchaseComplete, (player, item, success) => {
            console.log(player.name.get() + " purchased " + item + " with success: " + success);
        });
    }
    clearOwner() {
        this.owner = this.world.getServerPlayer();
    }
    onPurchaseSuccess(player) {
        super.onPurchaseSuccess(player);
        this.setPurchased(true);
    }
    setPurchased(purchased) {
        this.purchased = purchased;
        if (this.props.ovenMesh !== undefined && this.props.ovenMesh !== null) {
            this.props.ovenMesh.visible.set(purchased);
        }
        if (purchased) {
            this.updateText("Bake Apple Pie: " + this.props.piePriceAmount + " Apples");
        }
    }
    attemptPieBake() {
        if (this.owner === undefined || this.bakeRemaining > 0) {
            return;
        }
        const owner = this.owner;
        core_1.WorldInventory.getPlayerEntitlementQuantity(owner, this.props.piePriceSKU).then((quantity) => {
            if (quantity >= this.props.piePriceAmount) {
                core_1.WorldInventory.consumeItemForPlayer(owner, this.props.piePriceSKU, this.props.piePriceAmount);
                this.sendNetworkBroadcastEvent(PurchaseableItem_1.PurchaseableItemEvents.OnConsumeItem, { player: owner, itemSKU: this.props.piePriceSKU, itemAmount: this.props.piePriceAmount });
                this.startBakingPie();
            }
            else {
                const shortfall = this.props.piePriceAmount - Number(quantity);
                this.updateFailText("Not enough apples. " + shortfall + " more needed!");
            }
        });
    }
    startBakingPie() {
        this.bakeRemaining = this.props.pieBakeDuration;
        this.bakeIntervalId = this.async.setInterval(() => {
            this.bakeUpdate(this.bakeIntervalDelayS);
        }, this.bakeIntervalDelayS * 1000);
    }
    bakeUpdate(deltaTime) {
        this.bakeRemaining -= deltaTime;
        this.updateText("Baking Apple Pie: " + this.bakeRemaining.toFixed(1) + "s");
        if (this.bakeRemaining <= 0) {
            this.async.clearInterval(this.bakeIntervalId);
            this.bakeIntervalId = -1;
            this.onPieBakeComplete();
        }
    }
    onPieBakeComplete() {
        if (this.owner === undefined) {
            return;
        }
        core_1.WorldInventory.grantItemToPlayer(this.owner, this.props.pieSKU, this.props.pieAmount);
        this.sendNetworkBroadcastEvent(PurchaseableItem_1.PurchaseableItemEvents.OnReceiveItem, { player: this.owner, itemSKU: this.props.pieSKU, itemAmount: this.props.pieAmount });
        this.updateText("Bake Apple Pie: " + this.props.piePriceAmount + " Apples");
    }
}
Oven.propsDefinition = {
    ...PurchaseableItem_1.PurchaseableItem.propsDefinition,
    ovenMesh: { type: hz.PropTypes.Entity },
    piePriceSKU: { type: hz.PropTypes.String },
    piePriceAmount: { type: hz.PropTypes.Number, default: 1 },
    pieSKU: { type: hz.PropTypes.String },
    pieAmount: { type: hz.PropTypes.Number, default: 1 },
    pieBakeDuration: { type: hz.PropTypes.Number, default: 15 },
};
hz.Component.register(Oven);
