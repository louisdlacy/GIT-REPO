"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ppvLeaderboard_Func = void 0;
const CUI_Bindings_Data_1 = require("CUI_Bindings_Data");
const PlayerData_Data_1 = require("PlayerData_Data");
const UtilComponent_Data_1 = require("UtilComponent_Data");
const WorldVariableNames_Data_1 = require("WorldVariableNames_Data");
exports.ppvLeaderboard_Func = {
    updatePPVAndLeaderboards,
    updatePPV,
};
function updatePPVAndLeaderboards(player) {
    const playerData = PlayerData_Data_1.playerDataMap.get(player);
    if (playerData && UtilComponent_Data_1.componentUtil_Data.component) {
        updatePPV(player, playerData);
        UtilComponent_Data_1.componentUtil_Data.component.world.leaderboards.setScoreForPlayer(WorldVariableNames_Data_1.worldVariableNames.leaderboards.longestStreak, player, playerData.stats.visits.longestStreak, false);
        const playerTokens = UtilComponent_Data_1.componentUtil_Data.component.world.persistentStorage.getPlayerVariable(player, WorldVariableNames_Data_1.worldVariableNames.numberPPVs.premiumTokens);
        UtilComponent_Data_1.componentUtil_Data.component.world.leaderboards.setScoreForPlayer(WorldVariableNames_Data_1.worldVariableNames.leaderboards.mostPremiumTokens, player, playerTokens, true);
        CUI_Bindings_Data_1.cuiBindings_Data.tokensBinding.set(playerTokens, [player]);
    }
}
function updatePPV(player, playerData) {
    if (UtilComponent_Data_1.componentUtil_Data.component) {
        UtilComponent_Data_1.componentUtil_Data.component.world.persistentStorage.setPlayerVariable(player, WorldVariableNames_Data_1.worldVariableNames.jsonPPVs.playerStats, playerData.stats);
        CUI_Bindings_Data_1.cuiBindings_Data.playerDataBinding.set(playerData, [player]);
    }
}
