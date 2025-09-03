import * as hz from 'horizon/core';
export declare const SpeedBoostPickupEvents: {
    OnPickupSpeedBoost: hz.NetworkEvent<{
        player: hz.Player;
        speedBoostAmount: number;
        duration: number;
    }>;
};
