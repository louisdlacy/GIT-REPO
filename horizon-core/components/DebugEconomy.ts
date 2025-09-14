import * as hz from 'horizon/core';
import { WorldInventory } from 'horizon/core';
import { PurchaseableItemEvents } from 'PurchaseableItem';

export const DebugEconomyEvents = {
  GrantItem: new hz.NetworkEvent<{ player: hz.Player, itemSKU: string, quantity: number }>("GrantItem"),
  ConsumeItem: new hz.NetworkEvent<{ player: hz.Player, itemSKU: string, quantity: number }>("ConsumeItem"),
  ResetItem: new hz.NetworkEvent<{ player: hz.Player, itemSKU: string }>("ResetItem"),
}

class DebugEconomy extends hz.Component<typeof DebugEconomy> {
  static propsDefinition = {
    active: {type: hz.PropTypes.Boolean, default: false},
  };

  preStart(): void {
    this.connectNetworkBroadcastEvent(DebugEconomyEvents.GrantItem, ({player, itemSKU, quantity}) => {
      console.log("Granting to " + player + ": " + quantity + "x " + itemSKU);
      WorldInventory.grantItemToPlayer(player, itemSKU, quantity);
      this.sendUpdateUIEvent(player);
    });

    this.connectNetworkBroadcastEvent(DebugEconomyEvents.ConsumeItem, ({player, itemSKU, quantity}) => {
      console.log("Consuming from " + player + ": " + quantity + "x " + itemSKU);
      WorldInventory.consumeItemForPlayer(player, itemSKU, quantity);
      this.sendUpdateUIEvent(player);
    });

    this.connectNetworkBroadcastEvent(DebugEconomyEvents.ResetItem, ({player, itemSKU}) => {
      console.log("Resetting " + player + "'s " + itemSKU);
      WorldInventory.getPlayerEntitlementQuantity(player, itemSKU).then((count) => {
        console.log("Player has " + count + "x " + itemSKU + ", consuming all");
        WorldInventory.consumeItemForPlayer(player, itemSKU, count);
        this.sendUpdateUIEvent(player);
      });
    });
  }

  start() {

  }

  sendUpdateUIEvent(player: hz.Player){
    this.async.setTimeout(() => {
      this.sendNetworkBroadcastEvent(PurchaseableItemEvents.OnInventoryChanged, ({player}));
    }, 3000);
  }

}
hz.Component.register(DebugEconomy);
