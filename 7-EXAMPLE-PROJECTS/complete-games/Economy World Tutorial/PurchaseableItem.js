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
exports.PurchaseableItem = exports.PurchaseableItemEvents = void 0;
const hz = __importStar(require("horizon/core"));
const core_1 = require("horizon/core");
const core_2 = require("horizon/core");
exports.PurchaseableItemEvents = {
    OnConsumeItem: new hz.NetworkEvent('OnConsumeItem'),
    OnReceiveItem: new hz.NetworkEvent('OnReceiveItem'),
    OnInventoryChanged: new hz.NetworkEvent('OnInventoryChanged'),
};
class PurchaseableItem extends hz.Component {
    preStart() {
    }
    start() {
        this.updateText("Purchase " + this.props.itemCurrency + ": " + this.props.priceAmount + " " + this.props.priceCurrency + "s");
    }
    onAttemptPurchase(player) {
        core_2.WorldInventory.getPlayerEntitlementQuantity(player, this.props.priceSKU).then((quantity) => {
            if (quantity >= this.props.priceAmount) {
                this.onPurchaseSuccess(player);
            }
            else {
                const shortfall = this.props.priceAmount - Number(quantity);
                this.onPurchaseFail(player, shortfall);
            }
        });
    }
    onPurchaseSuccess(player) {
        core_2.WorldInventory.grantItemToPlayer(player, this.props.itemSKU, this.props.itemAmount);
        this.sendNetworkBroadcastEvent(exports.PurchaseableItemEvents.OnReceiveItem, { player: player, itemSKU: this.props.itemSKU, itemAmount: this.props.itemAmount });
        this.updateText("", false);
    }
    onPurchaseFail(player, shortfall) {
        this.updateFailText(("Not enough " + this.props.priceCurrency + "s: " + shortfall + " more needed"));
    }
    updateText(text, visible = true) {
        if (this.props.priceTxt !== undefined && this.props.priceTxt !== null) {
            this.props.priceTxt.as(core_1.TextGizmo).text.set(text);
            this.props.priceTxt.as(core_1.TextGizmo).visible.set(visible);
        }
    }
    updateFailText(text, visible = true) {
        console.log("Showing error text: " + this.props.errorTxt);
        if (this.props.errorTxt !== undefined && this.props.errorTxt !== null) {
            console.log("Setting error text to: " + text);
            this.props.errorTxt.as(core_1.TextGizmo).text.set(text);
            this.props.errorTxt.as(core_1.TextGizmo).visible.set(visible);
            this.async.setTimeout(() => {
                if (this.props.errorTxt !== undefined && this.props.errorTxt !== null) {
                    this.props.errorTxt.as(core_1.TextGizmo).visible.set(false);
                }
            }, 3000);
        }
    }
}
exports.PurchaseableItem = PurchaseableItem;
PurchaseableItem.propsDefinition = {
    trigger: { type: hz.PropTypes.Entity },
    priceSKU: { type: hz.PropTypes.String },
    priceCurrency: { type: hz.PropTypes.String },
    priceAmount: { type: hz.PropTypes.Number },
    priceTxt: { type: hz.PropTypes.Entity },
    itemSKU: { type: hz.PropTypes.String },
    itemCurrency: { type: hz.PropTypes.String },
    itemAmount: { type: hz.PropTypes.Number },
    errorTxt: { type: hz.PropTypes.Entity },
};
hz.Component.register(PurchaseableItem);
