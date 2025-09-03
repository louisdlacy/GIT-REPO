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
exports.CutsceneEvents = void 0;
const camera_1 = require("horizon/camera");
const hz = __importStar(require("horizon/core"));
const uab = __importStar(require("horizon/unity_asset_bundles"));
const PlayerCamera_1 = require("PlayerCamera");
exports.CutsceneEvents = {
    OnStartCutscene: new hz.LocalEvent('OnStartCutscene'),
    OnCutsceneComplete: new hz.LocalEvent('OnCutsceneComplete'),
};
class DoorCutscene extends hz.Component {
    constructor() {
        super(...arguments);
        this.cameraDollyTimeoutId = {};
        this.cameraResetTimeoutId = {};
        this.environmentalAnimationIsPlaying = false;
        this.doorButton = undefined;
    }
    start() {
        this.connectLocalEvent(this.entity, exports.CutsceneEvents.OnStartCutscene, ({ player, doorButton }) => {
            this.doorButton = doorButton;
            // Play the camera aniations. You can add / edit / remove for your own camera animations here.
            this.playCameraAnimation(player);
            // Play environmental animations. You can add / edit / remove for your own environmental animations here.
            this.playEnvironmentalAnimation();
            this.connectNetworkEvent(player, PlayerCamera_1.PlayerCameraEvents.OnCameraResetPressed, () => {
                this.quitCameraAnimationForPlayer(player);
            });
        });
    }
    playCameraAnimation(player) {
        const playerName = player.name.get();
        if (this.props.cameraStart !== undefined && this.props.cameraStart !== null) {
            // Move camera to the start position
            this.sendNetworkEvent(player, PlayerCamera_1.PlayerCameraEvents.SetCameraFixedPositionWithEntity, { entity: this.props.cameraStart, duration: DoorCutscene.MoveToStartDuration, easing: DoorCutscene.MoveToStartEasing });
            // Move the camera to the end position over time and after a delay. The delay should be long enough to allow the camera to move to the start position (at least the duration of the first camera move).
            this.cameraDollyTimeoutId[playerName] = this.async.setTimeout(() => {
                if (this.props.cameraEnd !== undefined && this.props.cameraEnd !== null) {
                    this.sendNetworkEvent(player, PlayerCamera_1.PlayerCameraEvents.SetCameraFixedPositionWithEntity, { entity: this.props.cameraEnd, duration: this.props.moveDuration, easing: DoorCutscene.DollyEasing });
                }
                else {
                    console.warn("No cameraEnd was set in DoorCutscene props. Reverting to previous camera.");
                    this.sendNetworkEvent(player, PlayerCamera_1.PlayerCameraEvents.RevertPlayerCamera, {});
                }
                this.cameraDollyTimeoutId[playerName] = -1;
            }, DoorCutscene.MoveToStartDuration * 1000); // * 1000 to convert from seconds to milliseconds
            // Camera movement completed. Reset the player camera.
            this.cameraResetTimeoutId[playerName] = this.async.setTimeout(() => {
                this.sendNetworkEvent(player, PlayerCamera_1.PlayerCameraEvents.RevertPlayerCamera, {});
                this.cameraResetTimeoutId[playerName] = -1;
            }, (DoorCutscene.MoveToStartDuration + this.props.moveDuration + DoorCutscene.RobotAnimationLength + 0.2) * 1000);
        }
    }
    quitCameraAnimationForPlayer(player) {
        const playerName = player.name.get();
        if (this.cameraDollyTimeoutId[playerName] !== -1) {
            this.async.clearTimeout(this.cameraDollyTimeoutId[playerName]);
            this.cameraDollyTimeoutId[playerName] = -1;
        }
        console.log("Clearing camera reset timer started for player " + playerName + " id: " + this.cameraResetTimeoutId[playerName]);
        if (this.cameraResetTimeoutId[playerName] !== -1) {
            this.async.clearTimeout(this.cameraResetTimeoutId[playerName]);
            this.cameraResetTimeoutId[playerName] = -1;
        }
    }
    playEnvironmentalAnimation() {
        if (this.environmentalAnimationIsPlaying) {
            console.warn("Triggered another environmental animation while one is already playing. Ignoring additional animation call.");
            return;
        }
        this.environmentalAnimationIsPlaying = true;
        // Open the door after a delay.
        this.async.setTimeout(() => {
            if (this.props.door !== undefined && this.props.door !== null) {
                this.props.door.as(hz.AnimatedEntity).play();
            }
            else {
                console.warn("DoorButton pressed, but no door was set in the props.");
            }
        }, (DoorCutscene.MoveToStartDuration + DoorCutscene.DoorOpenDelay) * 1000);
        // Play the robot waving animation. Delete this function if you want to remove the robot animation.
        const robot = this.props.robot?.as(uab.AssetBundleGizmo).getRoot();
        this.async.setTimeout(() => {
            if (robot !== undefined && robot !== null) {
                robot.setAnimationParameterTrigger("EmoteYes");
            }
            else {
                console.warn("Attempted robot animation, but no robot was set in the props.");
            }
        }, this.props.moveDuration * 1000);
        // Shut the door again. Delete this function if you want to keep the door open.
        this.async.setTimeout(() => {
            if (this.props.door !== undefined && this.props.door !== null) {
                this.props.door.as(hz.AnimatedEntity).stop();
                this.environmentalAnimationIsPlaying = false;
                if (this.doorButton !== undefined) {
                    this.sendNetworkEvent(this.doorButton, exports.CutsceneEvents.OnCutsceneComplete, {});
                }
                else {
                    console.warn("DoorButton pressed, but no door button was found. Did the Cutscene end without starting?");
                }
            }
        }, (DoorCutscene.MoveToStartDuration + this.props.moveDuration + DoorCutscene.RobotAnimationLength) * 1000);
    }
}
DoorCutscene.propsDefinition = {
    door: { type: hz.PropTypes.Entity },
    cameraStart: { type: hz.PropTypes.Entity },
    cameraEnd: { type: hz.PropTypes.Entity },
    moveDuration: { type: hz.PropTypes.Number, default: 5 },
    robot: { type: hz.PropTypes.Entity },
};
DoorCutscene.MoveToStartDuration = 0.4;
DoorCutscene.MoveToStartEasing = camera_1.Easing.Linear;
DoorCutscene.DollyEasing = camera_1.Easing.EaseOut;
DoorCutscene.DoorOpenDelay = 0.5;
DoorCutscene.RobotAnimationLength = 1.8;
hz.Component.register(DoorCutscene);
