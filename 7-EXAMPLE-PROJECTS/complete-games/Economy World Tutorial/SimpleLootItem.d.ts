import * as hz from 'horizon/core';
export declare const SimpleLootItemEvents: {
    OnPickupLoot: hz.NetworkEvent<{
        player: hz.Player;
        sku: string;
        count: number;
    }>;
};
