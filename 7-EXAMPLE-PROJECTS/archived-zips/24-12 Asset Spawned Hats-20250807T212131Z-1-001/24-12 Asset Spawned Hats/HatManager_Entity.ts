import { AttachableEntity, AttachablePlayerAnchor, CodeBlockEvents, Component, Entity, Player, PropTypes, Quaternion, Vec3 } from "horizon/core";


class HatManager_Entity extends Component<typeof HatManager_Entity> {
  static propsDefinition = {
    defaultHatAsset: { type: PropTypes.Asset },
  };

  hatMap = new Map<Player, Entity>();

  preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterWorld, (player) => { this.playerEnterWorld(player); });
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerExitWorld, (player) => { this.playerExitWorld(player); });
  }

  start() {

  }

  async playerEnterWorld(player: Player) {
    if (this.props.defaultHatAsset && !this.hatMap.has(player)) {
      const hatSpawned = await this.world.spawnAsset(this.props.defaultHatAsset, new Vec3(0, -1, 0), Quaternion.one, Vec3.one);

      hatSpawned[0].as(AttachableEntity).attachToPlayer(player, AttachablePlayerAnchor.Head);

      this.hatMap.set(player, hatSpawned[0]);
    }
  }

  playerExitWorld(player: Player) {
    const hat = this.hatMap.get(player);
    this.hatMap.delete(player);

    if (hat) {
      this.world.deleteAsset(hat);
    }
  }
}
Component.register(HatManager_Entity);