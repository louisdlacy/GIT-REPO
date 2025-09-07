import * as hz from 'horizon/core';

/**
 * Player Manager System
 * Central hub for managing player state and coordination.
 */
class sysPlayerManager extends hz.Component<typeof sysPlayerManager> {
  static propsDefinition = {
    // Example future prop: spawnPoint: { type: hz.PropTypes.Entity }
  };

  private players: Map<number, hz.Player> = new Map();

  preStart() {
    // Listen for players entering and leaving the world
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterWorld, (player: hz.Player) => {
      this.addPlayer(player);
    });

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (player: hz.Player) => {
      this.removePlayer(player);
    });
  }

  start() {
    console.log("sysPlayerManager started.");
    // Populate with any players already in the world when the script starts
    this.world.getPlayers().forEach(player => {
      this.addPlayer(player);
    });
  }

  private addPlayer(player: hz.Player) {
    if (!this.players.has(player.id)) {
      this.players.set(player.id, player);
      console.log(`Player joined: ${player.name.get()} (ID: ${player.id}). Total players: ${this.players.size}`);
    }
  }

  private removePlayer(player: hz.Player) {
    if (this.players.has(player.id)) {
      this.players.delete(player.id);
      console.log(`Player left: ${player.name.get()} (ID: ${player.id}). Total players: ${this.players.size}`);
    }
  }
}

hz.Component.register(sysPlayerManager);