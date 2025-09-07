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
exports.NPCAgent = exports.NPCAgentEmote = void 0;
const hz = __importStar(require("horizon/core"));
const navmesh_1 = require("horizon/navmesh");
const ab = __importStar(require("horizon/unity_asset_bundles"));
var NPCAgentEmote;
(function (NPCAgentEmote) {
    NPCAgentEmote["Wave"] = "EmoteWave";
    NPCAgentEmote["Celebration"] = "EmoteCelebration";
    NPCAgentEmote["Taunt"] = "EmoteTaunt";
    NPCAgentEmote["Yes"] = "EmoteYes";
    NPCAgentEmote["No"] = "EmoteNo";
    NPCAgentEmote["Point"] = "EmotePoint";
})(NPCAgentEmote || (exports.NPCAgentEmote = NPCAgentEmote = {}));
class NPCAgent extends hz.Component {
    constructor() {
        super(...arguments);
        this.animMoving_ = false;
        this.animSpeed_ = 0.0;
        this.animDead_ = false;
        this.animLookX_ = 0.0;
        this.animLookY_ = 0.0;
    }
    // Public properties
    get lookAt() {
        return this.lookAt_;
    }
    set lookAt(value) {
        if (value != this.lookAt_) {
            this.lookAt_ = value;
        }
    }
    get dead() {
        return this.animDead_;
    }
    set dead(value) {
        if (value != this.animDead_) {
            this.animDead_ = value;
            this.assetRef_?.setAnimationParameterBool("Death", value);
            this.navMeshAgent_?.isImmobile.set(value);
        }
    }
    get navMeshAgent() {
        return this.navMeshAgent_;
    }
    triggerAnimation(animationName) {
        if (animationName === "Death") {
            // Kill and revive if this is the death animation
            this.assetRef_?.setAnimationParameterBool("Death", true);
            this.async.setTimeout(() => {
                this.assetRef_?.setAnimationParameterBool("Death", false);
            }, 4000);
        }
        else {
            this.assetRef_?.setAnimationParameterTrigger(animationName, false);
        }
    }
    // Public methods
    triggerAttackAnimation() {
        this.triggerAnimation("Attack");
    }
    triggerHitAnimation() {
        this.triggerAnimation("Hit");
    }
    triggerEmoteAnimation(emote) {
        this.triggerAnimation(emote);
    }
    setMaxSpeedToWalkSpeed() {
        this.navMeshAgent_?.maxSpeed.set(this.props.walkSpeed);
    }
    setMaxSpeedToRunSpeed() {
        this.navMeshAgent_?.maxSpeed.set(Math.max(this.props.walkSpeed, this.props.runSpeed));
    }
    // Lifecycle
    start() {
        this.assetRef_ = this.entity.as(ab.AssetBundleGizmo)?.getRoot();
        this.resetAllAnimationParameters();
        this.navMeshAgent_ = this.entity.as(navmesh_1.NavMeshAgent) || undefined;
        this.navMeshAgent_?.maxSpeed.set(Math.max(this.props.walkSpeed, this.props.runSpeed));
        this.connectLocalBroadcastEvent(hz.World.onUpdate, (data) => {
            this.update(data.deltaTime);
        });
        // Make sure the random parameter used for selecting a random idle is updated once a second.
        if (this.props.hasRandomIdle) {
            this.async.setInterval(() => {
                this.assetRef_?.setAnimationParameterFloat("Random", Math.random());
            }, 1000);
        }
    }
    resetAllAnimationParameters() {
        if (this.assetRef_ === undefined || this.assetRef_ === null) {
            console.warn("NPCAgenet::resetAllAnimationParameters() Attempted to reset all animation triggers on an undefined assetRef_");
        }
        // Can also use this.assetRef_?.resetAnimationParameterTrigger("Death"); but we're specifying values here so that they can be easily overriden for default state
        this.assetRef_?.setAnimationParameterBool("Death", false);
        this.assetRef_?.setAnimationParameterBool("Moving", false);
        this.assetRef_?.setAnimationParameterBool("Falling", false);
        this.assetRef_?.setAnimationParameterFloat("LookX", 0);
        this.assetRef_?.setAnimationParameterFloat("LookY", 0);
        this.assetRef_?.setAnimationParameterFloat("Speed", 0);
        this.assetRef_?.setAnimationParameterFloat("RotateSpeed", 0);
        this.assetRef_?.setAnimationParameterFloat("Random", 0);
    }
    update(deltaTime) {
        this.updateSpeedAnimationParameters(deltaTime);
        this.updateLookAtAnimationParameters(deltaTime);
    }
    // Private methods
    updateSpeedAnimationParameters(deltaTime) {
        var speed = this.navMeshAgent?.currentSpeed.get() || 0.0;
        var speedAnimationValue = this.calculateSpeedAnimationValue(speed);
        speedAnimationValue = (speedAnimationValue + this.animSpeed_) * 0.5;
        if (speedAnimationValue <= 0.1) {
            speedAnimationValue = 0.0;
        }
        if (speedAnimationValue != this.animSpeed_) {
            this.animSpeed_ = speedAnimationValue;
            this.assetRef_?.setAnimationParameterFloat("Speed", speedAnimationValue);
        }
        var movingAnimationValue = speedAnimationValue > 0.0;
        if (movingAnimationValue != this.animMoving_) {
            this.animMoving_ = movingAnimationValue;
            this.assetRef_?.setAnimationParameterBool("Moving", movingAnimationValue);
        }
    }
    calculateSpeedAnimationValue(speed) {
        // Animation value is between 0 and 1 for walking, and between 1 and 4 for running.
        if (speed < this.props.walkSpeed) {
            return speed / this.props.walkSpeed;
        }
        else if (this.props.runSpeed <= this.props.walkSpeed) {
            return 1;
        }
        else if (speed < this.props.runSpeed) {
            return (((speed - this.props.walkSpeed) /
                (this.props.runSpeed - this.props.walkSpeed)) *
                3 +
                1);
        }
        else {
            return 4;
        }
    }
    updateLookAtAnimationParameters(deltaTime) {
        let desiredLookX = 0.0;
        let desiredLookY = 0.0;
        if (this.lookAt != undefined) {
            const headPosition = this.entity.position.get();
            headPosition.y += this.props.headHeight;
            const delta = this.lookAt.sub(headPosition);
            const dotForward = hz.Vec3.dot(this.entity.forward.get(), delta);
            if (dotForward > 0) {
                const dotRight = hz.Vec3.dot(this.entity.right.get(), delta);
                const dotUp = hz.Vec3.dot(this.entity.up.get(), delta);
                const angleRight = Math.atan2(dotRight, dotForward);
                const angleUp = Math.atan2(dotUp, dotForward);
                desiredLookX = angleRight / (Math.PI * 0.5);
                desiredLookY = angleUp / (Math.PI * 0.5);
            }
        }
        desiredLookX = (4 * this.animLookX_ + desiredLookX) * 0.2;
        desiredLookY = (4 * this.animLookY_ + desiredLookY) * 0.2;
        if (desiredLookX != this.animLookX_) {
            this.animLookX_ = desiredLookX;
            this.assetRef_?.setAnimationParameterFloat("LookX", desiredLookX);
        }
        if (desiredLookY != this.animLookY_) {
            this.animLookY_ = desiredLookY;
            this.assetRef_?.setAnimationParameterFloat("LookY", desiredLookY);
        }
    }
}
exports.NPCAgent = NPCAgent;
// Editable Properties
NPCAgent.propsDefinition = {
    headHeight: { type: hz.PropTypes.Number, default: 1.8 },
    walkSpeed: { type: hz.PropTypes.Number, default: 1.0 },
    runSpeed: { type: hz.PropTypes.Number, default: 0.0 },
    hasRandomIdle: { type: hz.PropTypes.Boolean, default: false },
};
hz.Component.register(NPCAgent);
