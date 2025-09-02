import { CodeBlockEvents, Component, Player, PropTypes } from "horizon/core";


class IWP_Manager_Entity extends Component<typeof IWP_Manager_Entity> {
  static propsDefinition = {
    ppvName: { type: PropTypes.String, default: 'Yuule:Yuule' },
  };

  preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnItemPurchaseComplete, (player, item, success) => { this.purchase(player, item, success); });
  }

  start() {

  }

  purchase(player: Player, item: string, success: boolean) {
    switch (item) {
      case '1_yuule_8310a776':
        if (success) {
          console.log('Purchase succeeded for item: ' + item);

          const playerBalance = 1 + this.world.persistentStorage.getPlayerVariable(player, this.props.ppvName);
          this.world.persistentStorage.setPlayerVariable(player, this.props.ppvName, playerBalance);
        }
        else {
          console.log('Purchase failed for item: ' + item);
        }
        break;
      case '5_yuule_5bc5229d':
        if (success) {
          console.log('Purchase succeeded for item: ' + item);
          
          const playerBalance = 5 + this.world.persistentStorage.getPlayerVariable(player, this.props.ppvName);
          this.world.persistentStorage.setPlayerVariable(player, this.props.ppvName, playerBalance);
        }
        else {
          console.log('Purchase failed for item: ' + item);
        }
        break;
      default:
        console.log('Case for item not found: ' + item);
        break;
    }
  }
}
Component.register(IWP_Manager_Entity);