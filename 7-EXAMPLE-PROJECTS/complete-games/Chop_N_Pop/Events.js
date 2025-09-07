"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaveManagerNetworkEvents = exports.Events = void 0;
const core_1 = require("horizon/core");
exports.Events = {
    gameReset: new core_1.NetworkEvent('gameReset'),
    // Gun Events
    projectileHit: new core_1.NetworkEvent('projectileHit'),
    playerScoredHit: new core_1.NetworkEvent('playerScoredHit'),
    gunRequestAmmo: new core_1.NetworkEvent('gunRequestAmmo'),
    gunRequestAmmoResponse: new core_1.NetworkEvent('gunRequestAmmoResponse'),
    // Axe events
    axeHit: new core_1.NetworkEvent('axeHit'),
    // Monster Events
    playerHit: new core_1.NetworkEvent('PlayerHit'),
    // Monster Management
    monstersInRange: new core_1.NetworkEvent('monstersInRange'),
    monstersInRangeResponse: new core_1.NetworkEvent('monstersInRangeResponse'),
    // Loot
    lootPickup: new core_1.NetworkEvent('LootPickup'),
    // Player
    playerDeath: new core_1.NetworkEvent('PlayerDeath'),
    registerLocalPlayerController: new core_1.NetworkEvent("registerLocalPlayerController"),
    playerDataUpdate: new core_1.NetworkEvent('playerDataUpdate'),
    playerAmmoUpdate: new core_1.NetworkEvent('playerAmmoUpdate'),
    playerHpUpdate: new core_1.NetworkEvent('playerHpUpdate'),
};
exports.WaveManagerNetworkEvents = {
    StartWaveGroup: new core_1.NetworkEvent('StartWaveGroup'),
    StopWaveGroup: new core_1.NetworkEvent('StopWaveGroup'),
    NextWave: new core_1.NetworkEvent('NextWave'),
    StartingWave: new core_1.NetworkEvent('StartingWave'),
    WaveComplete: new core_1.NetworkEvent('WaveComplete'),
    FightStarted: new core_1.NetworkEvent('FightStarted'),
    FightEnded: new core_1.NetworkEvent('FightEnded'),
};
