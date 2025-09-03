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
const camera_1 = __importStar(require("horizon/camera"));
/**
 * Camera Manager Component (Local)
 *
 * Handles camera-related events for the local player in Horizon Worlds.
 * Listens for network events from sysCameraChangeTrigger and applies
 * camera settings to the local player's view.
 */
class sysCameraManagerLocal extends hz.Component {
    constructor() {
        super(...arguments);
        this.ownedByServer = true;
        this.transitionOptions = {
            duration: 0.5,
            easing: camera_1.Easing.EaseInOut,
        };
    }
    start() {
        this.owningPlayer = this.entity.owner.get();
        this.ownedByServer = this.owningPlayer === this.world.getServerPlayer();
        if (this.ownedByServer)
            return;
        this.resetCameraToDefaults();
        this.setupStandardCameraModeListeners();
        this.setupSpecialCameraEffectListeners();
    }
    resetCameraToDefaults() {
        camera_1.default.setCameraModeThirdPerson();
        camera_1.default.setCameraRollWithOptions(0);
        camera_1.default.resetCameraFOV();
    }
    /**
     * Set up listeners for standard camera mode changes
     */
    setupStandardCameraModeListeners() {
        this.connectNetworkEvent(this.owningPlayer, sysEvents_1.sysEvents.OnSetCameraModeThirdPerson, () => {
            camera_1.default.setCameraModeThirdPerson(this.transitionOptions);
        });
        this.connectNetworkEvent(this.owningPlayer, sysEvents_1.sysEvents.OnSetCameraModeFirstPerson, () => {
            camera_1.default.setCameraModeFirstPerson(this.transitionOptions);
        });
        this.connectNetworkEvent(this.owningPlayer, sysEvents_1.sysEvents.OnSetCameraModeFixed, (data) => {
            camera_1.default.setCameraModeFixed({
                position: data.position,
                rotation: data.rotation,
                ...this.transitionOptions
            });
        });
        this.connectNetworkEvent(this.owningPlayer, sysEvents_1.sysEvents.OnSetCameraModeAttached, (data) => {
            camera_1.default.setCameraModeAttach(data.target, {
                positionOffset: data.positionOffset,
                translationSpeed: data.translationSpeed,
                rotationSpeed: data.rotationSpeed,
                ...this.transitionOptions
            });
        });
        this.connectNetworkEvent(this.owningPlayer, sysEvents_1.sysEvents.OnSetCameraModeFollow, () => {
            camera_1.default.setCameraModeFollow(this.transitionOptions);
        });
        this.connectNetworkEvent(this.owningPlayer, sysEvents_1.sysEvents.OnSetCameraModePan, (data) => {
            const panCameraOptions = {
                positionOffset: data.positionOffset,
                ...this.transitionOptions,
            };
            camera_1.default.setCameraModePan(panCameraOptions);
        });
        this.connectNetworkEvent(this.owningPlayer, sysEvents_1.sysEvents.OnSetCameraModeOrbit, () => {
            camera_1.default.setCameraModeOrbit(this.transitionOptions);
        });
    }
    /**
     * Set up listeners for special camera effects
     */
    setupSpecialCameraEffectListeners() {
        this.connectNetworkEvent(this.owningPlayer, sysEvents_1.sysEvents.OnSetCameraRoll, (data) => {
            camera_1.default.setCameraRollWithOptions(data.rollAngle, this.transitionOptions);
        });
        this.connectNetworkEvent(this.owningPlayer, sysEvents_1.sysEvents.OnSetCameraFOV, (data) => {
            camera_1.default.overrideCameraFOV(data.newFOV, this.transitionOptions);
        });
        this.connectNetworkEvent(this.owningPlayer, sysEvents_1.sysEvents.OnResetCameraFOV, () => {
            camera_1.default.resetCameraFOV(this.transitionOptions);
        });
        this.connectNetworkEvent(this.owningPlayer, sysEvents_1.sysEvents.OnSetCameraPerspectiveSwitchingEnabled, (data) => {
            camera_1.default.perspectiveSwitchingEnabled.set(data.enabled);
        });
        this.connectNetworkEvent(this.owningPlayer, sysEvents_1.sysEvents.OnSetCameraCollisionEnabled, (data) => {
            camera_1.default.collisionEnabled.set(data.enabled);
        });
    }
}
sysCameraManagerLocal.propsDefinition = {};
hz.Component.register(sysCameraManagerLocal);
