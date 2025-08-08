import { Component, SpawnPointGizmo } from "horizon/core";
import { teleportPlayer_Data } from "TeleportPlayer_Data";


class TeleportPlayerSpawnPoint_Entity extends Component<typeof TeleportPlayerSpawnPoint_Entity> {
  static propsDefinition = {};

  preStart() {
    teleportPlayer_Data.spawnPoints.push(this.entity.as(SpawnPointGizmo));
  }

  start() {

  }
}
Component.register(TeleportPlayerSpawnPoint_Entity);