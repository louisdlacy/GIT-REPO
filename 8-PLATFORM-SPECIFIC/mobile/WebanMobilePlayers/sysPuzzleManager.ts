import * as hz from 'horizon/core';
import { sysEvents } from 'sysEvents';

class sysPuzzleManager extends hz.Component<typeof sysPuzzleManager> {
  static propsDefinition = {
    hintText: {type: hz.PropTypes.String},
    hintDelay: {type: hz.PropTypes.Number, default: 30},
    hintDuration: {type: hz.PropTypes.Number, default: 5},
    hintRepeatTime: {type: hz.PropTypes.Number, default: 30},
    objectToMove: {type: hz.PropTypes.Entity},
  };

  private activePlayersList = new Array<hz.Player>();
  private isActive = false;
  private timeoutID = -1;
  private intervalID = -1;

  start() {
    // Keeping track of players in the puzzle room and start the puzzle when the first player enters
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      if (!this.activePlayersList.includes(player)) {
        this.activePlayersList.push(player);
      }

      if (!this.isActive) this.OnStartPuzzle();
    });

    // Removing players from the active players list when they exit the puzzle room
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, (player: hz.Player) => {
      if (this.activePlayersList.includes(player)) {
        this.activePlayersList.splice(this.activePlayersList.indexOf(player), 1);
      }
    });

    // Listen to the `OnFinishPuzzle` event to complete the puzzle and allow the player to continue
    this.connectNetworkEvent(this.entity, sysEvents.OnFinishPuzzle, () => {
      this.OnFinishPuzzle();
    });
  }

  // Starts the puzzle and displays a hint to the active players after `hintDelay` seconds and repeat the hint every `hintRepeatTime` seconds
  private OnStartPuzzle() {
    this.isActive = true;

    this.timeoutID = this.async.setTimeout(() => {
      this.sendNetworkBroadcastEvent(sysEvents.OnDisplayHintHUD, {players: this.activePlayersList, text: this.props.hintText, duration: this.props.hintDuration});
      this.intervalID = this.async.setInterval(() => {
        this.sendNetworkBroadcastEvent(sysEvents.OnDisplayHintHUD, {players: this.activePlayersList, text: this.props.hintText, duration: this.props.hintDuration});
      }, this.props.hintRepeatTime * 1000)},
      this.props.hintDelay * 1000
    );
  }

  // Finish the puzzle, clearing all the timeouts and sending an event to move the object (for example, the door to the next room or some platforms)
  private OnFinishPuzzle() {
    this.async.clearTimeout(this.timeoutID);
    this.async.clearInterval(this.intervalID);
    if (this.props.objectToMove) this.sendLocalEvent(this.props.objectToMove, sysEvents.OnMoveObject, {});
  }
}
hz.Component.register(sysPuzzleManager);
