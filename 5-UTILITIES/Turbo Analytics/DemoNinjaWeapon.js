"use strict";
/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * @format
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
const hz = __importStar(require("horizon/core"));
const TurboAnalytics_1 = require("TurboAnalytics");
const DemoNinjaCommon_1 = require("DemoNinjaCommon");
const DEFAULT_COLOR = hz.Color.red;
const COLORS = [hz.Color.red, hz.Color.white, hz.Color.blue, hz.Color.green];
const BATCH_DISCO_NUM_TIMES = 30;
// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
class TurboWeapon extends hz.Component {
    constructor() {
        super(...arguments);
        this.bulletColor = DEFAULT_COLOR;
        this.colorIndex = 0;
        this.shotCounter = 0;
        this.isProjectile = false;
        this.projectileSpeed = 100;
        this.weaponKey = "";
    }
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
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabStart, (isRightHand, player) => {
            this.owner = player;
            (0, TurboAnalytics_1.Analytics)()?.sendWeaponGrab({ player, weaponKey: this.weaponKey, weaponType: 'Ninja Weapon Type', isRightHand });
            this.isRightHand = true;
        });
        // Release Owner and Log Weapon Release (include num times used)
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnGrabEnd, (player) => {
            (0, TurboAnalytics_1.Analytics)()?.sendWeaponRelease({ player, weaponKey: this.weaponKey, weaponType: 'Ninja Weapon Type', isRightHand: this.isRightHand, weaponUsedNumTimes: this.shotCounter });
            this.isRightHand = undefined;
            this.owner = this.world.getServerPlayer();
            this.onChangeOwner();
        });
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnIndexTriggerDown, (player) => this.onFireWeapon(player));
        if (this.isProjectile && this.projectile !== undefined) {
            this.connectCodeBlockEvent(this.projectile, hz.CodeBlockEvents.OnProjectileHitPlayer, (playerHit) => {
                this.onHitPlayer(playerHit);
            });
        }
    }
    onChangeOwner() {
        this.shotCounter = 0;
    }
    getNextColor() {
        if (this.colorIndex >= (COLORS.length - 1)) {
            this.colorIndex = 0;
        }
        else {
            this.colorIndex = Math.max(0, this.colorIndex + 1);
        }
        return COLORS[this.colorIndex];
    }
    onRotateColor() {
        this.bulletColor = this.getNextColor();
        this.projectile?.color.set(this.bulletColor);
    }
    onFireWeapon(player) {
        if (this.isProjectile) {
            (0, DemoNinjaCommon_1.playSFX)(this.fireSFX);
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
    onBatchDisco(player, numShots) {
        (0, DemoNinjaCommon_1.playSFX)(this.discoSFX);
        const turboData = {
            player,
            discoveryItemKey: "Turbo Batch Disco " + this.weaponKey,
            discoveryAmount: numShots,
            discoveryNumTimes: 1,
            discoveryIsImplied: true,
        };
        (0, TurboAnalytics_1.Analytics)()?.sendDiscoveryMade(turboData, true); // NOTE: First time Only
    }
    // Send Hit Player Event
    onHitPlayer(playerHit) {
        if (!playerHit) {
            return;
        }
        ;
        const playerHitName = (0, DemoNinjaCommon_1.getPlayerName)(playerHit, this.world);
        let killerName = "[Killer]";
        const killer = this.owner;
        if (killer !== undefined) {
            killerName = (0, DemoNinjaCommon_1.getPlayerName)(killer, this.world);
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
        this.async.setTimeout(() => (0, TurboAnalytics_1.Analytics)()?.sendDeathByPlayer({
            player: deadPlayer,
            killedByWeaponKey: this.weaponKey, killedByPlayer: killerName
        }), 1000);
        // KO (A bit after x2)
        if (killer === undefined) {
            return;
        }
        this.async.setTimeout(() => (0, TurboAnalytics_1.Analytics)()?.sendKOPlayer({
            player: killer,
            killedByWeaponKey: this.weaponKey,
            otherPlayerKilled: deadPlayerName
        }), 1000 * 2.0);
    }
    updateDisplay() {
        (0, DemoNinjaCommon_1.setText)(this.shotsDisplayTxt, this.shotCounter.toString());
    }
}
TurboWeapon.propsDefinition = {
    projectile: { type: hz.PropTypes.Entity },
    bulletColor: { type: hz.PropTypes.Color, default: DEFAULT_COLOR },
    fireSFX: { type: hz.PropTypes.Entity },
    discoSFX: { type: hz.PropTypes.Entity },
    weaponKey: { type: hz.PropTypes.String },
    shotsDisplayTxt: { type: hz.PropTypes.Entity },
};
hz.Component.register(TurboWeapon);
