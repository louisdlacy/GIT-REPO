import { Player, NetworkEvent } from 'horizon/core';
export declare const PlayerEntered: NetworkEvent<{
    player: Player;
}>;
export declare const PlayerExited: NetworkEvent<{
    player: Player;
}>;
