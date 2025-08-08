import * as hz from 'horizon/core';
import { TextGizmo } from 'horizon/core';
import { WorldInventory } from 'horizon/core';

export const PurchaseableItemEvents = {
  OnConsumeItem: new hz.NetworkEvent<{ player: hz.Player, itemSKU: string, itemAmount: number }>('OnConsumeItem'),
  OnReceiveItem: new hz.NetworkEvent<{ player: hz.Player, itemSKU: string, itemAmount: number }>('OnReceiveItem'),
  OnInventoryChanged: new hz.NetworkEvent<{ player: hz.Player }>('OnInventoryChanged'),
}

export class PurchaseableItem<T> extends hz.Component<typeof PurchaseableItem & T> {
  static propsDefinition = {
    trigger: {type: hz.PropTypes.Entity},
    priceSKU: {type: hz.PropTypes.String},
    priceCurrency: {type: hz.PropTypes.String},
    priceAmount: {type: hz.PropTypes.Number},
    priceTxt: {type: hz.PropTypes.Entity},
    itemSKU: {type: hz.PropTypes.String},
    itemCurrency: {type: hz.PropTypes.String},
    itemAmount: {type: hz.PropTypes.Number},
    errorTxt: {type: hz.PropTypes.Entity},
  };

  preStart() {

  }

  start(): void {
    this.updateText("Purchase " + this.props.itemCurrency + ": " + this.props.priceAmount + " " + this.props.priceCurrency + "s");
  }

  protected onAttemptPurchase(player: hz.Player) {
    WorldInventory.getPlayerEntitlementQuantity(player, this.props.priceSKU).then((quantity) => {
      if (quantity >= this.props.priceAmount) {
        this.onPurchaseSuccess(player);
      } else {
        const shortfall = this.props.priceAmount - Number(quantity);
        this.onPurchaseFail(player, shortfall);
      }
    });
  }

  protected onPurchaseSuccess(player: hz.Player) {
    WorldInventory.grantItemToPlayer(player, this.props.itemSKU, this.props.itemAmount);
    this.sendNetworkBroadcastEvent(PurchaseableItemEvents.OnReceiveItem, { player: player, itemSKU: this.props.itemSKU, itemAmount: this.props.itemAmount });
    this.updateText("", false);
  }

  protected onPurchaseFail(player: hz.Player, shortfall: number) {
    this.updateFailText(("Not enough " + this.props.priceCurrency + "s: " + shortfall + " more needed"));
  }

  protected updateText(text: string, visible: boolean = true) {
    if (this.props.priceTxt !== undefined && this.props.priceTxt !== null) {
      this.props.priceTxt.as(TextGizmo).text.set(text);
      this.props.priceTxt.as(TextGizmo).visible.set(visible);
    }
  }

  protected updateFailText(text: string, visible: boolean = true) {
    console.log("Showing error text: " + this.props.errorTxt);
    if (this.props.errorTxt !== undefined && this.props.errorTxt !== null) {
      console.log("Setting error text to: " + text);
      this.props.errorTxt.as(TextGizmo).text.set(text);
      this.props.errorTxt.as(TextGizmo).visible.set(visible);
      this.async.setTimeout(() => {
        if (this.props.errorTxt !== undefined && this.props.errorTxt !== null) {
          this.props.errorTxt.as(TextGizmo).visible.set(false);
        }
      }, 3000);
    }
  }
}
hz.Component.register(PurchaseableItem);
