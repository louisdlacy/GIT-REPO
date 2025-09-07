import { NetworkEvent, Player } from "horizon/core";
import { Easing } from "horizon/ui";
export declare const NotificationEvent: NetworkEvent<{
    message: string;
    players: Player[];
    imageAssetId: string | null;
}>;
export declare function cycleEaseTypesAndVariation(easeTypeIndex: number, variationIndex: number): [number, number, string];
export declare const easeTypes: Easing[][];
