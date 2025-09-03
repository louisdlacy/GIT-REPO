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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NPCMonster_1 = require("NPCMonster");
const camera_1 = __importDefault(require("horizon/camera"));
const hz = __importStar(require("horizon/core"));
const core_1 = require("horizon/core");
class Sword extends hz.Component {
    constructor() {
        super(...arguments);
        this.startPosition = hz.Vec3.zero;
        this.startRotation = hz.Quaternion.zero;
        this.returnSwordTimerId = -1;
        this.lastSwingTs = -1;
    }
    start() {
        this.startPosition = this.entity.position.get();
        this.startRotation = this.entity.rotation.get();
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabStart, (isRightHand, player) => {
            if (this.returnSwordTimerId > -1) {
                this.async.clearTimeout(this.returnSwordTimerId);
                this.returnSwordTimerId = -1;
            }
            this.entity.owner.set(player);
            this.async.setTimeout(() => {
                camera_1.default.setCameraModeThirdPerson();
            }, 500);
            this.sendNetworkBroadcastEvent(NPCMonster_1.StartAttackingPlayer, { player });
        });
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnIndexTriggerDown, (triggerPlayer) => {
            if (triggerPlayer.deviceType.get() !== core_1.PlayerDeviceType.VR && triggerPlayer === this.entity.owner.get()) {
                if (this.lastSwingTs === -1 || Date.now() - this.lastSwingTs > this.props.swingCooldown) {
                    this.lastSwingTs = Date.now();
                    this.entity.owner.get().playAvatarGripPoseAnimationByName(hz.AvatarGripPoseAnimationNames.Fire);
                }
            }
        });
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabEnd, (player) => {
            camera_1.default.setCameraModeFirstPerson();
            this.async.setTimeout(() => {
                this.entity.owner.set(this.world.getServerPlayer());
            }, 300);
            this.returnSwordTimerId = this.async.setTimeout(() => {
                this.entity.position.set(this.startPosition);
                this.entity.rotation.set(this.startRotation);
                this.returnSwordTimerId = -1;
            }, this.props.returnSwordDelay);
            this.sendNetworkBroadcastEvent(NPCMonster_1.StopAttackingPlayer, { player });
        });
    }
}
Sword.propsDefinition = {
    returnSwordDelay: { type: hz.PropTypes.Number, default: 1 },
    swingCooldown: { type: hz.PropTypes.Number, default: 200 }
};
hz.Component.register(Sword);
