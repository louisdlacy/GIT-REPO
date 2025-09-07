import { Entity, NetworkEvent } from "horizon/core";
export declare const events: {
    networked: {
        requestArrow: NetworkEvent<{
            requester: Entity;
        }>;
        yourArrowIs: NetworkEvent<{
            arrow: Entity;
        }>;
    };
    local: {};
};
