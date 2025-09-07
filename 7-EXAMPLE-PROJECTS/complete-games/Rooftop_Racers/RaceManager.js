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
exports.RaceManager = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
/**
 * This manager is responsible for tracking the player progress around the race and the race UI
 */
const hz = __importStar(require("horizon/core"));
const GameUtils_1 = require("GameUtils");
const Events_1 = require("Events");
const MatchManager_1 = require("MatchManager");
class RaceManager extends hz.Component {
    static getInstance() {
        return RaceManager.s_instance;
    }
    constructor() {
        super();
        this.raceUpdateIntervalID = 0;
        this.raceParticipants = new Map();
        this.raceWinners = new Set();
        this.matchTime = 0;
        this.startLineRaceUI = null;
        this.finishLineRaceUI = null;
        this.defaultRaceUIText = "";
        if (RaceManager.s_instance === undefined) {
            RaceManager.s_instance = this;
        }
        else {
            console.error(`There are two ${this.constructor.name} in the world!`);
            return;
        }
    }
    preStart() {
        this.startLineRaceUI = this.props.startLineRaceUI.as(hz.TextGizmo);
        this.finishLineRaceUI = this.props.finishLineRaceUI.as(hz.TextGizmo);
        this.connectLocalBroadcastEvent(Events_1.Events.onPlayerReachedGoal, (data) => {
            this.playerFinishedRace(data.player);
        });
        this.connectLocalBroadcastEvent(Events_1.Events.onPlayerLeftMatch, (data) => {
            this.handleOnPlayerLeftMatch(data.player);
        });
        this.connectLocalBroadcastEvent(Events_1.Events.onGameStateChanged, (data) => {
            if (data.fromState === GameUtils_1.GameState.EndingMatch && data.toState === GameUtils_1.GameState.CompletedMatch) {
                this.handleOnMatchEnd();
            }
            else if (data.fromState === GameUtils_1.GameState.StartingMatch && data.toState === GameUtils_1.GameState.PlayingMatch) {
                this.handleOnMatchStart();
            }
        });
        this.connectLocalBroadcastEvent(hz.World.onUpdate, (data) => {
            //match started
            if (this.raceParticipants.size > 0) {
                this.matchTime += data.deltaTime;
            }
        });
        this.connectNetworkBroadcastEvent(Events_1.Events.onResetWorld, (data) => { this.reset(); });
        this.raceCurve = this.initCurve(this.props.trackPointsParent.children.get());
        this.handleUpdateRaceUI(this.defaultRaceUIText);
        this.reset();
    }
    start() {
        this.sendLocalBroadcastEvent(GameUtils_1.CurveVisualizer.SetCurve, { curve: this.raceCurve });
    }
    handleOnMatchStart() {
        this.handleUpdateRaceUI(this.defaultRaceUIText);
        const distThresholdCheckProgress = 0.5;
        const players = MatchManager_1.MatchManager.getInstance().getPlayersWithStatus(GameUtils_1.PlayerGameStatus.Playing);
        for (let i = 0; i < players.length; i++) {
            this.raceParticipants.set(players[i].id, {
                player: players[i],
                lastKnownRaceTime: 0,
                lastKnownRaceProgress: 0,
                lastKnownPosition: hz.Vec3.zero
            });
        }
        //start to regularly calculate the race progress of the players
        this.raceUpdateIntervalID = this.async.setInterval(() => {
            this.updateAllRacerCurveProgress(distThresholdCheckProgress);
            //sort the players by their progress, descending curve progress order
            const racePositions = Array.from(this.raceParticipants.values()).sort((a, b) => {
                return b.lastKnownRaceProgress - a.lastKnownRaceProgress;
            });
            racePositions.forEach((entry, index) => {
                if (entry.player && !this.raceWinners.has(entry)) {
                    this.sendNetworkEvent(entry.player, Events_1.Events.onRacePosUpdate, {
                        playerPos: (index + 1),
                        totalRacers: this.raceParticipants.size,
                        matchTime: this.matchTime
                    });
                }
            });
        }, 500);
    }
    updateAllRacerCurveProgress(distThresholdCheckProgress) {
        this.raceParticipants.forEach((participant) => {
            const plyr = participant.player;
            if (!plyr || this.raceWinners.has(participant)) {
                return;
            }
            const plyrPos = participant.player.position.get();
            //Player has appreciably moved since last position, update the process
            if (plyrPos.distanceSquared(participant.lastKnownPosition) > distThresholdCheckProgress) {
                participant.lastKnownRaceProgress = this.raceCurve.findClosestPointCurveProgress(plyrPos);
                participant.lastKnownRaceTime = this.matchTime;
                participant.lastKnownPosition = plyrPos;
            }
        });
    }
    handleOnMatchEnd() {
        //Add the missing players to the roll call  as did not finish
        let rollCall = this.getWinnerRollCallString(Array.from(this.raceWinners.keys()));
        const raceParticipants = Array.from(this.raceParticipants.values());
        for (let rp of raceParticipants) {
            if (!this.raceWinners.has(rp)) {
                rollCall += `Did Not Finish\t${rp.player.name.get()}\t[${(0, GameUtils_1.msToMinutesAndSeconds)(rp.lastKnownRaceTime)}]\n`;
            }
        }
        this.handleUpdateRaceUI(rollCall);
        this.reset();
    }
    handleOnPlayerLeftMatch(player) {
        if (player) {
            const rp = this.raceParticipants.get(player.id);
            if (rp) {
                this.raceWinners.delete(rp);
                this.raceParticipants.delete(player.id);
            }
            console.log(`${this.constructor.name} Removed player ${player.name.get()}`);
        }
        else {
            console.warn(`${this.constructor.name} Removed null player`);
        }
    }
    initCurve(chckObjs) {
        let points = [];
        chckObjs.forEach((checkpoint) => {
            points.push(checkpoint.position.get());
        });
        return new GameUtils_1.Curve(points);
    }
    handleUpdateRaceUI(text) {
        this.startLineRaceUI.text.set(text);
        this.finishLineRaceUI.text.set(text);
    }
    playerFinishedRace(player) {
        if (!player) {
            return;
        }
        const rp = this.raceParticipants.get(player.id);
        if (rp && !this.raceWinners.has(rp)) {
            this.sendNetworkEvent(player, Events_1.Events.onStopRacePosUpdates, {});
            this.raceWinners.add(rp);
            rp.lastKnownRaceProgress = 1;
            rp.lastKnownRaceTime = this.matchTime;
            this.handleUpdateRaceUI(this.getWinnerRollCallString(Array.from(this.raceWinners.keys())));
        }
    }
    getWinnerRollCallString(winningPlayers) {
        let rollCall = this.defaultRaceUIText;
        const winString = ["1st: ", "2nd: ", "3rd: ", "4th: ", "5th: ", "6th: ", "7th: ", "8th: "];
        const maxNumOfWinners = Math.min(winString.length, winningPlayers.length);
        for (let i = 0; i < maxNumOfWinners; i++) {
            const rp = winningPlayers[i];
            rollCall += `${winString[i]}\t${rp.player.name.get()}\t[${(0, GameUtils_1.msToMinutesAndSeconds)(rp.lastKnownRaceTime)}]\n`;
        }
        return rollCall;
    }
    reset() {
        console.warn("RACE RESET");
        this.async.clearInterval(this.raceUpdateIntervalID);
        this.raceParticipants.forEach((data) => { this.sendNetworkEvent(data.player, Events_1.Events.onStopRacePosUpdates, {}); });
        this.raceUpdateIntervalID = 0;
        this.raceParticipants.clear();
        this.raceWinners.clear();
        this.matchTime = 0;
    }
    dispose() { this.reset(); }
}
exports.RaceManager = RaceManager;
RaceManager.propsDefinition = {
    startLineRaceUI: { type: hz.PropTypes.Entity },
    finishLineRaceUI: { type: hz.PropTypes.Entity },
    trackPointsParent: { type: hz.PropTypes.Entity },
    curveVisualizer: { type: hz.PropTypes.Entity },
};
hz.Component.register(RaceManager);
