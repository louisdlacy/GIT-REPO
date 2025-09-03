"use strict";
// Meant to be used in conjunction with an Asset Pool Gizmo
// This is a basic player manager component that can be used to handle events sent to the player.
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
exports.PMCameraEvents = void 0;
const hz = __importStar(require("horizon/core"));
const camera_1 = __importStar(require("horizon/camera"));
// Define the network events that this player manager will handle
exports.PMCameraEvents = {
    setFirstPerson: new hz.NetworkEvent('setFirstPerson'),
    setThirdPerson: new hz.NetworkEvent('setThirdPerson'),
    setAttached: new hz.NetworkEvent('setAttached'),
    setFixed: new hz.NetworkEvent('setFixed'),
    setOrbit: new hz.NetworkEvent('setOrbit'),
    setPan: new hz.NetworkEvent('setPan'),
    setFollow: new hz.NetworkEvent('setFollow'),
};
class PlayerManager_Camera extends hz.Component {
    constructor() {
        super(...arguments);
        this.originalCameraMode = camera_1.CameraMode.FirstPerson;
    }
    start() {
        //set the owner of this entity
        this.owner = this.entity.owner.get();
        //confirm the owner is a player, exit if not
        if (this.owner === this.world.getServerPlayer()) {
            return;
        }
        //looks like we have a real player, lets connect to the network events
        console.log('PlayerManager_Basic: Player manager', this.entity.id, ' started for', this.owner.name.get());
        this.connectNetworkEvent(this.owner, exports.PMCameraEvents.setFirstPerson, (data) => this.setFirstPerson(data.options));
        this.connectNetworkEvent(this.owner, exports.PMCameraEvents.setThirdPerson, (data) => this.setThirdPerson(data.options));
        this.connectNetworkEvent(this.owner, exports.PMCameraEvents.setAttached, (data) => this.setAttached(data.target, data.options));
        this.connectNetworkEvent(this.owner, exports.PMCameraEvents.setFixed, (data) => this.setFixed(data.options));
        this.connectNetworkEvent(this.owner, exports.PMCameraEvents.setOrbit, (data) => this.setOrbit(data.options));
        this.connectNetworkEvent(this.owner, exports.PMCameraEvents.setPan, (data) => this.setPan(data.options));
        this.connectNetworkEvent(this.owner, exports.PMCameraEvents.setFollow, (data) => this.setFollow(data.options));
    }
    setFirstPerson(options) {
        if (options) {
            this.lastCameraOptions = options;
            camera_1.default.setCameraModeFirstPerson(options);
        }
        else {
            camera_1.default.setCameraModeFirstPerson();
        }
    }
    setThirdPerson(options) {
        if (options) {
            this.lastCameraOptions = options;
            camera_1.default.setCameraModeThirdPerson(options);
        }
        else {
            camera_1.default.setCameraModeThirdPerson();
        }
    }
    setAttached(target, options) {
        this.originalCameraMode = camera_1.default.currentMode.get();
        if (options) {
            this.lastAttachOptions = options;
            this.lastCameraTarget = target;
            camera_1.default.setCameraModeAttach(target, options);
        }
        else {
            camera_1.default.setCameraModeAttach(target);
        }
        this.async.setTimeout(() => {
            this.revertCameraMode();
        }, 3000);
    }
    setFixed(options) {
        if (options) {
            this.lastFixedOptions = options;
            camera_1.default.setCameraModeFixed(options);
        }
        else {
            camera_1.default.setCameraModeFixed();
        }
        this.async.setTimeout(() => {
            this.revertCameraMode();
        }, 3000);
    }
    setOrbit(options) {
        if (options) {
            this.lastOrbitOptions = options;
            camera_1.default.setCameraModeOrbit(options);
        }
        else {
            camera_1.default.setCameraModeOrbit();
        }
    }
    setPan(options) {
        if (options) {
            this.lastPanOptions = options;
            camera_1.default.setCameraModePan(options);
        }
        else {
            camera_1.default.setCameraModePan();
        }
    }
    setFollow(options) {
        if (options) {
            this.lastFollowOptions = options;
            camera_1.default.setCameraModeFollow(options);
        }
        else {
            camera_1.default.setCameraModeFollow();
        }
    }
    revertCameraMode() {
        if (this.originalCameraMode !== undefined) {
            switch (this.originalCameraMode) {
                case camera_1.CameraMode.FirstPerson:
                    this.setFirstPerson(this.lastCameraOptions);
                    break;
                case camera_1.CameraMode.ThirdPerson:
                    this.setThirdPerson(this.lastCameraOptions);
                    break;
                case camera_1.CameraMode.Attach:
                    this.setAttached(this.lastCameraTarget ? this.lastCameraTarget : this.entity, this.lastAttachOptions);
                    break;
                case camera_1.CameraMode.Fixed:
                    this.setFixed(this.lastFixedOptions);
                    break;
                case camera_1.CameraMode.Orbit:
                    this.setOrbit(this.lastOrbitOptions);
                    break;
                case camera_1.CameraMode.Pan:
                    this.setPan(this.lastPanOptions);
                    break;
                case camera_1.CameraMode.Follow:
                    this.setFollow(this.lastFollowOptions);
                    break;
                default:
                    console.warn('PlayerManager_Camera: Unknown camera mode', this.originalCameraMode);
            }
        }
        else {
            console.warn('PlayerManager_Camera: No original camera mode set');
        }
    }
}
PlayerManager_Camera.propsDefinition = {};
hz.Component.register(PlayerManager_Camera);
/***********************************************************************************************
****************************You can have more than 1 script per file.***************************
******Below is just a test script for the trigger to prove the Player Manager script works******
***********************************************************************************************/
class cameraTrigger extends hz.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            console.log('Player entered trigger', player.name.get());
            switch (this.props.mode) {
                case camera_1.CameraMode.FirstPerson:
                    this.sendNetworkEvent(player, exports.PMCameraEvents.setFirstPerson, {});
                    break;
                case camera_1.CameraMode.ThirdPerson:
                    this.sendNetworkEvent(player, exports.PMCameraEvents.setThirdPerson, {});
                    break;
                case camera_1.CameraMode.Attach:
                    this.sendNetworkEvent(player, exports.PMCameraEvents.setAttached, { target: this.entity });
                    break;
                case camera_1.CameraMode.Fixed:
                    const fixedOptions = {
                        position: this.entity.position.get(),
                        rotation: this.entity.rotation.get(),
                    };
                    const transOptions = {
                        delay: 0,
                        duration: 0.5,
                        easing: camera_1.Easing.Linear,
                    };
                    const options = { ...fixedOptions, ...transOptions };
                    this.sendNetworkEvent(player, exports.PMCameraEvents.setFixed, { options: options });
                    break;
                case camera_1.CameraMode.Orbit:
                    this.sendNetworkEvent(player, exports.PMCameraEvents.setOrbit, {});
                    break;
                case camera_1.CameraMode.Pan:
                    this.sendNetworkEvent(player, exports.PMCameraEvents.setPan, {});
                    break;
                case camera_1.CameraMode.Follow:
                    this.sendNetworkEvent(player, exports.PMCameraEvents.setFollow, {});
                    break;
                default:
                    break;
            }
        });
    }
    start() { }
}
cameraTrigger.propsDefinition = {
    mode: {
        type: hz.PropTypes.Number,
        default: 0,
    },
};
hz.Component.register(cameraTrigger);
