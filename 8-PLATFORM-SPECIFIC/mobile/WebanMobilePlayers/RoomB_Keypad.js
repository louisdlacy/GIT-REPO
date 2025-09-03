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
class RoomB_Keypad extends hz.Component {
    constructor() {
        super(...arguments);
        this.digitCount = 0;
        this.maxDigitCount = 4;
        this.currentCode = "";
        this.guessedCode = false;
        this.enabled = true;
    }
    start() {
        this.activePlayer = this.world.getServerPlayer();
        const cameraPos = hz.Vec3.add(this.entity.position.get(), this.props.relativeCameraPosition);
        const cameraRot = hz.Quaternion.fromEuler(this.props.cameraRotation);
        if (this.props.digitsText) {
            this.originalDigitsTextColor = this.props.digitsText.color.get();
        }
        if (this.props.tappingRaycast) {
            this.raycastGizmo = this.props.tappingRaycast.as(hz.RaycastGizmo);
        }
        // Enter Focused Interaction mode when a player interacts with the object
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            if (this.activePlayer === this.world.getServerPlayer() && player.deviceType.get() !== hz.PlayerDeviceType.VR) {
                this.activePlayer = player;
                this.sendNetworkEvent(player, sysEvents_1.sysEvents.OnStartFocusMode, { exampleController: this.entity, cameraPosition: cameraPos, cameraRotation: cameraRot });
                this.sendNetworkEvent(player, sysEvents_1.sysEvents.OnSetCameraFOV, { newFOV: this.props.cameraFov });
            }
        });
        // Reset status after a player exits Focused Interaction mode
        this.connectNetworkEvent(this.entity, sysEvents_1.sysEvents.OnExitFocusMode, (data) => {
            if (this.activePlayer === data.player) {
                this.activePlayer = this.world.getServerPlayer();
                this.sendNetworkEvent(data.player, sysEvents_1.sysEvents.OnResetCameraFOV, {});
            }
        });
        // Tracking Focused Interaction inputs to check if a button was tapped
        this.connectNetworkEvent(this.entity, sysEvents_1.sysEvents.OnFocusedInteractionInputEnded, (data) => {
            const interaction = data.interactionInfo;
            if (interaction !== undefined && interaction.interactionIndex === 0 && this.raycastGizmo) {
                const hit = this.raycastGizmo.raycast(interaction.worldRayOrigin, interaction.worldRayDirection);
                if (hit && hit.targetType === hz.RaycastTargetType.Entity && hit.target) {
                    this.sendNetworkEvent(hit.target, sysEvents_1.sysEvents.OnEntityTapped, null);
                }
            }
        });
        // When `OnButtonPressed` is received, update `currentCode`, check if the code is correct. If it is, notify the puzzle manager to finish the puzzle and exit Focused Interaction mode
        this.connectNetworkEvent(this.entity, sysEvents_1.sysEvents.OnButtonPressed, (data) => {
            if (!this.enabled || this.guessedCode)
                return;
            ++this.digitCount;
            this.currentCode += data.number + " ";
            this.UpdateDigitsText(this.currentCode);
            if (this.digitCount === this.maxDigitCount) {
                this.guessedCode = this.CheckCode();
                if (this.guessedCode) {
                    this.props.digitsText?.color.set(hz.Color.green);
                    // Notify the puzzle manager that the puzzle is finished
                    if (this.props.puzzleManager)
                        this.sendNetworkEvent(this.props.puzzleManager, sysEvents_1.sysEvents.OnFinishPuzzle, {});
                }
                else {
                    this.props.digitsText?.color.set(hz.Color.red);
                    this.enabled = false;
                    this.async.setTimeout(() => this.ResetKeypad(), 1500);
                }
            }
        });
    }
    ResetKeypad() {
        this.digitCount = 0;
        this.currentCode = "";
        this.UpdateDigitsText(this.currentCode);
        this.props.digitsText?.color.set(this.originalDigitsTextColor);
        this.enabled = true;
    }
    UpdateDigitsText(newDigitsText) {
        this.props.digitsText?.as(hz.TextGizmo)?.text.set("<align=left>" + newDigitsText);
    }
    CheckCode() {
        return this.currentCode.replace(/ /g, "") === this.props.correctCode.replace(/ /g, "");
    }
}
RoomB_Keypad.propsDefinition = {
    digitsText: { type: hz.PropTypes.Entity },
    correctCode: { type: hz.PropTypes.String },
    puzzleManager: { type: hz.PropTypes.Entity },
    tappingRaycast: { type: hz.PropTypes.Entity },
    relativeCameraPosition: { type: hz.PropTypes.Vec3 },
    cameraRotation: { type: hz.PropTypes.Vec3 },
    cameraFov: { type: hz.PropTypes.Number },
};
hz.Component.register(RoomB_Keypad);
