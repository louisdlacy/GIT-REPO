import { CodeBlockEvents, Component, Player, PropTypes } from "horizon/core";
import { randomSpawnPoint_Func } from "RandomSpawnPoint_Func";


class RandomTeleporter_Entity extends Component<typeof RandomTeleporter_Entity> {
  static propsDefinition = {
    trigger: { type: PropTypes.Entity },
  };

  preStart() {
    if (this.props.trigger) {
      this.connectCodeBlockEvent(this.props.trigger, CodeBlockEvents.OnPlayerEnterTrigger, (player) => { this.playerEnterTrigger(player); });
    }
  }

  start() {

  }

  playerEnterTrigger(player: Player) {
    randomSpawnPoint_Func.randomlyTeleportPlayer(player);
  }
}
Component.register(RandomTeleporter_Entity);