import { BaseAssetBundleComponent, AssetBundleParameterType } from 'BaseAssetBundleComponent';
import { Events } from 'Events';
import * as hz from 'horizon/core';
import { Emotions } from 'GameConsts';
import * as GC from 'GameConsts';
import { Lerp } from "./MathUtils";
import { NavMeshAgent } from "horizon/navmesh";

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

const GraphEmotions: string[] = [
    Emotions.Neutral,
    Emotions.Happy,
    Emotions.Suspicious,
    Emotions.Angry,
    Emotions.Confused
];

// Reference https://developers.meta.com/horizon/documentation/unity/audio-ovrlipsync-viseme-reference/?locale=en_GB
const enum VISEMES {
    sil = "00",
    PP = "01",
    FF = "02",
    TH = "03",
    DD = "04",
    kk = "05",
    CH = "06",
    SS = "07",
    nn = "08",
    RR = "09",
    aa = "10",
    E = "11",
    I = "12",
    O = "13",
    U = "14"
}

const EYES_MESH_NAME = "MeshEyes";
const MOUTH_MESH_NAME = "MeshMouth";

/**
 * Handles the necessary animation logic for NPCs, including locomotion, talking, and looking at targets.
 */
export abstract class BaseNPCAnimationComponent<T> extends BaseAssetBundleComponent<typeof BaseNPCAnimationComponent & T> {
    static propsDefinition = {
        ...BaseAssetBundleComponent.propsDefinition,
        flipbookFace: { type: hz.PropTypes.Boolean, defaultValue: false },
        navigation: { type: hz.PropTypes.Entity },
    }

    cached = {
        lookX: 0,
        lookY: 0,
    }

    protected lookAtTarget: hz.Player | hz.Entity | undefined;
    protected isTalking = false;
    protected headHeight = 1.8; // Default height of the head height
    private currentEmotion: GC.Emotions = GC.Emotions.Neutral;
    private directTransition: boolean = true;
    private isInVisemeCooldown: boolean = false;
    public started = false;
    protected abstract availableEmotions: Emotions[];
    private navMeshAgent?: NavMeshAgent;

    /**
     * Initializes the NPC animation component, setting up navigation and event subscriptions.
     */
    override start() {
        super.start();

        // guard against no navigation component (i.e. the in NUX navigation isn't needed)
        if (this.props.navigation) {
            this.navMeshAgent = this.props.navigation.as(NavMeshAgent);
        }

        this.reset();
        this.subscribeToEvents();

        this.startNPC();
    }

    /**
     * Updates the NPC animations, including locomotion and look-at parameters.
     * @param deltaTime - The time elapsed since the last update.
     */
    override update(deltaTime: number): void {
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

        this.connectLocalEvent(this.entity, Events.onEmotionChanged, (data) => {
            this.setEmotion(data.emotion);
        });

        this.connectLocalEvent(this.entity, Events.onStoppedTalking, () => {
            this.stopTalking();
        });

        this.connectLocalEvent(this.entity, Events.onStartedLookingAtTarget, (data) => {
            this.startLookingAtTarget(data.target);
        });

        this.connectLocalEvent(this.entity, Events.onStoppedLookingAtTarget, () => {
            this.stopLookingAtTarget();
        });

        this.connectLocalEvent(this.entity, Events.resetAnimation, () => {
            this.reset();
        });

        this.connectLocalEvent(this.entity, Events.onVisemeReceived, (data) => {
            this.setViseme(data.viseme);
        });

        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (player: hz.Player) => {
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
    override handleAnimationEvent(eventName: string) {
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
    setDirectTransition(directTransition: boolean) {
        this.directTransition = directTransition;
        this.setAnimationParameter(AssetBundleParameterType.Boolean, `DirectTransition`, directTransition);
    }

    /**
     * Sets the speed animation parameter.
     * @param value - The speed value to set.
     */
    setSpeed(value: number) {
        this.setAnimationParameter(AssetBundleParameterType.Float, "Speed", value);
    }

    /**
     * Sets the emotion of the NPC, updating eye shapes and animation parameters.
     * @param emotion - The emotion to set.
     * @param force - Whether to force the emotion change.
     */
    setEmotion(emotion: GC.Emotions, force: boolean = false) {
        if (!this.availableEmotions.includes(emotion)) {
            return;
        }

        this.setEyeShape(emotion);

        if (!this.directTransition && this.currentEmotion != emotion) {
            this.setAnimationParameter(AssetBundleParameterType.Trigger, `Emotion${this.currentEmotion}To${emotion}`);
        } else if (force) {
            this.setAnimationParameter(AssetBundleParameterType.Trigger, `Emotion${Emotions.Angry}To${emotion}`);
        }

        this.currentEmotion = emotion;
    }

    /**
     * Sets the viseme shape for the NPC's mouth based on the received viseme.
     * @param viseme - The viseme to set.
     */
    setViseme(viseme: string) {
        this.log(`OnLLMVisemeReceived received: ${viseme}`, GC.CONSOLE_LOG_VISEMES);
        this.startTalking();

        if (!this.isInVisemeCooldown || viseme == VISEMES.sil) {
            this.log(`OnLLMVisemeReceived APPLIED: ${viseme}`, GC.CONSOLE_LOG_VISEMES);

            this.setMouthShape(viseme);
            this.isInVisemeCooldown = true;

            this.startTimeout(VISEME_TIMEOUT, () => {
                this.isInVisemeCooldown = false;
            }, VISEME_TIMEOUT_TIME, true)

            this.startTimeout(TALKING_TIMEOUT, () => {
                this.stopTalking();
            }, TALKING_TIMEOUT_TIME, true)
        }
    }

    /**
     * Sets the mouth shape for the NPC based on the given shape.
     * @param shape - The shape to set for the mouth.
     */
    setMouthShape(shape: string) {
        if (this.props.flipbookFace) {
            this.setMaterial(`${MOUTH_MESH_NAME}_Lod0`, `Mouth${shape}`);
            this.setMaterial(`${MOUTH_MESH_NAME}_Lod1`, `Mouth${shape}`);
        } else {
            this.setAnimationParameter(AssetBundleParameterType.Trigger, `Viseme${shape}`);
        }
    }

    /**
     * Sets the eye shape for the NPC based on the given shape.
     * @param shape - The shape to set for the eyes.
     */
    setEyeShape(shape: string) {

        if (this.props.flipbookFace) {
            this.setMaterial(`${EYES_MESH_NAME}_Lod0`, `Eyes${shape}`);
            this.setMaterial(`${EYES_MESH_NAME}_Lod1`, `Eyes${shape}`);
        } else {
            // Reset other emotions
            for (let graphEmotion of GraphEmotions) {
                this.setAnimationParameter(AssetBundleParameterType.Boolean, `Emotion${graphEmotion}`, false);
            }

            // Apply desired emotion
            this.setAnimationParameter(AssetBundleParameterType.Boolean, `Emotion${shape}`, true);
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
    stopTalking(force: boolean = false) {
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
    startLookingAtTarget(target: hz.Player | hz.Entity) {
        this.log(`LOOK AT: startLookingAtTarget - ${this.entity.name.get()} at ${target.name.get()}`, GC.CONSOLE_LOG_NPC_ANIMATION);
        this.lookAtTarget = target;
    }

    /**
     * Updates the look-at animation parameters based on the target's position.
     * @param deltaTime - The time elapsed since the last update.
     */
    protected updateLookAtAnimationParameters(deltaTime: number) {
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

        this.cached.lookX = Lerp(this.cached.lookX, desiredLookX, deltaTime * LOOK_AT_BLEND_TIME);
        this.cached.lookY = Lerp(this.cached.lookY, desiredLookY, deltaTime * LOOK_AT_BLEND_TIME);
        this.setAnimationParameter(AssetBundleParameterType.Float, "LookX", this.cached.lookX);
        this.setAnimationParameter(AssetBundleParameterType.Float, "LookY", this.cached.lookY);
    }

    /**
     * Resets the NPC's state, stopping talking and setting default speed and emotion.
     */
    reset() {
        this.stopTalking(true);
        this.setSpeed(0);
        this.setEmotion(Emotions.Neutral, true);
    }

    /**
     * Sets the height of the NPC's head for look-at calculations.
     * @param height - The height to set for the head.
     */
    setHeadHeight(height: number) {
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
                let timeElapsedNormalized = timeElapsed / TALKING_BLEND_MAX_TIME
                let value = this.isTalking ? timeElapsedNormalized : 1 - timeElapsedNormalized;
                this.setAnimationParameter(AssetBundleParameterType.Float, "Talking", value);
            }
        })
    }
}
