import { CodeBlockEvents, Component, Player, PropTypes } from "horizon/core";


const timeStampMapMs = new Map<Player, number>();
let worldStartTimeMs = 0;

class RaceTrigger_Entity extends Component<typeof RaceTrigger_Entity> {
  static propsDefinition = {
    isStart: { type: PropTypes.Boolean, default: true },
    leaderboardName: { type: PropTypes.String, default: 'LeaderboardName' },
  };

  preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, (player) => { this.playerEnterTrigger(player); });
  }

  start() {
    worldStartTimeMs = Date.now();
  }

  playerEnterTrigger(player: Player) {
    if (this.props.isStart) {
      timeStampMapMs.set(player, Date.now());
    }
    else {
      const elapsedMs = Date.now() - (timeStampMapMs.get(player) ?? worldStartTimeMs);

      this.world.leaderboards.setScoreForPlayer(this.props.leaderboardName, player, (elapsedMs / 1_000), false);
    }
  }
}
Component.register(RaceTrigger_Entity);