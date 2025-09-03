import { Npc, Viseme } from "horizon/npc";
import * as hz from 'horizon/core';
import * as GC from 'GameConsts';
import { BaseComponent } from "./BaseComponent";
import { LogLevel } from "BaseLogger";
/**
 * Direction to give the boss and optionally elicit a response.
 * @param key - The context key to set in wit.ai
 * @param additionalPrompt - extra text to append to the final prompt
 * @param speechVariables - parameters to pass into the string replacement
 * @param toPlayer - The player to speak to, if any
 * @param speechEndCallback - The callback to call when the speech ends, if any
 * @param emotion - The emotion to set the LLM to, if any
 * @param captioningAudience - whether or not to caption this speech to the audience
 */
export declare const REQUEST_RESPONSE_TIMEOUT: string;
export declare const REQUEST_RESPONSE_TIMEOUT_DURATION: number;
/**
 * Base class for LLM-powered NPCs that provides core functionality for conversation management,
 * emotion handling, speech synthesis, and player interaction. This class serves as the foundation
 * for AI-driven characters that can engage in dynamic conversations with players.
 *
 * Key Features:
 * - LLM conversation management with context and memory
 * - Emotion system with automatic reset timers
 * - Speech synthesis with viseme support
 * - Player engagement tracking and captioning
 * - Error handling and recovery mechanisms
 * - Look-at target management for natural interactions
 */
export declare class NPC_Base extends BaseComponent<typeof NPC_Base> {
    static propsDefinition: any;
    name: string;
    protected _player: hz.Player | undefined;
    private _lookAtTarget;
    protected npcGizmo?: Npc | null;
    private _playerEngagedInConversation;
    protected captioningAudience: hz.Player[];
    private isTalking;
    private hasDirectionPending;
    private currentEmotion;
    private visemeEventSubscription;
    protected eventSubscriptions: hz.EventSubscription[];
    /**
     * Initializes the LLM component by setting up the NPC gizmo, subscribing to events,
     * and preparing the component for conversation management.
     */
    start(): void;
    /**
     * Updates the display name of the NPC.
     * @param newName - The new name to assign to the NPC
     */
    setName(newName: string): void;
    /**
     * Disconnects all LLM event subscriptions and cleans up resources.
     * Should be called when the LLM component is being destroyed or reset.
     */
    disconnectLLM(): void;
    /**
     * Sets up all necessary event subscriptions for NPC functionality including
     * player exit events, NPC errors, emotion events, and speech events.
     */
    subscribeEvents(): void;
    /**
     * Called when all players have left the world. Resets the LLM session
     * and stops any ongoing speech to clean up the NPC state.
     */
    onAllPlayersLeftWorld(): void;
    /**
     * Called when a specific player leaves the world. Cleans up any conversation
     * state and captioning audience associated with that player.
     * @param player - The player who left the world
     */
    onPlayerLeftWorld(player: hz.Player): void;
    /**
     * Handles the start of NPC speech by updating internal state, setting up
     * look-at targets, enabling visemes, and stopping response timeouts.
     */
    handleStartSpeakingToPlayer(): void;
    /**
     * Handles the end of NPC speech by cleaning up state, disabling visemes,
     * and ensuring proper emotion timing for deterministic behavior.
     */
    handleStopSpeakingToPlayer(): void;
    /**
     * Handles NPC errors by resetting speech state and logging the error.
     * Ensures gameplay continues despite LLM errors.
     * @param error - The error code as a string
     * @param message - The error message
     */
    handleNpcError(error: string, message: string): void;
    /**
     * Processes viseme data received from the LLM and forwards it to the agent mesh
     * for facial animation synchronization during speech.
     * @param viseme - The viseme data from the LLM
     */
    handleVisemeReceived(viseme: Viseme): void;
    /**
     * Handles the start of an emotion by mapping emotion strings to game constants
     * and applying the appropriate emotion to the NPC.
     * @param emotion - The emotion string received from the LLM
     */
    handleEmotionStart(emotion: string): void;
    /**
     * Handles the end of an emotion by resetting the NPC back to neutral state.
     * @param emotion - The emotion string that is ending
     */
    handleEmotionStop(emotion: string): void;
    /**
     * Prepares the LLM to start talking by setting up captioning audience,
     * conversation state, and initial emotion. The actual speech start is
     * handled by a separate method linked to the LLM start talk event.
     * @param player - The target player for the conversation
     * @param showCaptions - Caption audience configuration
     * @param emotion - The emotion to display during speech
     */
    prepareToTalk(player: hz.Player | undefined, showCaptions?: GC.CaptionAudience, emotion?: GC.Emotions): void;
    /**
     * Resets the LLM conversation session, clearing all memory and context.
     * Used when starting fresh conversations or when all players leave.
     */
    resetLLMSession(): void;
    /**
     * Sets the value of the shared context map at the given key to be the given value.
     * Will also trigger the LLM to respond if the elicitResponse flag is set to true.
     * This value will remain until changed or the session is reset.
     * @param key - The context key to set
     * @param value - The value to associate with the key
     * @param elicitResponse - Whether to trigger an LLM response immediately
     */
    setContextEntry(key: string, value: string, elicitResponse?: boolean): void;
    /**
     * Removes a specific context entry from the LLM's dynamic context.
     * @param key - The context key to remove
     */
    clearContextEntry(key: string): void;
    /**
     * Clears all dynamic context entries from the LLM conversation.
     */
    clearAllContextEntries(): void;
    /**
     * Clears all dynamic context from the LLM conversation.
     * Alias for clearAllContextMapEntries for backward compatibility.
     */
    clearAllDirection(): void;
    /**
     * Adds an event perception to the LLM's understanding of the current situation.
     * @param description - The description of what the NPC should perceive
     */
    addPerception(description: string): void;
    /**
     * Instructs the LLM to speak specific text to a target player with the given emotion and captioning settings.
     * @param text - The text to speak (will use empty string if undefined)
     * @param target - The player to address (optional)
     * @param emotion - The emotion to display during speech
     * @param showCaptions - Caption audience configuration
     */
    speak(text: string | undefined, target?: hz.Player, emotion?: GC.Emotions, showCaptions?: GC.CaptionAudience): void;
    /**
     * Elicits a speech response from the LLM with specified parameters.
     *
     * @param instruction - The instruction or prompt to elicit a response from the LLM
     * @param target - The player to whom the speech is directed, if any
     * @param emotion - The emotion to display during the speech
     * @param showCaptions - Configuration for which audience should see the captions
     */
    elicitSpeech(instruction: string | undefined, target?: hz.Player, emotion?: GC.Emotions, showCaptions?: GC.CaptionAudience): void;
    /**
     * Requests the LLM to stop speaking. The actual stop is handled by
     * a separate method linked to the LLM stop talk event.
     */
    askLLMToStopTalking(): void;
    /**
     * Gets the current emotion state of the NPC.
     * @returns The current emotion
     */
    getCurrentEmotion(): GC.Emotions;
    /**
     * Resets the NPC's emotion to neutral without triggering timeout-based reset.
     */
    resetEmotion(): void;
    /**
     * Determines whether emotions can be set based on the source and configuration.
     * @param fromLLM - Whether the emotion change is coming from the LLM
     * @returns True if emotions can be set, false otherwise
     */
    canSetEmotions(fromLLM: boolean): boolean;
    /**
     * Sets the current emotion of the NPC with options for immediate application,
     * automatic reset, and source validation.
     * @param emotion - The emotion to set
     * @param applyImmediately - Whether to apply the emotion immediately to the mesh
     * @param resetAfterTimeout - Whether to automatically reset to neutral after a timeout
     * @param fromLLM - Whether this emotion change is coming from the LLM
     */
    setCurrentEmotion(emotion: GC.Emotions, applyImmediately?: boolean, resetAfterTimeout?: boolean, fromLLM?: boolean): void;
    /**
     * Checks if the NPC is in a safe state to start talking (not currently talking or processing).
     * @returns True if safe to talk, false otherwise
     */
    isSafeToTalk(): boolean;
    /**
     * Enables viseme event subscription for facial animation during speech.
     */
    enableViseme(): void;
    /**
     * Disables viseme event subscription and notifies the agent mesh that talking has stopped.
     */
    disableViseme(): void;
    /**
     * Overrides the base log method to add NPC-specific formatting and gizmo validation.
     * @param msg - The message to log
     * @param canLog - Whether logging is enabled for this message
     * @param logLevel - The log level for the message
     */
    log(msg: string, canLog?: boolean, logLevel?: LogLevel | undefined): void;
    /**
     * Sets the look-at target for the NPC. Speech targets have higher priority than look-at targets.
     * @param target - The player or entity to look at
     */
    setLookAtTarget(target: hz.Player | hz.Entity | undefined): void;
    /**
     * Gets the current look-at target, prioritizing speech targets over general look-at targets.
     * @returns The current look-at target (speech target takes priority)
     */
    private getLookAtTarget;
    /**
     * Sets the player currently engaged in conversation with the NPC.
     * Speech targets have higher priority than general look-at targets.
     * @param target - The player engaged in conversation
     * @param lookAtImmediately - Whether to immediately update the look-at target
     */
    setPlayerEngagedInConversation(target: hz.Player | undefined, lookAtImmediately?: boolean): void;
    /**
     * Gets the player currently engaged in conversation with the NPC.
     * @returns The player engaged in conversation, or undefined if none
     */
    getPlayerEngagedInConversation(): hz.Player | undefined;
    /**
     * Updates the NPC's look-at target by sending events to the agent mesh.
     * Prioritizes conversation targets over general look-at targets.
     */
    updateLookAtTarget(): void;
}
