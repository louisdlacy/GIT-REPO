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
const DoorCutscene_1 = require("DoorCutscene");
const hz = __importStar(require("horizon/core"));
class DoorButton extends hz.Component {
    start() {
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            if (this.props.doorCutscene !== undefined && this.props.doorCutscene !== null) {
                this.sendLocalEvent(this.props.doorCutscene, DoorCutscene_1.CutsceneEvents.OnStartCutscene, { player, doorButton: this.entity });
                this.entity.as(hz.TriggerGizmo).enabled.set(false);
            }
            else {
                console.warn("DoorButton pressed, but no doorCutscene was set in the props.");
            }
        });
        this.connectNetworkEvent(this.entity, DoorCutscene_1.CutsceneEvents.OnCutsceneComplete, () => {
            this.entity.as(hz.TriggerGizmo).enabled.set(true);
        });
    }
}
DoorButton.propsDefinition = {
    doorCutscene: { type: hz.PropTypes.Entity }
};
hz.Component.register(DoorButton);
