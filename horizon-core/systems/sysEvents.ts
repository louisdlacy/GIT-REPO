import { LocalEvent, Entity, Component, NetworkEvent, Player, Vec3, Quaternion, InteractionInfo, FocusedInteractionTapOptions, FocusedInteractionTrailOptions } from 'horizon/core';

/**
 * System Events
 *
 * Defines network and local events used throughout the application.
 * Events are grouped by functionality for easier reference.
 */
export const sysEvents = {
  // Hint HUD events
  OnRegisterHintHUDEntity: new LocalEvent<{HUDEntity: Entity, HUDComponent: Component}>("OnRegisterHintHUDEntity"),
  OnDisplayHintHUD: new NetworkEvent<{players: Player[], text: string, duration: number}>("OnDisplayHintHUD"),

  // Puzzle Manager events
  OnFinishPuzzle: new NetworkEvent("OnFinishPuzzle"),
  OnMoveObject: new LocalEvent("OnMoveObject"),

  // Camera API events
  OnSetCameraModeThirdPerson: new NetworkEvent("OnSetCameraModeThirdPerson"),
  OnSetCameraModeFirstPerson: new NetworkEvent("OnSetCameraModeFirstPerson"),
  OnSetCameraModeFixed: new NetworkEvent<{position: Vec3, rotation: Quaternion}>("OnSetCameraModeFixed"),
  OnSetCameraModeAttached: new NetworkEvent<{target: Entity | Player, positionOffset: Vec3, translationSpeed: number, rotationSpeed: number}>("OnSetCameraModeAttached"),
  OnSetCameraModeFollow: new NetworkEvent<{target: Entity | Player}>("OnSetCameraModeFollow"),
  OnSetCameraModePan: new NetworkEvent<{panSpeed: number, positionOffset?: Vec3}>("OnSetCameraModePan"),
  OnSetCameraModeOrbit: new NetworkEvent<{target: Entity | Player, distance: number, orbitSpeed: number}>("OnSetCameraModeOrbit"),
  OnSetCameraRoll: new NetworkEvent<{rollAngle: number}>("OnSetCameraRoll"),
  OnSetCameraFOV: new NetworkEvent<{newFOV: number}>("OnSetCameraFOV"),
  OnResetCameraFOV: new NetworkEvent("OnResetCameraFOV"),
  OnSetCameraPerspectiveSwitchingEnabled: new NetworkEvent<{enabled: boolean}>("OnSetCameraPerspectiveSwitching"),
  OnSetCameraCollisionEnabled: new NetworkEvent<{enabled: boolean}>("OnSetCameraCollisionEnabled"),

  // Focused Interactions events
  OnStartFocusMode: new NetworkEvent<{exampleController: Entity, cameraPosition: Vec3, cameraRotation: Quaternion}>("OnStartFocusMode"),
  OnExitFocusMode: new NetworkEvent<{player: Player}>("OnPlayerExitedExample"),
  OnPlayerExitedFocusMode: new NetworkEvent<{player: Player}>("OnPlayerExitedFocusMode"),
  OnFocusedInteractionInputStarted: new NetworkEvent<{interactionInfo: InteractionInfo}>("OnFocusedInteractionInputStarted"),
  OnFocusedInteractionInputMoved: new NetworkEvent<{interactionInfo: InteractionInfo}>("OnFocusedInteractionInputMoved"),
  OnFocusedInteractionInputEnded: new NetworkEvent<{interactionInfo: InteractionInfo}>("OnFocusedInteractionInputEnded"),
  OnEntityTapped: new NetworkEvent("OnEntityTapped"),

  // Focused Interactions - Tap and Trail Options
  OnSetFocusedInteractionTapOptions: new NetworkEvent<{enabled: boolean, tapOptions: Partial<FocusedInteractionTapOptions>}>("OnSetFocusedInteractionTapOptions"),
  OnSetFocusedInteractionTrailOptions: new NetworkEvent<{enabled: boolean, trailOptions: Partial<FocusedInteractionTrailOptions>}>("OnSetFocusedInteractionTrailOptions"),

  // Room B - Keypad events
  OnButtonPressed: new NetworkEvent<{number: number}>("OnButtonPressed"),

  // Room C - Cannon / Slingshot events
  OnCannonLeverMoved: new LocalEvent<{delta: number, isPitch: boolean}>('OnPitchMoved'),
  OnRegisterBall: new NetworkEvent<{ball: Entity}>('OnRegisterBall'),
  registerPlayerFI: new NetworkEvent<{playerFI: Entity}>('registerPlayerFI'),
  registerPlayer: new NetworkEvent<{player: Player}>('registerPlayer'),
  startFI: new LocalEvent<{player: Player}>('startFI'),
  stopFI: new LocalEvent<{player: Player}>('stopFI'),
  startFINetwork: new NetworkEvent('startFI'),
  stopFINetwork: new NetworkEvent('stopFI'),
  exitFITapped: new NetworkEvent<{playerFI: Entity}>('exitFI'),
  OnTouchStarted: new NetworkEvent<{playerFI: Entity, rayOrigin: Vec3, rayDirection: Vec3, screenPosition: Vec3}>('OnTouchStarted'),
  OnTouchMoved: new NetworkEvent<{playerFI: Entity, rayOrigin: Vec3, rayDirection: Vec3, screenPosition: Vec3}>('OnTouchMoved'),
  OnTouchEnded: new NetworkEvent<{playerFI: Entity, rayOrigin: Vec3, rayDirection: Vec3, screenPosition: Vec3}>('OnTouchEnded'),

    //Mergables
  OnReleasedItem: new NetworkEvent<{slot: Entity}>("OnReleasedItem"),
  OnInputRequestSlotInfo: new NetworkEvent<{requester: Entity, slot: Entity}>("OnInputRequestSlotInfo"),
  OnInputRequestSlotResponse: new NetworkEvent<{slot: Entity, heldItemID: number, heldItem: Entity | null}>("OnInputRequestSlotResponse"),
  OnDropRequestSlotInfo: new NetworkEvent<{requester: Entity, slot: Entity}>("OnDropRequestSlotInfo"),
  OnDropRequestSlotResponse: new NetworkEvent<{slot: Entity, heldItemID: number, heldItem: Entity | null}>("OnDropRequestSlotResponse"),
  MoveItemToSlot: new NetworkEvent<{item: Entity, itemID: number, slot: Entity}>("MoveItemToSlot"),
  ReleaseSlot: new NetworkEvent<{slotToRelease: Entity}>("ReleaseSlot"),
  SpawnItemRequest: new NetworkEvent<{requester: Entity, itemID: number}>("OnSpawnNewItem"),
  SpawnItemRequestResponse: new NetworkEvent<{accepted: boolean}>("OnSpawnNewItemResponse"),
  OnMatchingItems: new NetworkEvent<{item: Entity, itemID: number, slot: Entity, heldItem: Entity}>("OnMatchingItems"),
  
    //region Attachables
  AttachEvent: new NetworkEvent<{ player: Player }>("AttachEvent"),
  DetachEvent: new NetworkEvent("DetachEvent"),
  AssignedEvent: new NetworkEvent<{ player: Player }>("AssignEvent"),
  UnassignedEvent: new NetworkEvent<{}>("UnassignEvent"),

  //region List Event
  ListEvent: new NetworkEvent<{ list: Entity[]; listId: number }>("ListEvent"),

}
