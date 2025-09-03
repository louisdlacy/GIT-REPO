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
const Kitchen_1 = require("Kitchen");
class KitchenManager extends hz.Component {
    constructor() {
        super(...arguments);
        this.kitchens = [];
        this.kitchenAssignmentAttempts = 0;
        this.maxKitchenAssignmentAttempts = 5;
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player) => {
            console.log("Player entered world");
            if (player.name.get() !== "Trader") {
                this.getPlayerKitchen(player);
            }
        });
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (player) => {
            if (this.kitchens.length > player.index.get()) {
                const kitchen = this.kitchens[player.index.get()];
                this.sendLocalEvent(kitchen, Kitchen_1.KitchenEvents.SetOwner, { owner: undefined });
            }
        });
    }
    start() {
    }
    getPlayerKitchen(player) {
        if (player === undefined)
            return;
        if (this.kitchens.length > player.index.get()) {
            console.log("Assigning kitchen");
            const kitchen = this.kitchens[player.index.get()];
            this.sendLocalEvent(kitchen, Kitchen_1.KitchenEvents.SetOwner, { owner: player });
        }
        else {
            this.populateKitchens();
            this.async.setTimeout(() => {
                console.log("Not enough kitchens. Retrying...");
                if (this.kitchenAssignmentAttempts < this.maxKitchenAssignmentAttempts) {
                    this.kitchenAssignmentAttempts++;
                    this.getPlayerKitchen(player);
                }
            }, 1000);
        }
    }
    populateKitchens() {
        if (this.props.kitchen1 !== undefined && this.kitchens.indexOf(this.props.kitchen1) === -1) {
            this.kitchens.push(this.props.kitchen1);
        }
        if (this.props.kitchen2 !== undefined && this.kitchens.indexOf(this.props.kitchen2) === -1) {
            this.kitchens.push(this.props.kitchen2);
        }
        if (this.props.kitchen3 !== undefined && this.kitchens.indexOf(this.props.kitchen3) === -1) {
            this.kitchens.push(this.props.kitchen3);
        }
        if (this.props.kitchen4 !== undefined && this.kitchens.indexOf(this.props.kitchen4) === -1) {
            this.kitchens.push(this.props.kitchen4);
        }
    }
}
KitchenManager.propsDefinition = {
    kitchen1: { type: hz.PropTypes.Entity },
    kitchen2: { type: hz.PropTypes.Entity },
    kitchen3: { type: hz.PropTypes.Entity },
    kitchen4: { type: hz.PropTypes.Entity },
};
hz.Component.register(KitchenManager);
