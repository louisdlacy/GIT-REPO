"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
class IWP_Manager_Entity extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnItemPurchaseComplete, (player, item, success) => { this.purchase(player, item, success); });
    }
    start() {
    }
    purchase(player, item, success) {
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
IWP_Manager_Entity.propsDefinition = {
    ppvName: { type: core_1.PropTypes.String, default: 'Yuule:Yuule' },
};
core_1.Component.register(IWP_Manager_Entity);
