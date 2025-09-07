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
exports.DebugEconomyEvents = void 0;
const hz = __importStar(require("horizon/core"));
const core_1 = require("horizon/core");
const PurchaseableItem_1 = require("PurchaseableItem");
exports.DebugEconomyEvents = {
    GrantItem: new hz.NetworkEvent("GrantItem"),
    ConsumeItem: new hz.NetworkEvent("ConsumeItem"),
    ResetItem: new hz.NetworkEvent("ResetItem"),
};
class DebugEconomy extends hz.Component {
    preStart() {
        this.connectNetworkBroadcastEvent(exports.DebugEconomyEvents.GrantItem, ({ player, itemSKU, quantity }) => {
            console.log("Granting to " + player + ": " + quantity + "x " + itemSKU);
            core_1.WorldInventory.grantItemToPlayer(player, itemSKU, quantity);
            this.sendUpdateUIEvent(player);
        });
        this.connectNetworkBroadcastEvent(exports.DebugEconomyEvents.ConsumeItem, ({ player, itemSKU, quantity }) => {
            console.log("Consuming from " + player + ": " + quantity + "x " + itemSKU);
            core_1.WorldInventory.consumeItemForPlayer(player, itemSKU, quantity);
            this.sendUpdateUIEvent(player);
        });
        this.connectNetworkBroadcastEvent(exports.DebugEconomyEvents.ResetItem, ({ player, itemSKU }) => {
            console.log("Resetting " + player + "'s " + itemSKU);
            core_1.WorldInventory.getPlayerEntitlementQuantity(player, itemSKU).then((count) => {
                console.log("Player has " + count + "x " + itemSKU + ", consuming all");
                core_1.WorldInventory.consumeItemForPlayer(player, itemSKU, count);
                this.sendUpdateUIEvent(player);
            });
        });
    }
    start() {
    }
    sendUpdateUIEvent(player) {
        this.async.setTimeout(() => {
            this.sendNetworkBroadcastEvent(PurchaseableItem_1.PurchaseableItemEvents.OnInventoryChanged, ({ player }));
        }, 3000);
    }
}
DebugEconomy.propsDefinition = {
    active: { type: hz.PropTypes.Boolean, default: false },
};
hz.Component.register(DebugEconomy);
