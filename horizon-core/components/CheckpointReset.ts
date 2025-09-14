import * as hz from 'horizon/core';
import { Npc } from 'horizon/npc';
import { CheckpointEvents } from './Checkpoint';

class CheckpointReset extends hz.Component<typeof CheckpointReset> {
  static propsDefinition = {
    npc: {type: hz.PropTypes.Entity},
    checkpoint1: {type: hz.PropTypes.Entity},
    checkpoint2: {type: hz.PropTypes.Entity},
    checkpoint3: {type: hz.PropTypes.Entity},
    checkpoint4: {type: hz.PropTypes.Entity},
  };

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      this.resetCheckpoints(player);
    });
  }

  resetCheckpoints(player: hz.Player){
    this.sendLocalEvent(this.props.npc!, CheckpointEvents.PlayerReset, {player});
    this.sendLocalEvent(this.props.checkpoint1!, CheckpointEvents.PlayerReset, {player});
    this.sendLocalEvent(this.props.checkpoint2!, CheckpointEvents.PlayerReset, {player});
    this.sendLocalEvent(this.props.checkpoint3!, CheckpointEvents.PlayerReset, {player});
    this.sendLocalEvent(this.props.checkpoint4!, CheckpointEvents.PlayerReset, {player});
  }
}
hz.Component.register(CheckpointReset);
