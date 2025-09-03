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
const sysEvents_1 = require("sysEvents");
const hz = __importStar(require("horizon/core"));
class RoomC_CannonControl extends hz.Component {
    constructor() {
        super(...arguments);
        this.isGrabbed = false;
    }
    start() {
        if (this.props.lever === null || this.props.lever === undefined) {
            throw new Error('CannonControl requires a lever');
        }
        if (this.props.cannon === null || this.props.cannon === undefined) {
            throw new Error('CannonControl requires a cannon');
        }
        // Lever setup
        this.defaultPosition = this.entity.position.get();
        this.async.setInterval(() => {
            this.updateControl();
        }, 20);
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabStart, (isRightHand, player) => {
            this.isGrabbed = true;
            if (this.props.motorSfx === null || this.props.motorSfx === undefined) {
                throw new Error('CannonControl requires a motorSfx');
            }
            this.props.motorSfx.as(hz.AudioGizmo)?.play();
        });
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabEnd, (player) => {
            this.isGrabbed = false;
            this.entity.position.set(this.defaultPosition);
            if (this.props.motorSfx === null || this.props.motorSfx === undefined) {
                throw new Error('CannonControl requires a motorSfx');
            }
            this.props.motorSfx.as(hz.AudioGizmo)?.stop();
        });
    }
    updateControl() {
        if (this.props.lever === null || this.props.lever === undefined) {
            throw new Error('CannonControl requires a lever');
        }
        if (this.props.cannon === null || this.props.cannon === undefined) {
            throw new Error('CannonControl requires a cannon');
        }
        let deltaZ = this.entity.position.get().z - this.defaultPosition.z;
        deltaZ = Math.min(Math.max(deltaZ, this.props.minLeverPitch), this.props.maxLeverPitch);
        const lookAtPosition = this.defaultPosition.add(hz.Vec3.forward.mul(deltaZ));
        this.props.lever.lookAt(lookAtPosition);
        if (this.isGrabbed) {
            this.sendLocalEvent(this.props.cannon, sysEvents_1.sysEvents.OnCannonLeverMoved, { delta: deltaZ, isPitch: this.props.isPitch });
        }
    }
}
RoomC_CannonControl.propsDefinition = {
    lever: { type: hz.PropTypes.Entity },
    cannon: { type: hz.PropTypes.Entity },
    motorSfx: { type: hz.PropTypes.Entity },
    isPitch: { type: hz.PropTypes.Boolean, default: true },
    maxLeverPitch: { type: hz.PropTypes.Number, default: 0.3 },
    minLeverPitch: { type: hz.PropTypes.Number, default: -0.3 }
};
hz.Component.register(RoomC_CannonControl);
