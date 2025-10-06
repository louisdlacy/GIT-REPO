import { Component, Player, NetworkEvent } from 'horizon/core';

/**
 * sysInventory
 * A central inventory manager for all players.
 */
class sysInventory extends Component<typeof sysInventory> {
  static propsDefinition = {};

  // Map<PlayerID, Map<ItemName, Quantity>>
  private playerInventories: Map<number, Map<string, number>> = new Map();

  override preStart() {
    // Listen for the global event indicating an item was collected.
    this.connectNetworkBroadcastEvent(new NetworkEvent<{ player: Player, itemName: string }>('OnItemCollected'), (payload) => {
      this.addItem(payload.player, payload.itemName, 1);
    });
  }

  override start() {
    console.log("sysInventory manager started.");
  }

  /**
   * Adds a specified quantity of an item to a player's inventory.
   * @param player The player receiving the item.
   * @param itemName The name of the item to add.
   * @param quantity The amount of the item to add.
   */
  public addItem(player: Player, itemName: string, quantity: number): void {
    if (!this.playerInventories.has(player.id)) {
      this.playerInventories.set(player.id, new Map<string, number>());
    }

    const inventory = this.playerInventories.get(player.id)!;
    const currentQuantity = inventory.get(itemName) || 0;
    const newQuantity = currentQuantity + quantity;
    inventory.set(itemName, newQuantity);

    console.log(`Added ${quantity} of '${itemName}' to ${player.name.get()}'s inventory. New total: ${newQuantity}`);
  }

  /**
   * Removes a specified quantity of an item from a player's inventory.
   * @param player The player whose item is being removed.
   * @param itemName The name of the item to remove.
   * @param quantity The amount of the item to remove.
   */
  public removeItem(player: Player, itemName: string, quantity: number): void {
    if (!this.playerInventories.has(player.id)) {
      console.log(`${player.name.get()} has no inventory. Cannot remove '${itemName}'.`);
      return;
    }

    const inventory = this.playerInventories.get(player.id)!;
    const currentQuantity = inventory.get(itemName) || 0;

    if (currentQuantity === 0) {
      console.log(`${player.name.get()} does not have any '${itemName}'. Cannot remove.`);
      return;
    }

    const newQuantity = Math.max(0, currentQuantity - quantity);
    inventory.set(itemName, newQuantity);

    console.log(`Removed ${quantity} of '${itemName}' from ${player.name.get()}'s inventory. New total: ${newQuantity}`);
  }

  /**
   * Returns the quantity of a specific item for a given player.
   * @param player The player to check.
   * @param itemName The item to check.
   * @returns The quantity of the item, or 0 if not found.
   */
  public getItemCount(player: Player, itemName: string): number {
    if (!this.playerInventories.has(player.id)) {
      return 0;
    }

    const inventory = this.playerInventories.get(player.id)!;
    return inventory.get(itemName) || 0;
  }
}

Component.register(sysInventory);