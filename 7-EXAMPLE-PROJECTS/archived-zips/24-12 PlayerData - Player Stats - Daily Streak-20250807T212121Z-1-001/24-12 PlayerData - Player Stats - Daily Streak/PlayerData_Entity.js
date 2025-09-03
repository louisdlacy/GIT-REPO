"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const PlayerData_Data_1 = require("PlayerData_Data");
const PlayerData_Func_1 = require("PlayerData_Func");
const PlayerStats_Func_1 = require("PlayerStats_Func");
const WorldVariableNames_Data_1 = require("WorldVariableNames_Data");
class PlayerData_Entity extends core_1.Component {
    preStart() {
        WorldVariableNames_Data_1.worldVariableNames.jsonPPVs.playerStats = this.props.variableGroupName + ':' + this.props.playerStatsPPVVariableName;
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, (player) => { this.playerEnterWorld(player); });
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitWorld, (player) => { this.playerExitWorld(player); });
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterAFK, (player) => { this.playerEnterAFK(player); });
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitAFK, (player) => { this.playerExitAFK(player); });
    }
    start() {
        this.async.setInterval(() => { PlayerData_Func_1.playerData_Func.updateTimeSpent(); }, 60000);
        this.async.setInterval(() => {
            PlayerData_Func_1.playerData_Func.updatePlayerPositions();
            //#EXAMPLE USE
            //update Player Statuses
            //Check & Update Game State
        }, this.props.positionUpdateFrequencyMs);
    }
    playerEnterWorld(player) {
        const playerData = PlayerData_Func_1.playerData_Func.createEmptyPlayerData(player);
        PlayerData_Data_1.playerDataMap.set(player, playerData);
        PlayerStats_Func_1.playerStats_Func.updatePPVAndLeaderboards(player);
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
PlayerData_Entity.propsDefinition = {
    variableGroupName: { type: core_1.PropTypes.String, default: 'PlayerDataClass' },
    playerStatsPPVVariableName: { type: core_1.PropTypes.String, default: 'PlayerStats' },
    positionUpdateFrequencyMs: { type: core_1.PropTypes.Number, default: 100 },
};
core_1.Component.register(PlayerData_Entity);
