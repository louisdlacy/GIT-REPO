import * as hz from 'horizon/core';
import { Npc } from 'horizon/npc';
import { CheckpointEvents } from './Checkpoint';

class NPCAnnouncer extends hz.Component<typeof NPCAnnouncer> {
  static propsDefinition = {};

  private _npc!: Npc;

  preStart() {
    this.connectLocalEvent(this.entity, CheckpointEvents.PlayerReset, (data) => {
      this.resetMemory();
    });

    this.connectLocalEvent(this.entity, CheckpointEvents.PlayerEntered, (data) => {
      this.playerEnteredCheckpoint(data.player, data.checkpointNum);
    });

    this.connectLocalEvent(this.entity, CheckpointEvents.PlayerVisited, (data) => {
      this.playerVisitedCheckpoint(data.player, data.checkpointNum);
    });
  }

  start() {
    this._npc = this.entity.as(Npc);
    if (!this._npc) {
      console.error("NPCAnnouncer: Entity needs to be attached to an NPC gizmo!");
    }

    if (!this._npc.conversation) {
      console.error("NPCAnnouncer: npc conversation not found?");
    }

    this.resetMemory();
  }

  // Ask the NPC to comment on a player reaching a checkpoint.
  async playerEnteredCheckpoint(player: hz.Player, checkpointNum: number) {
    if (!player) {
      console.warn("NPCAnnouncer: null player passed to playerReachedCheckpoint");
      return;
    }

    console.log("player entered checkpoint: " + checkpointNum);

    const prompt = `A player has reached checkpoint ${checkpointNum}.
    Comment on whether or not a player has already visited this checkpoint before.`;

    await this._npc.conversation?.elicitResponse(prompt);
  }

  // When a player has visited a checkpoint, make the NPC aware of this.
  playerVisitedCheckpoint(player: hz.Player, checkpointNum: number) {
    if (!player) {
      console.warn("NPCAnnouncer: null player passed to playerReachedCheckpoint");
      return;
    }

    const prompt = `A player has already visited checkpoint ${checkpointNum}.`;
    this._npc.conversation?.addEventPerception(prompt);
  }

  resetMemory() {
    this._npc.conversation?.resetMemory();
  }

}
hz.Component.register(NPCAnnouncer);
