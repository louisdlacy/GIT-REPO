import { Player } from "horizon/core";
import { playerDataMap } from "PlayerData_Data";
import { PlayerStats } from "PlayerStats_Defs";
import { componentUtil_Data } from "UtilComponent_Data";
import { operatorUtils } from "UtilOperator_Func";
import { worldVariableNames } from "WorldVariableNames_Data";


export const playerStats_Func = {
  getPlayerStatsFromPPV,
  updatePPVAndLeaderboards,
}


const statsVersion = 1;


function getPlayerStatsFromPPV(player: Player): PlayerStats {
  const newPlayerStats = createEmptyPlayerStats();

  const oldPlayerStats: PlayerStats | undefined | null = componentUtil_Data.component?.world.persistentStorage.getPlayerVariable(player, worldVariableNames.jsonPPVs.playerStats);

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
function createEmptyPlayerStats(): PlayerStats {
  return {
    version: statsVersion,
    visits: {
      uniqueDaysVisited: 1,
      mostRecentDayVisited: operatorUtils.getDaySinceEpoch(),
      visitStreak: 1,
      longestStreak: 1,
      minsInWorld: 0,
    },
  }
}


function updatePPVAndLeaderboards(player: Player) {
  const playerData = playerDataMap.get(player);

  if (playerData) {
    componentUtil_Data.component?.world.persistentStorage.setPlayerVariable(player, worldVariableNames.jsonPPVs.playerStats, playerData.stats);

    componentUtil_Data.component?.world.leaderboards.setScoreForPlayer(worldVariableNames.leaderboards.longestStreak, player, playerData.stats.visits.longestStreak, false);
  }
}
