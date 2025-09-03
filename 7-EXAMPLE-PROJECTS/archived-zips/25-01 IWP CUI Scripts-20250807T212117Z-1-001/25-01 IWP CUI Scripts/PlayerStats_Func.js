"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerStats_Func = void 0;
const UtilComponent_Data_1 = require("UtilComponent_Data");
const UtilOperator_Func_1 = require("UtilOperator_Func");
const WorldVariableNames_Data_1 = require("WorldVariableNames_Data");
exports.playerStats_Func = {
    getPlayerStatsFromPPV,
};
const statsVersion = 1;
function getPlayerStatsFromPPV(player) {
    const newPlayerStats = createEmptyPlayerStats();
    if (player) {
        const oldPlayerStats = UtilComponent_Data_1.componentUtil_Data.component?.world.persistentStorage.getPlayerVariable(player, WorldVariableNames_Data_1.worldVariableNames.jsonPPVs.playerStats);
        if (oldPlayerStats) {
            if (oldPlayerStats.version >= 1) {
                newPlayerStats.premiumTokenProgress = oldPlayerStats.premiumTokenProgress;
                newPlayerStats.visits.minsInWorld = oldPlayerStats.visits.minsInWorld;
                newPlayerStats.visits.uniqueDaysVisited = oldPlayerStats.visits.uniqueDaysVisited;
                newPlayerStats.visits.visitStreak = oldPlayerStats.visits.visitStreak;
                newPlayerStats.visits.longestStreak = oldPlayerStats.visits.longestStreak;
                newPlayerStats.purchasedItems = oldPlayerStats.purchasedItems;
                newPlayerStats.purchasedColors = oldPlayerStats.purchasedColors;
                newPlayerStats.lastWornItem = oldPlayerStats.lastWornItem;
                newPlayerStats.lastWornColor = oldPlayerStats.lastWornColor;
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
    }
    return newPlayerStats;
}
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
        premiumTokenProgress: 0,
        purchasedItems: [],
        purchasedColors: [],
        lastWornItem: '',
        lastWornColor: '',
    };
}
