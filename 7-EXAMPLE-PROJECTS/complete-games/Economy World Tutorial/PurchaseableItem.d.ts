import * as hz from 'horizon/core';
export declare const PurchaseableItemEvents: {
    OnConsumeItem: hz.NetworkEvent<{
        player: hz.Player;
        itemSKU: string;
        itemAmount: number;
    }>;
    OnReceiveItem: hz.NetworkEvent<{
        player: hz.Player;
        itemSKU: string;
        itemAmount: number;
    }>;
    OnInventoryChanged: hz.NetworkEvent<{
        player: hz.Player;
    }>;
};
export declare class PurchaseableItem<T> extends hz.Component<typeof PurchaseableItem & T> {
    static propsDefinition: {
        trigger: {
            type: "Entity";
        };
        priceSKU: {
            type: "string";
        };
        priceCurrency: {
            type: "string";
        };
        priceAmount: {
            type: "number";
        };
        priceTxt: {
            type: "Entity";
        };
        itemSKU: {
            type: "string";
        };
        itemCurrency: {
            type: "string";
        };
        itemAmount: {
            type: "number";
        };
        errorTxt: {
            type: "Entity";
        };
    };
    preStart(): void;
    start(): void;
    protected onAttemptPurchase(player: hz.Player): void;
    protected onPurchaseSuccess(player: hz.Player): void;
    protected onPurchaseFail(player: hz.Player, shortfall: number): void;
    protected updateText(text: string, visible?: boolean): void;
    protected updateFailText(text: string, visible?: boolean): void;
}
