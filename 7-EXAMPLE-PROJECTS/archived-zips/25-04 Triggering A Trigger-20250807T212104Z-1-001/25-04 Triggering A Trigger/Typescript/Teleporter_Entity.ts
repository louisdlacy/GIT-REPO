import { CodeBlockEvents, Component, Player, PropTypes, SpawnPointGizmo } from "horizon/core";


class Teleporter_Entity extends Component<typeof Teleporter_Entity> {
  static propsDefinition = {
    spawnPoint: { type: PropTypes.Entity },
  };

  preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, (player) => { this.playerEnterTrigger(player); });
  }

  start() {

  }

  playerEnterTrigger(player: Player) {
    this.props.spawnPoint?.as(SpawnPointGizmo).teleportPlayer(player);
  }
}
Component.register(Teleporter_Entity);