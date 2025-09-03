"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const PlayerData_Data_1 = require("PlayerData_Data");
const PlayerData_Func_1 = require("PlayerData_Func");
const PPVLeaderboard_Func_1 = require("PPVLeaderboard_Func");
const WorldVariableNames_Data_1 = require("WorldVariableNames_Data");
class PlayerData_Entity extends core_1.Component {
    constructor() {
        super(...arguments);
        this.positionUpdateFrequencyMs = 100;
    }
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, (player) => { this.playerEnterWorld(player); });
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitWorld, (player) => { this.playerExitWorld(player); });
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterAFK, (player) => { this.playerEnterAFK(player); });
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitAFK, (player) => { this.playerExitAFK(player); });
    }
    start() {
        this.async.setInterval(() => { PlayerData_Func_1.playerData_Func.updateTimeSpent(); }, 60000);
        this.async.setInterval(() => {
            PlayerData_Func_1.playerData_Func.updatePlayerPositions();
        }, this.positionUpdateFrequencyMs);
    }
    playerEnterWorld(player) {
        const playerData = PlayerData_Func_1.playerData_Func.createEmptyPlayerData(player);
        PlayerData_Data_1.playerDataMap.set(player, playerData);
        PPVLeaderboard_Func_1.ppvLeaderboard_Func.updatePPVAndLeaderboards(player);
    }
    playerExitWorld(player) {
        const playerData = PlayerData_Data_1.playerDataMap.get(player);
        if (playerData) {
            this.world.persistentStorage.setPlayerVariable(player, WorldVariableNames_Data_1.worldVariableNames.jsonPPVs.playerStats, playerData.stats);
        }
        PlayerData_Data_1.playerDataMap.delete(player);
    }
    playerEnterAFK(player) {
        const playerData = PlayerData_Data_1.playerDataMap.get(player);
        if (playerData) {
            playerData.isAFK = true;
            playerData.enteredAFKAt = Date.now();
        }
    }
    playerExitAFK(player) {
        const playerData = PlayerData_Data_1.playerDataMap.get(player);
        if (playerData) {
            playerData.isAFK = false;
            playerData.enteredAFKAt = 0;
        }
    }
}
PlayerData_Entity.propsDefinition = {};
core_1.Component.register(PlayerData_Entity);
