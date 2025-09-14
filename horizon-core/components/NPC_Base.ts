import { NpcEvents, Npc, Viseme, NpcErrorCategory } from "horizon/npc";
import * as hz from 'horizon/core';
import * as GC from 'GameConsts';
import { Events } from "Events";
import { BaseComponent } from "./BaseComponent";
import { LogLevel } from "BaseLogger";

const TIMEOUT_RESET_EMOTION: string = "resetEmotion"; // Timeout before we reset the emotion back to neutral
const TIMEOUT_RESET_EMOTION_TIME: number = 10.0; // Time to wait before we reset the emotion back to neutral

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

export const REQUEST_RESPONSE_TIMEOUT: string = "requestResponseTimeout";
export const REQUEST_RESPONSE_TIMEOUT_DURATION: number = 10;

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
export class NPC_Base extends BaseComponent<typeof NPC_Base> {
  static propsDefinition = {
    ...BaseComponent.propsDefinition,
    agentMesh: { type: hz.PropTypes.Entity },
    agentNavigation: { type: hz.PropTypes.Entity }
  };

  name: string = "";

  protected _player: hz.Player | undefined;

  private _lookAtTarget: hz.Player | hz.Entity | undefined;

  protected npcGizmo?: Npc | null;

  private _playerEngagedInConversation: hz.Player | undefined;
  protected captioningAudience: hz.Player[] = [];

  private isTalking: boolean = false;
  private hasDirectionPending: boolean = false;
  private currentEmotion: GC.Emotions = GC.Emotions.Neutral;

  private visemeEventSubscription: hz.EventSubscription | null = null;
  protected eventSubscriptions: hz.EventSubscription[] = []

  /**
   * Initializes the LLM component by setting up the NPC gizmo, subscribing to events,
   * and preparing the component for conversation management.
   */
  start() {
    super.start();
    this.name = this.entity.name.get();
    this.npcGizmo = this.entity.as(Npc);

    this.subscribeEvents();

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (player: hz.Player) => {
      this.onPlayerLeftWorld(player);
    });

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (player: hz.Player) => {
      this.onPlayerLeftWorld(player);
    });

    this.askLLMToStopTalking();

    // Broadcast that this NPC has joined the world so the NPCBus can register it
    this.sendLocalBroadcastEvent(Events.onNpcJoinWorld, { npc: this });
    this.log(`NPC ${this.name} broadcasting join world event`);
  }

  /**
   * Updates the display name of the NPC.
   * @param newName - The new name to assign to the NPC
   */
  setName(newName: string) {
    this.name = newName;
  }

  /**
   * Disconnects all LLM event subscriptions and cleans up resources.
   * Should be called when the LLM component is being destroyed or reset.
   */
  disconnectLLM() {
    while (this.eventSubscriptions.length > 0) {
      this.eventSubscriptions.pop()!.disconnect();
    }
  }

  /**
   * Sets up all necessary event subscriptions for NPC functionality including
   * player exit events, NPC errors, emotion events, and speech events.
   */
  subscribeEvents() {
    if (!this.npcGizmo) {
      return;
    }

    this.eventSubscriptions.push(this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (player: hz.Player) => {
      // Reset the LLM session when all players leave the world
      const players = this.world.getPlayers();
      if (players.length == 0) {
        this.onAllPlayersLeftWorld();
      }

      this.onPlayerLeftWorld(player);
    }));

    this.eventSubscriptions.push(this.connectNetworkEvent(
      this.entity,
      NpcEvents.OnNpcError,
      (payload: { category: NpcErrorCategory, errorCode: number, errorMessage: string, playerId: number }) => {
        this.handleNpcError(payload.errorCode.toString(), payload.errorMessage);
      }
    ));

    this.eventSubscriptions.push(this.connectNetworkEvent(
      this.entity,
      NpcEvents.OnNpcEmoteStart,
      (payload: { emote: string }) => {
        this.handleEmotionStart(payload.emote);
      }
    ));

    this.eventSubscriptions.push(this.connectNetworkEvent(
      this.entity,
      NpcEvents.OnNpcEmoteStop,
      (payload: { emote: string }) => {
        this.handleEmotionStop(payload.emote);
      }
    ));

    this.eventSubscriptions.push(this.connectNetworkEvent(
      this.entity,
      NpcEvents.OnNpcStartedSpeaking,
      (payload: { emote: string }) => {
        this.handleStartSpeakingToPlayer();
      }
    ));
  }

  /**
   * Called when all players have left the world. Resets the LLM session
   * and stops any ongoing speech to clean up the NPC state.
   */
  onAllPlayersLeftWorld() {
    this.resetLLMSession();
    this.askLLMToStopTalking();
  }

  /**
   * Called when a specific player leaves the world. Cleans up any conversation
   * state and captioning audience associated with that player.
   * @param player - The player who left the world
   */
  onPlayerLeftWorld(player: hz.Player) {
    if (this.getPlayerEngagedInConversation() == player) {
      this.setPlayerEngagedInConversation(undefined);
    }
    this.captioningAudience = this.captioningAudience.filter(p => p != player);
  }

  /**
   * Handles the start of NPC speech by updating internal state, setting up
   * look-at targets, enabling visemes, and stopping response timeouts.
   */
  handleStartSpeakingToPlayer() {
    this.isTalking = true;
    this.hasDirectionPending = false;

    this.updateLookAtTarget();
    this.setCurrentEmotion(this.getCurrentEmotion(), true, false);
    this.enableViseme();

    this.stopTimeout(REQUEST_RESPONSE_TIMEOUT);
  }

  /**
   * Handles the end of NPC speech by cleaning up state, disabling visemes,
   * and ensuring proper emotion timing for deterministic behavior.
   */
  handleStopSpeakingToPlayer() {
    // At the moment the LLM gizmo might produce several stop speaking events for one response but we only want to trigger the speech end event once per response
    this.isTalking = false;
    this.disableViseme();
    this.setCurrentEmotion(this.getCurrentEmotion(), true, true); // Applying the current emotion to NPC after it finishes talking to make sure emotion inertial time will be deterministic
  }

  /**
   * Handles NPC errors by resetting speech state and logging the error.
   * Ensures gameplay continues despite LLM errors.
   * @param error - The error code as a string
   * @param message - The error message
   */
  handleNpcError(error: string, message: string) {
    // Reset speech parameter to make sure gameplay continues but be explicit that error has occurred by raisig it in code on screen
    this.isTalking = false;
    this.hasDirectionPending = false;
    this.log(`OnNpcError: ${error}: ${message}`, true, LogLevel.Error);
  }

  /**
   * Processes viseme data received from the LLM and forwards it to the agent mesh
   * for facial animation synchronization during speech.
   * @param viseme - The viseme data from the LLM
   */
  handleVisemeReceived(viseme: Viseme) {
    if (this.props.agentMesh) {
      let visemeIndex = viseme.toString().padStart(2, '0');
      this.sendLocalEvent(this.props.agentMesh, Events.onVisemeReceived, { viseme: visemeIndex });
    }
  }

  /**
   * Handles the start of an emotion by mapping emotion strings to game constants
   * and applying the appropriate emotion to the NPC.
   * @param emotion - The emotion string received from the LLM
   */
  handleEmotionStart(emotion: string) {
    let emotionToSet = this.currentEmotion;
    switch (emotion.toLowerCase()) {
      case "neutral":
      case "neutrual":
        emotionToSet = GC.Emotions.Neutral;
        break;
      case "angry":
      case "outraged":
        emotionToSet = GC.Emotions.Angry;
        break;
      case "surprised":
      case "confused":
      case "impatient":
        emotionToSet = GC.Emotions.Confused;
        break;
      case "happy":
      case "hapy":
      case "impressed":
      case "approving":
        emotionToSet = GC.Emotions.Happy;
        break;
      case "suspicious":
      case "sad":
        emotionToSet = GC.Emotions.Suspicious;
        break;
      case "speaking":
        //ignore
        return;
      default:
        this.log(`Unknown emotion: ${emotion}`, false, LogLevel.Error);
        // Default to the neutral emotion
        return;
    }
    this.setCurrentEmotion(emotionToSet, true, true, true);
  }

  /**
   * Handles the end of an emotion by resetting the NPC back to neutral state.
   * @param emotion - The emotion string that is ending
   */
  handleEmotionStop(emotion: string) {
    this.log(`EMOTION: Stop Emotion: ${emotion}`);
    this.setCurrentEmotion(GC.Emotions.Neutral, true, false, true);
  }

  /**
   * Prepares the LLM to start talking by setting up captioning audience,
   * conversation state, and initial emotion. The actual speech start is
   * handled by a separate method linked to the LLM start talk event.
   * @param player - The target player for the conversation
   * @param showCaptions - Caption audience configuration
   * @param emotion - The emotion to display during speech
   */
  prepareToTalk(player: hz.Player | undefined, showCaptions: GC.CaptionAudience = GC.CaptionAudience.PlayerOnly, emotion: GC.Emotions = this.currentEmotion) {
    switch (showCaptions) {
      case GC.CaptionAudience.AllPlayers:
        this.captioningAudience = this.world.getPlayers();
        this.log("Caption All players");
        break;
      case GC.CaptionAudience.PlayerOnly:
        if (player != undefined) {
          this.captioningAudience = [player!];
          this.log("Caption single player");
          break;
        }
      //fallthru when no player
      case GC.CaptionAudience.None:
        this.captioningAudience = [];
        this.log("Caption no one");
    }
    this.hasDirectionPending = true;
    if (player) {
      this.setPlayerEngagedInConversation(player, false);
    }

    if (emotion) {
      this.setCurrentEmotion(emotion, false);
    }
  }

  //#region Conversation Gizmo Wrappers
  /**
   * Resets the LLM conversation session, clearing all memory and context.
   * Used when starting fresh conversations or when all players leave.
   */
  resetLLMSession() {
    this.log("Resetting LLM Session");
    this.npcGizmo?.conversation?.resetMemory();
  }

  /**
   * Sets the value of the shared context map at the given key to be the given value.
   * Will also trigger the LLM to respond if the elicitResponse flag is set to true.
   * This value will remain until changed or the session is reset.
   * @param key - The context key to set
   * @param value - The value to associate with the key
   * @param elicitResponse - Whether to trigger an LLM response immediately
   */
  setContextEntry(key: string, value: string, elicitResponse: boolean = false): void {
    // note that persistent is always false as general context map entries don't have that concept.
    if (elicitResponse) {
      this.npcGizmo?.conversation?.elicitResponse(value);
    } else {
      this.npcGizmo?.conversation?.setDynamicContext(key, value);
    }
  }

  /**
   * Removes a specific context entry from the LLM's dynamic context.
   * @param key - The context key to remove
   */
  clearContextEntry(key: string): void {
    this.npcGizmo?.conversation?.removeDynamicContext(key);
  }

  /**
   * Clears all dynamic context entries from the LLM conversation.
   */
  clearAllContextEntries() {
    this.npcGizmo?.conversation?.clearDynamicContext();
  }

  /**
   * Clears all dynamic context from the LLM conversation.
   * Alias for clearAllContextMapEntries for backward compatibility.
   */
  clearAllDirection() {
    this.npcGizmo?.conversation?.clearDynamicContext();
  }

  /**
   * Adds an event perception to the LLM's understanding of the current situation.
   * @param description - The description of what the NPC should perceive
   */
  addPerception(description: string): void {
    this.npcGizmo?.conversation?.addEventPerception(description);
  }

  /**
   * Instructs the LLM to speak specific text to a target player with the given emotion and captioning settings.
   * @param text - The text to speak (will use empty string if undefined)
   * @param target - The player to address (optional)
   * @param emotion - The emotion to display during speech
   * @param showCaptions - Caption audience configuration
   */
  speak(text: string | undefined,
    target?: hz.Player,
    emotion: GC.Emotions = GC.Emotions.Neutral,
    showCaptions: GC.CaptionAudience = GC.CaptionAudience.PlayerOnly) {

    this.prepareToTalk(target, showCaptions, emotion);
    this.npcGizmo?.conversation?.speak(text ?? "");
  }

  /**
   * Elicits a speech response from the LLM with specified parameters.
   *
   * @param instruction - The instruction or prompt to elicit a response from the LLM
   * @param target - The player to whom the speech is directed, if any
   * @param emotion - The emotion to display during the speech
   * @param showCaptions - Configuration for which audience should see the captions
   */
  elicitSpeech(instruction: string | undefined,
    target?: hz.Player,
    emotion: GC.Emotions = GC.Emotions.Neutral,
    showCaptions: GC.CaptionAudience = GC.CaptionAudience.PlayerOnly) {

    this.prepareToTalk(target, showCaptions, emotion);
    this.npcGizmo?.conversation?.elicitResponse(instruction ?? "");
  }


  /**
   * Requests the LLM to stop speaking. The actual stop is handled by
   * a separate method linked to the LLM stop talk event.
   */
  askLLMToStopTalking() {
    this.npcGizmo?.conversation?.stopSpeaking();
  }
  //#endregion Conversation Gizmo Wrappers

  /**
   * Gets the current emotion state of the NPC.
   * @returns The current emotion
   */
  getCurrentEmotion() {
    return this.currentEmotion;
  }

  /**
   * Resets the NPC's emotion to neutral without triggering timeout-based reset.
   */
  resetEmotion() {
    this.setCurrentEmotion(GC.Emotions.Neutral, true, false);
  }

  /**
   * Determines whether emotions can be set based on the source and configuration.
   * @param fromLLM - Whether the emotion change is coming from the LLM
   * @returns True if emotions can be set, false otherwise
   */
  canSetEmotions(fromLLM: boolean): boolean {
    if (fromLLM) {
      // Emotion is being sent from the Npc so set it
      return true;
    }

    if (!GC.ONLY_USE_EMOTIONS_FROM_LLM) {
      // Flag not set so allow emotions from anywhere
      return true;
    }

    // We are set to only take emotional queues from the LLM so ignore game code
    // And this was not sent by the LLM so ignore it
    return false;
  }

  /**
   * Sets the current emotion of the NPC with options for immediate application,
   * automatic reset, and source validation.
   * @param emotion - The emotion to set
   * @param applyImmediately - Whether to apply the emotion immediately to the mesh
   * @param resetAfterTimeout - Whether to automatically reset to neutral after a timeout
   * @param fromLLM - Whether this emotion change is coming from the LLM
   */
  setCurrentEmotion(emotion: GC.Emotions, applyImmediately: boolean = true, resetAfterTimeout: boolean = true, fromLLM: boolean = false) {
    if (!this.canSetEmotions(fromLLM)) {
      // Only the NpcGizmo triggers emotion callbacks so always let the emotions through with the conversationGizmo.
      return;
    }

    this.currentEmotion = emotion;

    if (applyImmediately && this.props.agentMesh) {
      this.log(`LLM EMOTION: ${this.entity.name.get()} Emotion changed to ${emotion}`, GC.CONSOLE_LOG_LLM_EMOTION);
      this.stopTimeout(TIMEOUT_RESET_EMOTION);
      this.sendLocalEvent(this.props.agentMesh, Events.onEmotionChanged, { emotion: emotion });

      if (resetAfterTimeout) {
        // Reset emotion after a short delay
        this.startTimeout(TIMEOUT_RESET_EMOTION, () => {
          this.log(`LLM EMOTION: ${this.entity.name.get()} Resetting emotion to neutral after ${TIMEOUT_RESET_EMOTION_TIME} seconds`, GC.CONSOLE_LOG_LLM_EMOTION);
          this.resetEmotion();
        }, TIMEOUT_RESET_EMOTION_TIME, true);
      }
    }
  }

  /**
   * Checks if the NPC is in a safe state to start talking (not currently talking or processing).
   * @returns True if safe to talk, false otherwise
   */
  isSafeToTalk() {
    return !this.isTalking && !this.hasDirectionPending;
  }

  /**
   * Enables viseme event subscription for facial animation during speech.
   */
  enableViseme() {
    this.visemeEventSubscription = this.connectNetworkEvent(
      this.entity,
      NpcEvents.OnNpcVisemeChanged,
      (payload: { viseme: Viseme }) => {
        this.handleVisemeReceived(payload.viseme);
      }
    )
  }

  /**
   * Disables viseme event subscription and notifies the agent mesh that talking has stopped.
   */
  disableViseme() {
    this.visemeEventSubscription?.disconnect();
    if (this.props.agentMesh) {
      this.sendLocalEvent(this.props.agentMesh!, Events.onStoppedTalking, {});
    }
  }

  /**
   * Overrides the base log method to add NPC-specific formatting and gizmo validation.
   * @param msg - The message to log
   * @param canLog - Whether logging is enabled for this message
   * @param logLevel - The log level for the message
   */
  override log(msg: string, canLog: boolean = GC.CONSOLE_LOG_LLM, logLevel: LogLevel | undefined = LogLevel.Info): void {
    if (this.npcGizmo == null) {
      super.log("[LLM] No gizmo", GC.CONSOLE_LOG_LLM);
    }

    super.log(`[${this.name}]` + msg, canLog, logLevel);
  }

  /**
   * Sets the look-at target for the NPC. Speech targets have higher priority than look-at targets.
   * @param target - The player or entity to look at
   */
  setLookAtTarget(target: hz.Player | hz.Entity | undefined) {
    this._lookAtTarget = target;
    this.updateLookAtTarget();
  }

  /**
   * Gets the current look-at target, prioritizing speech targets over general look-at targets.
   * @returns The current look-at target (speech target takes priority)
   */
  private getLookAtTarget() {
    return this.getPlayerEngagedInConversation() || this._lookAtTarget;
  }

  /**
   * Sets the player currently engaged in conversation with the NPC.
   * Speech targets have higher priority than general look-at targets.
   * @param target - The player engaged in conversation
   * @param lookAtImmediately - Whether to immediately update the look-at target
   */
  setPlayerEngagedInConversation(target: hz.Player | undefined, lookAtImmediately: boolean = false) {
    this._playerEngagedInConversation = target;

    if (lookAtImmediately) {
      this.updateLookAtTarget();
    }
  }

  /**
   * Gets the player currently engaged in conversation with the NPC.
   * @returns The player engaged in conversation, or undefined if none
   */
  getPlayerEngagedInConversation() {
    return this._playerEngagedInConversation;
  }

  /**
   * Updates the NPC's look-at target by sending events to the agent mesh.
   * Prioritizes conversation targets over general look-at targets.
   */
  updateLookAtTarget() {
    if (!this.props.agentMesh) {
      return;
    }

    let lookAtTarget = this.getLookAtTarget();
    if (lookAtTarget) {
      this.sendLocalEvent(this.props.agentMesh!, Events.onStartedLookingAtTarget, { target: lookAtTarget });
    } else {
      this.sendLocalEvent(this.props.agentMesh!, Events.onStoppedLookingAtTarget, {});
    }
  }

}
hz.Component.register(NPC_Base);
