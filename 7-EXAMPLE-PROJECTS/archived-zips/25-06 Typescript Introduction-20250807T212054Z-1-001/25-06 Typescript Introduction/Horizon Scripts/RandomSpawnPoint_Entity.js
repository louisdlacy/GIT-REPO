"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("horizon/core");
const RandomSpawnPoint_Data_1 = require("RandomSpawnPoint_Data");
class RandomSpawnPoint_Entity extends core_1.Component {
    preStart() {
        RandomSpawnPoint_Data_1.randomSpawnPoint_Data.spawnPoints.push(this.entity.as(core_1.SpawnPointGizmo));
    }
    start() {
    }
}
RandomSpawnPoint_Entity.propsDefinition = {};
core_1.Component.register(RandomSpawnPoint_Entity);
