import { Entity, NetworkEvent, Player } from "horizon/core";
import { Binding, UINode } from "horizon/ui";
export declare const PopupRequest: NetworkEvent<{
    requester: Entity;
    player: Player;
    title: string;
    message: string;
}>;
export declare const PopupResponse: NetworkEvent<{
    player: Player;
}>;
export declare const button: (bndHeaderText: Binding<string>, bndFontSize: Binding<number>, bndBtnScale: Binding<number>) => UINode<import("horizon/ui").TextProps>[];
