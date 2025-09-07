"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigBox_Inventory_Manager = exports.InventoryEvents = void 0;
const BigBox_ItemState_1 = require("BigBox_ItemState");
const hz = __importStar(require("horizon/core"));
class InventoryEvents {
}
exports.InventoryEvents = InventoryEvents;
InventoryEvents.onSlotSelected = new hz.NetworkEvent("sendSlotSelected");
InventoryEvents.changeSlot = new hz.NetworkEvent("recieveSlotData");
/**
 * Manages an inventory of item states for every player in the server
 */
class BigBox_Inventory_Manager extends hz.Component {
    constructor() {
        super(...arguments);
        this.itemCatalog = [];
        this.playerInventories = new Map();
    }
    start() {
        this.catalogItemInfo();
        this.connectNetworkBroadcastEvent(InventoryEvents.onSlotSelected, (payload) => this.onSlotSelected(payload.owner, payload.index, payload.selected));
    }
    /**
     * Received from the Inventory UI. Information about the slot that has been clicked.
     * @param player Id of the player that clicked
     * @param slotId Id of the slot clicked
     * @param selected Whether or not the slot was selected for the first time, or deselected
     */
    onSlotSelected(player, slotId, selected) {
        const inventory = this.playerInventories.get(player);
        if (inventory) {
            const item = inventory[slotId];
            if (item) {
                if (selected) {
                    item.equip();
                }
                else {
                    item.unequip();
                }
            }
        }
    }
    /**
     * Adds an item from an item ID to the specified player's inventory
     */
    givePlayerItem(player, itemId, equip = false) {
        let info = this.itemCatalog.find(item => item.props.id === itemId);
        if (info) {
            this.givePlayerItemFromInfo(player, info, equip);
        }
        else {
            console.error('No item with id ' + itemId);
        }
    }
    /**
     * Adds an item from an item info to the specified player's inventory
     */
    givePlayerItemFromInfo(player, info, equip = false) {
        let itemState = new BigBox_ItemState_1.BigBox_ItemState(info, player);
        let inventory = this.playerInventories.get(player);
        let indexOf = 0;
        if (inventory) {
            let firstAvailable = inventory.findIndex(item => item === null); // find the first empty index in our inventory
            if (firstAvailable === -1) {
                inventory.push(itemState);
                indexOf = inventory.length - 1;
            }
            else {
                inventory[firstAvailable] = itemState;
                indexOf = firstAvailable;
            }
            this.playerInventories.set(player, inventory);
        }
        else { // first item for this player: initialize inventory
            this.playerInventories.set(player, [itemState]);
        }
        let container = { name: info.props.name, borderColor: info.props.color, };
        this.sendNetworkBroadcastEvent(InventoryEvents.changeSlot, { index: indexOf, properties: container, selected: equip }, [player]);
        if (equip) {
            itemState.equip();
        }
        console.log('Added item ' + itemState.info.props.name + ' to player ' + player.name.get());
    }
    /**
     * Removes an item from a player's inventory at specified index
     */
    removeItem(player, index) {
        let inventory = this.playerInventories.get(player);
        let itemState = inventory[index];
        if (itemState) {
            console.log('Removing item ' + itemState.info.props.name + ' from player ' + player.name.get());
            itemState.dispose();
            inventory[index] = null;
            let changedIndices = this.sortInventory(inventory, [index]);
            this.sendInventoryIndices(player, changedIndices);
            this.playerInventories.set(player, inventory);
        }
        else {
            console.error('No item at index ' + index);
        }
    }
    /**
     * Returns an item state at specified index
     * Returns null if no item is present in the slot
     */
    getItemAtIndex(player, index) {
        let inventory = this.playerInventories.get(player);
        let itemState = inventory[index];
        return itemState;
    }
    /**
     * Returns the index of the equipped item
     * Returns -1 if no item is equipped
     */
    getEquippedIndex(player) {
        let inventory = this.playerInventories.get(player);
        let equippedIndex = inventory.findIndex(item => item?.equipped);
        return equippedIndex;
    }
    /**
     * Returns the state of the equipped item
     * Returns undefined if no item is equipped
     */
    getEquippedItem(player) {
        let equippedIndex = this.getEquippedIndex(player);
        if (equippedIndex === -1) {
            return undefined;
        }
        let inventory = this.playerInventories.get(player);
        return inventory[equippedIndex];
    }
    /**
     * Sorts the inventory by compacting items (removing null gaps)
     */
    sortInventory(inventory, changedIndices) {
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
    sendInventoryIndices(player, indices) {
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
    sendInventoryItem(player, index, item) {
        let container;
        let selected = false;
        if (item) {
            container = { name: item.info.props.name, borderColor: item.info.props.color, };
            selected = item.equipped;
        }
        this.sendNetworkBroadcastEvent(InventoryEvents.changeSlot, { index: index, properties: container, selected: selected }, [player]);
    }
    catalogItemInfo() {
        this.props.catalogRoot.children.get().forEach((child) => {
            let info = child.getComponents()[0];
            if (info) {
                this.itemCatalog.push(info);
                console.log("added item " + info.props.id);
            }
        });
    }
}
exports.BigBox_Inventory_Manager = BigBox_Inventory_Manager;
BigBox_Inventory_Manager.propsDefinition = {
    catalogRoot: { type: hz.PropTypes.Entity }, // root of the object containing all of the ItemBaseInfos
};
hz.Component.register(BigBox_Inventory_Manager);
