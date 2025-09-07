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
class FeaturesLab_Attach2DUI extends hz.Component {
    constructor() {
        super(...arguments);
        this.originalPos = new hz.Vec3(0, 0, 0);
        this.originalRot = new hz.Quaternion(0, 0, 0, 0);
        this.originalScale = new hz.Vec3(0, 0, 0);
    }
    start() {
        const hud = this.props.hud;
        if (hud === undefined)
            return;
        this.originalPos = hud.position.get();
        this.originalRot = hud.rotation.get();
        this.originalScale = hud.scale.get();
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            hud.as(hz.AttachableEntity)?.attachToPlayer(player, hz.AttachablePlayerAnchor.Torso);
            hud.setVisibilityForPlayers([player], hz.PlayerVisibilityMode.VisibleTo);
        });
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, (player) => {
            hud.as(hz.AttachableEntity)?.detach();
            hud.resetVisibilityForPlayers();
        });
        this.connectCodeBlockEvent(hud, hz.CodeBlockEvents.OnAttachEnd, (player) => {
            hud.position.set(this.originalPos);
            hud.rotation.set(this.originalRot);
            hud.scale.set(this.originalScale);
        });
    }
}
FeaturesLab_Attach2DUI.propsDefinition = {
    hud: { type: hz.PropTypes.Entity },
};
hz.Component.register(FeaturesLab_Attach2DUI);
