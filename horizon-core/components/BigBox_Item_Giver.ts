import { BigBox_Player_Inventory } from 'BigBox_Player_Inventory';
import * as hz from 'horizon/core';

/**
 * Looks up item via id and grants it to user
 */
class BigBox_Item_Giver extends hz.Component<typeof BigBox_Item_Giver> {
  static propsDefinition = {
    trigger: { type: hz.PropTypes.Entity },
    itemId: { type: hz.PropTypes.String },
    playerInventoryManager: { type: hz.PropTypes.Entity },
  };

  private inventoryManager!: BigBox_Player_Inventory

  start() {
    this.inventoryManager = this.props.playerInventoryManager!.getComponents<BigBox_Player_Inventory>()[0]

    this.connectCodeBlockEvent(this.props.trigger!, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) =>{
      this.inventoryManager.givePlayerItem(player, this.props.itemId, true)
    })
  }
}
hz.Component.register(BigBox_Item_Giver);