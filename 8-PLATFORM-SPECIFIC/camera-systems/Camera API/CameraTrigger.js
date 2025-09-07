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
const PlayerCamera_1 = require("PlayerCamera");
class CameraTrigger extends hz.Component {
    start() {
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            this.sendNetworkEvent(player, PlayerCamera_1.PlayerCameraEvents.SetCameraMode, { mode: this.getCameraMode() });
        });
        if (!this.props.keepCameraOnExit) {
            this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, (player) => {
                this.sendNetworkEvent(player, PlayerCamera_1.PlayerCameraEvents.RevertPlayerCamera, {});
            });
        }
    }
    getCameraMode() {
        switch (this.props.cameraMode) {
            case 'Follow':
                return camera_1.CameraMode.Follow;
            case 'Pan':
                return camera_1.CameraMode.Pan;
            case 'Attach':
                return camera_1.CameraMode.Attach;
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
CameraTrigger.propsDefinition = {
    cameraMode: { type: hz.PropTypes.String },
    keepCameraOnExit: { type: hz.PropTypes.Boolean, default: false }
};
hz.Component.register(CameraTrigger);
