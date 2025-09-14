import * as hz from 'horizon/core';

class PlayerHudManager extends hz.Component<typeof PlayerHudManager> {
  static propsDefinition = {
    playerHud1: {type: hz.PropTypes.Entity},
    playerHud2: {type: hz.PropTypes.Entity},
    playerHud3: {type: hz.PropTypes.Entity},
    playerHud4: {type: hz.PropTypes.Entity},
  };

  private playerHuds: hz.Entity[] = [];

  preStart(): void {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player: hz.Player) => {
      this.onPlayerEnterWorld(player);
    });
  }

  start() {
    if (this.props.playerHud1 !== undefined) {
      this.playerHuds.push(this.props.playerHud1);
    }
    if (this.props.playerHud2 !== undefined) {
      this.playerHuds.push(this.props.playerHud2);
    }
    if (this.props.playerHud3 !== undefined) {
      this.playerHuds.push(this.props.playerHud3);
    }
    if (this.props.playerHud4 !== undefined) {
      this.playerHuds.push(this.props.playerHud4);
    }
  }

  onPlayerEnterWorld(player: hz.Player) {
    if (player.name.get() === "Trader") {
      return;
    }
    // Get a player hud
    if (player.index.get() > this.playerHuds.length - 1) {
      console.warn("No player hud for player: " + player.index.get());
      return;
    }
    console.log("Setting player hud for player: " + player.index.get());
    const playerHud = this.playerHuds[player.index.get()];
    playerHud.owner.set(player);

    // Assign the player hud to the player

  }
}
hz.Component.register(PlayerHudManager);
