/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * @format
 */


// TURBO USAGE: KEEP & CUSTOMIZE BASED ON YOUR NEEDS

import * as hz from 'horizon/core';
import { AreaEnterPayload, AreaExitPayload, ParticipationEnum } from 'horizon/analytics';
import { Analytics } from 'TurboAnalytics';

/* True if the string is legit */
function isLegit(x: string | null | undefined): boolean {
  return !!x && x.trim() !== '';
}

class TurboArea extends hz.Component<typeof TurboArea> {
  static propsDefinition = {
    area: { type: hz.PropTypes.String },
    isLobby: { type: hz.PropTypes.Boolean, default: true },
    isPlayerReady: { type: hz.PropTypes.Boolean, default: false },
    isInRound: { type: hz.PropTypes.Boolean, default: false }
  };

  areaResolved!: string;
  isLobby!: boolean;
  isPlayerReady!: boolean;
  isInRound!: boolean;

  cacheProps() {
    this.areaResolved = isLegit(this.props.area) ? this.props.area : 'UNKNOWN';
    this.isLobby = this.props.isLobby ?? true;
    this.isPlayerReady = this.props.isPlayerReady ?? false;
    this.isInRound = this.props.isInRound ?? false;
  }

  start() {
    this.cacheProps();

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (enterBy: hz.Player) => {
      this.onAreaEnter(enterBy);
    });

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, (exitedBy: hz.Player) => {
      this.onAreaExit(exitedBy);
    });
  }

  onAreaEnter(player: hz.Player) {
    Analytics()?.sendAreaEnter({
      player,
      actionArea: this.areaResolved,
      actionAreaIsLobbySection: this.isLobby,
      actionAreaIsPlayerReadyZone: this.isPlayerReady,
      turboState: this.isInRound ? ParticipationEnum.IN_ROUND : undefined // otherwise player isn't included in the round
    } as AreaEnterPayload);
  }

  onAreaExit(player: hz.Player) {
    Analytics()?.sendAreaExit({
      player,
      actionArea: this.areaResolved,
      actionAreaIsLobbySection: this.isLobby,
      actionAreaIsPlayerReadyZone: this.isPlayerReady
    } as AreaExitPayload);
  }
}
hz.Component.register(TurboArea);
