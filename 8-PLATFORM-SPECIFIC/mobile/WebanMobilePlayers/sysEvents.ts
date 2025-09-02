import * as hz from 'horizon/core';

/**
 * System Events
 *
 * Defines network and local events used throughout the application.
 * Events are grouped by functionality for easier reference.
 */
export const sysEvents = {
  // Hint HUD events
  OnRegisterHintHUDEntity: new hz.LocalEvent<{HUDEntity: hz.Entity, HUDComponent: hz.Component}>("OnRegisterHintHUDEntity"),
  OnDisplayHintHUD: new hz.NetworkEvent<{players: hz.Player[], text: string, duration: number}>("OnDisplayHintHUD"),

  // Puzzle Manager events
  OnFinishPuzzle: new hz.NetworkEvent("OnFinishPuzzle"),
  OnMoveObject: new hz.LocalEvent("OnMoveObject"),

  // Camera API events
  OnSetCameraModeThirdPerson: new hz.NetworkEvent("OnSetCameraModeThirdPerson"),
  OnSetCameraModeFirstPerson: new hz.NetworkEvent("OnSetCameraModeFirstPerson"),
  OnSetCameraModeFixed: new hz.NetworkEvent<{position: hz.Vec3, rotation: hz.Quaternion}>("OnSetCameraModeFixed"),
  OnSetCameraModeAttached: new hz.NetworkEvent<{target: hz.Entity | hz.Player, positionOffset: hz.Vec3, translationSpeed: number, rotationSpeed: number}>("OnSetCameraModeAttached"),
  OnSetCameraModeFollow: new hz.NetworkEvent<{target: hz.Entity | hz.Player}>("OnSetCameraModeFollow"),
  OnSetCameraModePan: new hz.NetworkEvent<{panSpeed: number, positionOffset?: hz.Vec3}>("OnSetCameraModePan"),
  OnSetCameraModeOrbit: new hz.NetworkEvent<{target: hz.Entity | hz.Player, distance: number, orbitSpeed: number}>("OnSetCameraModeOrbit"),
  OnSetCameraRoll: new hz.NetworkEvent<{rollAngle: number}>("OnSetCameraRoll"),
  OnSetCameraFOV: new hz.NetworkEvent<{newFOV: number}>("OnSetCameraFOV"),
  OnResetCameraFOV: new hz.NetworkEvent("OnResetCameraFOV"),
  OnSetCameraPerspectiveSwitchingEnabled: new hz.NetworkEvent<{enabled: boolean}>("OnSetCameraPerspectiveSwitching"),
  OnSetCameraCollisionEnabled: new hz.NetworkEvent<{enabled: boolean}>("OnSetCameraCollisionEnabled"),

  // Focused Interactions events
  OnStartFocusMode: new hz.NetworkEvent<{exampleController: hz.Entity, cameraPosition: hz.Vec3, cameraRotation: hz.Quaternion}>("OnStartFocusMode"),
  OnExitFocusMode: new hz.NetworkEvent<{player: hz.Player}>("OnPlayerExitedExample"),
  OnPlayerExitedFocusMode: new hz.NetworkEvent<{player: hz.Player}>("OnPlayerExitedFocusMode"),
  OnFocusedInteractionInputStarted: new hz.NetworkEvent<{interactionInfo: hz.InteractionInfo}>("OnFocusedInteractionInputStarted"),
  OnFocusedInteractionInputMoved: new hz.NetworkEvent<{interactionInfo: hz.InteractionInfo}>("OnFocusedInteractionInputMoved"),
  OnFocusedInteractionInputEnded: new hz.NetworkEvent<{interactionInfo: hz.InteractionInfo}>("OnFocusedInteractionInputEnded"),
  OnEntityTapped: new hz.NetworkEvent("OnEntityTapped"),

  // Focused Interactions - Tap and Trail Options
  OnSetFocusedInteractionTapOptions: new hz.NetworkEvent<{enabled: boolean, tapOptions: Partial<hz.FocusedInteractionTapOptions>}>("OnSetFocusedInteractionTapOptions"),
  OnSetFocusedInteractionTrailOptions: new hz.NetworkEvent<{enabled: boolean, trailOptions: Partial<hz.FocusedInteractionTrailOptions>}>("OnSetFocusedInteractionTrailOptions"),

  // Room B - Keypad events
  OnButtonPressed: new hz.NetworkEvent<{number: number}>("OnButtonPressed"),

  // Room C - Cannon / Slingshot events
  OnCannonLeverMoved: new hz.LocalEvent<{delta: number, isPitch: boolean}>('OnPitchMoved'),
  OnRegisterBall: new hz.NetworkEvent<{ball: hz.Entity}>('OnRegisterBall'),
  registerPlayerFI: new hz.NetworkEvent<{playerFI: hz.Entity}>('registerPlayerFI'),
  registerPlayer: new hz.NetworkEvent<{player: hz.Player}>('registerPlayer'),
  startFI: new hz.LocalEvent<{player: hz.Player}>('startFI'),
  stopFI: new hz.LocalEvent<{player: hz.Player}>('stopFI'),
  startFINetwork: new hz.NetworkEvent('startFI'),
  stopFINetwork: new hz.NetworkEvent('stopFI'),
  exitFITapped: new hz.NetworkEvent<{playerFI: hz.Entity}>('exitFI'),
  OnTouchStarted: new hz.NetworkEvent<{playerFI: hz.Entity, rayOrigin: hz.Vec3, rayDirection: hz.Vec3, screenPosition: hz.Vec3}>('OnTouchStarted'),
  OnTouchMoved: new hz.NetworkEvent<{playerFI: hz.Entity, rayOrigin: hz.Vec3, rayDirection: hz.Vec3, screenPosition: hz.Vec3}>('OnTouchMoved'),
  OnTouchEnded: new hz.NetworkEvent<{playerFI: hz.Entity, rayOrigin: hz.Vec3, rayDirection: hz.Vec3, screenPosition: hz.Vec3}>('OnTouchEnded'),
}
