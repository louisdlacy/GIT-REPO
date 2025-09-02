/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * @format
 */

// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD

import * as hz from 'horizon/core';
import { FrictionCausedPayload, FrictionHitPayload, Turbo, TurboDataService } from 'horizon/analytics';
import { Analytics } from 'TurboAnalytics';
import { getPlayerName, HTMLHelpers, playSFX, respawnPlayer, setText, wrapColor, wrapParens } from 'DemoNinjaCommon';

type SeenProps = {
  playerName: string;
  numTimes: number;
};

/* True if the string is legit */
function isLegit(x: string | null | undefined): boolean {
  return !!x && x.trim() !== '';
}

/* Turbo Friction Hit + Demo Turbo Options */
// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
class TurboFrictionHit extends hz.Component<typeof TurboFrictionHit> {

  FRICTION_COLOR_HTML = HTMLHelpers.Orange;

  static propsDefinition = {
    frictionItemKey: { type: hz.PropTypes.String },
    debugDisplay: { type: hz.PropTypes.Entity },
    sfx: { type: hz.PropTypes.Entity },
    trigger: { type: hz.PropTypes.Entity },
  };

  frictionItemKey!: string;
  seenPlayers: Map<number, SeenProps> = new Map();
  debugDisplay: hz.TextGizmo | undefined;
  sfx: hz.AudioGizmo | undefined;
  trigger: hz.TriggerGizmo | undefined;

  start() {

    this.frictionItemKey = isLegit(this.props.frictionItemKey) ? this.props.frictionItemKey : 'No Friction Key';
    this.trigger = this.props.trigger?.as(hz.TriggerGizmo);
    this.debugDisplay = this.props.debugDisplay?.as(hz.TextGizmo);
    this.sfx = this.props.sfx?.as(hz.AudioGizmo);

    if (this.trigger !== undefined) {
      this.connectCodeBlockEvent(this.trigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
        this.onFrictionHit(player);
      });
    }

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (exitBy: hz.Player) => {
      this.removePlayer(exitBy);
    });
  }

  onChange() {
    Turbo.getConfigs().debug && this.showDebugDisplay();
  }

  addPlayer(player: hz.Player) {
    if (!this.hasSeen(player)) {
      const playerName = getPlayerName(player, this.world);
      const playerSeenProps: SeenProps = { playerName, numTimes: 1 };
      this.seenPlayers.set(player.id, playerSeenProps);
    } else {
      this.updateSeenPlayerCount(player);
    }
  }
  removePlayer(player: hz.Player) {
    this.seenPlayers.delete(player.id);
  }

  getSeenPlayer(player: hz.Player) {
    return this.seenPlayers.get(player.id);
  }

  hasSeen(player: hz.Player): boolean {
    return this.seenPlayers.has(player.id);
  }

  updateSeenPlayerCount(player: hz.Player) {
    const seenPlayer = this.getSeenPlayer(player);
    if (seenPlayer) {
      seenPlayer.numTimes++;
    }
  }

  showDebugDisplay(): void {
    const keyDisplay = wrapColor(this.props.frictionItemKey, this.FRICTION_COLOR_HTML);
    let playerDisplayLocal = '';
    this.seenPlayers.forEach((seenPlayer) => {
      const { playerName, numTimes } = seenPlayer;
      const color = numTimes <= 1 ? HTMLHelpers.Green : this.FRICTION_COLOR_HTML;
      playerDisplayLocal += wrapColor(playerName + " " + wrapParens(numTimes.toString()), color) + HTMLHelpers.Break;
    });

    if (this.debugDisplay != null) {
      setText(this.debugDisplay, keyDisplay + HTMLHelpers.Break + 'Seen Players: ' + HTMLHelpers.Break + playerDisplayLocal);
    }
  }

  /** Friction Hit by Player */
  onFrictionHit(player: hz.Player) {
    if (player === this.world.getServerPlayer()) {
      return;
    }

    const turboData: FrictionHitPayload = {
      player,
      frictionItemKey: this.frictionItemKey,
      frictionIsImplied: false,
      frictionNumTimes: 1,
      frictionAmount: 1
    };

    if (this.sfx != null) {
      Turbo.getConfigs().debug && playSFX(this.sfx);
    }
    const playerKey = player.id;
    if (!this.seenPlayers.has(playerKey)) {
      this.addPlayer(player);
    } else {
      this.updateSeenPlayerCount(player);
    }
    this.onChange();

    this.async.setTimeout(() => Analytics()?.sendFrictionHit(turboData, false));

  }
}
hz.Component.register(TurboFrictionHit);

/** Demo: Simple Teleport Trigger + Friction Event when player falls off the world */
// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
class DemoFallOffWorldFrictionTrigger extends hz.Component<typeof DemoFallOffWorldFrictionTrigger> {
  static propsDefinition = {
    destination: { type: hz.PropTypes.Entity },
    sfx: { type: hz.PropTypes.Entity },
    debugDisplay: { type: hz.PropTypes.Entity },
  };

  destination: hz.SpawnPointGizmo | undefined;
  debugDisplay: hz.TextGizmo | undefined;
  sfx: hz.AudioGizmo | undefined;

  start() {
    this.destination = this.props.destination?.as(hz.SpawnPointGizmo);
    this.sfx = this.props.sfx?.as(hz.AudioGizmo);
    this.debugDisplay = this.props.debugDisplay?.as(hz.TextGizmo);

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      if (player === this.world.getServerPlayer()) {
        return;
      }
      // Sometimes it spawns the player and hits the trigger, so we can just use Turbo to ignore it!
      if (TurboDataService.getWorldSeconds(player) < 5.0) {
        return;
      }
      this.onFrictionHit(player);
    });
  }

  onFrictionHit(player: hz.Player) {
    const frictionItemKey = 'Fell Off World';

    respawnPlayer(this.destination, player);
    playSFX(this.sfx);
    Analytics()?.sendFrictionHit({ player, frictionItemKey, frictionNumTimes: 1 } as FrictionHitPayload);

    const seenCount = TurboDataService.getFrictionItemSeenCount(player, frictionItemKey);
    const playerName = getPlayerName(player, this.world);
    this.debugDisplay && setText(this.debugDisplay,
      wrapColor("Fell Off World", HTMLHelpers.Orange) +
      HTMLHelpers.Break +
      wrapColor(playerName + " (" + seenCount + ")", seenCount > 0 ? HTMLHelpers.MetaLightBlue : HTMLHelpers.Green));
  }
}
hz.Component.register(DemoFallOffWorldFrictionTrigger);

/** Demo: Friction Caused Example with a > 1 Amount */
// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
class DemoFrictionCausedTrigger extends hz.Component<typeof DemoFrictionCausedTrigger> {
  static propsDefinition = {
    sfx: { type: hz.PropTypes.Entity },
    debugDisplay: { type: hz.PropTypes.Entity },
  };

  debugDisplay: hz.TextGizmo | undefined;
  sfx: hz.AudioGizmo | undefined;

  start() {

    this.debugDisplay = this.props.debugDisplay?.as(hz.TextGizmo);
    this.sfx = this.props.sfx?.as(hz.AudioGizmo);

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      if (player === this.world.getServerPlayer()) {
        return;
      }
      this.onFrictionCaused(player);
    });
  }

  onFrictionCaused(player: hz.Player) {
    const frictionItemKey = 'Messed With the Blocks!';

    playSFX(this.sfx);
    Analytics()?.sendFrictionCaused({ player, frictionItemKey } as FrictionCausedPayload);

    const playerName = getPlayerName(player, this.world);
    if (this.debugDisplay !== undefined) {
      const numTimes = TurboDataService.getFrictionCausedSeen(player).get(frictionItemKey) || 1;
      setText(
        this.debugDisplay,
        wrapColor("Friction Caused: Messed with the Blocks!", HTMLHelpers.Red) +
        HTMLHelpers.Break +
        wrapColor(playerName + " " + wrapParens(numTimes.toString()), HTMLHelpers.MetaLightBlue)
      );
    }
  }
}
hz.Component.register(DemoFrictionCausedTrigger);
