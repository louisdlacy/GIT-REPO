import * as hz from 'horizon/core';

/**
 * Shop Manager
 * Handles buying/selling items between player inventories and the economy system.
 */
class sysShopManager extends hz.Component<typeof sysShopManager> {
  static propsDefinition = {
    // Example future prop: shopName: { type: 'string', default: 'Default Shop' }
  };

  start() {
    console.log("sysShopManager started.");
  }

  buyItem(player: hz.Entity, item: string, cost: number) {
    console.log(`Player ${player} is buying ${item} for ${cost}`);
    // TODO: deduct currency via sysEconomyManager, add to sysInventory
  }

  sellItem(player: hz.Entity, item: string, value: number) {
    console.log(`Player ${player} is selling ${item} for ${value}`);
    // TODO: add currency via sysEconomyManager, remove from sysInventory
  }
}

hz.Component.register(sysShopManager);
