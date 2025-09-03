"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HatManager_Data_1 = require("HatManager_Data");
const HatManager_Func_1 = require("HatManager_Func");
const core_1 = require("horizon/core");
const PlayerData_Data_1 = require("PlayerData_Data");
class HatManager_Entity extends core_1.Component {
    preStart() {
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, (player) => { this.playerEnterWorld(player); });
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitWorld, (player) => { this.playerExitWorld(player); });
    }
    start() {
    }
    async playerEnterWorld(player) {
        if (!HatManager_Data_1.hatManager_Data.hatMap.has(player)) {
            let playerDataInProgress = PlayerData_Data_1.playerDataMap.get(player);
            while (playerDataInProgress === undefined) {
                await new Promise(resolve => this.async.setTimeout(resolve, 100));
                playerDataInProgress = PlayerData_Data_1.playerDataMap.get(player);
            }
            const playerData = playerDataInProgress;
            if (playerData) {
                let hatAssetDataToSpawn = HatManager_Data_1.hatManager_Data.defaultHat;
                if (playerData.stats.lastWornItem !== '') {
                    HatManager_Data_1.hatManager_Data.allHats.forEach((hatAssetData) => {
                        if (hatAssetData.id === playerData.stats.lastWornItem) {
                            hatAssetDataToSpawn = hatAssetData;
                        }
                    });
                }
                if (!playerData.stats.purchasedItems.includes(playerData.stats.lastWornItem)) {
                    playerData.stats.purchasedItems.push(playerData.stats.lastWornItem);
                }
                HatManager_Func_1.hatManager_Func.spawnHat(player, playerData, hatAssetDataToSpawn);
            }
        }
    }
    playerExitWorld(player) {
        const hat = HatManager_Data_1.hatManager_Data.hatMap.get(player);
        HatManager_Data_1.hatManager_Data.hatMap.delete(player);
        if (hat) {
            this.world.deleteAsset(hat);
        }
    }
}
HatManager_Entity.propsDefinition = {};
core_1.Component.register(HatManager_Entity);
