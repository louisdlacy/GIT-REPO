import { BigBox_ItemState } from 'BigBox_ItemState';
import * as hz from 'horizon/core';
import { BigBox_ItemBaseInfo } from 'BigBox_ItemBaseInfo';
import { SlotContainer } from 'BigBox_Inventory_UI';
export declare class InventoryEvents {
    static onSlotSelected: hz.NetworkEvent<{
        owner: hz.Player;
        index: number;
        selected: boolean;
    }>;
    static changeSlot: hz.NetworkEvent<{
        index: number;
        properties?: SlotContainer;
        selected: boolean;
    }>;
}
/**
 * Manages an inventory of item states for every player in the server
 */
export declare class BigBox_Inventory_Manager extends hz.Component<typeof BigBox_Inventory_Manager> {
    static propsDefinition: {
        catalogRoot: {
            type: "Entity";
        };
    };
    private itemCatalog;
    private playerInventories;
    start(): void;
    /**
     * Received from the Inventory UI. Information about the slot that has been clicked.
     * @param player Id of the player that clicked
     * @param slotId Id of the slot clicked
     * @param selected Whether or not the slot was selected for the first time, or deselected
     */
    onSlotSelected(player: hz.Player, slotId: number, selected: boolean): void;
    /**
     * Adds an item from an item ID to the specified player's inventory
     */
    givePlayerItem(player: hz.Player, itemId: string, equip?: boolean): void;
    /**
     * Adds an item from an item info to the specified player's inventory
     */
    givePlayerItemFromInfo(player: hz.Player, info: BigBox_ItemBaseInfo, equip?: boolean): void;
    /**
     * Removes an item from a player's inventory at specified index
     */
    removeItem(player: hz.Player, index: number): void;
    /**
     * Returns an item state at specified index
     * Returns null if no item is present in the slot
     */
    getItemAtIndex(player: hz.Player, index: number): BigBox_ItemState | null;
    /**
     * Returns the index of the equipped item
     * Returns -1 if no item is equipped
     */
    getEquippedIndex(player: hz.Player): number;
    /**
     * Returns the state of the equipped item
     * Returns undefined if no item is equipped
     */
    getEquippedItem(player: hz.Player): BigBox_ItemState | undefined;
    /**
     * Sorts the inventory by compacting items (removing null gaps)
     */
    private sortInventory;
    /**
     * Sends inventory updates for specific indices to the UI
     */
    private sendInventoryIndices;
    /**
     * Sends a single inventory item update to the UI
     */
    private sendInventoryItem;
    catalogItemInfo(): void;
}
