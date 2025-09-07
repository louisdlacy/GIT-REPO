import { Component, NetworkEvent, Player } from 'horizon/core';
import { Bindable, TextStyle } from 'horizon/ui';
/** README
 * Turn on horizon/ui API by going into the Scripts menu -> Settings (gear icon) -> API -> horizon/ui
 *
 * In order to get persistent storage, add "playerData" to Variable Group
 * and then add "exp" as a variable under it.
 *
 * Copy this line of code to your script to add exp to the player
 * (replace currentPlayer with the player that wants to gain exp and xpGained with the amount that the player should gain):
 * this.sendNetworkBroadcastEvent(ExpEvents.expAddToPlayer, { player: currentPlayer, exp: xpGained });
*/
export declare const EXP_PERSISTENT_VAR = "playerData:exp";
export declare const BigBox_ExpEvents: {
    expAddToPlayer: NetworkEvent<{
        player: Player;
        exp: number;
    }>;
    expUpdatedForPlayer: NetworkEvent<{
        player: Player;
        currentLevel: number;
        percentExpToNextLevel: number;
        gainedExp: number;
    }>;
    requestInitializeExpForPlayer: NetworkEvent<{
        player: Player;
    }>;
};
export declare class BigBox_Exp_UI_Utils {
    static outlineText(text: Bindable<string>, outlineSize: number, textStyle: TextStyle): import("horizon/ui").UINode<import("horizon/ui").ViewProps>;
}
export declare class BigBox_ExpManager extends Component<typeof BigBox_ExpManager> {
    static propsDefinition: {};
    static instance: BigBox_ExpManager;
    preStart(): void;
    start(): void;
    private OnExpAddToPlayer;
    GetPlayerExp(player: Player): number;
}
