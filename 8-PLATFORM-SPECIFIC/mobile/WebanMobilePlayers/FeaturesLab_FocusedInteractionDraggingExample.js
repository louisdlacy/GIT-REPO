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
class FeaturesLab_FocusedInteractionDraggingExample extends hz.Component {
    start() {
        this.activePlayer = this.world.getServerPlayer();
        const cameraPos = hz.Vec3.add(this.entity.position.get(), new hz.Vec3(0, 2, -4));
        const cameraRot = hz.Quaternion.fromEuler(new hz.Vec3(30, 0, 0));
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            if (this.activePlayer === this.world.getServerPlayer() && player.deviceType.get() !== hz.PlayerDeviceType.VR) {
                this.activePlayer = player;
                this.sendNetworkEvent(player, sysEvents_1.sysEvents.OnStartFocusMode, { exampleController: this.entity, cameraPosition: cameraPos, cameraRotation: cameraRot });
                (0, sysUtils_1.SetTextGizmoText)(this.props.focusedInteractionDraggingText, `Focused Interaction<br>Dragging<br>Active player: ${player.name.get()}`);
                this.props.focusedInteractionDraggingInstructionsText?.visible.set(true);
            }
        });
        this.connectNetworkEvent(this.entity, sysEvents_1.sysEvents.OnExitFocusMode, (data) => {
            if (this.activePlayer === data.player) {
                this.activePlayer = this.world.getServerPlayer();
                (0, sysUtils_1.SetTextGizmoText)(this.props.focusedInteractionDraggingText, "Focused Interaction<br>Dragging");
                this.props.focusedInteractionDraggingInstructionsText?.visible.set(false);
            }
        });
        this.connectNetworkEvent(this.entity, sysEvents_1.sysEvents.OnFocusedInteractionInputStarted, (data) => {
            const interaction = data.interactionInfo;
            if (interaction !== undefined && interaction.interactionIndex === 0) {
                this.dragLastPos = interaction.screenPosition;
            }
        });
        this.connectNetworkEvent(this.entity, sysEvents_1.sysEvents.OnFocusedInteractionInputMoved, (data) => {
            const interaction = data.interactionInfo;
            if (interaction !== undefined && interaction.interactionIndex === 0) {
                if (this.dragLastPos === undefined || this.props.objectToDrag === undefined)
                    return;
                let dragDelta = interaction.screenPosition.sub(this.dragLastPos);
                if (dragDelta.magnitude() > 0) {
                    let rotation = hz.Quaternion.fromEuler(new hz.Vec3(dragDelta.y * 1080, -dragDelta.x * 1080, 0));
                    this.props.objectToDrag.rotation.set(rotation.mul(this.props.objectToDrag.rotation.get()));
                }
                this.dragLastPos = interaction.screenPosition;
            }
        });
        this.connectNetworkEvent(this.entity, sysEvents_1.sysEvents.OnFocusedInteractionInputEnded, (data) => {
            const interaction = data.interactionInfo;
            if (interaction !== undefined && interaction.interactionIndex === 0) {
                this.dragLastPos = undefined;
            }
        });
    }
}
FeaturesLab_FocusedInteractionDraggingExample.propsDefinition = {
    focusedInteractionDraggingText: { type: hz.PropTypes.Entity },
    focusedInteractionDraggingInstructionsText: { type: hz.PropTypes.Entity },
    objectToDrag: { type: hz.PropTypes.Entity },
};
hz.Component.register(FeaturesLab_FocusedInteractionDraggingExample);
