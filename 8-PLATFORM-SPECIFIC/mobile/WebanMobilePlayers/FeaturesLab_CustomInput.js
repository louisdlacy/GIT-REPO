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
const sysUtils_1 = require("sysUtils");
class FeaturesLab_CustomInput extends hz.Component {
    start() {
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player) => {
            if (player.id !== this.props.playerId)
                return;
            this.entity.owner.set(player);
        });
        if (this.entity.owner.get() !== this.world.getServerPlayer()) {
            this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
                (0, sysUtils_1.SetTextGizmoText)(this.props.CustomInputText, "Press left click / fire button<br>or<br>right click / aim button");
                if (hz.PlayerControls.isInputActionSupported(hz.PlayerInputAction.RightTrigger)) {
                    this.fireInput = hz.PlayerControls.connectLocalInput(hz.PlayerInputAction.RightTrigger, hz.ButtonIcon.Fire, this, { preferredButtonPlacement: hz.ButtonPlacement.Default });
                    this.fireInput.registerCallback((action, pressed) => {
                        (0, sysUtils_1.SetTextGizmoText)(this.props.CustomInputText, `Left click / fire button pressed: ${pressed}`);
                    });
                }
                if (hz.PlayerControls.isInputActionSupported(hz.PlayerInputAction.LeftTrigger)) {
                    this.aimInput = hz.PlayerControls.connectLocalInput(hz.PlayerInputAction.LeftTrigger, hz.ButtonIcon.Aim, this, { preferredButtonPlacement: hz.ButtonPlacement.Default });
                    this.aimInput.registerCallback((action, pressed) => {
                        (0, sysUtils_1.SetTextGizmoText)(this.props.CustomInputText, `Right click / aim button pressed: ${pressed}`);
                    });
                }
            });
            this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, (player) => {
                (0, sysUtils_1.SetTextGizmoText)(this.props.CustomInputText, "Custom Input");
                this.fireInput?.disconnect();
                this.aimInput?.disconnect();
            });
        }
    }
}
FeaturesLab_CustomInput.propsDefinition = {
    playerId: { type: hz.PropTypes.Number },
    CustomInputText: { type: hz.PropTypes.Entity },
};
hz.Component.register(FeaturesLab_CustomInput);
