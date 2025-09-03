"use strict";
/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
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
exports.GameState = exports.totalGemsCollected = exports.gems = exports.merchantTakesGem = exports.resetGemCounter = exports.collectGem = exports.moveGemToCourse = exports.setGameState = exports.gameStateChanged = void 0;
/**
  This script manages the basic gameflow and the events that trigger changes to gamestate. The events are defined in
  this file and exported. This file contains listeners for these events, as well as handlers that are triggered when
  the listener receives the specified event.

  As properties of the GameManager class, you specify the 5 gems that are to be found in the world.
 */
const hz = __importStar(require("horizon/core"));
const QuestManager_1 = require("QuestManager");
const Utils_1 = require("Utils");
// $$$ SPO Added to decrementGreenGemCount
// import { refreshScore } from 'EconomyUI';
exports.gameStateChanged = new hz.LocalEvent('gameStateChanged');
exports.setGameState = new hz.LocalEvent('setGameState');
exports.moveGemToCourse = new hz.LocalEvent('moveGemToCourse');
exports.collectGem = new hz.LocalEvent('collectGem');
exports.resetGemCounter = new hz.LocalEvent('resetGemCounter');
// $$$ SPO Added to decrementGreenGemCount
exports.merchantTakesGem = new hz.LocalEvent('merchantTakesGem');
exports.gems = [];
exports.totalGemsCollected = new Map();
class GameManager extends hz.Component {
    constructor() {
        super(...arguments);
        this.totalGemsCollected = exports.totalGemsCollected; //new Map<bigint, hz.Entity>();
        this.totalLifetimeGemsCollected = 0; // tracked for counting toward QuestCollect15TotalGems
    }
    start() {
        this.gameState = GameState.Ready;
        this.setGameState(GameState.Ready);
        let gem1 = this.props.gemOne;
        let gem2 = this.props.gemTwo;
        let gem3 = this.props.gemThree;
        let gem4 = this.props.gemFour;
        let gem5 = this.props.gemFive;
        exports.gems.push(gem1, gem2, gem3, gem4, gem5);
        this.connectLocalBroadcastEvent(exports.setGameState, (data) => {
            this.setGameState(data.state);
        });
        this.connectLocalBroadcastEvent(exports.collectGem, (data) => {
            this.handleGemCollect(data.gem);
            // If gemCount >= 15 then send event to resolve quest for collecting 15 total gems.
            if (!(0, Utils_1.isNPC)(data.collector)) {
                this.totalLifetimeGemsCollected++;
                // $$$ SPO Added:
                // this.sendLocalBroadcastEvent( refreshScore, {  player : data.collector } );
                // console.log("[GameManager] " + data.collector.name.get() + " grabbed a gem! Lifetime total: " + this.totalLifetimeGemsCollected.toString())
                if ((this.totalLifetimeGemsCollected >= 15) && (data.collector.hasCompletedAchievement('QuestCollect15Gems') == false)) {
                    this.sendLocalBroadcastEvent(QuestManager_1.questComplete, { player: data.collector, questName: QuestManager_1.QuestNames.QuestCollect15Gems });
                }
            }
        });
        // If reset gem counter event is reset, then reset gem counts for player (data.collector).
        this.connectLocalBroadcastEvent(exports.resetGemCounter, (data) => {
            // triggered only when all quests are reset.
            this.resetGemCounter(data.collector);
        });
    }
    resetGemCounter(player) {
        this.totalLifetimeGemsCollected = 0;
        // console.log("[" + player.name.get() + "]: Total gems collected reset: 0")
    }
    setGameState(state) {
        if (this.gameState === state) {
            return;
        }
        const initialGameStateValue = this.gameState;
        switch (state) {
            case GameState.Ready:
                if (this.gameState !== GameState.Ready) {
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
                this.updateScoreboard('Game Over?');
                break;
        }
        if (initialGameStateValue !== this.gameState) {
            this.sendLocalBroadcastEvent(exports.gameStateChanged, { state: this.gameState });
        }
    }
    updateScoreboard(text) {
        let sb = this.props.scoreboard;
        sb.as(hz.TextGizmo).text.set(text);
    }
    onGameStateReady() {
        this.totalGemsCollected.clear();
        if (this.props.sfxResetGame) {
            let mySFX = this.props.sfxResetGame.as(hz.AudioGizmo);
            mySFX.play();
        }
        this.updateScoreboard('Ready to Start!');
    }
    handleGemCollect(gem) {
        if (!this.totalGemsCollected.has(gem.id)) {
            this.totalGemsCollected.set(gem.id, gem);
            this.updateScoreboard(`Gems Collected: ${this.totalGemsCollected.size}`);
        }
        if (this.totalGemsCollected.size === exports.gems.length) {
            this.setGameState(GameState.Finished);
        }
    }
    onGameStatePlaying() {
        this.updateScoreboard('Game On!');
        if (this.props.sfxStartGame) {
            let mySFX = this.props.sfxStartGame.as(hz.AudioGizmo);
            mySFX.play();
        }
        exports.gems.forEach((gem) => {
            this.sendLocalEvent(gem, exports.moveGemToCourse, { gem: gem });
        });
    }
}
GameManager.propsDefinition = {
    gemOne: { type: hz.PropTypes.Entity },
    gemTwo: { type: hz.PropTypes.Entity },
    gemThree: { type: hz.PropTypes.Entity },
    gemFour: { type: hz.PropTypes.Entity },
    gemFive: { type: hz.PropTypes.Entity },
    scoreboard: { type: hz.PropTypes.Entity },
    sfxStartGame: { type: hz.PropTypes.Entity },
    sfxResetGame: { type: hz.PropTypes.Entity },
};
hz.Component.register(GameManager);
var GameState;
(function (GameState) {
    GameState[GameState["Ready"] = 0] = "Ready";
    GameState[GameState["Playing"] = 1] = "Playing";
    GameState[GameState["Finished"] = 2] = "Finished";
})(GameState || (exports.GameState = GameState = {}));
;
