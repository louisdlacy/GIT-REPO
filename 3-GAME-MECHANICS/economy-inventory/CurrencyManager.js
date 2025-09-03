"use strict";
/* READ ME
TUTORIAL VIDEO
https://youtu.be/e0twyvyUEBE

REQUIREMENTS
Go to Systems > Variable Groups and create a Player Persistent Variable wIth the Number data type
Set the VariableGroup Value in the Collectable Entity and the UI Entity to the new Variable Group

To add additional ways to spend/earn money you must update the CurrencyManager whenever currency
is remove/awarded. To do that first import the NetworkEvent outside of the class
  const currencyUpdate = new hz.NetworkEvent<{ oldValue: number; newValue: number; player: hz.Player }>('currencyUpdate');
Then send this network event and the UI will update.
  this.sendNetworkBroadcastEvent(currencyUpdate, {oldValue, newValue, player});

For additional help or suggestions join the discord server:
https://discord.gg/H9823Yw5q2

Vatonage ©
*/
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
exports.currencyUpdate = void 0;
const hz = __importStar(require("horizon/core"));
const ui = __importStar(require("horizon/ui"));
exports.currencyUpdate = new hz.NetworkEvent('currencyUpdate');
class Collectable extends hz.Component {
    constructor() {
        super(...arguments);
        this.active = true;
        this.trigger = null;
    }
    start() {
        this.entity.children.get().forEach(element => {
            if (element.name.get() == "CollectionTrigger") {
                this.trigger = element;
            }
        });
        this.connectCodeBlockEvent(this.trigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            if (this.active) {
                const oldValue = this.world.persistentStorage.getPlayerVariable(player, this.props.VariableGroup) ?? 0;
                const newValue = oldValue + this.props.CurrencyAmount;
                this.world.persistentStorage.setPlayerVariable(player, this.props.VariableGroup, newValue);
                this.sendNetworkBroadcastEvent(exports.currencyUpdate, { oldValue, newValue, player });
                this.active = false;
                this.entity.visible.set(false);
                this.entity.collidable.set(false);
                this.async.setTimeout(() => {
                    this.entity.visible.set(true);
                    this.entity.collidable.set(true);
                    this.active = true;
                }, this.props.RespawnTime * 1000);
            }
        });
    }
}
Collectable.propsDefinition = {
    VariableGroup: { type: hz.PropTypes.String },
    CurrencyAmount: { type: hz.PropTypes.Number, default: 10 },
    RespawnTime: { type: hz.PropTypes.Number, default: 60 },
};
class Core extends ui.UIComponent {
    constructor() {
        super(...arguments);
        this.currencyAmount = new ui.Binding("0");
        this.currencyChange = new ui.Binding(0);
        this.displayCurrencyChange = new ui.Binding(false);
    }
    start() {
        this.connectNetworkBroadcastEvent(exports.currencyUpdate, (data) => {
            this.setUI(data.oldValue, data.newValue, data.player);
        });
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player) => {
            this.setUI(0, this.world.persistentStorage.getPlayerVariable(player, this.props.VariableGroup) ?? 0, player);
        });
    }
    setUI(oldValue, newValue, player) {
        this.currencyAmount.set(this.shortenNumber(newValue), [player]);
        if (this.props.DisplayChange) {
            this.currencyChange.set(newValue - oldValue, [player]);
            this.displayCurrencyChange.set(true, [player]);
            this.async.setTimeout(() => {
                this.displayCurrencyChange.set(false, [player]);
            }, 1000);
        }
    }
    initializeUI() {
        const CurrencyImage = this.props.CurrencyImage ? ui.ImageSource.fromTextureAsset(this.props.CurrencyImage.as(hz.TextureAsset)) : null;
        return ui.View({
            children: [
                ui.View({
                    children: ui.UINode.if(this.displayCurrencyChange, this.goldChangeText()),
                    style: {
                        position: 'absolute',
                        bottom: this.props.DisplaySize + 8,
                        left: 0,
                    },
                }),
                ui.View({
                    children: [
                        ui.Image({
                            source: CurrencyImage,
                            style: {
                                width: this.props.DisplaySize,
                                height: this.props.DisplaySize,
                                marginRight: 8,
                            },
                        }),
                        ui.Text({
                            text: this.currencyAmount.derive((currency) => `${currency}`),
                            style: {
                                fontSize: this.props.DisplaySize,
                                color: this.props.TextColor,
                            },
                        }),
                    ],
                    style: {
                        flexDirection: 'row',
                        alignItems: 'center',
                    },
                }),
            ],
            style: {
                position: 'absolute',
                bottom: 8,
                left: 16,
            },
        });
    }
    goldChangeText() {
        return ui.Text({
            text: this.currencyChange.derive((change) => `${change > 0 ? '+' : ''}${change}`),
            style: {
                fontSize: this.props.DisplaySize / 2,
                color: this.currencyChange.derive((change) => change > 0 ? '#00ff00' : '#ff0000'),
            },
        });
    }
    shortenNumber(num) {
        if (this.props.AbbreviateCurrency) {
            if (num < 100) {
                return (Math.floor(num * 100) / 100).toString();
            }
            else if (num < 1000) {
                return Math.floor(num).toString();
            }
            else if (num < 10000) {
                return Math.floor(num / 10) / 100 + "K";
            }
            else if (num < 100000) {
                return Math.floor(num / 100) / 10 + "K";
            }
            else if (num < 1000000) {
                return Math.floor(num / 1000) + "K";
            }
            else if (num < 10000000) {
                return Math.floor(num / 10000) / 100 + "M";
            }
            else if (num < 100000000) {
                return Math.floor(num / 100000) / 10 + "M";
            }
            else if (num < 1000000000) {
                return Math.floor(num / 1000000) + "M";
            }
            else if (num < 10000000000) {
                return Math.floor(num / 10000000) / 100 + "B";
            }
            else if (num < 100000000000) {
                return Math.floor(num / 100000000) / 10 + "B";
            }
            else if (num < 1000000000000) {
                return Math.floor(num / 1000000000) + "B";
            }
            else if (num < 10000000000000) {
                return Math.floor(num / 10000000000) / 100 + "T";
            }
            else if (num < 100000000000000) {
                return Math.floor(num / 100000000000) / 10 + "T";
            }
            else if (num < 1000000000000000) {
                return Math.floor(num / 1000000000000) + "T";
            }
            else if (num < 10000000000000000) {
                return Math.floor(num / 10000000000000) / 100 + "Qa";
            }
            else if (num < 100000000000000000) {
                return Math.floor(num / 100000000000000) / 10 + "Qa";
            }
            else if (num < 1000000000000000000) {
                return Math.floor(num / 1000000000000000) + "Qa";
            }
            else if (num < 10000000000000000000) {
                return Math.floor(num / 10000000000000000) / 100 + "Qi";
            }
            else if (num < 100000000000000000000) {
                return Math.floor(num / 100000000000000000) / 10 + "Qi";
            }
            else if (num < 1000000000000000000000) {
                return Math.floor(num / 1000000000000000000) + "Qi";
            }
        }
        return Math.floor(num).toString();
    }
}
Core.propsDefinition = {
    VariableGroup: { type: hz.PropTypes.String },
    DisplayChange: { type: hz.PropTypes.Boolean, default: true },
    AbbreviateCurrency: { type: hz.PropTypes.Boolean, default: true },
    DisplaySize: { type: hz.PropTypes.Number, default: 100 },
    TextColor: { type: hz.PropTypes.String, default: "#d4af37" },
    CurrencyImage: { type: hz.PropTypes.Asset },
};
hz.Component.register(Core);
hz.Component.register(Collectable);
