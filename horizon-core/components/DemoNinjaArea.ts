/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * @format
 */


// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD

import * as hz from 'horizon/core';
import { AreaEnterPayload, AreaExitPayload, ParticipationEnum, Turbo, TurboDataService } from 'horizon/analytics';
import { HTMLHelpers, getTimerDisplay, playSFX, setText, wrapColor, wrapParens } from 'DemoNinjaCommon';
import { Analytics } from 'TurboAnalytics';

type DemoSeenProps = {
  playerName: string;
  numTimes: number;
};

/* True if the Area Key is legit (not left blank/undefined etc.) */
function isLegitArea(x: string | null | undefined): boolean {
  return !!x && x.trim() !== '';
}

// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
class DemoTurboArea extends hz.Component<typeof DemoTurboArea> {
  static propsDefinition = {
    area: { type: hz.PropTypes.String },
    isLobby: { type: hz.PropTypes.Boolean, default: true },
    isPlayerReady: { type: hz.PropTypes.Boolean, default: false },
    isInRound: { type: hz.PropTypes.Boolean, default: false },
    displayTxtObj: { type: hz.PropTypes.Entity },
    enterSFX: { type: hz.PropTypes.Entity },
    exitSFX: { type: hz.PropTypes.Entity },
  };

  areaResolved!: string;
  isLobby!: boolean;
  isPlayerReady!: boolean;
  isInRound!: boolean;

  displayTxtObj: hz.TextGizmo | undefined;
  enterSFX: hz.AudioGizmo | undefined;
  exitSFX: hz.AudioGizmo | undefined;
  isRunning: boolean = false;

  seenPlayers: Map<hz.Player, DemoSeenProps> = new Map<hz.Player, DemoSeenProps>();

  cacheProps() {
    this.areaResolved = isLegitArea(this.props.area) ? this.props.area : 'UNKNOWN';
    this.isLobby = this.props.isLobby ?? true;
    this.isPlayerReady = this.props.isPlayerReady ?? false;
    this.isInRound = this.props.isInRound ?? false;

    this.seenPlayers.clear();
    this.displayTxtObj = this.props.displayTxtObj?.as(hz.TextGizmo);
    this.enterSFX = this.props.enterSFX?.as(hz.AudioGizmo);
    this.exitSFX = this.props.exitSFX?.as(hz.AudioGizmo);
  }

  start() {
    this.cacheProps();

    this.displayTxtObj?.visible.set(true);

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (enterBy: hz.Player) => {
      this.onAreaEnter(enterBy);
    });

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, (exitedBy: hz.Player) => {
      this.onAreaExit(exitedBy);
    });

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (exitBy: hz.Player) => {
      this.removePlayer(exitBy);
    });

    this.async.setTimeout(() => {
      this.async.setInterval(() => {
        this.showDemoDisplay();
      }, 1000);
    }, 1000)
  }

  onAreaEnter(player: hz.Player) {
    this.isRunning = true;
    this.addPlayer(player);
    playSFX(this.enterSFX);

    Analytics()?.sendAreaEnter({
      player,
      actionArea: this.areaResolved,
      actionAreaIsLobbySection: this.isLobby,
      actionAreaIsPlayerReadyZone: this.isPlayerReady,
      turboState: this.isInRound ? ParticipationEnum.IN_ROUND : undefined  // Force In Round on Enter
    } as AreaEnterPayload);
  }

  onAreaExit(player: hz.Player) {
    this.isRunning = false;
    playSFX(this.exitSFX);
    Analytics()?.sendAreaExit({
      player,
      actionArea: this.areaResolved,
      actionAreaIsLobbySection: this.isLobby,
      actionAreaIsPlayerReadyZone: this.isPlayerReady
    } as AreaExitPayload);
  }

  addPlayer(player: hz.Player) {
    if (!this.hasSeen(player)) {
      const playerName = this.getPlayerName(player);
      const playerSeenProps: DemoSeenProps = { playerName, numTimes: 1 };
      this.seenPlayers.set(player, playerSeenProps);
    } else {
      this.updateSeenPlayerCount(player);
    }
  }

  getPlayerName(player: hz.Player): string {
    return player.name.get();
  }

  getSeenPlayer(player: hz.Player) {
    return this.seenPlayers.get(player);
  }

  hasSeen(player: hz.Player): boolean {
    return this.seenPlayers.has(player);
  }

  removePlayer(player: hz.Player) {
    this.seenPlayers.delete(player);
  }

  showDemoDisplay(): void {
    const keyDisplay = wrapColor("Turbo Area: " + this.areaResolved, HTMLHelpers.MetaLightBlue);
    let playerDisplayLocal = '';
    this.seenPlayers.forEach((seenData, player) => {
      const { playerName, numTimes } = seenData;
      const color = numTimes <= 1 ? HTMLHelpers.Green : HTMLHelpers.MetaLightBlue;
      playerDisplayLocal += wrapColor(playerName + " - # Visits: " + wrapParens(numTimes.toString()), color) + HTMLHelpers.Break;

      if (Turbo.isReady()) {
        const timerKey = this.areaResolved;
        const sessionSeconds = 1.0 * TurboDataService.getAreaSessionSeconds(player, timerKey)
        const latestSeconds = 1.0 * TurboDataService.getAreaLatestIntervalSeconds(player, timerKey);
        playerDisplayLocal += getTimerDisplay(timerKey, sessionSeconds, latestSeconds, false, this.isRunning) + HTMLHelpers.Break;
        playerDisplayLocal = playerDisplayLocal.replace("(S:)", "Session - ").replace("(C:)", "Latest - ");
      }
    });

    if (this.seenPlayers.size > 0) {
      setText(this.displayTxtObj, keyDisplay + HTMLHelpers.Break + 'Seen Players:' + HTMLHelpers.Break + playerDisplayLocal);
    } else {
      setText(this.displayTxtObj, keyDisplay + HTMLHelpers.Break + wrapColor('Seen Players:' + HTMLHelpers.Break + "None", HTMLHelpers.Gray));
    }
  }

  updateSeenPlayerCount(player: hz.Player) {
    const seenPlayer = this.getSeenPlayer(player);
    if (seenPlayer) {
      seenPlayer.numTimes++;
    }
  }
}
hz.Component.register(DemoTurboArea);
