import * as hz from 'horizon/core';
export declare const CameraEvents: {
    firstPerson: hz.NetworkEvent<{}>;
    thirdPerson: hz.NetworkEvent<{}>;
    attachPerson: hz.NetworkEvent<{
        target: hz.Entity;
    }>;
    panPerson: hz.NetworkEvent<{}>;
};
