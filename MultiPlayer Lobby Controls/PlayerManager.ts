import { GameState, Events, MatchPlayers } from 'GameUtils';
import * as hz from 'horizon/core';

/* This script must be added to a game object in order to run */
class PlayerManager extends hz.Component<typeof PlayerManager> {
  static propsDefinition = {
    // TODO: create a prop for the Match Spawn Point
    // TODO: create a prop for the Lobby Spawn Point
  };
  /* We can use our helpful Utils class to easily manage players */
  private matchPlayers: MatchPlayers = new MatchPlayers();

  /* Using preStart for broadcast listeners helps make sure bindings are in place first */
  preStart() {
    this.connectLocalBroadcastEvent(
      Events.gameStateChanged,
      (data: {
        fromState: GameState,
        toState: GameState,
      }) => this.handleGameStateChanged(data.fromState, data.toState),
    );
  }

  start() {
    /** Fires any time a user joins the world */
    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerEnterWorld,
      (player: hz.Player) => this.handleOnPlayerEnterWorld(player),
    );

    /** Fires any time a user leaves the world */
    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerExitWorld,
      (player: hz.Player) => this.handleOnPlayerExitWorld(player),
    );
  }

  /** When a player enters the world, add that player
   * and an initial player status to our Player Map
   */
  private handleOnPlayerEnterWorld(player: hz.Player): void {
    // TODO: when players enter, add them to our list of MatchPlayers
  };

  /** When a player leaves the world,
   * Remove that player from the PlayerMap.
   */
  private handleOnPlayerExitWorld(player: hz.Player): void {
    // TODO: when a player leaves, remove them from our list of MatchPlayers
  };

  private handleGameStateChanged(fromState: GameState, toState: GameState) {
    switch (toState) {
      case GameState.Playing:
        // TODO: if "fromState" was "Starting", move all players to the match area
        break;
      case GameState.Finished:
        if (fromState === GameState.Ending) {
          this.moveAllMatchPlayersToLobby();
          // TODO: reset the world back to the original game state
        }
        break;
    }
  };

  private moveAllLobbyPlayersToMatch() {
    /* Gets all Lobby players using our helper classes*/
    const lobbyPlayers = this.matchPlayers.getPlayersInLobby();
    lobbyPlayers.list.forEach((p: hz.Player) => {
      this.movePlayerFromLobbyToMatch(p);
    });
  }

  /* Physically move a player and keep our data sets updated*/
  private movePlayerFromLobbyToMatch(player: hz.Player) {
    // TODO: respawn the player at the Match Spawn Point location
    // TODO: update lobby MatchPlayers
  }

  private moveAllMatchPlayersToLobby() {
    /* Gets all Match players using our helper classes*/
    const matchPlayers = this.matchPlayers.getPlayersInMatch();
    matchPlayers.list.forEach((p: hz.Player) => {
      this.movePlayerFromMatchToLobby(p);
    });
  }

  private movePlayerFromMatchToLobby(player: hz.Player) {
    // TODO: respawn the player at the Lobby Spawn Point location
    // TODO: update match MatchPlayers
  }
}
hz.Component.register(PlayerManager);
