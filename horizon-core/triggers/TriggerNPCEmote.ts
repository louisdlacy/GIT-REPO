import { NPCAgentEmote } from 'NPCAgent';
import { PlayAnimation } from 'NPCStandAndLook';
import * as hz from 'horizon/core';
import { TriggerGizmo } from 'horizon/core';

class TriggerNPCEmote extends hz.Component<typeof TriggerNPCEmote> {
  static propsDefinition = {
    npc: {type: hz.PropTypes.Entity, default: undefined},
    animation: {type: hz.PropTypes.String, default: NPCAgentEmote.Celebration},
  };

  start() {
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
      if (this.props.npc !== undefined) {
        this.sendLocalEvent(this.props.npc, PlayAnimation, {
          animation: this.props.animation,
          player: player,
        })
        this.entity.as(TriggerGizmo)?.enabled.set(false);
        this.async.setTimeout(() => {
          this.entity.as(TriggerGizmo)?.enabled.set(true);
        }, 1000)
      }
    });
  }
}
hz.Component.register(TriggerNPCEmote);
