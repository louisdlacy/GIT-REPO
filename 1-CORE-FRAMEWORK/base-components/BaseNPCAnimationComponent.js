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
exports.BaseNPCAnimationComponent = void 0;
const BaseAssetBundleComponent_1 = require("BaseAssetBundleComponent");
const Events_1 = require("Events");
const hz = __importStar(require("horizon/core"));
const GameConsts_1 = require("GameConsts");
const GC = __importStar(require("GameConsts"));
const MathUtils_1 = require("./MathUtils");
const navmesh_1 = require("horizon/navmesh");
const UPDATE_TALKING_ANIMATION_BLEND_TIMEOUT = "UPDATE_TALKING_ANIMATION_BLEND_TIMEOUT";
const TALKING_BLEND_TIME_INTERVAL = 0.0139; // seconds - 72fps
const TALKING_BLEND_MAX_TIME = 0.175; // seconds
const LOOK_AT_BLEND_TIME = 5;
const VISEME_TIMEOUT = "VISEME_TIMEOUT";
const VISEME_TIMEOUT_TIME = 0.1;
// The NPC platform seems not always to be triggering the stopped talking event so adding a timeout to make talking
// animation stop after a timeout
const TALKING_TIMEOUT = "TALKING_TIMEOUT";
const TALKING_TIMEOUT_TIME = 1;
const GraphEmotions = [
    GameConsts_1.Emotions.Neutral,
    GameConsts_1.Emotions.Happy,
    GameConsts_1.Emotions.Suspicious,
    GameConsts_1.Emotions.Angry,
    GameConsts_1.Emotions.Confused
];
const EYES_MESH_NAME = "MeshEyes";
const MOUTH_MESH_NAME = "MeshMouth";
/**
 * Handles the necessary animation logic for NPCs, including locomotion, talking, and looking at targets.
 */
class BaseNPCAnimationComponent extends BaseAssetBundleComponent_1.BaseAssetBundleComponent {
    constructor() {
        super(...arguments);
        this.cached = {
            lookX: 0,
            lookY: 0,
        };
        this.isTalking = false;
        this.headHeight = 1.8; // Default height of the head height
        this.currentEmotion = GC.Emotions.Neutral;
        this.directTransition = true;
        this.isInVisemeCooldown = false;
        this.started = false;
    }
    /**
     * Initializes the NPC animation component, setting up navigation and event subscriptions.
     */
    start() {
        super.start();
        // guard against no navigation component (i.e. the in NUX navigation isn't needed)
        if (this.props.navigation) {
            this.navMeshAgent = this.props.navigation.as(navmesh_1.NavMeshAgent);
        }
        this.reset();
        this.subscribeToEvents();
        this.startNPC();
    }
    /**
     * Updates the NPC animations, including locomotion and look-at parameters.
     * @param deltaTime - The time elapsed since the last update.
     */
    update(deltaTime) {
        if (this.started) {
            super.update(deltaTime);
            this.updateLocomotionAnimation();
            this.updateLookAtAnimationParameters(deltaTime);
        }
    }
    /**
     * Subscribes to various events related to NPC animations and actions.
     */
    subscribeToEvents() {
        this.connectLocalEvent(this.entity, Events_1.Events.onEmotionChanged, (data) => {
            this.setEmotion(data.emotion);
        });
        this.connectLocalEvent(this.entity, Events_1.Events.onStoppedTalking, () => {
            this.stopTalking();
        });
        this.connectLocalEvent(this.entity, Events_1.Events.onStartedLookingAtTarget, (data) => {
            this.startLookingAtTarget(data.target);
        });
        this.connectLocalEvent(this.entity, Events_1.Events.onStoppedLookingAtTarget, () => {
            this.stopLookingAtTarget();
        });
        this.connectLocalEvent(this.entity, Events_1.Events.resetAnimation, () => {
            this.reset();
        });
        this.connectLocalEvent(this.entity, Events_1.Events.onVisemeReceived, (data) => {
            this.setViseme(data.viseme);
        });
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (player) => {
            if (this.lookAtTarget == player) {
                this.lookAtTarget = undefined;
            }
        });
    }
    /**
     * Starts the NPC, enabling updates.
     */
    startNPC() {
        this.enableUpdate(true);
        this.started = true;
    }
    /**
     * Stops the locomotion animation by setting the speed to zero.
     */
    stopLocomotionAnimation() {
        this.setSpeed(0);
    }
    /**
     * Handles animation events, such as footsteps.
     * @param eventName - The name of the animation event.
     */
    handleAnimationEvent(eventName) {
        super.handleAnimationEvent(eventName);
        let [eventType, eventVar] = eventName.split(":");
        switch (eventType) {
            case "FOOTSTEP":
                // SoundManager.instance.playSoundAtPos(GC.Sounds.SHOPPER_FOOTSTEP, this.entity.position.get());
                break;
        }
    }
    /**
     * Updates the locomotion animation based on the current speed of the navMeshAgent.
     */
    updateLocomotionAnimation() {
        this.setSpeed(this.navMeshAgent?.currentSpeed.get() || 0);
    }
    /**
     * Sets the direct transition flag and updates the animation parameter.
     * @param directTransition - Whether to use direct transition for animations.
     */
    setDirectTransition(directTransition) {
        this.directTransition = directTransition;
        this.setAnimationParameter(BaseAssetBundleComponent_1.AssetBundleParameterType.Boolean, `DirectTransition`, directTransition);
    }
    /**
     * Sets the speed animation parameter.
     * @param value - The speed value to set.
     */
    setSpeed(value) {
        this.setAnimationParameter(BaseAssetBundleComponent_1.AssetBundleParameterType.Float, "Speed", value);
    }
    /**
     * Sets the emotion of the NPC, updating eye shapes and animation parameters.
     * @param emotion - The emotion to set.
     * @param force - Whether to force the emotion change.
     */
    setEmotion(emotion, force = false) {
        if (!this.availableEmotions.includes(emotion)) {
            return;
        }
        this.setEyeShape(emotion);
        if (!this.directTransition && this.currentEmotion != emotion) {
            this.setAnimationParameter(BaseAssetBundleComponent_1.AssetBundleParameterType.Trigger, `Emotion${this.currentEmotion}To${emotion}`);
        }
        else if (force) {
            this.setAnimationParameter(BaseAssetBundleComponent_1.AssetBundleParameterType.Trigger, `Emotion${GameConsts_1.Emotions.Angry}To${emotion}`);
        }
        this.currentEmotion = emotion;
    }
    /**
     * Sets the viseme shape for the NPC's mouth based on the received viseme.
     * @param viseme - The viseme to set.
     */
    setViseme(viseme) {
        this.log(`OnLLMVisemeReceived received: ${viseme}`, GC.CONSOLE_LOG_VISEMES);
        this.startTalking();
        if (!this.isInVisemeCooldown || viseme == "00" /* VISEMES.sil */) {
            this.log(`OnLLMVisemeReceived APPLIED: ${viseme}`, GC.CONSOLE_LOG_VISEMES);
            this.setMouthShape(viseme);
            this.isInVisemeCooldown = true;
            this.startTimeout(VISEME_TIMEOUT, () => {
                this.isInVisemeCooldown = false;
            }, VISEME_TIMEOUT_TIME, true);
            this.startTimeout(TALKING_TIMEOUT, () => {
                this.stopTalking();
            }, TALKING_TIMEOUT_TIME, true);
        }
    }
    /**
     * Sets the mouth shape for the NPC based on the given shape.
     * @param shape - The shape to set for the mouth.
     */
    setMouthShape(shape) {
        if (this.props.flipbookFace) {
            this.setMaterial(`${MOUTH_MESH_NAME}_Lod0`, `Mouth${shape}`);
            this.setMaterial(`${MOUTH_MESH_NAME}_Lod1`, `Mouth${shape}`);
        }
        else {
            this.setAnimationParameter(BaseAssetBundleComponent_1.AssetBundleParameterType.Trigger, `Viseme${shape}`);
        }
    }
    /**
     * Sets the eye shape for the NPC based on the given shape.
     * @param shape - The shape to set for the eyes.
     */
    setEyeShape(shape) {
        if (this.props.flipbookFace) {
            this.setMaterial(`${EYES_MESH_NAME}_Lod0`, `Eyes${shape}`);
            this.setMaterial(`${EYES_MESH_NAME}_Lod1`, `Eyes${shape}`);
        }
        else {
            // Reset other emotions
            for (let graphEmotion of GraphEmotions) {
                this.setAnimationParameter(BaseAssetBundleComponent_1.AssetBundleParameterType.Boolean, `Emotion${graphEmotion}`, false);
            }
            // Apply desired emotion
            this.setAnimationParameter(BaseAssetBundleComponent_1.AssetBundleParameterType.Boolean, `Emotion${shape}`, true);
        }
    }
    /**
     * Starts the talking animation for the NPC.
     */
    startTalking() {
        if (!this.isTalking) {
            this.isTalking = true;
            this.updateTalkingAnimationBlend();
        }
    }
    /**
     * Stops the talking animation for the NPC.
     * @param force - Whether to forcefully stop talking.
     */
    stopTalking(force = false) {
        if (this.isTalking || force) {
            this.isTalking = false;
            this.stopLookingAtTarget();
            this.updateTalkingAnimationBlend();
            this.setMouthShape(this.currentEmotion);
        }
    }
    /**
     * Stops the NPC from looking at the current target.
     */
    stopLookingAtTarget() {
        this.log(`LOOK AT: stopLookingAtTarget - ${this.entity.name.get()}`, GC.CONSOLE_LOG_NPC_ANIMATION);
        this.lookAtTarget = undefined;
    }
    /**
     * Starts the NPC looking at a specified target.
     * @param target - The target for the NPC to look at.
     */
    startLookingAtTarget(target) {
        this.log(`LOOK AT: startLookingAtTarget - ${this.entity.name.get()} at ${target.name.get()}`, GC.CONSOLE_LOG_NPC_ANIMATION);
        this.lookAtTarget = target;
    }
    /**
     * Updates the look-at animation parameters based on the target's position.
     * @param deltaTime - The time elapsed since the last update.
     */
    updateLookAtAnimationParameters(deltaTime) {
        let desiredLookX = 0.0;
        let desiredLookY = 0.0;
        let lookAtTarget = this.lookAtTarget;
        if (lookAtTarget) {
            let target = (lookAtTarget instanceof hz.Player) ? lookAtTarget.head : lookAtTarget;
            const headPosition = this.entity.position.get();
            headPosition.y += this.headHeight;
            const delta = target.position.get().sub(headPosition);
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
        this.cached.lookX = (0, MathUtils_1.Lerp)(this.cached.lookX, desiredLookX, deltaTime * LOOK_AT_BLEND_TIME);
        this.cached.lookY = (0, MathUtils_1.Lerp)(this.cached.lookY, desiredLookY, deltaTime * LOOK_AT_BLEND_TIME);
        this.setAnimationParameter(BaseAssetBundleComponent_1.AssetBundleParameterType.Float, "LookX", this.cached.lookX);
        this.setAnimationParameter(BaseAssetBundleComponent_1.AssetBundleParameterType.Float, "LookY", this.cached.lookY);
    }
    /**
     * Resets the NPC's state, stopping talking and setting default speed and emotion.
     */
    reset() {
        this.stopTalking(true);
        this.setSpeed(0);
        this.setEmotion(GameConsts_1.Emotions.Neutral, true);
    }
    /**
     * Sets the height of the NPC's head for look-at calculations.
     * @param height - The height to set for the head.
     */
    setHeadHeight(height) {
        this.log(`LOOK AT: setHeadHeight - ${this.entity.name.get()} at ${height}`, GC.CONSOLE_LOG_NPC_ANIMATION);
        this.headHeight = height;
    }
    /**
     * Updates the talking animation blend over time.
     */
    updateTalkingAnimationBlend() {
        let timeElapsed = 0;
        this.startInterval(UPDATE_TALKING_ANIMATION_BLEND_TIMEOUT, TALKING_BLEND_TIME_INTERVAL, TALKING_BLEND_MAX_TIME, {
            onInterval: () => {
                timeElapsed += TALKING_BLEND_TIME_INTERVAL;
                let timeElapsedNormalized = timeElapsed / TALKING_BLEND_MAX_TIME;
                let value = this.isTalking ? timeElapsedNormalized : 1 - timeElapsedNormalized;
                this.setAnimationParameter(BaseAssetBundleComponent_1.AssetBundleParameterType.Float, "Talking", value);
            }
        });
    }
}
exports.BaseNPCAnimationComponent = BaseNPCAnimationComponent;
BaseNPCAnimationComponent.propsDefinition = {
    ...BaseAssetBundleComponent_1.BaseAssetBundleComponent.propsDefinition,
    flipbookFace: { type: hz.PropTypes.Boolean, defaultValue: false },
    navigation: { type: hz.PropTypes.Entity },
};
