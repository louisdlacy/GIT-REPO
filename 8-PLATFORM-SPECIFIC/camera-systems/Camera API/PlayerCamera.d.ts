import * as hz from 'horizon/core';
import { CameraMode, Easing } from 'horizon/camera';
export declare const PlayerCameraEvents: {
    SetCameraMode: hz.NetworkEvent<{
        mode: CameraMode;
    }>;
    SetCameraFixedPosition: hz.NetworkEvent<{
        position: hz.Vec3;
        rotation?: hz.Quaternion;
        duration?: number;
        easing: Easing;
    }>;
    SetCameraFixedPositionWithEntity: hz.NetworkEvent<{
        entity: hz.Entity;
        duration?: number;
        easing?: Easing;
    }>;
    SetCameraAttachWithTarget: hz.NetworkEvent<{
        target: hz.Entity | hz.Player;
        positionOffset?: hz.Vec3;
        rotationOffset?: hz.Vec3 | hz.Quaternion;
    }>;
    SetCameraPan: hz.NetworkEvent<{
        positionOffset: hz.Vec3;
        translationSpeed: number;
    }>;
    SetCameraFollow: hz.NetworkEvent<{
        activationDelay: number;
        cameraTurnSpeed: number;
        continuousRotation: boolean;
        distance: number;
        horizonLevelling: boolean;
        rotationSpeed: number;
        translationSpeed: number;
        verticalOffset: number;
    }>;
    SetCameraCollisions: hz.NetworkEvent<{
        collisionsEnabled: boolean;
    }>;
    RevertPlayerCamera: hz.NetworkEvent<{}>;
    OnCameraResetPressed: hz.NetworkEvent<{
        player: hz.Player;
    }>;
};
export declare class PlayerCamera extends hz.Component<typeof PlayerCamera> {
    static propsDefinition: {};
    private player;
    private previousCameraMode;
    private cameraResetInput;
    private cameraResetHasRegisteredCallback;
    private defaultLocomotionSpeed;
    private defaultCameraCollisionsEnabled;
    start(): void;
    initCameraListeners(player: hz.Player): void;
    receiveOwnership(_serializableState: hz.SerializableState, _oldOwner: hz.Player, _newOwner: hz.Player): void;
    setCameraMode(mode: CameraMode): void;
    setCameraFixedPosition(position: hz.Vec3, rotation: hz.Quaternion | undefined, duration: number | undefined, easing: Easing | undefined): void;
    setCameraFixedPositionWithEntity(entity: hz.Entity, duration: number | undefined, easing: Easing | undefined): void;
    setCameraPan(positionOffset: hz.Vec3, translationSpeed: number): void;
    setCameraFollow(activationDelay: number, cameraTurnSpeed: number, continuousRotation: boolean, distance: number, horizonLevelling: boolean, rotationSpeed: number, translationSpeed: number, verticalOffset: number): void;
    setCameraAttachedToTarget(target: hz.Entity | hz.Player): void;
    displayCameraResetButton(on: boolean): void;
    onCameraResetButtonPressed(): void;
    revertPlayerCamera(): void;
    setPreviousCameraMode(): void;
    getPreviousCameraMode(): number;
    getCurrentCameraMode(): number;
    setCameraCollisions(collisionsEnabled: boolean): void;
}
