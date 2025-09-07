"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerStats_Func = void 0;
const PlayerData_Data_1 = require("PlayerData_Data");
const UtilComponent_Data_1 = require("UtilComponent_Data");
const UtilOperator_Func_1 = require("UtilOperator_Func");
const WorldVariableNames_Data_1 = require("WorldVariableNames_Data");
exports.playerStats_Func = {
    getPlayerStatsFromPPV,
    updatePPVAndLeaderboards,
};
const statsVersion = 1;
function getPlayerStatsFromPPV(player) {
    const newPlayerStats = createEmptyPlayerStats();
    const oldPlayerStats = UtilComponent_Data_1.componentUtil_Data.component?.world.persistentStorage.getPlayerVariable(player, WorldVariableNames_Data_1.worldVariableNames.jsonPPVs.playerStats);
    if (oldPlayerStats) {
        if (oldPlayerStats.version >= 1) {
            newPlayerStats.visits.minsInWorld = oldPlayerStats.visits.minsInWorld;
            newPlayerStats.visits.uniqueDaysVisited = oldPlayerStats.visits.uniqueDaysVisited;
            newPlayerStats.visits.visitStreak = oldPlayerStats.visits.visitStreak;
            newPlayerStats.visits.longestStreak = oldPlayerStats.visits.longestStreak;
            if (newPlayerStats.visits.mostRecentDayVisited !== oldPlayerStats.visits.mostRecentDayVisited) {
                newPlayerStats.visits.uniqueDaysVisited++;
                if (newPlayerStats.visits.mostRecentDayVisited <= oldPlayerStats.visits.mostRecentDayVisited + 2) {
                    newPlayerStats.visits.visitStreak++;
                    newPlayerStats.visits.longestStreak = Math.max(newPlayerStats.visits.visitStreak, newPlayerStats.visits.longestStreak);
                }
                else {
                    newPlayerStats.visits.visitStreak = 1;
                }
            }
        }
    }
    return newPlayerStats;
}
/**
 * Creates an empty PlayerStats with default values of 0.
 * @returns PlayerData
 */
function createEmptyPlayerStats() {
    return {
        version: statsVersion,
        visits: {
            uniqueDaysVisited: 1,
            mostRecentDayVisited: UtilOperator_Func_1.operatorUtils.getDaySinceEpoch(),
            visitStreak: 1,
            longestStreak: 1,
            minsInWorld: 0,
        },
    };
}
function updatePPVAndLeaderboards(player) {
    const playerData = PlayerData_Data_1.playerDataMap.get(player);
    if (playerData) {
        UtilComponent_Data_1.componentUtil_Data.component?.world.persistentStorage.setPlayerVariable(player, WorldVariableNames_Data_1.worldVariableNames.jsonPPVs.playerStats, playerData.stats);
        UtilComponent_Data_1.componentUtil_Data.component?.world.leaderboards.setScoreForPlayer(WorldVariableNames_Data_1.worldVariableNames.leaderboards.longestStreak, player, playerData.stats.visits.longestStreak, false);
    }
}
