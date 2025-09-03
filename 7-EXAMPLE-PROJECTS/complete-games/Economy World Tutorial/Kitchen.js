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
exports.KitchenEvents = void 0;
const hz = __importStar(require("horizon/core"));
const core_1 = require("horizon/core");
exports.KitchenEvents = {
    SetOwner: new hz.LocalEvent('SetOwner'),
    SetOvenOwner: new hz.LocalEvent('SetOvenOwner'),
};
class Kitchen extends hz.Component {
    constructor() {
        super(...arguments);
        this.ovens = [];
    }
    preStart() {
        this.connectLocalEvent(this.entity, exports.KitchenEvents.SetOwner, ({ owner }) => {
            this.setKitchenOwner(owner);
        });
    }
    start() {
        this.setKitchenOwner(undefined);
        if (this.props.oven1 !== undefined && this.props.oven2 !== undefined && this.props.oven3 !== undefined && this.props.oven4 !== undefined) {
            this.ovens = [this.props.oven1, this.props.oven2, this.props.oven3, this.props.oven4];
        }
    }
    setKitchenOwner(owner) {
        if (owner !== undefined) {
            this.entity.visible.set(true);
            this.entity.collidable.set(true);
            core_1.WorldInventory.getPlayerEntitlementQuantity(owner, this.props.ovenSku).then((quantity) => {
                if (quantity == 0) {
                    if (this.ovens.length > 0) {
                        core_1.WorldInventory.grantItemToPlayer(owner, this.props.ovenSku, 1);
                        this.sendLocalEvent(this.ovens[0], exports.KitchenEvents.SetOvenOwner, { owner, purchased: true });
                    }
                }
                else {
                    for (let i = 0; i < this.ovens.length; i++) {
                        const purchased = i < quantity;
                        this.sendLocalEvent(this.ovens[i], exports.KitchenEvents.SetOvenOwner, { owner, purchased });
                    }
                }
            });
            if (this.props.kitchenTxtInternal !== undefined) {
                this.props.kitchenTxtInternal.visible.set(true);
                this.props.kitchenTxtInternal.as(hz.TextGizmo).text.set(owner.name.get() + " Kitchen");
            }
            if (this.props.kitchenTxtExternal !== undefined) {
                this.props.kitchenTxtExternal.visible.set(true);
                this.props.kitchenTxtExternal.as(hz.TextGizmo).text.set(owner.name.get() + " Kitchen");
            }
        }
        else {
            this.ovens.forEach((oven) => {
                this.sendLocalEvent(oven, exports.KitchenEvents.SetOwner, { owner: undefined });
            });
            this.entity.visible.set(false);
            this.entity.collidable.set(false);
            this.props.kitchenTxtInternal?.visible.set(false);
            this.props.kitchenTxtExternal?.visible.set(false);
        }
    }
}
Kitchen.propsDefinition = {
    oven1: { type: hz.PropTypes.Entity },
    oven2: { type: hz.PropTypes.Entity },
    oven3: { type: hz.PropTypes.Entity },
    oven4: { type: hz.PropTypes.Entity },
    ovenSku: { type: hz.PropTypes.String },
    kitchenTxtInternal: { type: hz.PropTypes.Entity },
    kitchenTxtExternal: { type: hz.PropTypes.Entity }
};
hz.Component.register(Kitchen);
