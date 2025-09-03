"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerManager = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const Behaviour_1 = require("Behaviour");
const Events_1 = require("Events");
const GameUtils_1 = require("GameUtils");
const core_1 = require("horizon/core");
// This script must be added to a game object in order to run
class PlayerManager extends Behaviour_1.Behaviour {
    constructor() {
        super(...arguments);
        // We can use our helpful Utils class to easily manage players
        this.gamePlayers = new GameUtils_1.GamePlayers();
    }
    // Using preStart for broadcast listeners helps make sure bindings are in place first
    Awake() {
        PlayerManager.instance = this;
        // Player join and leave
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerEnterWorld, this.handleOnPlayerEnterWorld.bind(this));
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitWorld, this.handleOnPlayerExitWorld.bind(this));
        // Player actions
        this.connectNetworkBroadcastEvent(Events_1.Events.lootPickup, this.handleLootPickup.bind(this));
        // Gun management
        this.connectNetworkEvent(this.entity, Events_1.Events.gunRequestAmmo, (data) => {
            var pData = this.gamePlayers.get(data.player);
            var availableAmmo = 0;
            if (pData) {
                var availableAmmo = Math.min(data.ammoCount, pData.ammo);
                pData.ammo -= availableAmmo;
                // Update HUD on reload
                this.updatePlayerHUD(pData);
            }
            this.sendNetworkEvent(data.weapon, Events_1.Events.gunRequestAmmoResponse, { ammoCount: availableAmmo });
        });
    }
    Start() {
        this.hudPool = Behaviour_1.BehaviourFinder.GetBehaviour(this.props.hudPool);
    }
    hitPlayer(player, damage, damageOrigin) {
        if (player.deviceType.get() != 'VR') {
            var damageVector = player.position.get().sub(damageOrigin).normalize();
            player.applyForce(damageVector.mul(this.props.knockbackForceOnHit));
        }
        var playerHp = this.gamePlayers.takeDamage(player, damage);
        console.log('ARGHH, hit!!!');
        if (playerHp <= 0) {
            // Set invincibility to prevent damage while in respawn
            this.gamePlayers.setInvincible(player, true);
            this.async.setTimeout(() => {
                this.gamePlayers.setInvincible(player, false);
            }, this.props.respawnInvincibibilityMs);
            // Send player death event
            this.sendNetworkBroadcastEvent(Events_1.Events.playerDeath, { player: player });
            this.movePlayerFromMatchToLobby(player);
            this.gamePlayers.revive(player);
        }
        var playerData = this.gamePlayers.get(player);
        if (playerData) {
            this.updatePlayerHUD(playerData);
        }
    }
    // When a player enters the world, add that player and an initial player status to our Player Map
    handleOnPlayerEnterWorld(player) {
        // Handle double join messages
        if (!this.gamePlayers.get(player)) {
            const pData = this.gamePlayers.addNewPlayer(new GameUtils_1.PlayerData(player, this.props.playerStartAmmo, this.props.playerMaxHp));
            pData.hud = this.hudPool?.allocate(player.position.get(), player.rotation.get(), player);
            this.updatePlayerHUD(pData);
        }
        else {
            console.warn("PlayerManager: Player already joined world");
        }
    }
    // When a player leaves the world, Remove that player from the PlayerMap.
    handleOnPlayerExitWorld(player) {
        const pData = this.gamePlayers.get(player);
        this.hudPool?.free(pData?.hud);
        this.gamePlayers.removePlayer(player);
    }
    resetAllPlayers() {
        this.moveAllMatchPlayersToLobby();
        this.gamePlayers.resetAllPlayers();
        this.resetAllPlayersHUD();
    }
    moveAllMatchPlayersToLobby() {
        const gamePlayers = this.gamePlayers.getPlayersInMatch();
        gamePlayers.forEach((p) => {
            this.movePlayerFromMatchToLobby(p.player);
        });
    }
    movePlayerFromMatchToLobby(player) {
        this.props.lobbySpawnPoint?.as(core_1.SpawnPointGizmo)?.teleportPlayer(player);
        this.gamePlayers.moveToLobby(player);
    }
    resetAllPlayersHUD() {
        this.gamePlayers.all.forEach((p) => {
            this.updatePlayerHUD(p);
        });
    }
    updatePlayerHUD(p) {
        this.sendNetworkEvent(p.player, Events_1.Events.playerDataUpdate, { ammo: p.ammo, hp: p.hp });
    }
    handleLootPickup(data) {
        var playerData = this.gamePlayers.get(data.player);
        if (playerData) {
            if (data.loot === 'Ammo') {
                this.gamePlayers.addAmmo(data.player, this.props.ammoPerBox);
            }
            else if (data.loot === 'Potion') {
                this.gamePlayers.heal(data.player, this.props.healthPerPotion, this.props.playerMaxHp);
            }
            this.updatePlayerHUD(playerData);
        }
    }
}
exports.PlayerManager = PlayerManager;
PlayerManager.propsDefinition = {
    matchSpawnPoint: { type: core_1.PropTypes.Entity },
    lobbySpawnPoint: { type: core_1.PropTypes.Entity },
    playerMaxHp: { type: core_1.PropTypes.Number, default: 100 },
    respawnInvincibibilityMs: { type: core_1.PropTypes.Number, default: 3000 },
    playerStartAmmo: { type: core_1.PropTypes.Number, default: 10 },
    ammoPerBox: { type: core_1.PropTypes.Number, default: 10 },
    healthPerPotion: { type: core_1.PropTypes.Number, default: 1 },
    knockbackForceOnHit: { type: core_1.PropTypes.Number, default: 0 },
    hitScream: { type: core_1.PropTypes.Entity },
    hudPool: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(PlayerManager);
