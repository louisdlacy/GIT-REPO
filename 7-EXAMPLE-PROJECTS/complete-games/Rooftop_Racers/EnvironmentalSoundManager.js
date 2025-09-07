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
exports.EnvironmentalSoundManager = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
/**
 * Controls the playing of sounds that are heard by all players throughout the world, based on the game state.
 * Examples include the countdown to race start.
 */
const hz = __importStar(require("horizon/core"));
const GameUtils_1 = require("GameUtils");
const Events_1 = require("Events");
class EnvironmentalSoundManager extends hz.Component {
    static getInstance() {
        return EnvironmentalSoundManager.s_instance;
    }
    constructor() {
        super();
        this.LobbyBGAudio = null;
        this.LobbyReadyUpBGAudio = null;
        this.RaceBGAudio = null;
        this.countdown1VO = null;
        this.countdown2VO = null;
        this.countdown3VO = null;
        this.countdown10VO = null;
        this.matchStartedVO = null;
        this.matchEndedVO = null;
        this.matchEndingVO = null;
        this.BGMAudioOptions = { fade: 2 };
        this.VOAudioOptions = { fade: 0 };
        if (EnvironmentalSoundManager.s_instance === undefined) {
            EnvironmentalSoundManager.s_instance = this;
        }
        else {
            console.error(`There are two ${this.constructor.name} in the world!`);
            return;
        }
    }
    preStart() {
        this.LobbyBGAudio = this.props.LobbyBGAudio?.as(hz.AudioGizmo) ?? null;
        this.LobbyReadyUpBGAudio = this.props.LobbyReadyUpBGAudio?.as(hz.AudioGizmo) ?? null;
        this.RaceBGAudio = this.props.RaceBGAudio?.as(hz.AudioGizmo) ?? null;
        this.countdown10VO = this.props.countdown10VO?.as(hz.AudioGizmo) ?? null;
        this.countdown3VO = this.props.countdown3VO?.as(hz.AudioGizmo) ?? null;
        this.countdown2VO = this.props.countdown2VO?.as(hz.AudioGizmo) ?? null;
        this.countdown1VO = this.props.countdown1VO?.as(hz.AudioGizmo) ?? null;
        this.matchStartedVO = this.props.matchStartedVO?.as(hz.AudioGizmo) ?? null;
        this.matchEndingVO = this.props.matchEndingVO?.as(hz.AudioGizmo) ?? null;
        this.matchEndedVO = this.props.matchEndedVO?.as(hz.AudioGizmo) ?? null;
        this.LobbyBGAudio?.play(this.BGMAudioOptions);
        this.connectLocalBroadcastEvent(Events_1.Events.onGameStateChanged, (data) => {
            if (data.fromState === GameUtils_1.GameState.ReadyForMatch && data.toState === GameUtils_1.GameState.StartingMatch) {
                this.RaceBGAudio?.stop(this.BGMAudioOptions);
                this.LobbyReadyUpBGAudio?.play(this.BGMAudioOptions);
                this.LobbyBGAudio?.stop(this.BGMAudioOptions);
            }
            else if (data.fromState === GameUtils_1.GameState.StartingMatch && data.toState === GameUtils_1.GameState.PlayingMatch) {
                this.RaceBGAudio?.play(this.BGMAudioOptions);
                this.LobbyReadyUpBGAudio?.stop(this.BGMAudioOptions);
                this.LobbyBGAudio?.stop(this.BGMAudioOptions);
                this.matchStartedVO?.play(this.VOAudioOptions);
            }
            else if (data.toState === GameUtils_1.GameState.ReadyForMatch) {
                this.RaceBGAudio?.stop(this.BGMAudioOptions);
                this.LobbyReadyUpBGAudio?.stop(this.BGMAudioOptions);
                this.LobbyBGAudio?.play(this.BGMAudioOptions);
            }
            else if (data.toState === GameUtils_1.GameState.EndingMatch) {
                this.matchEndingVO?.play(this.VOAudioOptions);
            }
            else if (data.toState === GameUtils_1.GameState.CompletedMatch) {
                this.matchEndedVO?.play(this.VOAudioOptions);
            }
        });
        this.connectLocalBroadcastEvent(Events_1.Events.onGameStartTimeLeft, (data) => {
            const timeLeftMS = data.timeLeftMS;
            if (timeLeftMS <= 3500 && timeLeftMS > 2500) {
                this.countdown3VO?.play(this.VOAudioOptions);
            }
            else if (timeLeftMS <= 2500 && timeLeftMS > 1500) {
                this.countdown2VO?.play(this.VOAudioOptions);
            }
            else if (timeLeftMS <= 1500) {
                this.countdown1VO?.play(this.VOAudioOptions);
            }
        });
        this.connectLocalBroadcastEvent(Events_1.Events.onGameEndTimeLeft, (data) => {
            const timeLeftMS = data.timeLeftMS;
            if (timeLeftMS <= 10500 && timeLeftMS > 9500) {
                this.countdown10VO?.play(this.VOAudioOptions);
            }
            else if (timeLeftMS <= 3500 && timeLeftMS > 2500) {
                this.countdown3VO?.play(this.VOAudioOptions);
            }
            else if (timeLeftMS <= 2500 && timeLeftMS > 1500) {
                this.countdown2VO?.play(this.VOAudioOptions);
            }
            else if (timeLeftMS <= 1500) {
                this.countdown1VO?.play(this.VOAudioOptions);
            }
        });
    }
    start() {
    }
}
exports.EnvironmentalSoundManager = EnvironmentalSoundManager;
EnvironmentalSoundManager.propsDefinition = {
    LobbyBGAudio: { type: hz.PropTypes.Entity },
    LobbyReadyUpBGAudio: { type: hz.PropTypes.Entity },
    RaceBGAudio: { type: hz.PropTypes.Entity },
    countdown10VO: { type: hz.PropTypes.Entity },
    countdown3VO: { type: hz.PropTypes.Entity },
    countdown2VO: { type: hz.PropTypes.Entity },
    countdown1VO: { type: hz.PropTypes.Entity },
    matchStartedVO: { type: hz.PropTypes.Entity }, //plays when transiting from StartingMatch to PlayingMatch
    matchEndingVO: { type: hz.PropTypes.Entity }, //plays when transiting from PlayingMatch to EndingMatch (firstPlayer has reached)
    matchEndedVO: { type: hz.PropTypes.Entity }, //plays when transiting from EndingMatch to CompletedMatch
};
hz.Component.register(EnvironmentalSoundManager);
