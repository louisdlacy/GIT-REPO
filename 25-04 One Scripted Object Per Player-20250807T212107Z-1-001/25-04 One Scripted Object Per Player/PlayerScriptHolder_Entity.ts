import { CodeBlockEvents, Component, Player, World } from "horizon/core";
import { playerScriptHolder_Data } from "PlayerScriptHolder_Data";


class PlayerScriptHolder_Entity extends Component<typeof PlayerScriptHolder_Entity> {
  static propsDefinition = {};

  iAmFor = -1;
  myPlayer: Player | undefined;

  preStart() {
    if (!playerScriptHolder_Data.psHolderEntities.includes(this.entity)) {
      playerScriptHolder_Data.psHolderEntities.push(this.entity);
    }

    this.iAmFor = playerScriptHolder_Data.psHolderEntities.indexOf(this.entity);

    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterWorld, (player) => { this.playerEnterWorld(player); });
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerExitWorld, (player) => { this.playerExitWorld(player); });

    this.connectLocalBroadcastEvent(World.onUpdate, (payload: { deltaTime: number }) => { this.onUpdate(payload.deltaTime); });
  }

  start() {

  }

  onUpdate(deltaTime: number) {
    if (this.myPlayer) {
      console.log(this.myPlayer.name.get());
    }
  }

  playerEnterWorld(player: Player) {
    if (this.iAmFor === player.index.get()) {
      this.myPlayer = player;
    }
  }

  playerExitWorld(player: Player) {
    if (this.myPlayer === player) {
      this.myPlayer = undefined;
    }
  }
}
Component.register(PlayerScriptHolder_Entity);