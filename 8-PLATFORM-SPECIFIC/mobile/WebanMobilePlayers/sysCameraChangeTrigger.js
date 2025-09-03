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
const camera_1 = require("horizon/camera");
const hz = __importStar(require("horizon/core"));
const sysEvents_1 = require("sysEvents");
const sysUtils_1 = require("sysUtils");
/**
 * Camera Change Trigger Component
 *
 * Changes the camera mode when a player enters a trigger area.
 * Supports standard camera modes and special camera effects.
 * Resets camera when player exits the trigger area.
 */
class sysCameraChangeTrigger extends hz.Component {
    constructor() {
        super(...arguments);
        this.cameraModeMap = {
            'Follow': camera_1.CameraMode.Follow,
            'Pan': camera_1.CameraMode.Pan,
            'Fixed': camera_1.CameraMode.Fixed,
            'Attach': camera_1.CameraMode.Attach,
            'Orbit': camera_1.CameraMode.Orbit,
            'ThirdPerson': camera_1.CameraMode.ThirdPerson,
            'FirstPerson': camera_1.CameraMode.FirstPerson,
        };
        this.cameraMode = '';
    }
    preStart() {
        this.cameraMode = this.props.cameraMode;
    }
    start() {
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, this.handlePlayerEnterTrigger.bind(this));
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, this.handlePlayerExitTrigger.bind(this));
    }
    /**
     * Handle when a player enters the trigger area
     */
    handlePlayerEnterTrigger(player) {
        const cameraMode = this.getCameraMode();
        if (cameraMode === null) {
            this.applySpecialCameraEffect(player);
            return;
        }
        this.applyStandardCameraMode(player, cameraMode);
    }
    /**
     * Apply special camera effects that aren't part of the CameraMode enum
     */
    applySpecialCameraEffect(player) {
        switch (this.props.cameraMode) {
            case "Roll":
                this.sendNetworkEvent(player, sysEvents_1.sysEvents.OnSetCameraRoll, { rollAngle: 45 });
                this.updateTextGizmo("Camera Roll Applied");
                break;
            case "FOV":
                this.sendNetworkEvent(player, sysEvents_1.sysEvents.OnSetCameraFOV, { newFOV: 90 });
                this.updateTextGizmo("Camera FOV Changed");
                break;
            case "PerspectiveSwitching":
                this.sendNetworkEvent(player, sysEvents_1.sysEvents.OnSetCameraPerspectiveSwitchingEnabled, { enabled: true });
                this.updateTextGizmo("Camera Perspective Switching Enabled<br><br>Press PageUp/PageDown to change<br>between 1st person and 3rd person modes");
                break;
            case "Collision":
                this.sendNetworkEvent(player, sysEvents_1.sysEvents.OnSetCameraCollisionEnabled, { enabled: false });
                this.updateTextGizmo("Camera collision disabled");
                break;
            default:
                this.resetToThirdPerson(player);
                this.updateTextGizmo("Camera set to Third Person Mode (default)");
                break;
        }
    }
    /**
     * Apply a standard camera mode from the CameraMode enum
     */
    applyStandardCameraMode(player, cameraMode) {
        switch (cameraMode) {
            case camera_1.CameraMode.FirstPerson:
                this.sendNetworkEvent(player, sysEvents_1.sysEvents.OnSetCameraModeFirstPerson, null);
                this.updateTextGizmo("Camera set to First Person Mode");
                break;
            case camera_1.CameraMode.ThirdPerson:
                this.resetToThirdPerson(player);
                this.updateTextGizmo("Camera set to Third Person Mode");
                break;
            case camera_1.CameraMode.Follow:
                this.sendNetworkEvent(player, sysEvents_1.sysEvents.OnSetCameraModeFollow, { target: player });
                this.updateTextGizmo("Camera set to Follow Mode");
                break;
            case camera_1.CameraMode.Pan:
                const panPositionOffset = new hz.Vec3(0, 1, -6);
                this.sendNetworkEvent(player, sysEvents_1.sysEvents.OnSetCameraModePan, {
                    panSpeed: 1.0,
                    positionOffset: panPositionOffset
                });
                this.updateTextGizmo("Camera set to Pan Mode with position offset");
                break;
            case camera_1.CameraMode.Fixed:
                const fixedPosition = hz.Vec3.add(this.entity.position.get(), new hz.Vec3(0, 1, -5));
                const fixedRotation = hz.Quaternion.fromEuler(new hz.Vec3(0, 0, 0));
                this.sendNetworkEvent(player, sysEvents_1.sysEvents.OnSetCameraModeFixed, {
                    position: fixedPosition,
                    rotation: fixedRotation
                });
                this.updateTextGizmo("Camera set to Fixed Mode");
                break;
            case camera_1.CameraMode.Attach:
                const positionOffset = new hz.Vec3(0, 0, -5);
                const translationSpeed = 1;
                const rotationSpeed = 1;
                this.sendNetworkEvent(player, sysEvents_1.sysEvents.OnSetCameraModeAttached, {
                    target: player,
                    positionOffset: positionOffset,
                    translationSpeed: translationSpeed,
                    rotationSpeed: rotationSpeed
                });
                this.updateTextGizmo("Camera set to Attach Mode");
                break;
            case camera_1.CameraMode.Orbit:
                this.sendNetworkEvent(player, sysEvents_1.sysEvents.OnSetCameraModeOrbit, {
                    target: player,
                    distance: 5.0,
                    orbitSpeed: 1.0
                });
                this.updateTextGizmo("Camera set to Orbit Mode");
                break;
        }
    }
    /**
     * Handle when a player exits the trigger area
     */
    handlePlayerExitTrigger(player) {
        const cameraMode = this.getCameraMode();
        if (cameraMode === null) {
            this.removeSpecialCameraEffect(player);
            return;
        }
        if (cameraMode !== camera_1.CameraMode.ThirdPerson) {
            this.resetToThirdPerson(player);
        }
        this.updateTextGizmo(`${this.props.cameraMode} Camera`);
    }
    /**
     * Remove special camera effects when exiting the trigger
     */
    removeSpecialCameraEffect(player) {
        switch (this.props.cameraMode) {
            case "Roll":
                this.sendNetworkEvent(player, sysEvents_1.sysEvents.OnSetCameraRoll, { rollAngle: 0 });
                this.updateTextGizmo("Camera Roll");
                break;
            case "FOV":
                this.sendNetworkEvent(player, sysEvents_1.sysEvents.OnResetCameraFOV, null);
                this.updateTextGizmo("Camera FOV");
                break;
            case "PerspectiveSwitching":
                this.sendNetworkEvent(player, sysEvents_1.sysEvents.OnSetCameraPerspectiveSwitchingEnabled, { enabled: false });
                this.updateTextGizmo("Camera Perspective Switching");
                break;
            case "Collision":
                this.sendNetworkEvent(player, sysEvents_1.sysEvents.OnSetCameraCollisionEnabled, { enabled: true });
                this.updateTextGizmo("Camera collision enabled");
                break;
            default:
                console.error(`[sysCameraChangeTrigger] No matching camera mode found for ${this.props.cameraMode}`);
                this.updateTextGizmo("Camera mode not found");
                break;
        }
    }
    /**
     * Reset the camera to third person mode
     */
    resetToThirdPerson(player) {
        this.sendNetworkEvent(player, sysEvents_1.sysEvents.OnSetCameraModeThirdPerson, null);
    }
    /**
     * Update the text display with information about the current camera mode
     */
    updateTextGizmo(text) {
        (0, sysUtils_1.SetTextGizmoText)(this.props.cameraModeText, text);
    }
    /**
     * Get the CameraMode enum value from the string camera mode
     */
    getCameraMode() {
        return this.cameraModeMap[this.cameraMode] ?? null;
    }
}
sysCameraChangeTrigger.propsDefinition = {
    cameraMode: { type: hz.PropTypes.String },
    cameraModeText: { type: hz.PropTypes.Entity },
};
hz.Component.register(sysCameraChangeTrigger);
