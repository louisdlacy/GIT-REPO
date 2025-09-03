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
const DebugEconomy_1 = require("DebugEconomy");
const hz = __importStar(require("horizon/core"));
const core_1 = require("horizon/core");
const ui_1 = require("horizon/ui");
const SimpleLootItem_1 = require("SimpleLootItem");
class DebugEconomy extends ui_1.UIComponent {
    constructor() {
        super(...arguments);
        this.itemSKU = 'apple_615786d0';
        this.owner = undefined;
        this.itemCountBinding = new ui_1.Binding('0');
        this.itemCountUpdating = new ui_1.Binding(false);
        this.itemNameBinding = new ui_1.Binding('Apple');
        this.toggleDebugEconomy = undefined;
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player) => {
            if (player.name.get() !== "Trader") {
                console.log("Setting owner of DebugEconomyUI to " + player.name.get());
                this.entity.owner.set(player);
            }
        });
    }
    start() {
        if (this.props.itemSKU === undefined) {
            console.warn("DebugEconomyUI: itemSKU is undefined. Using default apple_615786d0.");
        }
        else {
            this.itemSKU = this.props.itemSKU;
        }
        if (this.props.itemName === undefined) {
            console.warn("DebugEconomyUI: itemName is undefined. Using default Apple.");
        }
        else {
            this.itemNameBinding.set(this.props.itemName);
        }
    }
    onDebugTogglePressed() {
        this.entity.visible.set(!this.entity.visible.get());
    }
    receiveOwnership(_serializableState, _oldOwner, _newOwner) {
        if (_newOwner !== this.world.getServerPlayer()) {
            this.owner = _newOwner;
            this.updateUI();
            this.connectNetworkBroadcastEvent(SimpleLootItem_1.SimpleLootItemEvents.OnPickupLoot, ({ player, sku, count }) => {
                console.log("Player collected loot: " + player.name.get());
                if (player === this.owner && sku === this.itemSKU) {
                    console.log("This player and this sku");
                }
                this.updateUI();
            });
            if (this.props.active) {
                this.toggleDebugEconomy = hz.PlayerControls.connectLocalInput(hz.PlayerInputAction.LeftTertiary, hz.ButtonIcon.Menu, this, { preferredButtonPlacement: hz.ButtonPlacement.Center });
                this.toggleDebugEconomy.registerCallback((action, pressed) => {
                    if (pressed) {
                        this.onDebugTogglePressed();
                    }
                });
            }
        }
        else {
            this.itemCountBinding.reset();
        }
    }
    updateUI() {
        if (this.owner !== undefined) {
            console.log("Updating UI");
            core_1.WorldInventory.getPlayerEntitlementQuantity(this.owner, this.itemSKU).then((invCount) => {
                console.log("New " + this.props.itemName + " count: " + invCount.toString());
                this.itemCountBinding.set(invCount.toString());
            });
        }
    }
    initializeUI() {
        return (0, ui_1.View)({
            children: [
                (0, ui_1.Pressable)({
                    children: [
                        (0, ui_1.Text)({
                            text: this.itemNameBinding.derive((value) => { return "+" + this.props.grantAmount + " " + value + "s"; }),
                        })
                    ],
                    style: {
                        backgroundColor: 'lightgreen',
                        padding: 4,
                    },
                    onClick: () => {
                        if (this.owner !== undefined) {
                            this.sendNetworkBroadcastEvent(DebugEconomy_1.DebugEconomyEvents.GrantItem, { player: this.owner, itemSKU: this.itemSKU, quantity: this.props.grantAmount });
                            this.itemCountUpdating.set(true);
                            this.async.setTimeout(() => {
                                this.itemCountUpdating.set(false);
                                this.updateUI();
                            }, 5000);
                        }
                    }
                }),
                (0, ui_1.Pressable)({
                    children: [
                        (0, ui_1.Text)({
                            text: this.itemNameBinding.derive((value) => { return "-" + this.props.consumeAmount + " " + value + "s"; }),
                        })
                    ],
                    style: {
                        backgroundColor: 'pink',
                        padding: 4,
                    },
                    onClick: () => {
                        if (this.owner !== undefined) {
                            this.sendNetworkBroadcastEvent(DebugEconomy_1.DebugEconomyEvents.ConsumeItem, { player: this.owner, itemSKU: this.itemSKU, quantity: this.props.consumeAmount });
                            this.itemCountUpdating.set(true);
                            this.async.setTimeout(() => {
                                this.itemCountUpdating.set(false);
                                this.updateUI();
                            }, 5000);
                        }
                    }
                }),
                (0, ui_1.Pressable)({
                    children: [
                        (0, ui_1.Text)({
                            text: this.itemNameBinding.derive((value) => { return 'Reset ' + value + "s"; }),
                        })
                    ],
                    style: {
                        backgroundColor: 'red',
                        padding: 4,
                    },
                    onClick: () => {
                        if (this.owner !== undefined) {
                            this.sendNetworkBroadcastEvent(DebugEconomy_1.DebugEconomyEvents.ResetItem, { player: this.owner, itemSKU: this.itemSKU });
                            this.itemCountUpdating.set(true);
                            this.async.setTimeout(() => {
                                this.itemCountUpdating.set(false);
                                this.updateUI();
                            }, 5000);
                        }
                    }
                }),
            ],
            style: {
                position: 'absolute',
                height: 100,
                width: 200,
                backgroundColor: this.itemCountUpdating.derive((updating) => { return (updating) ? 'gray' : 'black'; }),
                right: 20,
                bottom: 100,
            },
        });
    }
}
DebugEconomy.propsDefinition = {
    active: { type: hz.PropTypes.Boolean, default: false },
    itemSKU: { type: hz.PropTypes.String },
    itemName: { type: hz.PropTypes.String },
    grantAmount: { type: hz.PropTypes.Number, default: 5 },
    consumeAmount: { type: hz.PropTypes.Number, default: 5 },
};
hz.Component.register(DebugEconomy);
