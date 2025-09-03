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
class sysFocusedInteractionManagerLocal extends hz.Component {
    constructor() {
        super(...arguments);
        this.ownedByServer = true;
        this.currentTapOptions = hz.DefaultFocusedInteractionTapOptions;
        this.currentTrailOptions = hz.DefaultFocusedInteractionTrailOptions;
    }
    start() {
        this.owningPlayer = this.entity.owner.get();
        this.ownedByServer = this.owningPlayer === this.world.getServerPlayer();
        // Only the local clients can use Focused Interactions
        if (this.ownedByServer)
            return;
        // When the `OnStartFocusMode` event is received, the player will enter Focused Interaction mode and start using an example controller to send inputs to
        this.connectNetworkEvent(this.owningPlayer, sysEvents_1.sysEvents.OnStartFocusMode, (data) => {
            this.activeFocusedInteractionExample = data.exampleController;
            this.owningPlayer.enterFocusedInteractionMode();
            this.sendNetworkEvent(this.owningPlayer, sysEvents_1.sysEvents.OnSetCameraModeFixed, { position: data.cameraPosition, rotation: data.cameraRotation });
        });
        // When the player exits Focused Interaction mode, reset camera to third person and notify the example controller
        this.connectNetworkBroadcastEvent(sysEvents_1.sysEvents.OnPlayerExitedFocusMode, (data) => {
            if (data.player !== this.owningPlayer)
                return;
            this.sendNetworkEvent(this.owningPlayer, sysEvents_1.sysEvents.OnSetCameraModeThirdPerson, null);
            if (this.activeFocusedInteractionExample) {
                this.sendNetworkEvent(this.activeFocusedInteractionExample, sysEvents_1.sysEvents.OnExitFocusMode, { player: this.owningPlayer });
                this.activeFocusedInteractionExample = undefined;
            }
        });
        // Tracking Focused Interaction inputs and sending the interaction data to the active example controller
        this.connectLocalBroadcastEvent(hz.PlayerControls.onFocusedInteractionInputStarted, (data) => {
            const firstInteraction = data.interactionInfo[0];
            if (firstInteraction.interactionIndex !== 0)
                return;
            if (this.activeFocusedInteractionExample) {
                this.sendNetworkEvent(this.activeFocusedInteractionExample, sysEvents_1.sysEvents.OnFocusedInteractionInputStarted, { interactionInfo: firstInteraction });
            }
        });
        this.connectLocalBroadcastEvent(hz.PlayerControls.onFocusedInteractionInputMoved, (data) => {
            const firstInteraction = data.interactionInfo[0];
            if (firstInteraction.interactionIndex !== 0)
                return;
            if (this.activeFocusedInteractionExample) {
                this.sendNetworkEvent(this.activeFocusedInteractionExample, sysEvents_1.sysEvents.OnFocusedInteractionInputMoved, { interactionInfo: firstInteraction });
            }
        });
        this.connectLocalBroadcastEvent(hz.PlayerControls.onFocusedInteractionInputEnded, (data) => {
            const firstInteraction = data.interactionInfo[0];
            if (firstInteraction.interactionIndex !== 0)
                return;
            if (this.activeFocusedInteractionExample) {
                this.sendNetworkEvent(this.activeFocusedInteractionExample, sysEvents_1.sysEvents.OnFocusedInteractionInputEnded, { interactionInfo: firstInteraction });
            }
        });
        // Customize taps when the `OnSetFocusedInteractionTapOptions` is received
        this.connectNetworkEvent(this.owningPlayer, sysEvents_1.sysEvents.OnSetFocusedInteractionTapOptions, (data) => {
            this.currentTapOptions = { ...this.currentTapOptions, ...data.tapOptions };
            this.owningPlayer.focusedInteraction.setTapOptions(data.enabled, this.currentTapOptions);
        });
        // Customize trails when the `OnSetFocusedInteractionTrailOptions` is received
        this.connectNetworkEvent(this.owningPlayer, sysEvents_1.sysEvents.OnSetFocusedInteractionTrailOptions, (data) => {
            this.currentTrailOptions = { ...this.currentTrailOptions, ...data.trailOptions };
            this.owningPlayer.focusedInteraction.setTrailOptions(data.enabled, this.currentTrailOptions);
        });
    }
}
sysFocusedInteractionManagerLocal.propsDefinition = {};
hz.Component.register(sysFocusedInteractionManagerLocal);
