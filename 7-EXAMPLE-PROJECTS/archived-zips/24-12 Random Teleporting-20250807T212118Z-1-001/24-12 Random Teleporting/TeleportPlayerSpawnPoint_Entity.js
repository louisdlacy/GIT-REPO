"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const TeleportPlayer_Data_1 = require("TeleportPlayer_Data");
class TeleportPlayerSpawnPoint_Entity extends core_1.Component {
    preStart() {
        TeleportPlayer_Data_1.teleportPlayer_Data.spawnPoints.push(this.entity.as(core_1.SpawnPointGizmo));
    }
    start() {
    }
}
TeleportPlayerSpawnPoint_Entity.propsDefinition = {};
core_1.Component.register(TeleportPlayerSpawnPoint_Entity);
