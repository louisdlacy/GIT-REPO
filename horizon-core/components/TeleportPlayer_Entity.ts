import { CodeBlockEvents, Component, Player, PropTypes, RaycastGizmo } from "horizon/core";
import NavMeshManager from "horizon/navmesh";
import { teleportPlayer_Data } from "TeleportPlayer_Data";
import { arrayUtils } from "UtilArray_Func";


class TeleportPlayer_Entity extends Component<typeof TeleportPlayer_Entity> {
  static propsDefinition = {
    ray: { type: PropTypes.Entity },
  };

  async preStart() {
    teleportPlayer_Data.ray = this.props.ray?.as(RaycastGizmo);

    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterWorld, (player) => { this.playerEnterWorld(player); });
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerExitWorld, (player) => { this.playerExitWorld(player); });
    
    teleportPlayer_Data.navMesh = await NavMeshManager.getInstance(this.world).getByName('player');
  }

  start() {

  }

  playerEnterWorld(player: Player) {
    if (!teleportPlayer_Data.players.includes(player)) {
      teleportPlayer_Data.players.push(player);
    }
  }

  playerExitWorld(player: Player) {
    arrayUtils.removeItemFromArray(teleportPlayer_Data.players, player);
  }
}
Component.register(TeleportPlayer_Entity);