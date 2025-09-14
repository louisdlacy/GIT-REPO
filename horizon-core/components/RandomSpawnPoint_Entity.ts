import { Component, SpawnPointGizmo } from "horizon/core";
import { randomSpawnPoint_Data } from "RandomSpawnPoint_Data";


class RandomSpawnPoint_Entity extends Component<typeof RandomSpawnPoint_Entity> {
  static propsDefinition = {};

  preStart() {
    randomSpawnPoint_Data.spawnPoints.push(this.entity.as(SpawnPointGizmo));
  }

  start() {

  }
}
Component.register(RandomSpawnPoint_Entity);