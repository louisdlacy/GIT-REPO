"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamePlayers = exports.PlayerData = void 0;
exports.loadImageFromTexture = loadImageFromTexture;
const ui_1 = require("horizon/ui");
class PlayerData {
    constructor(player, ammo, hp) {
        this.player = player;
        this.hp = this.initialHp = hp;
        this.ammo = this.initialAmmo = ammo;
        this.hud = null;
        this.isInvincible = false;
    }
    reset() {
        this.hp = this.initialHp;
        this.ammo = this.initialAmmo;
        this.isInvincible = false;
    }
}
exports.PlayerData = PlayerData;
class GamePlayers {
    constructor() {
        this.all = new Map;
        this.inLobby = new Set;
        this.inMatch = new Set;
    }
    get(p) {
        return this.all.get(p);
    }
    addAmmo(p, amount) {
        var playerData = this.get(p);
        if (playerData) {
            playerData.ammo += amount;
        }
    }
    takeDamage(p, amount) {
        var playerData = this.get(p);
        if (playerData && !playerData.isInvincible) {
            playerData.hp -= amount;
            return playerData.hp > 0 ? playerData.hp : 0;
        }
        // Non-existent player, can't take damage
        return 1;
    }
    setInvincible(p, isInvincible) {
        var playerData = this.get(p);
        if (playerData) {
            playerData.isInvincible = isInvincible;
            return isInvincible;
        }
        return false;
    }
    heal(p, amount, max) {
        var playerData = this.get(p);
        if (playerData) {
            playerData.hp = playerData.hp + amount;
            return playerData.hp;
        }
        // Non-existent player, can't heal
        return 0;
    }
    revive(p) {
        var playerData = this.get(p);
        if (playerData) {
            playerData.hp = playerData.initialHp;
        }
    }
    isInLobby(p) {
        return this.inLobby.has(p.id);
    }
    isInMatch(p) {
        return this.inMatch.has(p.id);
    }
    playersInLobby() {
        return this.inLobby.size;
    }
    playersInMatch() {
        return this.inMatch.size;
    }
    playersInWorld() {
        return this.inLobby.size + this.inMatch.size;
    }
    getPlayersInLobby() {
        var playerList = [];
        this.all.forEach(element => {
            if (this.inLobby.has(element.player.id)) {
                playerList.push(element);
            }
        });
        return playerList;
    }
    getPlayersInMatch() {
        var playerList = [];
        this.all.forEach(element => {
            if (this.inMatch.has(element.player.id)) {
                playerList.push(element);
            }
        });
        return playerList;
    }
    moveToLobby(p) {
        if (this.inMatch.has(p.id)) {
            this.inMatch.delete(p.id);
            this.inLobby.add(p.id);
        }
    }
    moveToMatch(p) {
        if (this.inLobby.has(p.id)) {
            this.inLobby.delete(p.id);
            this.inMatch.add(p.id);
        }
    }
    addNewPlayer(p) {
        this.all.set(p.player, p);
        this.inLobby.add(p.player.id);
        return p;
    }
    removePlayer(p) {
        this.inLobby.delete(p.id);
        this.inMatch.delete(p.id);
        this.all.delete(p);
    }
    resetAllPlayers() {
        this.all.forEach(element => {
            element.reset();
        });
    }
}
exports.GamePlayers = GamePlayers;
function loadImageFromTexture(asset, style) {
    return (0, ui_1.Image)({
        source: ui_1.ImageSource.fromTextureAsset(asset),
        style: style,
    });
}
