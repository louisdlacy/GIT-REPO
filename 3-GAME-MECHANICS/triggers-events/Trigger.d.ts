import { NetworkEvent, Player } from 'horizon/core';
export declare const PlayersToDisplay: NetworkEvent<{
    players: Player[];
}>;
export declare const CUIReady: NetworkEvent<Record<string, never>>;
