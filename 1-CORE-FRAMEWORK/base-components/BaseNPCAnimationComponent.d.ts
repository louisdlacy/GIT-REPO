import { BaseAssetBundleComponent } from 'BaseAssetBundleComponent';
import * as hz from 'horizon/core';
import { Emotions } from 'GameConsts';
import * as GC from 'GameConsts';
/**
 * Handles the necessary animation logic for NPCs, including locomotion, talking, and looking at targets.
 */
export declare abstract class BaseNPCAnimationComponent<T> extends BaseAssetBundleComponent<typeof BaseNPCAnimationComponent & T> {
    static propsDefinition: any;
    cached: {
        lookX: number;
        lookY: number;
    };
    protected lookAtTarget: hz.Player | hz.Entity | undefined;
    protected isTalking: boolean;
    protected headHeight: number;
    private currentEmotion;
    private directTransition;
    private isInVisemeCooldown;
    started: boolean;
    protected abstract availableEmotions: Emotions[];
    private navMeshAgent?;
    /**
     * Initializes the NPC animation component, setting up navigation and event subscriptions.
     */
    start(): void;
    /**
     * Updates the NPC animations, including locomotion and look-at parameters.
     * @param deltaTime - The time elapsed since the last update.
     */
    update(deltaTime: number): void;
    /**
     * Subscribes to various events related to NPC animations and actions.
     */
    subscribeToEvents(): void;
    /**
     * Starts the NPC, enabling updates.
     */
    startNPC(): void;
    /**
     * Stops the locomotion animation by setting the speed to zero.
     */
    stopLocomotionAnimation(): void;
    /**
     * Handles animation events, such as footsteps.
     * @param eventName - The name of the animation event.
     */
    handleAnimationEvent(eventName: string): void;
    /**
     * Updates the locomotion animation based on the current speed of the navMeshAgent.
     */
    updateLocomotionAnimation(): void;
    /**
     * Sets the direct transition flag and updates the animation parameter.
     * @param directTransition - Whether to use direct transition for animations.
     */
    setDirectTransition(directTransition: boolean): void;
    /**
     * Sets the speed animation parameter.
     * @param value - The speed value to set.
     */
    setSpeed(value: number): void;
    /**
     * Sets the emotion of the NPC, updating eye shapes and animation parameters.
     * @param emotion - The emotion to set.
     * @param force - Whether to force the emotion change.
     */
    setEmotion(emotion: GC.Emotions, force?: boolean): void;
    /**
     * Sets the viseme shape for the NPC's mouth based on the received viseme.
     * @param viseme - The viseme to set.
     */
    setViseme(viseme: string): void;
    /**
     * Sets the mouth shape for the NPC based on the given shape.
     * @param shape - The shape to set for the mouth.
     */
    setMouthShape(shape: string): void;
    /**
     * Sets the eye shape for the NPC based on the given shape.
     * @param shape - The shape to set for the eyes.
     */
    setEyeShape(shape: string): void;
    /**
     * Starts the talking animation for the NPC.
     */
    startTalking(): void;
    /**
     * Stops the talking animation for the NPC.
     * @param force - Whether to forcefully stop talking.
     */
    stopTalking(force?: boolean): void;
    /**
     * Stops the NPC from looking at the current target.
     */
    stopLookingAtTarget(): void;
    /**
     * Starts the NPC looking at a specified target.
     * @param target - The target for the NPC to look at.
     */
    startLookingAtTarget(target: hz.Player | hz.Entity): void;
    /**
     * Updates the look-at animation parameters based on the target's position.
     * @param deltaTime - The time elapsed since the last update.
     */
    protected updateLookAtAnimationParameters(deltaTime: number): void;
    /**
     * Resets the NPC's state, stopping talking and setting default speed and emotion.
     */
    reset(): void;
    /**
     * Sets the height of the NPC's head for look-at calculations.
     * @param height - The height to set for the head.
     */
    setHeadHeight(height: number): void;
    /**
     * Updates the talking animation blend over time.
     */
    updateTalkingAnimationBlend(): void;
}
