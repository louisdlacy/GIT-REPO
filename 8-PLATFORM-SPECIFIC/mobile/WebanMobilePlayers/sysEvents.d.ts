import * as hz from 'horizon/core';
/**
 * System Events
 *
 * Defines network and local events used throughout the application.
 * Events are grouped by functionality for easier reference.
 */
export declare const sysEvents: {
    OnRegisterHintHUDEntity: hz.LocalEvent<{
        HUDEntity: hz.Entity;
        HUDComponent: hz.Component;
    }>;
    OnDisplayHintHUD: hz.NetworkEvent<{
        players: hz.Player[];
        text: string;
        duration: number;
    }>;
    OnFinishPuzzle: hz.NetworkEvent<Record<string, never>>;
    OnMoveObject: hz.LocalEvent<Record<string, never>>;
    OnSetCameraModeThirdPerson: hz.NetworkEvent<Record<string, never>>;
    OnSetCameraModeFirstPerson: hz.NetworkEvent<Record<string, never>>;
    OnSetCameraModeFixed: hz.NetworkEvent<{
        position: hz.Vec3;
        rotation: hz.Quaternion;
    }>;
    OnSetCameraModeAttached: hz.NetworkEvent<{
        target: hz.Entity | hz.Player;
        positionOffset: hz.Vec3;
        translationSpeed: number;
        rotationSpeed: number;
    }>;
    OnSetCameraModeFollow: hz.NetworkEvent<{
        target: hz.Entity | hz.Player;
    }>;
    OnSetCameraModePan: hz.NetworkEvent<{
        panSpeed: number;
        positionOffset?: hz.Vec3;
    }>;
    OnSetCameraModeOrbit: hz.NetworkEvent<{
        target: hz.Entity | hz.Player;
        distance: number;
        orbitSpeed: number;
    }>;
    OnSetCameraRoll: hz.NetworkEvent<{
        rollAngle: number;
    }>;
    OnSetCameraFOV: hz.NetworkEvent<{
        newFOV: number;
    }>;
    OnResetCameraFOV: hz.NetworkEvent<Record<string, never>>;
    OnSetCameraPerspectiveSwitchingEnabled: hz.NetworkEvent<{
        enabled: boolean;
    }>;
    OnSetCameraCollisionEnabled: hz.NetworkEvent<{
        enabled: boolean;
    }>;
    OnStartFocusMode: hz.NetworkEvent<{
        exampleController: hz.Entity;
        cameraPosition: hz.Vec3;
        cameraRotation: hz.Quaternion;
    }>;
    OnExitFocusMode: hz.NetworkEvent<{
        player: hz.Player;
    }>;
    OnPlayerExitedFocusMode: hz.NetworkEvent<{
        player: hz.Player;
    }>;
    OnFocusedInteractionInputStarted: hz.NetworkEvent<{
        interactionInfo: hz.InteractionInfo;
    }>;
    OnFocusedInteractionInputMoved: hz.NetworkEvent<{
        interactionInfo: hz.InteractionInfo;
    }>;
    OnFocusedInteractionInputEnded: hz.NetworkEvent<{
        interactionInfo: hz.InteractionInfo;
    }>;
    OnEntityTapped: hz.NetworkEvent<Record<string, never>>;
    OnSetFocusedInteractionTapOptions: hz.NetworkEvent<{
        enabled: boolean;
        tapOptions: Partial<hz.FocusedInteractionTapOptions>;
    }>;
    OnSetFocusedInteractionTrailOptions: hz.NetworkEvent<{
        enabled: boolean;
        trailOptions: Partial<hz.FocusedInteractionTrailOptions>;
    }>;
    OnButtonPressed: hz.NetworkEvent<{
        number: number;
    }>;
    OnCannonLeverMoved: hz.LocalEvent<{
        delta: number;
        isPitch: boolean;
    }>;
    OnRegisterBall: hz.NetworkEvent<{
        ball: hz.Entity;
    }>;
    registerPlayerFI: hz.NetworkEvent<{
        playerFI: hz.Entity;
    }>;
    registerPlayer: hz.NetworkEvent<{
        player: hz.Player;
    }>;
    startFI: hz.LocalEvent<{
        player: hz.Player;
    }>;
    stopFI: hz.LocalEvent<{
        player: hz.Player;
    }>;
    startFINetwork: hz.NetworkEvent<Record<string, never>>;
    stopFINetwork: hz.NetworkEvent<Record<string, never>>;
    exitFITapped: hz.NetworkEvent<{
        playerFI: hz.Entity;
    }>;
    OnTouchStarted: hz.NetworkEvent<{
        playerFI: hz.Entity;
        rayOrigin: hz.Vec3;
        rayDirection: hz.Vec3;
        screenPosition: hz.Vec3;
    }>;
    OnTouchMoved: hz.NetworkEvent<{
        playerFI: hz.Entity;
        rayOrigin: hz.Vec3;
        rayDirection: hz.Vec3;
        screenPosition: hz.Vec3;
    }>;
    OnTouchEnded: hz.NetworkEvent<{
        playerFI: hz.Entity;
        rayOrigin: hz.Vec3;
        rayDirection: hz.Vec3;
        screenPosition: hz.Vec3;
    }>;
};
