import * as hz from 'horizon/core';
export declare const JumpBoostPickupEvents: {
    OnPickupJumpBoost: hz.NetworkEvent<{
        player: hz.Player;
        jumpBoostAmount: number;
        duration: number;
    }>;
    OnApplyJumpBoost: hz.NetworkEvent<{
        jumpBoostAmount: number;
        duration: number;
    }>;
};
