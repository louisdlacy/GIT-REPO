import { BigBox_ItemState } from 'BigBox_ItemState';
import * as hz from 'horizon/core';
import { BigBox_ItemBaseInfo } from 'BigBox_ItemBaseInfo';
import { BigBox_Inventory_UI, SlotContainer } from 'BigBox_Inventory_UI';

export class InventoryEvents{
  public static onSlotSelected = new hz.NetworkEvent<{owner: hz.Player, index: number, selected: boolean}>("sendSlotSelected")
  public static changeSlot = new hz.NetworkEvent<{index: number, properties?: SlotContainer, selected: boolean}>("recieveSlotData")
}

/**
 * Manages an inventory of item states for every player in the server
 */
export class BigBox_Inventory_Manager extends hz.Component<typeof BigBox_Inventory_Manager> {
  static propsDefinition = {
    catalogRoot: { type: hz.PropTypes.Entity }, // root of the object containing all of the ItemBaseInfos
  };

  private itemCatalog: BigBox_ItemBaseInfo[] = []

  private playerInventories = new Map<hz.Player,(BigBox_ItemState | null)[]>()

  start() {
    this.catalogItemInfo()
    this.connectNetworkBroadcastEvent(InventoryEvents.onSlotSelected, (payload) => this.onSlotSelected(payload.owner, payload.index, payload.selected))
  }

  /**
   * Received from the Inventory UI. Information about the slot that has been clicked.
   * @param player Id of the player that clicked
   * @param slotId Id of the slot clicked
   * @param selected Whether or not the slot was selected for the first time, or deselected
   */
  public onSlotSelected(player: hz.Player, slotId: number, selected: boolean){
    const inventory = this.playerInventories.get(player)
    if (inventory){
      const item = inventory[slotId]

      if (item){
        if (selected){
          item.equip()
        }
        else{
          item.unequip()
        }
      }
    }
  }

  /**
   * Adds an item from an item ID to the specified player's inventory
   */
  public givePlayerItem(player: hz.Player, itemId: string, equip: boolean = false){
    let info = this.itemCatalog.find(item => item.props.id === itemId)
    if (info){
      this.givePlayerItemFromInfo(player, info, equip)
    }
    else{
      console.error('No item with id ' + itemId)
    }
  }

  /**
   * Adds an item from an item info to the specified player's inventory
   */
  public givePlayerItemFromInfo(player: hz.Player, info: BigBox_ItemBaseInfo, equip: boolean = false){
      let itemState = new BigBox_ItemState(info, player)
      let inventory = this.playerInventories.get(player)
      let indexOf = 0

      if (inventory){
        let firstAvailable = inventory.findIndex(item => item === null) // find the first empty index in our inventory
        if (firstAvailable === -1){
          inventory.push(itemState)
          indexOf = inventory.length - 1
        }
        else{
          inventory[firstAvailable] = itemState
          indexOf = firstAvailable
        }

        this.playerInventories.set(player, inventory)
      }
      else{ // first item for this player: initialize inventory
        this.playerInventories.set(player, [itemState])
      }

      let container: SlotContainer = { name: info.props.name, borderColor: info.props.color, }
      this.sendNetworkBroadcastEvent(InventoryEvents.changeSlot, {index: indexOf, properties: container, selected: equip}, [player]);
      if (equip){
        itemState.equip()
      }

      console.log('Added item ' + itemState.info.props.name + ' to player ' + player.name.get())
  }

  /**
   * Removes an item from a player's inventory at specified index
   */
  public removeItem(player: hz.Player, index: number){
    let inventory = this.playerInventories.get(player)!
    let itemState = inventory[index]

    if (itemState){
      console.log('Removing item ' + itemState.info.props.name + ' from player ' + player.name.get())
      itemState.dispose()
      inventory[index] = null

      let changedIndices = this.sortInventory(inventory, [index])
      this.sendInventoryIndices(player, changedIndices)
      this.playerInventories.set(player, inventory)
    }
    else{
      console.error('No item at index ' + index)
    }
  }

  /**
   * Returns an item state at specified index
   * Returns null if no item is present in the slot
   */
  public getItemAtIndex(player: hz.Player, index: number) : BigBox_ItemState | null{
    let inventory = this.playerInventories.get(player)!
    let itemState = inventory[index]

    return itemState
  }

  /**
   * Returns the index of the equipped item
   * Returns -1 if no item is equipped
   */
  public getEquippedIndex(player: hz.Player) : number{
    let inventory = this.playerInventories.get(player)!
    let equippedIndex = inventory.findIndex(item => item?.equipped)

    return equippedIndex
  }

  /**
   * Returns the state of the equipped item
   * Returns undefined if no item is equipped
   */
  public getEquippedItem(player: hz.Player) : BigBox_ItemState | undefined{
    let equippedIndex = this.getEquippedIndex(player)

    if (equippedIndex === -1){
      return undefined
    }

    let inventory = this.playerInventories.get(player)!
    return inventory[equippedIndex]!
  }

  /**
   * Sorts the inventory by compacting items (removing null gaps)
   */
  private sortInventory(inventory: (BigBox_ItemState | null)[], changedIndices: number[]) {
    for (let i = 0; i < inventory.length; i++) {
      let nextItemIndex = -1;
      for (let j = i; j < inventory.length; j++) {
        const item = inventory[j];
        if (item == undefined) {
          continue;
        }
        if (nextItemIndex < 0) {
          nextItemIndex = j;
          continue;
        }
      }
      if (nextItemIndex < 0 || i === nextItemIndex) {
        continue;
      }
      const swap = inventory[i];
      inventory[i] = inventory[nextItemIndex];
      inventory[nextItemIndex] = swap;
      if (!changedIndices.includes(i)) {
        changedIndices.push(i);
      }
      if (!changedIndices.includes(nextItemIndex)) {
        changedIndices.push(nextItemIndex);
      }
    }

    return changedIndices;
  }

  /**
   * Sends inventory updates for specific indices to the UI
   */
  private sendInventoryIndices(player: hz.Player, indices: number[]) {
    let inventory = this.playerInventories.get(player);
    if (inventory) {
      for (let i = 0; i < indices.length; i++) {
        const index = indices[i];
        const item = inventory[index];
        this.sendInventoryItem(player, index, item);
      }
    }
  }

  /**
   * Sends a single inventory item update to the UI
   */
  private sendInventoryItem(player: hz.Player, index: number, item: BigBox_ItemState | null) {
    let container: SlotContainer | undefined;
    let selected = false;

    if (item) {
      container = { name: item.info.props.name, borderColor: item.info.props.color, };
      selected = item.equipped;
    }

    this.sendNetworkBroadcastEvent(InventoryEvents.changeSlot, {index: index, properties: container, selected: selected}, [player]);
  }

  catalogItemInfo(){
    this.props.catalogRoot!.children.get().forEach((child) =>{
      let info = child.getComponents<BigBox_ItemBaseInfo>()[0]
      if (info){
        this.itemCatalog.push(info)
        console.log("added item " + info.props.id)
      }
    })
  }
}
hz.Component.register(BigBox_Inventory_Manager);
