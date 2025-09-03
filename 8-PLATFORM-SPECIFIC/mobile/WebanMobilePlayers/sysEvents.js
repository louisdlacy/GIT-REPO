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
exports.sysEvents = void 0;
const hz = __importStar(require("horizon/core"));
/**
 * System Events
 *
 * Defines network and local events used throughout the application.
 * Events are grouped by functionality for easier reference.
 */
exports.sysEvents = {
    // Hint HUD events
    OnRegisterHintHUDEntity: new hz.LocalEvent("OnRegisterHintHUDEntity"),
    OnDisplayHintHUD: new hz.NetworkEvent("OnDisplayHintHUD"),
    // Puzzle Manager events
    OnFinishPuzzle: new hz.NetworkEvent("OnFinishPuzzle"),
    OnMoveObject: new hz.LocalEvent("OnMoveObject"),
    // Camera API events
    OnSetCameraModeThirdPerson: new hz.NetworkEvent("OnSetCameraModeThirdPerson"),
    OnSetCameraModeFirstPerson: new hz.NetworkEvent("OnSetCameraModeFirstPerson"),
    OnSetCameraModeFixed: new hz.NetworkEvent("OnSetCameraModeFixed"),
    OnSetCameraModeAttached: new hz.NetworkEvent("OnSetCameraModeAttached"),
    OnSetCameraModeFollow: new hz.NetworkEvent("OnSetCameraModeFollow"),
    OnSetCameraModePan: new hz.NetworkEvent("OnSetCameraModePan"),
    OnSetCameraModeOrbit: new hz.NetworkEvent("OnSetCameraModeOrbit"),
    OnSetCameraRoll: new hz.NetworkEvent("OnSetCameraRoll"),
    OnSetCameraFOV: new hz.NetworkEvent("OnSetCameraFOV"),
    OnResetCameraFOV: new hz.NetworkEvent("OnResetCameraFOV"),
    OnSetCameraPerspectiveSwitchingEnabled: new hz.NetworkEvent("OnSetCameraPerspectiveSwitching"),
    OnSetCameraCollisionEnabled: new hz.NetworkEvent("OnSetCameraCollisionEnabled"),
    // Focused Interactions events
    OnStartFocusMode: new hz.NetworkEvent("OnStartFocusMode"),
    OnExitFocusMode: new hz.NetworkEvent("OnPlayerExitedExample"),
    OnPlayerExitedFocusMode: new hz.NetworkEvent("OnPlayerExitedFocusMode"),
    OnFocusedInteractionInputStarted: new hz.NetworkEvent("OnFocusedInteractionInputStarted"),
    OnFocusedInteractionInputMoved: new hz.NetworkEvent("OnFocusedInteractionInputMoved"),
    OnFocusedInteractionInputEnded: new hz.NetworkEvent("OnFocusedInteractionInputEnded"),
    OnEntityTapped: new hz.NetworkEvent("OnEntityTapped"),
    // Focused Interactions - Tap and Trail Options
    OnSetFocusedInteractionTapOptions: new hz.NetworkEvent("OnSetFocusedInteractionTapOptions"),
    OnSetFocusedInteractionTrailOptions: new hz.NetworkEvent("OnSetFocusedInteractionTrailOptions"),
    // Room B - Keypad events
    OnButtonPressed: new hz.NetworkEvent("OnButtonPressed"),
    // Room C - Cannon / Slingshot events
    OnCannonLeverMoved: new hz.LocalEvent('OnPitchMoved'),
    OnRegisterBall: new hz.NetworkEvent('OnRegisterBall'),
    registerPlayerFI: new hz.NetworkEvent('registerPlayerFI'),
    registerPlayer: new hz.NetworkEvent('registerPlayer'),
    startFI: new hz.LocalEvent('startFI'),
    stopFI: new hz.LocalEvent('stopFI'),
    startFINetwork: new hz.NetworkEvent('startFI'),
    stopFINetwork: new hz.NetworkEvent('stopFI'),
    exitFITapped: new hz.NetworkEvent('exitFI'),
    OnTouchStarted: new hz.NetworkEvent('OnTouchStarted'),
    OnTouchMoved: new hz.NetworkEvent('OnTouchMoved'),
    OnTouchEnded: new hz.NetworkEvent('OnTouchEnded'),
};
