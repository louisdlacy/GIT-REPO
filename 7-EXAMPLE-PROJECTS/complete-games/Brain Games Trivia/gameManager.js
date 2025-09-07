"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameManager = exports.GameStatus = void 0;
const Events_1 = require("Events");
const core_1 = require("horizon/core");
exports.GameStatus = "idle";
class gameManager extends core_1.Component {
    constructor() {
        super(...arguments);
        // The map is used as a boolean to track if the player is active (true) or eliminated (false).
        this.players = new Map();
        this.stations = [];
    }
    preStart() {
        gameManager.s_instance = this;
        this.connectLocalBroadcastEvent(Events_1.Events.gameOver, () => {
            this.players.clear();
            this.stations.forEach((station) => {
                // station.clear();
            });
            exports.GameStatus = "idle";
            this.sendLocalBroadcastEvent(Events_1.Events.hideMobileUI, {});
        });
        this.connectCodeBlockEvent(this.entity, core_1.CodeBlockEvents.OnPlayerExitWorld, (player) => {
            this.players.delete(player);
            this.playerElimination(player);
        });
    }
    start() { }
    registerStation(station) {
        this.stations.push(station);
    }
    registerPlayer(player) {
        if (exports.GameStatus === "running" || this.players.has(player)) {
            return;
        }
        this.players.set(player, false); // Register player vote
    }
    startGame(winningCategory) {
        if (exports.GameStatus === "running") {
            return;
        }
        exports.GameStatus = "running";
        let index = 0;
        const mobilePlayers = [];
        this.players.forEach((value, key) => {
            if (key.deviceType.get() !== core_1.PlayerDeviceType.VR) {
                mobilePlayers.push(key);
                this.sendNetworkBroadcastEvent(Events_1.Events.setCameratoViewMode, { player: key, });
            }
            this.stations[index].assignplayer(key);
            this.players.set(key, true);
            index++;
        });
        this.async.setTimeout(() => {
            this.sendLocalBroadcastEvent(Events_1.Events.startGame, { winningCategory, players: this.players });
        }, 5000);
        this.sendLocalBroadcastEvent(Events_1.Events.assignMobilePlayers, { mobilePlayers });
        this.sendLocalBroadcastEvent(Events_1.Events.showOnlyToVR, {});
    }
    playerElimination(player) {
        if (this.players.has(player)) {
            this.players.set(player, false);
        }
        let alivePlayers = 0;
        this.sendLocalBroadcastEvent(Events_1.Events.RemoveMobilePlayer, { player });
        this.players.forEach((isActive) => {
            if (isActive) {
                alivePlayers++;
            }
        });
        if (alivePlayers === 0) {
            this.sendLocalBroadcastEvent(Events_1.Events.allplayersEliminated, {});
            this.world.getPlayers().forEach((player) => {
                this.sendNetworkEvent(player, Events_1.Events.setCameraPlayerview, {});
            });
        }
    }
}
exports.gameManager = gameManager;
gameManager.propsDefinition = {};
core_1.Component.register(gameManager);
