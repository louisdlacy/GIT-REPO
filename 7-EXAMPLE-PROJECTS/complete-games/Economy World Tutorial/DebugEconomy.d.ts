import * as hz from 'horizon/core';
export declare const DebugEconomyEvents: {
    GrantItem: hz.NetworkEvent<{
        player: hz.Player;
        itemSKU: string;
        quantity: number;
    }>;
    ConsumeItem: hz.NetworkEvent<{
        player: hz.Player;
        itemSKU: string;
        quantity: number;
    }>;
    ResetItem: hz.NetworkEvent<{
        player: hz.Player;
        itemSKU: string;
    }>;
};
