// Copyright (c) Dave Mills (uRocketLife). Released under the MIT License.

import { AudioLabel, playAudio } from "AudioManager";
import LocalCamera, { CameraTransitionOptions, Easing } from "horizon/camera";
import {
  Component,
  PropTypes,
  Entity,
  Vec3,
  PlayerControls,
  InteractionInfo,
  RaycastTargetType,
  RaycastGizmo,
  Player,
  PlayerDeviceType,
  PlayerInput,
  PlayerInputAction,
  ButtonIcon,
  ButtonPlacement,
  FocusedInteractionTapOptions,
  FocusedInteractionTrailOptions,
  DefaultFocusedInteractionTapOptions,
  DefaultFocusedInteractionTrailOptions,
  NetworkEvent,
  Quaternion,
} from "horizon/core";
import { sysEvents } from "sysEvents";
import { simpleButtonEvent } from "UI_SimpleButtonEvent";
import { playVFX, VFXLabel } from "VFXManager";

//region event definitions
export const damageEvent = new NetworkEvent<{ player: Player; damage: number }>("damageEvent");

/**
 * A focused-interaction & camera helper for Horizon Worlds. This component:
 * - Toggles Focused Interaction Mode via a custom input.
 * - Switches between First-Person and Third-Person cameras with easing.
 * - Listens for focused interaction input (start/move/end) and performs selection raycasts.
 * - Emits a `damageEvent` to any hit entity tagged `"damageable"`.
 */
class InteractionController extends Component<typeof InteractionController> {
  static propsDefinition = {
    selectionRaycast: { type: PropTypes.Entity },
  };
  showDebugs: boolean = true; // Set to true to enable debug logs

  //player assigned ownership
  private playerOwner: Player | null = null;

  //tap and trail options
  private currentTapOptions: FocusedInteractionTapOptions = DefaultFocusedInteractionTapOptions;
  private currentTrailOptions: FocusedInteractionTrailOptions = DefaultFocusedInteractionTrailOptions;

  //custom input variables
  private swapInput?: PlayerInput;

  //current player interaction state
  private isFirstPerson: boolean = false;
  private inFocusMode = false;
  
  //camera transition options
  private transitionOptions: CameraTransitionOptions = {
    duration: 0.5,
    easing: Easing.EaseInOut,
  };
  //selection raycast gizmo
  private selectionRaycastGizmo: RaycastGizmo | null = null;

  //region preStart()
  preStart(): void {
    //ensure script is owned by a player and not the server
    const isServerOwner = this.entity.owner.get() === this.world.getServerPlayer();
    if (isServerOwner) return;

    //cache player owner
    this.playerOwner = this.entity.owner.get();

    this.connectNetworkEvent(this.entity, simpleButtonEvent, (data) => {
      if (!this.playerOwner) return;

      if (!this.inFocusMode) {
        console.log("Entering Focused Interaction Mode");
        this.entity.owner.get().enterFocusedInteractionMode();
        this.inFocusMode = true;
      } else {
        console.log("Exiting Focused Interaction Mode");
        this.entity.owner.get().exitFocusedInteractionMode();
        this.inFocusMode = false;
      }
    });

    //region focused interaction events
    this.connectLocalBroadcastEvent(PlayerControls.onFocusedInteractionInputStarted, (data) => {
      const firstInteraction = data.interactionInfo[0];
      console.log("Focused Interaction Input Started", firstInteraction);
      if (firstInteraction.interactionIndex !== 0) return;

      this.onInputStarted({ interactionInfo: [firstInteraction] });
      playAudio(this, AudioLabel.button);
    });

    this.connectLocalBroadcastEvent(PlayerControls.onFocusedInteractionInputMoved, (data) => {
      const firstInteraction = data.interactionInfo[0];
      if (firstInteraction.interactionIndex !== 0) return;

      this.onInputMoved({ interactionInfo: [firstInteraction] });
    });

    this.connectLocalBroadcastEvent(PlayerControls.onFocusedInteractionInputEnded, (data) => {
      const firstInteraction = data.interactionInfo[0];
      if (firstInteraction.interactionIndex !== 0) return;

      this.onInputEnded({ interactionInfo: [firstInteraction] });
    });

    //region tap&trail options
    // Customize taps when the `OnSetFocusedInteractionTapOptions` is received
    this.connectNetworkEvent(this.playerOwner, sysEvents.OnSetFocusedInteractionTapOptions, (data) => {
      this.currentTapOptions = { ...this.currentTapOptions, ...data.tapOptions };
      this.playerOwner!.focusedInteraction.setTapOptions(data.enabled, this.currentTapOptions);
    });

    // Customize trails when the `OnSetFocusedInteractionTrailOptions` is received
    this.connectNetworkEvent(this.playerOwner, sysEvents.OnSetFocusedInteractionTrailOptions, (data) => {
      this.currentTrailOptions = { ...this.currentTrailOptions, ...data.trailOptions };
      this.playerOwner!.focusedInteraction.setTrailOptions(data.enabled, this.currentTrailOptions);
    });

    //region custom input
    //custom input subscription
    this.swapInput = PlayerControls.connectLocalInput(PlayerInputAction.RightTertiary, ButtonIcon.Swap, this, {
      preferredButtonPlacement: ButtonPlacement.Default,
    });
    this.swapInput.registerCallback((action, pressed) => {
      if (this.playerOwner?.deviceType.get() === PlayerDeviceType.VR) {
        console.error("VR not supported for camera switching");
        return;
      }

      if (pressed) {
        if (!this.isFirstPerson) {
          console.log("Switching to First Person View");
          LocalCamera.setCameraModeFirstPerson(this.transitionOptions);
          this.playerOwner?.enterFocusedInteractionMode();
          this.inFocusMode = true;
          playAudio(this, AudioLabel.open);
        } else {
          console.log("Switching to Third Person View");
          LocalCamera.setCameraModeThirdPerson(this.transitionOptions);
          this.playerOwner?.exitFocusedInteractionMode();
          this.inFocusMode = false;
          playAudio(this, AudioLabel.close);
        }
        this.isFirstPerson = !this.isFirstPerson;
      }
    });
  }

  //region start()
  start(): void {
    const isServerOwner = this.entity.owner.get() === this.world.getServerPlayer();
    if (isServerOwner) return;

    if (this.props.selectionRaycast) {
      this.selectionRaycastGizmo = this.props.selectionRaycast.as(RaycastGizmo);
    }
  }

  //region onInputStarted()
  private onInputStarted(data: { interactionInfo: InteractionInfo[] }) {
    const touchInfo = data.interactionInfo[0];

    const hitEntity = this.raycastHitTarget(this.selectionRaycastGizmo!, touchInfo);
    const hitPoint = this.raycastHitPoint(this.selectionRaycastGizmo!, touchInfo);
    debugLog(this.showDebugs, `Hit slot: ${hitEntity ? hitEntity.name.get() : "None"}, Hit point: ${hitPoint ? hitPoint.toString() : "None"}`);
    if (hitEntity) {
      const tags = hitEntity.tags.get();
      if (tags.includes("damageable")) {
        debugLog(this.showDebugs, `Hit damageable slot: ${hitEntity.name.get()}`);
        //send damage event
        this.sendNetworkEvent(hitEntity, damageEvent, { player: this.playerOwner, damage: 10 });
        playAudio(this, AudioLabel.break);
        playVFX(this, VFXLabel.sparkles, [], hitPoint!, Quaternion.zero);
      }
      // debugLog(this.showDebugs, `Hit slot tags: ${tags.join(", ")}`);
    } else {
    }

  }

  //region onInputMoved()
  private onInputMoved(data: { interactionInfo: InteractionInfo[] }) {
    const touchInfo = data.interactionInfo[0];

  }

  //region onInputEnded()
  private onInputEnded(data: { interactionInfo: InteractionInfo[] }) {

  }

  //region raycastHitTarget()
  private raycastHitTarget(ray: RaycastGizmo, interactionInfo: InteractionInfo): Entity | null {
    const hit = ray.raycast(interactionInfo.worldRayOrigin, interactionInfo.worldRayDirection);
    return hit && hit.targetType === RaycastTargetType.Entity ? hit.target : null;
  }

  //region raycastHitPoint()
  private raycastHitPoint(ray: RaycastGizmo, interactionInfo: InteractionInfo): Vec3 | null {
    const hit = ray.raycast(interactionInfo.worldRayOrigin, interactionInfo.worldRayDirection);
    return hit && hit.targetType === RaycastTargetType.Entity ? hit.hitPoint : null;
  }

}

Component.register(InteractionController);

export function debugLog(showDebug: boolean, message: string): void {
  if (showDebug) {
    console.log(message);
  }
}
