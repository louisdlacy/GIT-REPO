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
exports.GameState = exports.collectGem = exports.moveGemToCourse = exports.setGameState = exports.gameStateChanged = void 0;
const hz = __importStar(require("horizon/core"));
exports.gameStateChanged = new hz.LocalEvent('gameStateChanged');
exports.setGameState = new hz.LocalEvent('setGameState');
exports.moveGemToCourse = new hz.LocalEvent('moveGemToCourse');
exports.collectGem = new hz.LocalEvent('collectGem');
class GameManagerExample extends hz.Component {
    constructor() {
        super(...arguments);
        this.gems = [];
        this.totalGemsCollected = new Map();
    }
    start() {
        this.setGameState(GameState.Ready);
        this.connectLocalBroadcastEvent(exports.setGameState, (data) => {
            this.setGameState(data.state);
        });
        this.connectLocalBroadcastEvent(exports.collectGem, (data) => {
            this.handleGemCollect(data.gem);
        });
        const gem1 = this.props.gemOne;
        const gem2 = this.props.gemTwo;
        const gem3 = this.props.gemThree;
        const gem4 = this.props.gemFour;
        const gem5 = this.props.gemFive;
        this.gems.push(gem1, gem2, gem3, gem4, gem5);
    }
    setGameState(state) {
        if (this.gameState === state) {
            return;
        }
        switch (state) {
            case GameState.Ready:
                if (this.gameState !== GameState.Playing) {
                    this.gameState = GameState.Ready;
                    this.onGameStateReady();
                }
                break;
            case GameState.Playing:
                if (this.gameState === GameState.Ready) {
                    this.gameState = GameState.Playing;
                    this.onGameStatePlaying();
                }
                break;
            case GameState.Finished:
                this.gameState = GameState.Finished;
                this.onGameStateFinished();
                break;
        }
        console.log(`new game state is: ${GameState[this.gameState]}`);
        // this.sendLocalBroadcastEvent(gameStateChanged, {state: this.gameState});
    }
    updateScoreboard(text) {
        this.props.scoreboard.as(hz.TextGizmo).text.set(text);
    }
    onGameStateFinished() {
        this.totalGemsCollected.clear();
        this.updateScoreboard('Game Over');
    }
    ;
    onGameStateReady() {
        this.totalGemsCollected.clear();
        this.updateScoreboard('Ready');
    }
    ;
    handleGemCollect(gem) {
        if (!this.totalGemsCollected.has(gem.id)) {
            this.totalGemsCollected.set(gem.id, gem);
            this.updateScoreboard(`Gems Collected: ${this.totalGemsCollected.size}`);
        }
        if (this.totalGemsCollected.size === this.gems.length) {
            this.setGameState(GameState.Finished);
        }
    }
    onGameStatePlaying() {
        this.gems.forEach((gem) => {
            this.sendLocalEvent(gem, exports.moveGemToCourse, {});
        });
        this.updateScoreboard('Game On!');
    }
}
GameManagerExample.propsDefinition = {
    gemOne: { type: hz.PropTypes.Entity },
    gemTwo: { type: hz.PropTypes.Entity },
    gemThree: { type: hz.PropTypes.Entity },
    gemFour: { type: hz.PropTypes.Entity },
    gemFive: { type: hz.PropTypes.Entity },
    scoreboard: { type: hz.PropTypes.Entity },
};
hz.Component.register(GameManagerExample);
var GameState;
(function (GameState) {
    GameState[GameState["Ready"] = 0] = "Ready";
    GameState[GameState["Playing"] = 1] = "Playing";
    GameState[GameState["Finished"] = 2] = "Finished";
})(GameState || (exports.GameState = GameState = {}));
;
