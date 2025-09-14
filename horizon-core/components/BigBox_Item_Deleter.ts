import { BigBox_Player_Inventory } from 'BigBox_Player_Inventory';
import * as hz from 'horizon/core';

/**
 * Deletes the item currently held by the player and removes it from their inventory
 */
class BigBox_Item_Deleter extends hz.Component<typeof BigBox_Item_Deleter> {
  static propsDefinition = {
    trigger: { type: hz.PropTypes.Entity },
    playerInventoryManager: { type: hz.PropTypes.Entity },
  };

  private inventoryManager!: BigBox_Player_Inventory

  start() {
    this.inventoryManager = this.props.playerInventoryManager!.getComponents<BigBox_Player_Inventory>()[0]

    this.connectCodeBlockEvent(this.props.trigger!, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) =>{
      let equippedIndex = this.inventoryManager.getEquippedIndex(player)

      if (equippedIndex !== -1){
        this.inventoryManager.removeItem(player, equippedIndex)
      }
    })
  }
}
hz.Component.register(BigBox_Item_Deleter);