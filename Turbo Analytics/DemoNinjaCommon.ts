/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * @format
 */


// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD

import * as hz from 'horizon/core';
import { RoundStartPayload, AreaEnterPayload, RoundEndPayload } from 'horizon/analytics';
import { Analytics, TURBO_DEBUG } from 'TurboAnalytics';
import { exists, getStringWithBreaks, getTimeString, HTMLHelpers, setText, wrapColor } from 'DebugTurbo';
export { HTMLHelpers, exists, getPlayerName, getStringWithBreaks, getTimerDisplay, getTimeString, setText, wrapColor, wrapParens } from 'DebugTurbo';

export function setPos(obj: hz.Entity | undefined, pos: hz.Vec3) {
  if (exists(obj)) {
    obj?.position.set(pos);
  }
}

export function setPosAndRot(obj: hz.Entity | undefined, pos: hz.Vec3, rot: hz.Quaternion) {
  if (exists(obj)) {
    obj?.position.set(pos);
    obj?.rotation.set(rot);
  }
}

export function respawnPlayer(spawnPoint: hz.SpawnPointGizmo | undefined, player: hz.Player) {
  spawnPoint?.as(hz.SpawnPointGizmo)?.teleportPlayer(player);
}

export function playSFX(sfx: hz.AudioGizmo | undefined) {
  sfx?.as(hz.AudioGizmo)?.play();
}

export function stopSFX(sfx: hz.AudioGizmo | undefined) {
  sfx?.as(hz.AudioGizmo)?.stop();
}

/** Demo: RoundStart Trigger
 * @remarks TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
 */
class RoundStartTrigger extends hz.Component<typeof RoundStartTrigger> {
  static propsDefinition = {
    destSpawnPoint: { type: hz.PropTypes.Entity },
    sfx: { type: hz.PropTypes.Entity },
  };

  sfx: hz.AudioGizmo | undefined;
  destSpawnPoint!: hz.SpawnPointGizmo | undefined;

  start() {

    this.sfx = this.props.sfx?.as(hz.AudioGizmo);
    this.destSpawnPoint = this.props.destSpawnPoint?.as(hz.SpawnPointGizmo);

    // Warning! Game Round Starts should only be sent once per Round via a Round Manager since it sends action for each player
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
      this.onRoundStart(player);
    });
  }


  // TODO (Creator) - See below for important note about Round-based experiences and Turbo Areas
  onRoundStart(player: hz.Player) {
    const players = this.world.getPlayers();
    respawnPlayer(this.destSpawnPoint, player);

    /** Players currently in an Area marked as Lobby won't be considered in the round.  Make sure to use the isRound to help with this.
    * Respawns can also sometimes happen before the Area Trigger is registered.
    * ensure your ordering is correct.  For example, you may want to send AreaEnter for each player into a Active Round Area before sending the RoundStart

    players.forEach((player, index) => {
      this.async.setTimeout(() => {
        Analytics()?.sendAreaEnter({ player, actionArea: "Game Area", actionAreaIsLobbySection: false, actionAreaIsPlayerReadyZone: false, turboState: ParticipationEnum.IN_ROUND } as AreaEnterPayload);
      }, index * 50);
    });

    **/

    Analytics()?.sendAllRoundStart(players, {} as RoundStartPayload);
    playSFX(this.sfx);

  }
}
hz.Component.register(RoundStartTrigger);


/** Demo: RoundStart Trigger
 * @remarks TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
 */
class RoundEndTrigger extends hz.Component<typeof RoundEndTrigger> {
  static propsDefinition = {
    sfx: { type: hz.PropTypes.Entity },
  };

  sfx: hz.AudioGizmo | undefined;

  start() {
    this.sfx = this.props.sfx?.as(hz.AudioGizmo);

    // Warning! Game Round Ends should only be sent once per Round via a Round Manager since it sends action for each player
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, (_player: hz.Player) => {
      this.onRoundEnd();
    });
  };

  onRoundEnd() {
    const players = this.world.getPlayers();
    Analytics()?.sendAllRoundEnd(players, {} as RoundEndPayload);
    playSFX(this.sfx);
  };

}
hz.Component.register(RoundEndTrigger);


/** Demo: Simple World Timer Display on a Text Object
 * @remarks TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
 */
class WorldTimer extends hz.Component<typeof WorldTimer> {
  static propsDefinition = {
    txtObject: { type: hz.PropTypes.Entity },
  };

  txtObject: hz.TextGizmo | undefined;
  totalSeconds = 0.0;

  start() {
    if (!TURBO_DEBUG) { return };
    this.totalSeconds = 0.0;

    this.txtObject = this.props.txtObject?.as(hz.TextGizmo);

    // Subscribe to the World Update Event
    this.connectLocalBroadcastEvent(hz.World.onUpdate, (data) => {
      this.updateSeconds(data.deltaTime);
    });

    // Update UI every second (instead of per frame)
    this.async.setInterval(() => {
      this.updateDisplay();
    }, 1000
    );
  }

  updateDisplay() {
    setText(this.txtObject, getTimeString(this.totalSeconds));
  }

  updateSeconds(deltaTime: number) {
    this.totalSeconds += deltaTime;
  }
}
hz.Component.register(WorldTimer);

/** Demo: Release Notes
 * @remarks TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
 */
class DemoTurboReleaseNotes extends hz.Component<typeof DemoTurboReleaseNotes> {
  static propsDefinition = {
    txtWhatsNew: { type: hz.PropTypes.Entity },
    txtCoreLibrary: { type: hz.PropTypes.Entity },
    txtOnboarding: { type: hz.PropTypes.Entity },
    txtTesting: { type: hz.PropTypes.Entity },
  };
  start() {

    const WHATS_NEW = getStringWithBreaks(
      HTMLHelpers.AlignLeft,
      wrapColor(
        "<size=200%>What's New in V22? (Highlights)</size>", HTMLHelpers.Pink),
      "* Turbo API launched as horizon/analytics!",
      "* Refactored, simplified, and optimized Modules"
    );
    const CORE_API = getStringWithBreaks(
      HTMLHelpers.AlignLeft,
      wrapColor("<size=200%>Turbo Modules: Core API</size>", HTMLHelpers.MetaLightBlue),
      "* Strongly typed payloads and simplified events",
      "* TurboDataService for realtime events queries"
    );
    const TESTING = getStringWithBreaks(
      HTMLHelpers.AlignLeft,
      wrapColor("<size=200%>Turbo Modules: Testing and Quality</size>", HTMLHelpers.MetaLightBlue),
      "* Turbo API is covered by 100's of integration tests",
    );
    const ONBOARDING = getStringWithBreaks(
      HTMLHelpers.AlignLeft,
      wrapColor("<size=200%>Turbo Onboarding Experience</size>", HTMLHelpers.MetaLightBlue),
      "* Changed up the music and the art",
      "* Did you find the secret elevator?",
    );

    setText(this.props.txtWhatsNew?.as(hz.Entity), WHATS_NEW);
    setText(this.props.txtCoreLibrary?.as(hz.Entity), CORE_API);
    setText(this.props.txtTesting?.as(hz.Entity), TESTING);
    setText(this.props.txtOnboarding?.as(hz.Entity), ONBOARDING);
  }
}
hz.Component.register(DemoTurboReleaseNotes);
