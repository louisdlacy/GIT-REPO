import { Player } from "horizon/core";
import { randomSpawnPoint_Data } from "RandomSpawnPoint_Data";


export const randomSpawnPoint_Func = {
  randomlyTeleportPlayer,
}


function randomlyTeleportPlayer(player: Player) {
  const availableSpawnPoints = [...randomSpawnPoint_Data.spawnPoints];

  if (randomSpawnPoint_Data.lastSpawnPointIndex >= 0) {
    availableSpawnPoints.splice(randomSpawnPoint_Data.lastSpawnPointIndex, 1);
  }

  const randomSpawnPoint = availableSpawnPoints[Math.floor(Math.random() * availableSpawnPoints.length)];
  
  randomSpawnPoint.teleportPlayer(player);

  randomSpawnPoint_Data.lastSpawnPointIndex = randomSpawnPoint_Data.spawnPoints.indexOf(randomSpawnPoint);
}