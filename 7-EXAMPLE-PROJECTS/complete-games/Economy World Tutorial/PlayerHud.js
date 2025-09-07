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
const ui_1 = require("horizon/ui");
const PurchaseableItem_1 = require("PurchaseableItem");
const SimpleLootItem_1 = require("SimpleLootItem");
class PlayerHud extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.currency1CountBinding = new ui_1.Binding(0);
        this.currency2CountBinding = new ui_1.Binding(0);
        this.currency3CountBinding = new ui_1.Binding(0);
        this.owner = undefined;
        // Platform-specific position values as Bindings
        this.topPositionBinding = new ui_1.Binding(0);
        this.rightPositionBinding = new ui_1.Binding(0);
    }
    preStart() {
        this.connectNetworkBroadcastEvent(SimpleLootItem_1.SimpleLootItemEvents.OnPickupLoot, ({ player, sku, count }) => {
            if (this.owner === player) {
                this.async.setTimeout(() => {
                    hz.WorldInventory.getPlayerEntitlementQuantity(player, this.props.currency1SKU).then(quantity => {
                        this.currency1CountBinding.set(Number(quantity));
                    });
                }, 1500);
            }
        });
        this.connectNetworkBroadcastEvent(PurchaseableItem_1.PurchaseableItemEvents.OnReceiveItem, ({ player, itemSKU, itemAmount }) => {
            if (this.owner === player) {
                this.async.setTimeout(() => {
                    hz.WorldInventory.getPlayerEntitlementQuantity(player, itemSKU).then(quantity => {
                        this.updateForSKU(itemSKU, quantity);
                    });
                }, 1500);
            }
        });
        this.connectNetworkBroadcastEvent(PurchaseableItem_1.PurchaseableItemEvents.OnConsumeItem, ({ player, itemSKU, itemAmount }) => {
            if (this.owner === player) {
                this.async.setTimeout(() => {
                    hz.WorldInventory.getPlayerEntitlementQuantity(player, itemSKU).then(quantity => {
                        this.updateForSKU(itemSKU, quantity);
                    });
                }, 1500);
            }
        });
        this.connectNetworkBroadcastEvent(PurchaseableItem_1.PurchaseableItemEvents.OnInventoryChanged, ({ player }) => {
            if (this.owner === player) {
                this.async.setTimeout(() => {
                    this.updateUI();
                }, 1500);
            }
        });
        this.connectNetworkBroadcastEvent(hz.InWorldShopHelpers.OnPlayerPurchasedItemEvent, (payload) => {
            const player = payload.playerId;
            if (this.owner && this.owner.id === player) {
                this.async.setTimeout(() => {
                    this.updateUI();
                }, 1500);
            }
        });
        // Add your own event listeners for players receiving or consuming items here
    }
    updateUI() {
        if (this.owner !== undefined && this.owner !== this.world.getServerPlayer()) {
            hz.WorldInventory.getPlayerEntitlements(this.owner).then(entitlements => {
                entitlements.forEach((entitlement) => {
                    this.updateForSKU(entitlement.sku, entitlement.quantity);
                });
            });
            // Set platform-specific position values
            const isMobile = this.world.getLocalPlayer().deviceType.get() === hz.PlayerDeviceType.Mobile;
            this.topPositionBinding.set(isMobile ? PlayerHud.MOBILE_TOP_POSITION : PlayerHud.DESKTOP_TOP_POSITION);
            this.rightPositionBinding.set(isMobile ? PlayerHud.MOBILE_RIGHT_POSITION : PlayerHud.DESKTOP_RIGHT_POSITION);
        }
    }
    updateForSKU(sku, quantity) {
        if (sku === this.props.currency1SKU) {
            this.currency1CountBinding.set(Number(quantity));
        }
        if (sku === this.props.currency2SKU) {
            this.currency2CountBinding.set(Number(quantity));
        }
        if (sku === this.props.currency3SKU) {
            this.currency3CountBinding.set(Number(quantity));
        }
    }
    start() {
    }
    receiveOwnership(_serializableState, _oldOwner, _newOwner) {
        if (_newOwner !== this.world.getServerPlayer()) {
            console.log("Setting hud owner: " + _newOwner.name.get());
            this.owner = _newOwner;
            this.updateUI();
            this.connectCodeBlockEvent(this.owner, hz.CodeBlockEvents.OnItemPurchaseComplete, (player, item, success) => {
                console.log(player.name.get() + " purchased " + item + " with success: " + success);
            });
        }
    }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.View)({
                    children: [
                        (0, ui_1.Image)({
                            source: ui_1.ImageSource.fromTextureAsset(this.props.currency1Texture),
                            style: { height: 40, width: 40 }
                        }),
                        (0, ui_1.Text)({
                            text: this.currency1CountBinding.derive((count) => {
                                return "x " + count;
                            }),
                            style: {
                                color: 'white',
                                fontSize: 20,
                                paddingTop: 10,
                            }
                        })
                    ],
                    style: {
                        flexDirection: 'row',
                    }
                }),
                (0, ui_1.View)({
                    children: [
                        (0, ui_1.Image)({
                            source: ui_1.ImageSource.fromTextureAsset(this.props.currency2Texture),
                            style: { height: 40, width: 40 }
                        }),
                        (0, ui_1.Text)({
                            text: this.currency2CountBinding.derive((count) => {
                                return "x " + count;
                            }),
                            style: {
                                color: 'white',
                                fontSize: 20,
                                paddingTop: 10,
                            }
                        }),
                    ],
                    style: {
                        flexDirection: 'row',
                    }
                }),
                (0, ui_1.View)({
                    children: [
                        (0, ui_1.Image)({
                            source: ui_1.ImageSource.fromTextureAsset(this.props.currency3Texture),
                            style: { height: 40, width: 40 }
                        }),
                        (0, ui_1.Text)({
                            text: this.currency3CountBinding.derive((count) => {
                                return "X " + count;
                            }),
                            style: {
                                color: 'white',
                                fontSize: 20,
                                paddingTop: 10,
                            }
                        })
                    ],
                    style: {
                        flexDirection: 'row',
                    }
                })
            ],
            style: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                width: 100,
                position: 'absolute',
                top: this.topPositionBinding,
                right: this.rightPositionBinding,
                margin: 20,
                padding: 5,
                borderRadius: 5
            }
        });
    }
}
PlayerHud.propsDefinition = {
    currency1Name: { type: hz.PropTypes.String },
    currency1SKU: { type: hz.PropTypes.String },
    currency1Texture: { type: hz.PropTypes.Asset },
    currency2Name: { type: hz.PropTypes.String },
    currency2SKU: { type: hz.PropTypes.String },
    currency2Texture: { type: hz.PropTypes.Asset },
    currency3Name: { type: hz.PropTypes.String },
    currency3SKU: { type: hz.PropTypes.String },
    currency3Texture: { type: hz.PropTypes.Asset },
};
// Position constants for easy adjustment
PlayerHud.MOBILE_TOP_POSITION = 90;
PlayerHud.MOBILE_RIGHT_POSITION = 60;
PlayerHud.DESKTOP_TOP_POSITION = 120;
PlayerHud.DESKTOP_RIGHT_POSITION = 29;
hz.Component.register(PlayerHud);
