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
const GameUtils_1 = require("GameUtils");
const hz = __importStar(require("horizon/core"));
/** This script must be added to a game object in order to run */
class GameManager extends hz.Component {
    constructor() {
        super(...arguments);
        this.gameState = GameUtils_1.GameState.Ready;
        this.timerID = 0;
        this.countdownTimeInMS = 3000;
    }
    /* Using preStart for broadcast listeners helps make sure bindings are in place first */
    preStart() {
        this.connectLocalBroadcastEvent(GameUtils_1.Events.registerNewMatch, (data) => {
            // TODO: update the game state to "Starting"
        });
        this.connectLocalBroadcastEvent(GameUtils_1.Events.gameOver, (data) => {
            // TODO: update the game state to "Ending"
        });
        this.connectLocalBroadcastEvent(GameUtils_1.Events.setGameState, (data) => {
            this.setGameState(data.newState);
        });
    }
    start() {
        this.setGameState(GameUtils_1.GameState.Ready);
    }
    setGameState(state) {
        /* If the new state is the same as the current state, stop. */
        if (this.gameState === state) {
            return;
        }
        const previousState = this.gameState;
        switch (state) {
            case GameUtils_1.GameState.Ready:
                this.gameState = GameUtils_1.GameState.Ready;
                break;
            case GameUtils_1.GameState.Starting:
                if (this.gameState === GameUtils_1.GameState.Ready) {
                    this.gameState = GameUtils_1.GameState.Starting;
                    // TODO: Call the "handleNewMatchStarting" event handler
                }
                break;
            case GameUtils_1.GameState.Playing:
                this.gameState = GameUtils_1.GameState.Playing;
                break;
            case GameUtils_1.GameState.Ending:
                this.gameState = GameUtils_1.GameState.Ending;
                this.handleGameOver();
                break;
            case GameUtils_1.GameState.Finished:
                this.gameState = GameUtils_1.GameState.Finished;
                break;
        }
        this.sendLocalBroadcastEvent(GameUtils_1.Events.gameStateChanged, {
            fromState: previousState,
            toState: this.gameState
        });
    }
    /* Displays a 3 second count down to all players */
    handleNewMatchStarting() {
        this.timerID = this.async.setInterval(() => {
            if (this.countdownTimeInMS > 0) {
                // TODO: show Popup UI message to everyone with remaining time
                this.countdownTimeInMS -= 1000; // decrement the countdown by 1 second
            }
            else {
                if (this.timerID !== 0) {
                    this.async.clearInterval(this.timerID);
                    this.timerID = 0;
                    this.setGameState(GameUtils_1.GameState.Playing);
                    this.countdownTimeInMS = 3000; // reset the initial countdown value
                }
            }
        }, 1000);
    }
    handleGameOver() {
        if (this.timerID === 0) {
            this.world.ui.showPopupForEveryone(`Game Over! \n Teleporting back to Lobby`, 3);
            this.timerID = this.async.setTimeout(() => {
                this.setGameState(GameUtils_1.GameState.Finished);
                this.async.clearTimeout(this.timerID);
                this.timerID = 0;
            }, 3000);
        }
    }
}
GameManager.propsDefinition = {};
hz.Component.register(GameManager);
