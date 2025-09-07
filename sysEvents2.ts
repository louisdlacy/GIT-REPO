import { LocalEvent, Entity, Component, NetworkEvent, Player, Vec3, Quaternion, InteractionInfo, FocusedInteractionTapOptions, FocusedInteractionTrailOptions, Asset } from 'horizon/core';
// import { PlayerData, PlayerDataType } from 'SaveManager';
// import { VFXLabel } from 'VFXManager';

export const sysEvents = {
  //region Hint HUD events
  OnRegisterHintHUDEntity: new LocalEvent<{HUDEntity: Entity, HUDComponent: Component}>("OnRegisterHintHUDEntity"),
  OnDisplayHintHUD: new NetworkEvent<{players: Player[], text: string, duration: number}>("OnDisplayHintHUD"),

  //region Puzzle Manager events
  OnFinishPuzzle: new NetworkEvent("OnFinishPuzzle"),
  OnMoveObject: new LocalEvent("OnMoveObject"),

  //region Camera API events
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

  
  //region Focused Interactions events
  OnStartFocusMode: new NetworkEvent<{exampleController: Entity, cameraPosition: Vec3, cameraRotation: Quaternion}>("OnStartFocusMode"),
  OnExitFocusMode: new NetworkEvent<{player: Player}>("OnPlayerExitedExample"),
  OnPlayerExitedFocusMode: new NetworkEvent<{player: Player}>("OnPlayerExitedFocusMode"),
  OnFocusedInteractionInputStarted: new NetworkEvent<{interactionInfo: InteractionInfo}>("OnFocusedInteractionInputStarted"),
  OnFocusedInteractionInputMoved: new NetworkEvent<{interactionInfo: InteractionInfo}>("OnFocusedInteractionInputMoved"),
  OnFocusedInteractionInputEnded: new NetworkEvent<{interactionInfo: InteractionInfo}>("OnFocusedInteractionInputEnded"),
  OnEntityTapped: new NetworkEvent("OnEntityTapped"),
  //region Focused Interactions events - Customize Tap and Trail Options
  OnSetFocusedInteractionTapOptions: new NetworkEvent<{enabled: boolean, tapOptions: Partial<FocusedInteractionTapOptions>}>("OnSetFocusedInteractionTapOptions"),
  OnSetFocusedInteractionTrailOptions: new NetworkEvent<{enabled: boolean, trailOptions: Partial<FocusedInteractionTrailOptions>}>("OnSetFocusedInteractionTrailOptions"),

  //region Room B - Keypad events
  OnButtonPressed: new NetworkEvent<{number: number}>("OnButtonPressed"),

  //region Room C - Cannon / Slingshot events
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

  //region Mergables
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
  
  OnPayoutInterval: new NetworkEvent<{heldItemIdArray: number[]}>("OnPayoutInterval"),
  LoadingProgress: new NetworkEvent<{progress: number}>("LoadingProgress"),
  OnLoadingComplete: new NetworkEvent("OnLoadingComplete"),
  OnTextureAssetRequest: new NetworkEvent<{requester: Entity}>("OnTextureAssetRequest"),
  OnTextureAssetResponse: new NetworkEvent<{textureAssetIDArray: string[]}>("OnTextureAssetResponse"),
  OnNewTenantUnlocked: new NetworkEvent<{tenantID: number}>("OnNewTenantUnlocked"),
  OnNewLevelUnlocked: new NetworkEvent<{level: number, gemReward: number}>("OnNewLevelUnlocked"),
  
  StartParty: new NetworkEvent<{}>("StartParty"),
  StopParty: new NetworkEvent<{}>("StopParty"),
  PartyStateUpdated: new NetworkEvent<{partyActive: boolean}>("PartyStateUpdated"),
  StartFire: new NetworkEvent<{}>("StartFire"),
  StopFire: new NetworkEvent<{}>("StopFire"),
  FireStateUpdated: new NetworkEvent<{fireActive: boolean}>("FireStateUpdated"),
  OnDroppedInPartySlot: new NetworkEvent<{slot: Entity, itemID: number, heldItem: Entity | null}>("OnDroppedInPartySlot"),
  
  // //region Player data
  // OnPlayerStatsUpdate: new NetworkEvent<{playerDataType: PlayerDataType, value: number}>("OnPlayerStatsUpdate"),
  // SavePlayerData: new NetworkEvent<{playerData: PlayerData}>("SavePlayerData"),
  // ResetPlayerData: new NetworkEvent("ResetPlayerData"),
  // OnPlayerDataLoaded: new NetworkEvent<{playerData: PlayerData}>("SharePlayerData"),
  // PlayerDataRequest: new NetworkEvent<{requester: Entity}>("PlayerDataRequest"),
  // PlayerDataResponse: new NetworkEvent<{playerData: PlayerData}>("PlayerDataResponse"),
  // //region UI Events
  // ShowHideUI: new NetworkEvent<{show: boolean}>("ShowHideUI"),
  // UIActiveThereforeStopInteraction: new NetworkEvent<{block: boolean}>("UIActiveThereforeStopInteraction"),

  // //region Audio Events
  // PlayAudioAtPosition: new NetworkEvent<{audioLabel: AudioLabel, audibleFor: Player[], position?: Vec3}>("PlayAudioAtPosition"),
  // StopAudio: new NetworkEvent<{audioLabel: AudioLabel}>("StopAudio"),

  // //region VFX Events
  // PlayVFXAtPosition: new NetworkEvent<{vfxLabel: VFXLabel, visibleFor: Player[], position?: Vec3, rotation?: Quaternion}>("PlayVFXAtPosition"),
  // StopVFX: new NetworkEvent<{vfxLabel: VFXLabel}>("StopVFX"),

  //region Confirmation request events
  ConfirmPanelRequest: new NetworkEvent<{requester: Entity, confirmationMessage: string}>("ConfirmPanelRequest"),
  ConfirmationPanelResponse: new NetworkEvent<{accepted: boolean}>("ConfirmationPanelResponse"),

  //region Shop 
  AutoMergeAllRequest: new NetworkEvent<{requester: Entity}>("AutoMergeAllRequest"),

  //region Attachables
  AttachEvent: new NetworkEvent<{player: Player}>("AttachEvent"),
  DetachEvent: new NetworkEvent("DetachEvent"),

  //region List Event
  ListEvent: new NetworkEvent<{list: Entity[]; listId: number}>("ListEvent"),

  //region New Owner Event
  NewOwnerEvent: new NetworkEvent<{ newOwner: Player }>("NewOwnerEvent"),

 SubscriptionRequest: new NetworkEvent<{
  requester: Entity;
  filterType?: string[]; // e.g. ["human", "mobile"]
}>("SubscriptionRequest"),

  PlayerJoinedWorld: new NetworkEvent<{ player: Player }>("PlayerJoinedWorld"),
  PlayerLeftWorld: new NetworkEvent<{ player: Player }>("PlayerLeftWorld"),


    //region UI Events
  simpleButtonEvent: new NetworkEvent<{ }>("simpleButtonEvent"),

  damageEvent: new NetworkEvent<{ damage: number, source: Entity }>("damageEvent"),
}