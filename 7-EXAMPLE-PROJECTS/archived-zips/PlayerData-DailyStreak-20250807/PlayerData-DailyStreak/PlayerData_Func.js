"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerData_Func = void 0;
const core_1 = require("horizon/core");
const PlayerData_Data_1 = require("PlayerData_Data");
const PlayerStats_Func_1 = require("PlayerStats_Func");
exports.playerData_Func = {
    createEmptyPlayerData,
    updateTimeSpent,
    updatePlayerPositions,
};
function createEmptyPlayerData(player) {
    return {
        name: player.name.get(),
        isXS: player.deviceType.get() !== core_1.PlayerDeviceType.VR,
        isAFK: false,
        enteredAFKAt: 0,
        position: player.position.get(),
        stats: PlayerStats_Func_1.playerStats_Func.getPlayerStatsFromPPV(player),
    };
}
function updateTimeSpent() {
    PlayerData_Data_1.playerDataMap.forEach((playerData) => {
        playerData.stats.visits.minsInWorld++;
    });
}
function updatePlayerPositions() {
    PlayerData_Data_1.playerDataMap.forEach((playerData, player) => {
        playerData.position = player.position.get();
    });
}
