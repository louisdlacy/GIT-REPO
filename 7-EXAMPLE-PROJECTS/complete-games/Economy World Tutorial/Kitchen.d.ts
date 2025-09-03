import * as hz from 'horizon/core';
export declare const KitchenEvents: {
    SetOwner: hz.LocalEvent<{
        owner: hz.Player | undefined;
    }>;
    SetOvenOwner: hz.LocalEvent<{
        owner: hz.Player | undefined;
        purchased: boolean;
    }>;
};
