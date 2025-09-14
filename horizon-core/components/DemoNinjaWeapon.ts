/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * @format
 */

// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD

import * as hz from 'horizon/core';
import { DiscoveryMadePayload, WeaponReleasePayload } from 'horizon/analytics'
import { Analytics } from 'TurboAnalytics';
import { getPlayerName, playSFX, setText } from 'DemoNinjaCommon';

const DEFAULT_COLOR = hz.Color.red;
const COLORS = [hz.Color.red, hz.Color.white, hz.Color.blue, hz.Color.green];
const BATCH_DISCO_NUM_TIMES = 30;

// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
class TurboWeapon extends hz.Component<typeof TurboWeapon> {
  static propsDefinition = {
    projectile: { type: hz.PropTypes.Entity },
    bulletColor: { type: hz.PropTypes.Color, default: DEFAULT_COLOR },
    fireSFX: { type: hz.PropTypes.Entity },
    discoSFX: { type: hz.PropTypes.Entity },
    weaponKey: { type: hz.PropTypes.String },
    shotsDisplayTxt: { type: hz.PropTypes.Entity },
  };

  bulletColor: hz.Color = DEFAULT_COLOR;
  colorIndex = 0;
  shotCounter = 0;
  isProjectile: boolean = false;
  projectileSpeed: number = 100;
  projectile: hz.ProjectileLauncherGizmo | undefined;
  weaponKey: string = "";

  owner: hz.Player | undefined;
  discoSFX: hz.AudioGizmo | undefined;
  isRightHand?: boolean | undefined;
  fireSFX: hz.AudioGizmo | undefined;
  shotsDisplayTxt: hz.TextGizmo | undefined;

  start() {

    // Cache Props
    this.weaponKey = this.props.weaponKey ?? "UNKNOWN";
    this.bulletColor = this.props.bulletColor ?? DEFAULT_COLOR;
    this.projectile = this.props.projectile?.as(hz.ProjectileLauncherGizmo);
    if (this.projectile !== undefined) {
      this.isProjectile = true;
    }

    this.discoSFX = this.props.discoSFX?.as(hz.AudioGizmo);

    if (this.props.fireSFX != null) {
      const maybeFireSFX = this.props.fireSFX.as(hz.AudioGizmo);
      if (maybeFireSFX != null) {
        this.fireSFX = maybeFireSFX;
      }
    }

    this.shotsDisplayTxt = this.props.shotsDisplayTxt?.as(hz.TextGizmo);

    // Set Owner and log Grab
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabStart, (isRightHand, player: hz.Player) => {
      this.owner = player;
      Analytics()?.sendWeaponGrab({ player, weaponKey: this.weaponKey, weaponType: 'Ninja Weapon Type', isRightHand })
      this.isRightHand = true;
    });

    // Release Owner and Log Weapon Release (include num times used)
    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabEnd, (player: hz.Player) => {
      Analytics()?.sendWeaponRelease({ player, weaponKey: this.weaponKey, weaponType: 'Ninja Weapon Type', isRightHand: this.isRightHand, weaponUsedNumTimes: this.shotCounter } as WeaponReleasePayload);
      this.isRightHand = undefined;
      this.owner = this.world.getServerPlayer();
      this.onChangeOwner();
    });

    this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnIndexTriggerDown, (player) => this.onFireWeapon(player));

    if (this.isProjectile && this.projectile !== undefined) {
      this.connectCodeBlockEvent(this.projectile, hz.CodeBlockEvents.OnProjectileHitPlayer, (playerHit: hz.Player) => {
        this.onHitPlayer(playerHit);
      });
    }

  }

  onChangeOwner() {
    this.shotCounter = 0;
  }

  getNextColor(): hz.Color {
    if (this.colorIndex >= (COLORS.length - 1)) {
      this.colorIndex = 0;
    } else {
      this.colorIndex = Math.max(0, this.colorIndex + 1);
    }
    return COLORS[this.colorIndex];
  }

  onRotateColor() {
    this.bulletColor = this.getNextColor();
    this.projectile?.color.set(this.bulletColor);
  }

  onFireWeapon(player: hz.Player) {
    if (this.isProjectile) {
      playSFX(this.fireSFX);
      const launchOptions = {
        speed: this.projectileSpeed ?? 100,
        ignorePlayers: false,
        ignoreObjects: false,
      };
      this.projectile?.launch(launchOptions);
      this.onRotateColor();
    }
    this.shotCounter++;
    // Bulk Discovery Made - Num Shots
    if (this.shotCounter >= BATCH_DISCO_NUM_TIMES) {
      const snapCounter = this.shotCounter;
      this.shotCounter = 0; // Important to avoid runaway calls
      this.onBatchDisco(player, snapCounter);
    }
    this.updateDisplay();
  }

  // Send Batch Discovery Made Event (every N Shots)
  onBatchDisco(player: hz.Player, numShots: number) {
    playSFX(this.discoSFX);
    const turboData: DiscoveryMadePayload = {
      player,
      discoveryItemKey: "Turbo Batch Disco " + this.weaponKey,
      discoveryAmount: numShots,
      discoveryNumTimes: 1,
      discoveryIsImplied: true,
    };
    Analytics()?.sendDiscoveryMade(turboData, true); // NOTE: First time Only
  }

  // Send Hit Player Event
  onHitPlayer(playerHit: hz.Player) {
    if (!playerHit) {
      return;
    };
    const playerHitName = getPlayerName(playerHit, this.world);

    let killerName = "[Killer]";
    const killer = this.owner;
    if (killer !== undefined) {
      killerName = getPlayerName(killer, this.world);
    }

    let deadPlayerName = "[Dead Player]";
    let deadPlayer = playerHit;
    if (deadPlayer !== undefined) {
      deadPlayerName = playerHitName;
    }

    if (deadPlayerName === killerName) {
      killerName = "Evil " + killerName; // The Evil You did it obviously...
    }

    // Death (A bit after)
    this.async.setTimeout(
      () => Analytics()?.sendDeathByPlayer({
        player: deadPlayer,
        killedByWeaponKey: this.weaponKey, killedByPlayer: killerName
      }), 1000)

    // KO (A bit after x2)
    if (killer === undefined) {
      return;
    }
    this.async.setTimeout(() => Analytics()?.sendKOPlayer({
      player: killer,
      killedByWeaponKey: this.weaponKey,
      otherPlayerKilled: deadPlayerName
    }), 1000 * 2.0);

  }


  updateDisplay() {
    setText(this.shotsDisplayTxt, this.shotCounter.toString());
  }

}
hz.Component.register(TurboWeapon);
