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
exports.PlayerCamera = exports.PlayerCameraEvents = void 0;
const hz = __importStar(require("horizon/core"));
const camera_1 = __importStar(require("horizon/camera"));
const PlayerCameraManager_1 = require("PlayerCameraManager");
// See PlayerCameraManager.ts for step-by-step instructions on how to use this class.
exports.PlayerCameraEvents = {
    SetCameraMode: new hz.NetworkEvent('SetCameraMode'),
    SetCameraFixedPosition: new hz.NetworkEvent('SetCameraFixedPosition'),
    SetCameraFixedPositionWithEntity: new hz.NetworkEvent('SetCameraFixedPositionWithEntity'),
    SetCameraAttachWithTarget: new hz.NetworkEvent('SetCameraAttachWithPlayer'),
    SetCameraPan: new hz.NetworkEvent('SetCameraPan'),
    SetCameraFollow: new hz.NetworkEvent('SetCameraFollow'),
    SetCameraCollisions: new hz.NetworkEvent('SetCameraCollisions'),
    RevertPlayerCamera: new hz.NetworkEvent('RevertPlayerCamera'),
    OnCameraResetPressed: new hz.NetworkEvent('OnCameraResetPressed'),
};
// Definitions of default camera options.
// cameraOptions is the base options that will be applied to all camera modes.
const cameraOptions = {
    duration: 0.4, // time to transition to the new camera mode in seconds
    easing: camera_1.Easing.EaseOut, // easing function to use for the transition
};
const cameraOptionsThirdPerson = {};
const cameraOptionsFirstPerson = {};
// cameraOptionsOrbit, cameraOptionsFirstPerson, and cameraOptionsThirdPerson are the options that will be applied to the specific camera modes.
const cameraOptionsOrbit = {
    distance: 12, // distance from the player to the camera
};
// cameraOptionsPan can be implemented for side scrolling and top-down view functionality.
const cameraOptionsPan = {
    positionOffset: new hz.Vec3(2, 0, 0), // position of the camera
    translationSpeed: 4.0, // translation speed
};
// cameraOptionsFollow can be implemented for a camera that follows the player.
const cameraOptionsFollow = {
    activationDelay: 0.5,
    cameraTurnSpeed: 0.5,
    continuousRotation: Boolean(true),
    distance: 12,
    horizonLevelling: Boolean(true),
    rotationSpeed: 0.5,
    translationSpeed: 4.0,
    verticalOffset: 0.5,
};
class PlayerCamera extends hz.Component {
    constructor() {
        super(...arguments);
        this.player = undefined;
        this.previousCameraMode = -1;
        this.cameraResetInput = undefined;
        this.cameraResetHasRegisteredCallback = false;
        this.defaultLocomotionSpeed = 4.5; // TODO: Change this if you alter the player's default speed.
        this.defaultCameraCollisionsEnabled = undefined;
    }
    start() {
        // Self register this PlayerCamera to the PlayerManager using a broadcast event.
        // We are using a broadcast event because it is easier to add / remove cameras as you adjust the number of max players for your world.
        // For more performance at world startup you may want to make this a non-broadcast network event and use the propsDefinition
        //  to specify a reference to the PlayerManager, then just use a sendNetworkEvent directly.
        this.sendNetworkBroadcastEvent(PlayerCameraManager_1.CameraManagerEvents.OnRegisterPlayerCamera, { ObjectId: "PlayerCamera", Object: this.entity });
    }
    initCameraListeners(player) {
        // Listen for an event on the player to set the camera mode.
        // This event could be sent by an object (e.g. on a grab event) or a trigger (e.g. on enter event).
        this.connectNetworkEvent(player, exports.PlayerCameraEvents.SetCameraMode, ({ mode }) => {
            this.setCameraMode(mode);
        });
        this.connectNetworkEvent(player, exports.PlayerCameraEvents.SetCameraFixedPosition, ({ position, rotation, duration, easing }) => {
            this.setCameraFixedPosition(position, rotation, duration, easing);
        });
        this.connectNetworkEvent(player, exports.PlayerCameraEvents.SetCameraFixedPositionWithEntity, ({ entity, duration, easing }) => {
            this.setCameraFixedPositionWithEntity(entity, duration, easing);
        });
        this.connectNetworkEvent(player, exports.PlayerCameraEvents.SetCameraPan, ({ positionOffset, translationSpeed }) => {
            this.setCameraPan(positionOffset, translationSpeed);
        });
        this.connectNetworkEvent(player, exports.PlayerCameraEvents.SetCameraFollow, ({ activationDelay, cameraTurnSpeed, continuousRotation, distance, horizonLevelling, rotationSpeed, translationSpeed, verticalOffset }) => {
            this.setCameraFollow(activationDelay, cameraTurnSpeed, continuousRotation, distance, horizonLevelling, rotationSpeed, translationSpeed, verticalOffset);
        });
        this.connectNetworkEvent(player, exports.PlayerCameraEvents.SetCameraCollisions, ({ collisionsEnabled }) => {
            this.setCameraCollisions(collisionsEnabled);
        });
        this.connectNetworkEvent(player, exports.PlayerCameraEvents.RevertPlayerCamera, () => {
            this.revertPlayerCamera();
        });
        this.connectNetworkEvent(player, exports.PlayerCameraEvents.SetCameraAttachWithTarget, ({ target }) => {
            this.setCameraAttachedToTarget(target);
        });
    }
    receiveOwnership(_serializableState, _oldOwner, _newOwner) {
        if (_newOwner !== this.world.getServerPlayer()) {
            this.player = _newOwner;
            this.initCameraListeners(_newOwner);
        }
    }
    setCameraMode(mode) {
        if (mode === camera_1.CameraMode.Fixed) {
            console.warn("Used SetCameraMode with a fixed camera. Use SetFixedCameraPosition instead.");
            return;
        }
        // If we're switching to a new camera mode, save the previous camera mode so we can switch back to it.
        if (mode !== this.getCurrentCameraMode()) {
            this.setPreviousCameraMode();
        }
        // If we are switching away from a fixed camera, remove the camera reset button and allow player to move.
        if (this.getPreviousCameraMode() === camera_1.CameraMode.Fixed || this.getPreviousCameraMode() === camera_1.CameraMode.Attach) {
            this.displayCameraResetButton(false);
            if (this.player !== undefined && this.player !== null) {
                this.player.locomotionSpeed.set(this.defaultLocomotionSpeed);
            }
        }
        switch (mode) {
            case camera_1.CameraMode.Orbit:
                camera_1.default.setCameraModeOrbit({ ...cameraOptions, ...cameraOptionsOrbit });
                break;
            case camera_1.CameraMode.FirstPerson:
                camera_1.default.setCameraModeFirstPerson({ ...cameraOptions, ...cameraOptionsFirstPerson });
                break;
            case camera_1.CameraMode.ThirdPerson:
                camera_1.default.setCameraModeThirdPerson({ ...cameraOptions, ...cameraOptionsThirdPerson });
                break;
            case camera_1.CameraMode.Pan:
                camera_1.default.setCameraModePan({ ...cameraOptions, ...cameraOptionsPan });
                break;
            case camera_1.CameraMode.Follow:
                camera_1.default.setCameraModeFollow({ ...cameraOptions, ...cameraOptionsFollow });
                break;
            default:
                console.warn("Unknown camera mode: " + mode);
                break;
        }
    }
    // Set the camera to a fixed position and rotation.
    setCameraFixedPosition(position, rotation, duration, easing) {
        // If we're switching to a new camera mode, save the previous camera mode so we can switch back to it.
        if (this.getCurrentCameraMode() !== camera_1.CameraMode.Fixed) {
            this.setPreviousCameraMode();
        }
        this.displayCameraResetButton(true);
        // Stop player from moving when in fixed camera mode.
        if (this.player !== undefined && this.player !== null) {
            this.player.locomotionSpeed.set(0); // Delete this line to allow the player to move while in fixed camera mode.
        }
        camera_1.default.setCameraModeFixed({
            position,
            rotation,
            duration,
            easing
        });
    }
    // Use an entity's position and rotation to set the camera to a fixed position and rotation.
    // Pass this function an empty object from the world to use it's position and rotation - helpful for avoiding the use of hardcoded values.
    setCameraFixedPositionWithEntity(entity, duration, easing) {
        const position = entity.position.get();
        const rotation = entity.rotation.get();
        this.setCameraFixedPosition(position, rotation, duration, easing);
    }
    // Set the camera with a custom position and/or translation speed
    // Use undefined for positionOffset if you only want to set translationSpeed
    setCameraPan(positionOffset, translationSpeed) {
        if (this.getCurrentCameraMode() !== camera_1.CameraMode.Pan) {
            this.setPreviousCameraMode();
        }
        if (positionOffset === undefined) {
            positionOffset = cameraOptionsPan.positionOffset;
        }
        if (translationSpeed === undefined) {
            translationSpeed = cameraOptionsPan.translationSpeed;
        }
        camera_1.default.setCameraModePan({ ...cameraOptions, positionOffset, translationSpeed });
    }
    // Configure the camera to follow the player with custom settings.
    setCameraFollow(activationDelay, cameraTurnSpeed, continuousRotation, distance, horizonLevelling, rotationSpeed, translationSpeed, verticalOffset) {
        if (this.getCurrentCameraMode() !== camera_1.CameraMode.Follow) {
            this.setPreviousCameraMode();
        }
        if (activationDelay === undefined) {
            activationDelay = cameraOptionsFollow.activationDelay;
        }
        if (cameraTurnSpeed === undefined) {
            cameraTurnSpeed = cameraOptionsFollow.cameraTurnSpeed;
        }
        if (continuousRotation === undefined) {
            continuousRotation = cameraOptionsFollow.continuousRotation;
        }
        if (distance === undefined) {
            distance = cameraOptionsFollow.distance;
        }
        if (horizonLevelling === undefined) {
            horizonLevelling = cameraOptionsFollow.horizonLevelling;
        }
        if (rotationSpeed === undefined) {
            rotationSpeed = cameraOptionsFollow.rotationSpeed;
        }
        if (translationSpeed === undefined) {
            translationSpeed = cameraOptionsFollow.translationSpeed;
        }
        if (verticalOffset === undefined) {
            verticalOffset = cameraOptionsFollow.verticalOffset;
        }
        camera_1.default.setCameraModeFollow({ ...cameraOptions, activationDelay, cameraTurnSpeed, continuousRotation, distance, horizonLevelling, rotationSpeed, translationSpeed, verticalOffset });
    }
    setCameraAttachedToTarget(target) {
        if (this.getCurrentCameraMode() !== camera_1.CameraMode.Attach) {
            this.setPreviousCameraMode();
        }
        this.displayCameraResetButton(true);
        // Stop player from moving when in fixed camera mode.
        if (this.player !== undefined && this.player !== null) {
            this.player.locomotionSpeed.set(0); // Delete this line to allow the player to move while in fixed camera mode.
        }
        camera_1.default.setCameraModeAttach(target, {
            ...cameraOptions,
        });
    }
    // Adds a custom input button to enable players to reset their camera to the previous camera mode.
    // We use this when the camera mode is set to Fixed to avoid players getting stuck in a fixed camera mode, but you can use it for any camera mode.
    displayCameraResetButton(on) {
        if (on) {
            if (!this.cameraResetHasRegisteredCallback) {
                this.cameraResetInput = hz.PlayerControls.connectLocalInput(hz.PlayerInputAction.LeftGrip, hz.ButtonIcon.Door, this, { preferredButtonPlacement: hz.ButtonPlacement.Center });
                this.cameraResetInput.registerCallback((action, pressed) => {
                    if (pressed) {
                        this.onCameraResetButtonPressed();
                    }
                });
                this.cameraResetHasRegisteredCallback = true;
            }
        }
        else if (this.cameraResetInput !== undefined) {
            this.cameraResetInput?.disconnect();
            this.cameraResetHasRegisteredCallback = false;
        }
    }
    // Handler for when the reset button is pressed. Reverts the camera to the previous camera mode.
    onCameraResetButtonPressed() {
        if (this.player !== undefined && this.player !== null) {
            // Check we have a previous camera mode, otherwise default to third person.
            this.sendNetworkEvent(this.player, exports.PlayerCameraEvents.OnCameraResetPressed, { player: this.player }); // You can remove this if you are not using the cutscene system or don't care about the player's camera resetting.
            this.revertPlayerCamera();
        }
    }
    revertPlayerCamera() {
        if (this.player !== undefined && this.player !== null) {
            const previousCameraMode = this.getPreviousCameraMode();
            console.log("Revert player camera: " + previousCameraMode);
            this.sendNetworkEvent(this.player, exports.PlayerCameraEvents.SetCameraMode, { mode: previousCameraMode });
            if (this.defaultCameraCollisionsEnabled !== undefined) {
                this.sendNetworkEvent(this.player, exports.PlayerCameraEvents.SetCameraCollisions, { collisionsEnabled: this.defaultCameraCollisionsEnabled });
            }
        }
        else {
            console.warn("PlayerCamera: revertPlayerCamera called with no player set.");
        }
    }
    setPreviousCameraMode() {
        this.previousCameraMode = this.getCurrentCameraMode();
    }
    getPreviousCameraMode() {
        let previousCameraMode = camera_1.CameraMode.ThirdPerson;
        if (this.previousCameraMode !== -1) {
            previousCameraMode = this.previousCameraMode;
        }
        return previousCameraMode;
    }
    getCurrentCameraMode() {
        let currentMode = camera_1.default.currentMode.get();
        if (currentMode === 7)
            currentMode = camera_1.CameraMode.Orbit;
        return currentMode;
    }
    // Toggle camera collisions. If set to true, the camera will collide with the world, preferring to move closer to the player if collision is detected.
    setCameraCollisions(collisionsEnabled) {
        if (this.defaultCameraCollisionsEnabled === undefined) {
            this.defaultCameraCollisionsEnabled = camera_1.default.collisionEnabled.get();
            camera_1.default.collisionEnabled.set(collisionsEnabled);
        }
    }
}
exports.PlayerCamera = PlayerCamera;
PlayerCamera.propsDefinition = {};
hz.Component.register(PlayerCamera);
