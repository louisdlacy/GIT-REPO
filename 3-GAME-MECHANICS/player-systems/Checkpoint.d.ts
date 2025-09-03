import * as hz from 'horizon/core';
export declare const CheckpointEvents: {
    PlayerVisited: hz.LocalEvent<{
        player: hz.Player;
        checkpointNum: number;
    }>;
    PlayerEntered: hz.LocalEvent<{
        player: hz.Player;
        checkpointNum: number;
    }>;
    PlayerReset: hz.LocalEvent<{
        player: hz.Player;
    }>;
};
