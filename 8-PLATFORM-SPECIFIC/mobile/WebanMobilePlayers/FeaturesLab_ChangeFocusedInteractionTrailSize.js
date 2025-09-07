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
class FeaturesLab_ChangeFocusedInteractionTrailSize extends hz.Component {
    constructor() {
        super(...arguments);
        this.size = [1.0, 1.2, 0.6];
        this.currentSizeIndex = 0;
    }
    start() {
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            this.currentSizeIndex = (this.currentSizeIndex + 1) % this.size.length;
            this.sendNetworkEvent(player, sysEvents_1.sysEvents.OnSetFocusedInteractionTrailOptions, {
                enabled: true,
                trailOptions: {
                    startWidth: this.size[this.currentSizeIndex],
                    endWidth: 0.1,
                }
            });
            (0, sysUtils_1.SetTextGizmoText)(this.props.changeTrailSizeText, `Focused Interaction<br>Changed the trail size to ${this.size[this.currentSizeIndex].toString()}`);
        });
    }
}
FeaturesLab_ChangeFocusedInteractionTrailSize.propsDefinition = {
    changeTrailSizeText: { type: hz.PropTypes.Entity },
};
hz.Component.register(FeaturesLab_ChangeFocusedInteractionTrailSize);
