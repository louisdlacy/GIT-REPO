/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * @format
 */

// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD

import * as hz from 'horizon/core';
import { Action, AreaEnterPayload, AreaExitPayload, DiscoveryMadePayload, FrictionCausedPayload, FrictionHitPayload, QuestCompletedPayload, RewardsEarnedPayload, TurboDataService, TurboDebug } from 'horizon/analytics';
import { Analytics } from 'TurboAnalytics';
import { HTMLHelpers, getPlayerName, playSFX, setText, wrapColor, wrapParens } from 'DemoNinjaCommon';

// Turbo Rocket Fuel Ninja Quests
enum NinjaQuests {
  DISCOVERY_MADE = 'turbo_discovery',
  FRICTION_HIT = 'turbo_friction',
  LOBBY = 'turbo_lobby',
  TASKS = 'turbo_tasks',
  WEARABLE = 'turbo_wearable',
}

const analyticsLabels = new Map<NinjaQuests, string>([
  [NinjaQuests.DISCOVERY_MADE, 'Discovery Made'],
  [NinjaQuests.FRICTION_HIT, 'Friction Hit'],
  [NinjaQuests.LOBBY, 'Lobby'],
  [NinjaQuests.TASKS, 'Tasks'],
  [NinjaQuests.WEARABLE, 'Wearable'],
]);

type ValidPayloads = AreaEnterPayload | AreaExitPayload | DiscoveryMadePayload | FrictionCausedPayload | FrictionHitPayload | QuestCompletedPayload;

// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
class NinjaQuestsManager extends hz.Component<typeof NinjaQuestsManager> {
  start() {

    this.connectLocalBroadcastEvent(TurboDebug.events.onDebugTurboPlayerEvent, (data) => {
      const action = data.action;
      if (action === undefined) { return };
      const player = data.player;
      this.checkQuests(player, action, { player, ...data.eventData } as ValidPayloads);
    });
  }

  private checkQuests(player: hz.Player, action: Action, payload: ValidPayloads) {
    if (!payload) { return; }

    switch (action) {
      case Action.ACHIEVEMENT_UNLOCKED:
        this.sendQuestComplete(player, NinjaQuests.TASKS);
        break;
      case Action.AREA_ENTER:
        const areaData = payload as AreaEnterPayload;
        if (areaData.actionAreaIsLobbySection === true && areaData.actionArea === "Lobby") {
          this.sendQuestComplete(player, NinjaQuests.LOBBY);
        }
        break;
      case Action.DISCOVERY_MADE:
        this.sendQuestComplete(player, NinjaQuests.DISCOVERY_MADE);
        break;
      case Action.FRICTION_HIT:
        this.sendQuestComplete(player, NinjaQuests.FRICTION_HIT);
        break;
      case Action.TASK_START:
        this.sendQuestComplete(player, NinjaQuests.TASKS);
        break;
      case Action.WEARABLE_EQUIP:
        this.sendQuestComplete(player, NinjaQuests.WEARABLE);
        break;
    }
  }

  private sendQuestComplete(player: hz.Player, ninjaQuestId: NinjaQuests) {
    const questKey = ninjaQuestId.toString();
    // Skip if player already logged the quest in Turbo
    if (TurboDataService.getQuestsUnlocked(player).includes(questKey)) { return };

    // HzW Quests
    player.setAchievementComplete(questKey, true);

    // 🚀 Turbo Analytics: Lookup the analytics label for the quest for cleaner Analytics
    const analyticsLabel = analyticsLabels.get(ninjaQuestId);
    Analytics()?.sendQuestCompleted({ player, achievementKey: analyticsLabel } as QuestCompletedPayload, true);

  }
}
hz.Component.register(NinjaQuestsManager);


type RewardsEarnedSeenProps = {
  playerName: string;
  rewardsEarned: number;
};

/* True if the Rewards Type is legit (not left blank/undefined etc.) */
function isLegitRewardsType(x: string | null | undefined): boolean {
  return !!x && x.trim() !== '';
}

// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
class TurboRewardsEarned extends hz.Component<typeof TurboRewardsEarned> {
  static propsDefinition = {
    rewardsType: { type: hz.PropTypes.String },
    rewardsEarned: { type: hz.PropTypes.Number, default: 1 },
    debugDisplay: { type: hz.PropTypes.Entity },
    sfx: { type: hz.PropTypes.Entity },
    trigger: { type: hz.PropTypes.Entity },
  };


  rewardsEarned!: number;
  rewardsType!: string;

  debugDisplay: hz.TextGizmo | undefined;
  sfx: hz.AudioGizmo | undefined;
  trigger: hz.TriggerGizmo | undefined;

  seenPlayers: Map<hz.Player, RewardsEarnedSeenProps> = new Map();

  start() {
    this.rewardsType = isLegitRewardsType(this.props.rewardsType) ? this.props.rewardsType : 'Ninja Coin';
    this.rewardsEarned = this.props.rewardsEarned ?? 1;
    this.debugDisplay = this.props.debugDisplay?.as(hz.TextGizmo);
    this.sfx = this.props.sfx?.as(hz.AudioGizmo);
    this.trigger = this.props.trigger?.as(hz.TriggerGizmo);

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabStart, (_isRightHand: boolean, player: hz.Player) => {
      this.onRewardsEarned(player);
    });

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (exitBy: hz.Player) => {
      this.removePlayer(exitBy);
    });
  }

  onRewardsEarned(player: hz.Player) {
    if (player === this.world.getServerPlayer()) { return };

    playSFX(this.sfx);

    if (!this.seenPlayers.has(player)) {
      this.addPlayer(player);
    } else {
      this.updatePlayerRewards(player);
    }


    this.async.setTimeout(() => Analytics()?.sendRewardsEarned({
      player,
      rewardsType: this.rewardsType,
      rewardsEarned: this.rewardsEarned
    } as RewardsEarnedPayload));

    this.showDebugDisplay(player);

  }

  addPlayer(player: hz.Player) {
    if (!TurboDataService.getRewardsSeenKeys(player).includes(this.rewardsType)) {
      const playerName = getPlayerName(player, this.world);
      this.seenPlayers.set(player, { playerName, rewardsEarned: this.rewardsEarned } as RewardsEarnedSeenProps);
    } else {
      this.updatePlayerRewards(player);
    }
  }

  removePlayer(player: hz.Player) {
    this.seenPlayers.delete(player);
  }

  showDebugDisplay(player: hz.Player): void {
    const keyDisplay = wrapColor(this.rewardsType, HTMLHelpers.MetaLightBlue);

    let playerDisplayLocal = '';
    this.seenPlayers.forEach((seenPlayer) => {
      const rewardsAmount = TurboDataService.getRewardsEarnedByType(player)?.get(this.rewardsType) || this.rewardsEarned;
      const { playerName } = seenPlayer;
      const color = rewardsAmount <= 1 ? HTMLHelpers.Green : HTMLHelpers.MetaLightBlue;
      playerDisplayLocal += wrapColor(playerName + " " + wrapParens(rewardsAmount.toString()), color) + HTMLHelpers.Break;
    });

    if (this.debugDisplay !== undefined) {
      setText(this.debugDisplay, keyDisplay + HTMLHelpers.Break + 'Seen Players: ' + HTMLHelpers.Break + playerDisplayLocal);
    }
  }

  updatePlayerRewards(player: hz.Player) {
    const seenPlayer = this.seenPlayers.get(player);
    if (seenPlayer !== undefined) {
      const currentRewards = seenPlayer.rewardsEarned || 0;
      const rewardsEarned = currentRewards + this.rewardsEarned;
      this.seenPlayers.set(player, { playerName: seenPlayer.playerName, rewardsEarned: rewardsEarned } as RewardsEarnedSeenProps);
    }
  }
}
hz.Component.register(TurboRewardsEarned);
