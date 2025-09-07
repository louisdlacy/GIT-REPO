"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
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
exports.GameManager = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
/**
 * Controls the overall game state of the world, listening to events occurring and transiting the game state accordingly
 */
const hz = __importStar(require("horizon/core"));
const Events_1 = require("Events");
const GameUtils_1 = require("GameUtils");
const MatchManager_1 = require("MatchManager");
class GameManager extends hz.Component {
    constructor() {
        super();
        this.currentGameState = GameUtils_1.GameState.ReadyForMatch;
        this.startMatchTimerID = 0;
        this.endMatchTimerID = 0;
        this.newMatchTimerID = 0;
        this.startLineGameStateUI = null;
        this.finishLineGameStateUI = null;
        if (GameManager.s_instance === undefined) {
            GameManager.s_instance = this;
        }
        else {
            console.error(`There are two ${this.constructor.name} in the world!`);
            return;
        }
    }
    preStart() {
        this.currentGameState = GameUtils_1.GameState.ReadyForMatch;
        this.startLineGameStateUI = this.props.startLineGameStateUI.as(hz.TextGizmo);
        this.finishLineGameStateUI = this.props.finishLineGameStateUI.as(hz.TextGizmo);
        this.connectLocalBroadcastEvent(Events_1.Events.onPlayerJoinedStandby, () => {
            const totalPlayerStandby = MatchManager_1.MatchManager.getInstance().getPlayersWithStatus(GameUtils_1.PlayerGameStatus.Standby).length;
            if (totalPlayerStandby >= this.props.playersNeededForMatch) {
                this.transitFromReadyToStarting();
            }
        });
        //If players leave the match and are in standby, if there are too little players to start the match, we need to transit to ready
        this.connectLocalBroadcastEvent(Events_1.Events.onPlayerLeftStandby, () => {
            const totalPlayerInStandby = MatchManager_1.MatchManager.getInstance().getPlayersWithStatus(GameUtils_1.PlayerGameStatus.Standby).length;
            if (totalPlayerInStandby < this.props.playersNeededForMatch) {
                if (this.currentGameState === GameUtils_1.GameState.StartingMatch) {
                    this.transitFromStartingToReady();
                }
                else {
                    console.error("invalid state to transition from");
                }
            }
        });
        //handle the case where there the last player leaves the world
        this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitWorld, (player) => {
            if (this.world.getPlayers().length === 0) {
                this.sendNetworkBroadcastEvent(Events_1.Events.onResetWorld, {});
                console.warn("All players left, resetting world");
            }
            this.reset();
        });
        this.connectLocalBroadcastEvent(Events_1.Events.onPlayerReachedGoal, () => {
            this.transitFromPlayingToEnding();
        });
    }
    start() { }
    transitGameState(fromState, toState) {
        if (fromState === toState) {
            console.warn(`Trying to transit to the same state ${GameUtils_1.GameState[fromState]}, skipping`);
            return false;
        }
        else if (fromState !== this.currentGameState) {
            console.warn(`Trying to transit from ${GameUtils_1.GameState[fromState]} when Current state is ${GameUtils_1.GameState[this.currentGameState]} `);
            return false;
        }
        else {
            console.log(`transiting from ${GameUtils_1.GameState[fromState]} to ${GameUtils_1.GameState[toState]}`);
            this.currentGameState = toState;
            this.sendLocalBroadcastEvent(Events_1.Events.onGameStateChanged, { fromState, toState });
            return true;
        }
    }
    transitFromStartingToReady() {
        const transited = this.transitGameState(GameUtils_1.GameState.StartingMatch, GameUtils_1.GameState.ReadyForMatch);
        if (!transited)
            return;
        this.reset();
    }
    transitFromCompletedToReady() {
        const transited = this.transitGameState(GameUtils_1.GameState.CompletedMatch, GameUtils_1.GameState.ReadyForMatch);
        if (!transited)
            return;
        this.reset();
    }
    transitFromReadyToStarting() {
        const transited = this.transitGameState(GameUtils_1.GameState.ReadyForMatch, GameUtils_1.GameState.StartingMatch);
        if (!transited)
            return;
        this.startMatchTimerID = (0, GameUtils_1.timedIntervalActionFunction)(this.props.timeToMatchStartMS, this, (timerMS) => {
            const infoStr = `Match Starting in ${timerMS / 1000}!`;
            this.updateGameStateUI(infoStr);
            this.sendLocalBroadcastEvent(Events_1.Events.onGameStartTimeLeft, { timeLeftMS: timerMS });
            if (timerMS < this.props.minTimeToShowStartPopupsMS) {
                this.world.ui.showPopupForEveryone(infoStr, 1);
            }
        }, this.transitFromStartingToPlaying.bind(this));
    }
    transitFromStartingToPlaying() {
        const transited = this.transitGameState(GameUtils_1.GameState.StartingMatch, GameUtils_1.GameState.PlayingMatch);
        if (!transited)
            return;
        this.updateGameStateUI(`Game On!`);
    }
    transitFromPlayingToEnding() {
        const transited = this.transitGameState(GameUtils_1.GameState.PlayingMatch, GameUtils_1.GameState.EndingMatch);
        if (!transited)
            return;
        this.endMatchTimerID = (0, GameUtils_1.timedIntervalActionFunction)(this.props.timeToMatchEndMS, this, (timerMS) => {
            const infoStr = `Match Ending in ${timerMS / 1000}!`;
            this.updateGameStateUI(infoStr);
            if (timerMS < this.props.minTimeToShowEndPopupsMS) {
                this.world.ui.showPopupForEveryone(infoStr, 1);
            }
            this.sendLocalBroadcastEvent(Events_1.Events.onGameEndTimeLeft, { timeLeftMS: timerMS });
        }, this.transitFromEndingToCompleted.bind(this));
    }
    transitFromEndingToCompleted() {
        const transited = this.transitGameState(GameUtils_1.GameState.EndingMatch, GameUtils_1.GameState.CompletedMatch);
        if (!transited)
            return;
        //now transit from Completed to Ready
        this.newMatchTimerID = (0, GameUtils_1.timedIntervalActionFunction)(this.props.timeNewMatchReadyMS, this, (timerMS) => {
            const infoStr = `New Match Available in  ${timerMS / 1000}!`;
            this.updateGameStateUI(infoStr);
            this.world.ui.showPopupForEveryone(infoStr, this.props.timeNewMatchReadyMS / 1000);
        }, this.transitFromCompletedToReady.bind(this));
    }
    updateGameStateUI(text) {
        this.startLineGameStateUI?.text.set(text);
        this.finishLineGameStateUI?.text.set(text);
    }
    reset() {
        this.currentGameState = GameUtils_1.GameState.ReadyForMatch;
        this.updateGameStateUI('Ready');
        this.async.clearInterval(this.startMatchTimerID);
        this.async.clearInterval(this.endMatchTimerID);
        this.async.clearInterval(this.newMatchTimerID);
    }
    dispose() { this.reset(); }
}
exports.GameManager = GameManager;
GameManager.propsDefinition = {
    startLineGameStateUI: { type: hz.PropTypes.Entity },
    finishLineGameStateUI: { type: hz.PropTypes.Entity },
    timeToMatchStartMS: { type: hz.PropTypes.Number, default: 3000 },
    timeToMatchEndMS: { type: hz.PropTypes.Number, default: 3000 },
    timeNewMatchReadyMS: { type: hz.PropTypes.Number, default: 3000 },
    minTimeToShowStartPopupsMS: { type: hz.PropTypes.Number, default: 3000 },
    minTimeToShowEndPopupsMS: { type: hz.PropTypes.Number, default: 10000 },
    playersNeededForMatch: { type: hz.PropTypes.Number, default: 1 },
};
hz.Component.register(GameManager);
