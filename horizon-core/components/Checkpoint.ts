import * as hz from 'horizon/core';

export const CheckpointEvents = {
  // Fired when the player visits a checkpoint for the first time
  PlayerVisited: new hz.LocalEvent<{player: hz.Player, checkpointNum: number}>('checkpointVisited'),

  // Fired every time the player enters a checkpoint, even if they've already visited it
  PlayerEntered: new hz.LocalEvent<{player: hz.Player, checkpointNum: number}>('checkpointEntered'),

  // Fired every time the player resets a checkpoint, even if they've already visited it
  PlayerReset: new hz.LocalEvent<{player: hz.Player}>('checkpointReset'),

}

class Checkpoint extends hz.Component<typeof Checkpoint> {
  static propsDefinition = {
    num: {type: hz.PropTypes.Number, default: 1},
    checkpoint: {type: hz.PropTypes.Entity},
    npc: {type: hz.PropTypes.Entity}
  };

  private _mesh!: hz.MeshEntity;
  // Use a set to track of which players have visited this checkpoint (for multiplayer)
  private _visited: Set<number> = new Set<number>();

  private _unvisitedColor: hz.Color = new hz.Color(0.07, 0.58, 1);
  private _visitedColor: hz.Color = new hz.Color(0.27, 1, 0.25);

  preStart() {
    this.connectLocalEvent(this.entity, CheckpointEvents.PlayerReset, (data) => {
      this.resetCheckpoints(data.player);
    });

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      this.enteredCheckpoint(player);
    });

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, (player: hz.Player) => {
      this.exitedCheckpoint(player);
    });
  }

  start() {
    if (!this.props.checkpoint) {
      console.error(`Checkpoint ${this.props.num} has no checkpoint model set!`);
      return;
    }

    this._mesh = this.props.checkpoint?.as(hz.MeshEntity);
    this._mesh.style.tintStrength.set(1);
    this._mesh.style.tintColor.set(this._unvisitedColor);
  }

  enteredCheckpoint(player: hz.Player) {
    this.sendLocalEvent(this.props.npc!, CheckpointEvents.PlayerEntered, {
      player: player,
      checkpointNum: this.props.num
    })

    this._mesh.style.tintColor.set(this._visitedColor);
  }

  exitedCheckpoint(player: hz.Player) {
    if (this._visited.has(player.id)) {
      return;
    }

    this._visited.add(player.id);
    this.sendLocalEvent(this.props.npc!, CheckpointEvents.PlayerVisited, {
      player: player,
      checkpointNum: this.props.num
    });
  }

  resetCheckpoints(player: hz.Player) {
    this._visited.clear();
    this._mesh.style.tintColor.set(this._unvisitedColor);
  }
}
hz.Component.register(Checkpoint);
