/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */

/**
  This event tracks when a player enters or leaves the world, and creates a map between player index value and specified player. 
  Note that this world does not support multiplayer.

 */

import * as hz from 'horizon/core';

class PlayerManager extends hz.Component<typeof PlayerManager> {
  static propsDefinition = {};

  private playerMap: Map<number, hz.Player> = new Map<number, hz.Player>();

  start() {
    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerEnterWorld,
      (player: hz.Player) => {
        this.handleOnPlayerEnter(player);
      }
    );

    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerExitWorld,
      (player: hz.Player) => {
        this.handleOnPlayerExit(player);
      }
    );
  }

  private handleOnPlayerExit(player: hz.Player): void {
    if (this.playerMap.has(player.id)) {
      this.playerMap.delete(player.id);
      // console.log(`deleted player ${player.name.get()}`);
    }
  };

  private handleOnPlayerEnter(player: hz.Player): void {
    if (!this.playerMap.has(player.id)) {
      this.playerMap.set(player.id, player);
      // console.log(`added player ${player.name.get()}`);
    }
  };
}
hz.Component.register(PlayerManager);
