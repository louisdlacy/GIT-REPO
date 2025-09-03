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
exports.Weapon = void 0;
const camera_1 = require("horizon/camera");
const hz = __importStar(require("horizon/core"));
const PlayerCamera_1 = require("PlayerCamera");
// This weapon class can be extended to create different types of weapons (see Gun.ts for an example)
// Grabbing this weapon will set the camera mode to the specified mode.
// Dropping the weapon will set the camera mode back to third person.
class Weapon extends hz.Component {
    constructor() {
        super(...arguments);
        this.fireCooldown = 0.1;
        this.lastFired = -1;
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabStart, (isRightHand, player) => { this.onGrab(player); });
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabEnd, (player) => { this.onRelease(); });
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnIndexTriggerDown, (player) => { this.onIndexTriggerDown(player); });
    }
    start() {
        this.fireCooldown = this.props.fireCooldown * 1000;
    }
    onGrab(player) {
        console.log("Weapon: onGrab");
        this.entity.owner.set(player);
        this.sendNetworkEvent(player, PlayerCamera_1.PlayerCameraEvents.SetCameraMode, { mode: this.getCameraMode() });
    }
    onRelease() {
        const player = this.entity.owner.get();
        this.entity.owner.set(this.world.getServerPlayer());
        this.sendNetworkEvent(player, PlayerCamera_1.PlayerCameraEvents.SetCameraMode, { mode: camera_1.CameraMode.ThirdPerson });
    }
    // This is called when the index trigger is pressed.
    // Plays the fire animation and returns true if the weapon was fired.
    // fireCooldown is the minimum time between shots, so use this to prevent spamming, and adjust the timer to take into account the character's animation time.
    // You can override this function to add custom behavior. See Gun::onIndexTriggerDown() for an example.
    onIndexTriggerDown(player) {
        if (player === this.entity.owner.get()) {
            if (this.lastFired === -1 || Date.now() - this.lastFired > this.fireCooldown) {
                this.lastFired = Date.now();
                player.playAvatarGripPoseAnimationByName(hz.AvatarGripPoseAnimationNames.Fire);
                return true;
            }
        }
        return false;
    }
    getCameraMode() {
        switch (this.props.cameraMode) {
            case 'Orbit':
                return camera_1.CameraMode.Orbit;
            case 'ThirdPerson':
                return camera_1.CameraMode.ThirdPerson;
            case 'FirstPerson':
                return camera_1.CameraMode.FirstPerson;
            default:
                return camera_1.CameraMode.ThirdPerson;
        }
    }
}
exports.Weapon = Weapon;
Weapon.propsDefinition = {
    cameraMode: { type: hz.PropTypes.String },
    fireCooldown: { type: hz.PropTypes.Number, default: 0.1 },
};
hz.Component.register(Weapon);
