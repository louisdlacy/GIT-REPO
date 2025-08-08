/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * @format
 */

// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD

import * as hz from 'horizon/core';
import { DiscoveryMadePayload, TurboDataService } from 'horizon/analytics';
import { Analytics } from 'TurboAnalytics';
import { HTMLHelpers, getPlayerName, playSFX, setText, wrapColor, wrapParens } from 'DemoNinjaCommon';

type SeenProps = {
  playerName: string;
  numTimes: number;
};

/* True if the Discovery Item is legit (not left blank/undefined etc.) */
function isLegitDiscoKey(x: string | null | undefined): boolean {
  return !!x && x.trim() !== '';
}

// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
class TurboDiscoveryMade extends hz.Component<typeof TurboDiscoveryMade> {
  static propsDefinition = {
    discoKey: { type: hz.PropTypes.String },
    debugDisplay: { type: hz.PropTypes.Entity },
    sfx: { type: hz.PropTypes.Entity },
    trigger: { type: hz.PropTypes.Entity },
  };

  seenPlayers: Map<number, SeenProps> = new Map();
  debugDisplay: hz.TextGizmo | undefined;
  sfx: hz.AudioGizmo | undefined;
  trigger: hz.TriggerGizmo | undefined;
  discoKey: string = 'Ninja Discovery';

  start() {
    this.discoKey = isLegitDiscoKey(this.props.discoKey) ? this.props.discoKey : 'Ninja Discovery';
    this.debugDisplay = this.props.debugDisplay?.as(hz.TextGizmo);
    this.sfx = this.props.sfx?.as(hz.AudioGizmo);
    this.trigger = this.props.trigger?.as(hz.TriggerGizmo);

    if (this.trigger !== undefined) {
      this.connectCodeBlockEvent(this.trigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
        this.onDiscoveryMade(player);
      });
    }

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabStart, (_isRightHand: boolean, player: hz.Player) => {
      this.onDiscoveryMade(player);
    });

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (exitBy: hz.Player) => {
      this.removePlayer(exitBy);
    });
  }

  /** Discovery Made by Player */
  onDiscoveryMade(player: hz.Player) {
    if (player === this.world.getServerPlayer()) { return };

    playSFX(this.sfx);

    if (!this.seenPlayers.has(player.id)) {
      this.addPlayer(player);
    } else {
      this.updateSeenPlayerCount(player);
    }

    this.showDebugDisplay();

    this.async.setTimeout(() => Analytics()?.sendDiscoveryMade({
      player,
      discoveryItemKey: this.discoKey,
      discoveryIsImplied: false,
      discoveryNumTimes: 1,
      discoveryAmount: 1
    } as DiscoveryMadePayload));

  }

  addPlayer(player: hz.Player) {
    if (TurboDataService.getDiscoveryItemSeenCount(player, this.discoKey) == 0) {
      const playerName = getPlayerName(player, this.world);
      this.seenPlayers.set(player.id, { playerName, numTimes: 1 } as SeenProps);
    } else {
      this.updateSeenPlayerCount(player);
    }
  }

  removePlayer(player: hz.Player) {
    this.seenPlayers.delete(player.id);
  }

  showDebugDisplay(): void {
    const keyDisplay = wrapColor(this.discoKey, HTMLHelpers.MetaLightBlue);

    let playerDisplayLocal = '';
    this.seenPlayers.forEach((seenPlayer) => {
      const { playerName, numTimes } = seenPlayer;
      const color = numTimes <= 1 ? HTMLHelpers.Green : HTMLHelpers.MetaLightBlue;
      playerDisplayLocal += wrapColor(playerName + " " + wrapParens(numTimes.toString()), color) + HTMLHelpers.Break;
    });

    if (this.debugDisplay !== undefined) {
      setText(this.debugDisplay, keyDisplay + HTMLHelpers.Break + 'Seen Players: ' + HTMLHelpers.Break + playerDisplayLocal);
    }
  }

  updateSeenPlayerCount(player: hz.Player) {
    const seenPlayer = this.seenPlayers.get(player.id);
    if (seenPlayer) {
      seenPlayer.numTimes++;
    }
  }

}
hz.Component.register(TurboDiscoveryMade);
