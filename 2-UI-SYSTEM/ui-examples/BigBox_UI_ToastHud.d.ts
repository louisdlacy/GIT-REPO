import { NetworkEvent, Player } from "horizon/core";
import { Bindable, TextStyle, UINode, ViewProps } from "horizon/ui";
export declare const BigBox_ToastEvents: {
    /**
     * Event that's broadcast on the server and the client. Send it like this:
     * this.sendNetworkBroadcastEvent(BigBox_ToastEvents.textToast, {
     *   player: owner,
     *   text: "Text message"
     * });
     */
    textToast: NetworkEvent<{
        player: Player;
        text: string;
    }>;
};
export declare class BigBox_Toast_UI_Utils {
    static outlineText(text: Bindable<string>, outlineSize: number, textStyle: TextStyle): UINode<ViewProps>;
}
