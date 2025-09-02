import * as hz from 'horizon/core';
import { sysEvents } from 'sysEvents';

class sysFocusedInteractionManagerLocal extends hz.Component<typeof sysFocusedInteractionManagerLocal> {
  static propsDefinition = {};

  private ownedByServer: boolean = true;
  private owningPlayer!: hz.Player;

  private activeFocusedInteractionExample?: hz.Entity;

  private currentTapOptions: hz.FocusedInteractionTapOptions = hz.DefaultFocusedInteractionTapOptions;
  private currentTrailOptions: hz.FocusedInteractionTrailOptions = hz.DefaultFocusedInteractionTrailOptions;

  start() {
    this.owningPlayer = this.entity.owner.get();
    this.ownedByServer = this.owningPlayer === this.world.getServerPlayer();

    // Only the local clients can use Focused Interactions
    if (this.ownedByServer) return;

    // When the `OnStartFocusMode` event is received, the player will enter Focused Interaction mode and start using an example controller to send inputs to
    this.connectNetworkEvent(this.owningPlayer, sysEvents.OnStartFocusMode, (data) => {
      this.activeFocusedInteractionExample = data.exampleController;
      this.owningPlayer.enterFocusedInteractionMode();
      this.sendNetworkEvent(this.owningPlayer, sysEvents.OnSetCameraModeFixed, {position: data.cameraPosition, rotation: data.cameraRotation});
    });

    // When the player exits Focused Interaction mode, reset camera to third person and notify the example controller
    this.connectNetworkBroadcastEvent(sysEvents.OnPlayerExitedFocusMode, (data) => {
      if (data.player !== this.owningPlayer) return;

      this.sendNetworkEvent(this.owningPlayer, sysEvents.OnSetCameraModeThirdPerson, null);

      if (this.activeFocusedInteractionExample) {
        this.sendNetworkEvent(this.activeFocusedInteractionExample, sysEvents.OnExitFocusMode, {player: this.owningPlayer});
        this.activeFocusedInteractionExample = undefined;
      }
    });

    // Tracking Focused Interaction inputs and sending the interaction data to the active example controller
    this.connectLocalBroadcastEvent(hz.PlayerControls.onFocusedInteractionInputStarted, (data) => {
      const firstInteraction = data.interactionInfo[0];
      if (firstInteraction.interactionIndex !== 0) return;

      if (this.activeFocusedInteractionExample) {
        this.sendNetworkEvent(this.activeFocusedInteractionExample, sysEvents.OnFocusedInteractionInputStarted, {interactionInfo: firstInteraction});
      }
    });

    this.connectLocalBroadcastEvent(hz.PlayerControls.onFocusedInteractionInputMoved, (data) => {
      const firstInteraction = data.interactionInfo[0];
      if (firstInteraction.interactionIndex !== 0) return;

      if (this.activeFocusedInteractionExample) {
        this.sendNetworkEvent(this.activeFocusedInteractionExample, sysEvents.OnFocusedInteractionInputMoved, {interactionInfo: firstInteraction});
      }
    });

    this.connectLocalBroadcastEvent(hz.PlayerControls.onFocusedInteractionInputEnded, (data) => {
      const firstInteraction = data.interactionInfo[0];
      if (firstInteraction.interactionIndex !== 0) return;

      if (this.activeFocusedInteractionExample) {
        this.sendNetworkEvent(this.activeFocusedInteractionExample, sysEvents.OnFocusedInteractionInputEnded, {interactionInfo: firstInteraction});
      }
    });

    // Customize taps when the `OnSetFocusedInteractionTapOptions` is received
    this.connectNetworkEvent(this.owningPlayer, sysEvents.OnSetFocusedInteractionTapOptions, (data) => {
      this.currentTapOptions = {...this.currentTapOptions, ...data.tapOptions};
      this.owningPlayer.focusedInteraction.setTapOptions(data.enabled, this.currentTapOptions);
    });

    // Customize trails when the `OnSetFocusedInteractionTrailOptions` is received
    this.connectNetworkEvent(this.owningPlayer, sysEvents.OnSetFocusedInteractionTrailOptions, (data) => {
      this.currentTrailOptions = {...this.currentTrailOptions, ...data.trailOptions};
      this.owningPlayer.focusedInteraction.setTrailOptions(data.enabled, this.currentTrailOptions);
    });
  }
}
hz.Component.register(sysFocusedInteractionManagerLocal);
