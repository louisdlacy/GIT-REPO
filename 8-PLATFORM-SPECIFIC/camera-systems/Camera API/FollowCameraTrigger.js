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
const PlayerCamera_1 = require("PlayerCamera");
class FollowCameraTrigger extends hz.Component {
    start() {
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
            this.sendNetworkEvent(player, PlayerCamera_1.PlayerCameraEvents.SetCameraCollisions, { collisionsEnabled: this.props.collisionsEnabled });
            if (this.props.verticalOffset !== undefined && this.props.verticalOffset !== null) {
                this.sendNetworkEvent(player, PlayerCamera_1.PlayerCameraEvents.SetCameraFollow, { activationDelay: this.props.activationDelay, cameraTurnSpeed: this.props.cameraTurnSpeed, continuousRotation: this.props.continuousRotation, distance: this.props.distance, horizonLevelling: this.props.horizonLevelling, rotationSpeed: this.props.rotationSpeed, translationSpeed: this.props.translationSpeed, verticalOffset: this.props.verticalOffset });
            }
            else {
                console.warn("Attempted to use FixedCameraTrigger without a camera position entity. Create an empty object and reference it in the props.");
            }
        });
        if (!this.props.keepCameraOnExit) {
            this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, (player) => {
                this.sendNetworkEvent(player, PlayerCamera_1.PlayerCameraEvents.RevertPlayerCamera, { translationSpeed: 0.0 });
            });
        }
    }
}
FollowCameraTrigger.propsDefinition = {
    activationDelay: { type: hz.PropTypes.Number, default: 0.5 },
    cameraTurnSpeed: { type: hz.PropTypes.Number, default: 0.5 },
    continuousRotation: { type: hz.PropTypes.Boolean, default: true },
    distance: { type: hz.PropTypes.Number, default: 12 },
    horizonLevelling: { type: hz.PropTypes.Boolean, default: true },
    rotationSpeed: { type: hz.PropTypes.Number, default: 0.5 },
    translationSpeed: { type: hz.PropTypes.Number, default: 4.0 },
    verticalOffset: { type: hz.PropTypes.Number, default: 0.1 },
    collisionsEnabled: { type: hz.PropTypes.Boolean, default: false },
    keepCameraOnExit: { type: hz.PropTypes.Boolean, default: false },
};
hz.Component.register(FollowCameraTrigger);
