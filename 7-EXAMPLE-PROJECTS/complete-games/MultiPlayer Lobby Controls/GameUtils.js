"use strict";
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
exports.MatchPlayers = exports.PlayerList = exports.Events = exports.GameState = void 0;
exports.playersEqual = playersEqual;
const hz = __importStar(require("horizon/core"));
var GameState;
(function (GameState) {
    GameState[GameState["Ready"] = 0] = "Ready";
    GameState[GameState["Starting"] = 1] = "Starting";
    GameState[GameState["Playing"] = 2] = "Playing";
    GameState[GameState["Ending"] = 3] = "Ending";
    GameState[GameState["Finished"] = 4] = "Finished";
})(GameState || (exports.GameState = GameState = {}));
;
exports.Events = {
    gameStateChanged: new hz.LocalEvent('gameStateChanged'),
    registerNewMatch: new hz.LocalEvent('registerNewMatch'),
    gameOver: new hz.LocalEvent('gameOver'),
    setGameState: new hz.LocalEvent('setGameState'),
};
function playersEqual(a, b) {
    return a.id == b.id;
}
class PlayerList {
    constructor() {
        this.list = [];
    }
    size() {
        return this.list.length;
    }
    add(p) {
        if (!this.includes(p)) {
            this.list.push(p);
        }
    }
    includes(p) {
        return this.indexOf(p) >= 0;
    }
    indexOf(p) {
        for (let i = 0; i < this.list.length; ++i) {
            if (playersEqual(this.list[i], p)) {
                return i;
            }
        }
        return -1;
    }
    remove(p) {
        const i = this.indexOf(p);
        if (i >= 0) {
            this.list.splice(i, 1);
        }
    }
}
exports.PlayerList = PlayerList;
class MatchPlayers {
    constructor() {
        this.all = new PlayerList();
        this.inLobby = new PlayerList();
        this.inMatch = new PlayerList();
    }
    isInLobby(p) {
        return this.inLobby.includes(p);
    }
    isInMatch(p) {
        return this.inMatch.includes(p);
    }
    playersInLobby() {
        return this.inLobby.size();
    }
    playersInMatch() {
        return this.inMatch.size();
    }
    playersInWorld() {
        return this.all.size();
    }
    getPlayersInLobby() {
        return this.inLobby;
    }
    getPlayersInMatch() {
        return this.inMatch;
    }
    moveToLobby(p) {
        if (!this.all.includes(p)) {
            this.all.add(p);
        }
        if (!this.inLobby.includes(p)) {
            this.inLobby.add(p);
        }
        if (this.inMatch.includes(p)) {
            this.inMatch.remove(p);
        }
    }
    moveToMatch(p) {
        if (!this.all.includes(p)) {
            this.all.add(p);
        }
        if (!this.inMatch.includes(p)) {
            this.inMatch.add(p);
        }
        if (this.inLobby.includes(p)) {
            this.inLobby.remove(p);
        }
    }
    addNewPlayer(p) {
        this.moveToLobby(p);
    }
    removePlayer(p) {
        if (this.all.includes(p)) {
            this.all.remove(p);
        }
        if (this.inLobby.includes(p)) {
            this.inLobby.remove(p);
        }
        if (this.inMatch.includes(p)) {
            this.inMatch.remove(p);
        }
    }
}
exports.MatchPlayers = MatchPlayers;
exports.default = exports.Events;
