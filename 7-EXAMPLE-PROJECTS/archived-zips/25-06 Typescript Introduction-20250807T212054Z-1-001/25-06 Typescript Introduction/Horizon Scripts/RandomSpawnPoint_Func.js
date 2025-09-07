"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomSpawnPoint_Func = void 0;
const RandomSpawnPoint_Data_1 = require("RandomSpawnPoint_Data");
exports.randomSpawnPoint_Func = {
    randomlyTeleportPlayer,
};
function randomlyTeleportPlayer(player) {
    const availableSpawnPoints = [...RandomSpawnPoint_Data_1.randomSpawnPoint_Data.spawnPoints];
    if (RandomSpawnPoint_Data_1.randomSpawnPoint_Data.lastSpawnPointIndex >= 0) {
        availableSpawnPoints.splice(RandomSpawnPoint_Data_1.randomSpawnPoint_Data.lastSpawnPointIndex, 1);
    }
    const randomSpawnPoint = availableSpawnPoints[Math.floor(Math.random() * availableSpawnPoints.length)];
    randomSpawnPoint.teleportPlayer(player);
    RandomSpawnPoint_Data_1.randomSpawnPoint_Data.lastSpawnPointIndex = RandomSpawnPoint_Data_1.randomSpawnPoint_Data.spawnPoints.indexOf(randomSpawnPoint);
}
