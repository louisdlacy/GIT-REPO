"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iwpManager_Func = void 0;
const CUI_Bindings_Data_1 = require("CUI_Bindings_Data");
const IWP_Manager_Data_1 = require("IWP_Manager_Data");
const PlayerData_Data_1 = require("PlayerData_Data");
const PPVLeaderboard_Func_1 = require("PPVLeaderboard_Func");
const UtilComponent_Data_1 = require("UtilComponent_Data");
const WorldVariableNames_Data_1 = require("WorldVariableNames_Data");
exports.iwpManager_Func = {
    increasePlayerTokenProgress,
    chargeTokens,
};
/**
 * Increases player token progress, if more than 100%, rolls over, can be used to increase multiple full tokens
 * @param player to increase
 * @param increaseAmount out of `iwpManager_Data.amountToEarnAPremiumToken` (default of 1000)
 */
function increasePlayerTokenProgress(player, increaseAmount) {
    const playerData = PlayerData_Data_1.playerDataMap.get(player);
    if (playerData && UtilComponent_Data_1.componentUtil_Data.component) {
        playerData.stats.premiumTokenProgress += increaseAmount;
        if (playerData.stats.premiumTokenProgress >= IWP_Manager_Data_1.iwpManager_Data.amountToEarnAPremiumToken) {
            const tokensToIncreaseBy = Math.floor(playerData.stats.premiumTokenProgress / IWP_Manager_Data_1.iwpManager_Data.amountToEarnAPremiumToken);
            const playerBalance = tokensToIncreaseBy + UtilComponent_Data_1.componentUtil_Data.component.world.persistentStorage.getPlayerVariable(player, WorldVariableNames_Data_1.worldVariableNames.numberPPVs.premiumTokens);
            UtilComponent_Data_1.componentUtil_Data.component.world.persistentStorage.setPlayerVariable(player, WorldVariableNames_Data_1.worldVariableNames.numberPPVs.premiumTokens, playerBalance);
            playerData.stats.premiumTokenProgress = playerData.stats.premiumTokenProgress % IWP_Manager_Data_1.iwpManager_Data.amountToEarnAPremiumToken;
            PPVLeaderboard_Func_1.ppvLeaderboard_Func.updatePPVAndLeaderboards(player);
        }
        else {
            PPVLeaderboard_Func_1.ppvLeaderboard_Func.updatePPV(player, playerData);
        }
    }
}
/**
 * Charge premium tokens to a player. Returns true if successful, false if too low of a balance.
 * @param player To Charge
 * @param cost To Charge
 * @returns `boolean` representing the success of the charge.
 */
function chargeTokens(player, cost) {
    if (UtilComponent_Data_1.componentUtil_Data.component) {
        const newPlayerBalance = UtilComponent_Data_1.componentUtil_Data.component.world.persistentStorage.getPlayerVariable(player, WorldVariableNames_Data_1.worldVariableNames.numberPPVs.premiumTokens) - cost;
        if (newPlayerBalance >= 0) {
            UtilComponent_Data_1.componentUtil_Data.component.world.persistentStorage.setPlayerVariable(player, WorldVariableNames_Data_1.worldVariableNames.numberPPVs.premiumTokens, newPlayerBalance);
            UtilComponent_Data_1.componentUtil_Data.component.world.leaderboards.setScoreForPlayer(WorldVariableNames_Data_1.worldVariableNames.leaderboards.mostPremiumTokens, player, newPlayerBalance, true);
            CUI_Bindings_Data_1.cuiBindings_Data.tokensBinding.set(newPlayerBalance, [player]);
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}
