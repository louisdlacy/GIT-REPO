import { NetworkEvent } from "horizon/core";
/**
 * Events that are shared between ammo boxes, guns, and targets.
 */
export declare const Events: {
    pickupAmmo: NetworkEvent<{
        ammoType: string;
        amount: number;
    }>;
    ammoHit: NetworkEvent<{
        damage: number;
    }>;
};
