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
const sysEvents_1 = require("sysEvents");
const sysUtils_1 = require("sysUtils");
class FeaturesLab_ChangeFocusedInteractionTapColor extends hz.Component {
    constructor() {
        super(...arguments);
        this.colors = [hz.Color.white, hz.Color.red, hz.Color.blue, hz.Color.green];
        this.colorStrings = ["white", "red", "blue", "green"];
        this.currentColorIndex = 0;
    }
    start() {
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
            this.sendNetworkEvent(player, sysEvents_1.sysEvents.OnSetFocusedInteractionTapOptions, {
                enabled: true,
                tapOptions: {
                    startColor: this.colors[this.currentColorIndex],
                    endColor: this.colors[this.currentColorIndex],
                }
            });
            (0, sysUtils_1.SetTextGizmoText)(this.props.changeTapColorText, `Focused Interaction<br>Changed the tap color to ${this.colorStrings[this.currentColorIndex]}`);
        });
    }
}
FeaturesLab_ChangeFocusedInteractionTapColor.propsDefinition = {
    changeTapColorText: { type: hz.PropTypes.Entity },
};
hz.Component.register(FeaturesLab_ChangeFocusedInteractionTapColor);
