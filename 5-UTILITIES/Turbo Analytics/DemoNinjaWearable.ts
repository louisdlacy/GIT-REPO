/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * @format
 */

// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD

import * as hz from 'horizon/core';
import { TurboDataService, WearableEquipPayload, WearableReleasePayload } from 'horizon/analytics';
import { Analytics } from 'TurboAnalytics';
import { HTMLHelpers, getPlayerName, playSFX, setText, wrapColor, wrapParens } from 'DemoNinjaCommon';

type SeenProps = {
  playerName: string;
  numTimes: number;
};

// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
class TurboWearable extends hz.Component<typeof TurboWearable> {

  static propsDefinition = {
    wearableKey: { type: hz.PropTypes.String },
    wearableType: { type: hz.PropTypes.String },
    debugDisplay: { type: hz.PropTypes.Entity },
    sfxEquip: { type: hz.PropTypes.Entity },
    sfxRelease: { type: hz.PropTypes.Entity },
    isGrabToEquip: { type: hz.PropTypes.Boolean, default: false },
  };
  wearableKey!: string;
  wearableType!: string;
  isGrabToEquip!: boolean;

  debugDisplay: hz.TextGizmo | undefined;
  sfxEquip: hz.AudioGizmo | undefined;
  sfxRelease: hz.AudioGizmo | undefined;
  seenPlayers!: Map<number, SeenProps>;

  start() {

    this.seenPlayers = new Map<number, SeenProps>();
    this.wearableKey = this.props.wearableKey ?? 'Wearable Key';
    this.wearableType = this.props.wearableType ?? 'Wearable Type';
    this.debugDisplay = this.props.debugDisplay?.as(hz.TextGizmo);

    this.sfxEquip = this.props.sfxEquip?.as(hz.AudioGizmo);
    this.sfxRelease = this.props.sfxRelease?.as(hz.AudioGizmo);
    this.isGrabToEquip = this.props.isGrabToEquip ?? false;


    // On Attach Event: WearableEquip
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnAttachStart, (player) => {
      this.onEquip(player);
    });

    // On Unattach Event: Wearable Release
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnAttachEnd, (player) => {
      this.onRelease(player);
    });

    // On Grab Event (if set in props): Wearable Equip
    if (this.isGrabToEquip === true) {
      this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabStart, (_isRightHand, player) => {
        this.onEquip(player);
      });
    }

    // Remove OnExitWorld
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (exitBy: hz.Player) => {
      this.removePlayer(exitBy);
    });
  }

  onEquip(player: hz.Player) {
    if (player === this.world.getServerPlayer()) {
      return;
    }
    playSFX(this.sfxEquip);
    if (!this.seenPlayers.has(player.id)) {
      this.addPlayer(player);
    } else {
      this.updateSeenPlayerCount(player);
    }
    this.onChange();

    this.async.setTimeout(() => Analytics()?.sendWearableEquip({
      player,
      wearableKey: this.wearableKey,
      wearableType: this.wearableType
    } as WearableEquipPayload));
  }

  onRelease(player: hz.Player) {
    if (player === this.world.getServerPlayer()) {
      return;
    }
    playSFX(this.sfxRelease);
    this.onChange();

    this.async.setTimeout(() => Analytics()?.sendWearableRelease({
      player,
      wearableKey: this.wearableKey,
      wearableType: this.wearableType
    } as WearableReleasePayload));
  }

  addPlayer(player: hz.Player) {
    if (!this.hasSeen(player)) {
      const playerName = getPlayerName(player, this.world);
      const playerSeenProps: SeenProps = { playerName, numTimes: 1 };
      this.seenPlayers.set(player.id, playerSeenProps);
    }
  }

  removePlayer(player: hz.Player) {
    this.seenPlayers.delete(player.id);
  }

  getSeenPlayer(player: hz.Player) {
    return this.seenPlayers.get(player.id);
  }

  hasSeen(player: hz.Player): boolean {
    return TurboDataService.getWearablesSeen(player)?.has(this.wearableKey) ?? false;
  }

  updateSeenPlayerCount(player: hz.Player) {
    const seenPlayer = this.getSeenPlayer(player);
    if (seenPlayer) {
      seenPlayer.numTimes++;
    }
  }

  showDebugDisplay(): void {
    const keyDisplay = wrapColor('Key: ' + this.wearableKey + " (Type: " + this.wearableType + ")", HTMLHelpers.Purple);
    let playerDisplayLocal = '';
    this.seenPlayers.forEach((seenPlayer) => {
      const { playerName, numTimes } = seenPlayer;
      const color = numTimes <= 1 ? HTMLHelpers.Green : HTMLHelpers.MetaLightBlue;
      playerDisplayLocal += wrapColor(playerName + " " + wrapParens(numTimes.toString()), color) + HTMLHelpers.Break;
    });
    setText(this.debugDisplay, keyDisplay + HTMLHelpers.Break + 'Seen Players: ' + HTMLHelpers.Break + playerDisplayLocal);
  }

  onChange() {
    this.showDebugDisplay();
  }
}
hz.Component.register(TurboWearable);
