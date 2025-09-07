"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CUI_Bindings_Data_1 = require("CUI_Bindings_Data");
const core_1 = require("horizon/core");
const IWP_Manager_Data_1 = require("IWP_Manager_Data");
const IWP_Manager_Func_1 = require("IWP_Manager_Func");
const WorldVariableNames_Data_1 = require("WorldVariableNames_Data");
class IWP_Manager_Entity extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnItemPurchaseComplete, (player, item, success) => { this.purchase(player, item, success); });
    }
    start() {
    }
    purchase(player, item, success) {
        switch (item) {
            case '1_token_83742c02':
                this.playerPurchaseEffects(player, item, success, 1);
                break;
            case '7_tokens_9411fcdd':
                this.playerPurchaseEffects(player, item, success, 7);
                break;
            case '17_tokens_4e8c8fce':
                this.playerPurchaseEffects(player, item, success, 17);
                break;
            case '50_tokens_e02f20d3':
                this.playerPurchaseEffects(player, item, success, 50);
                break;
            case '40%_token_progress_5cce8274':
                if (success) {
                    IWP_Manager_Func_1.iwpManager_Func.increasePlayerTokenProgress(player, Math.ceil(IWP_Manager_Data_1.iwpManager_Data.amountToEarnAPremiumToken * 0.4));
                }
                break;
            default:
                console.log('Case for item not found: ' + item);
                break;
        }
    }
    playerPurchaseEffects(player, item, success, amount) {
        if (success) {
            const playerBalance = amount + this.world.persistentStorage.getPlayerVariable(player, WorldVariableNames_Data_1.worldVariableNames.numberPPVs.premiumTokens);
            this.world.persistentStorage.setPlayerVariable(player, WorldVariableNames_Data_1.worldVariableNames.numberPPVs.premiumTokens, playerBalance);
            CUI_Bindings_Data_1.cuiBindings_Data.tokensBinding.set(playerBalance, [player]);
        }
    }
}
IWP_Manager_Entity.propsDefinition = {};
core_1.Component.register(IWP_Manager_Entity);
