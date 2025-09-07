import * as hz from 'horizon/core';
import { AttachCameraOptions, CameraTarget, CameraTransitionOptions, FixedCameraOptions, FollowCameraOptions, OrbitCameraOptions, PanCameraOptions } from 'horizon/camera';
export declare const PMCameraEvents: {
    setFirstPerson: hz.NetworkEvent<{
        options?: CameraTransitionOptions;
    }>;
    setThirdPerson: hz.NetworkEvent<{
        options?: CameraTransitionOptions;
    }>;
    setAttached: hz.NetworkEvent<{
        target: CameraTarget;
        options?: AttachCameraOptions & CameraTransitionOptions;
    }>;
    setFixed: hz.NetworkEvent<{
        options?: FixedCameraOptions & CameraTransitionOptions;
    }>;
    setOrbit: hz.NetworkEvent<{
        options?: OrbitCameraOptions & CameraTransitionOptions;
    }>;
    setPan: hz.NetworkEvent<{
        options?: PanCameraOptions & CameraTransitionOptions;
    }>;
    setFollow: hz.NetworkEvent<{
        options?: FollowCameraOptions & CameraTransitionOptions;
    }>;
};
