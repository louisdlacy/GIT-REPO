"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoundtrackManager = exports.SountrackOneOffs = exports.SountrackStates = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const Behaviour_1 = require("Behaviour");
const Events_1 = require("Events");
const core_1 = require("horizon/core");
var SountrackStates;
(function (SountrackStates) {
    SountrackStates[SountrackStates["Lobby"] = 0] = "Lobby";
    SountrackStates[SountrackStates["Battle"] = 1] = "Battle";
    SountrackStates[SountrackStates["Boss"] = 2] = "Boss";
    SountrackStates[SountrackStates["End"] = 3] = "End";
})(SountrackStates || (exports.SountrackStates = SountrackStates = {}));
var SountrackOneOffs;
(function (SountrackOneOffs) {
    SountrackOneOffs[SountrackOneOffs["Death"] = 0] = "Death";
})(SountrackOneOffs || (exports.SountrackOneOffs = SountrackOneOffs = {}));
class SoundtrackManager extends Behaviour_1.Behaviour {
    constructor() {
        super(...arguments);
        this.stateTracks = new Map();
        this.oneOffTracks = new Map();
        this.currentTrack = null;
    }
    Start() {
        if (this.props.lobbyMusic) {
            this.stateTracks.set(SountrackStates.Lobby, this.props.lobbyMusic.as(core_1.AudioGizmo));
        }
        if (this.props.battleMusic) {
            this.stateTracks.set(SountrackStates.Battle, this.props.battleMusic.as(core_1.AudioGizmo));
        }
        if (this.props.bossMusic) {
            this.stateTracks.set(SountrackStates.Boss, this.props.bossMusic.as(core_1.AudioGizmo));
        }
        if (this.props.endMusic) {
            this.stateTracks.set(SountrackStates.End, this.props.endMusic.as(core_1.AudioGizmo));
        }
        if (this.props.deathStinger) {
            this.oneOffTracks.set(SountrackOneOffs.Death, this.props.deathStinger.as(core_1.AudioGizmo));
        }
        this.playMusicState(SountrackStates.Lobby);
        this.registerEventListeners();
    }
    registerEventListeners() {
        this.connectNetworkBroadcastEvent(Events_1.WaveManagerNetworkEvents.FightStarted, (data) => {
            this.playMusicState(SountrackStates.Battle);
        });
        this.connectNetworkBroadcastEvent(Events_1.WaveManagerNetworkEvents.StartingWave, (data) => {
            if (data.waveNumber == 3) {
                this.playMusicState(SountrackStates.Boss);
            }
        });
        this.connectNetworkBroadcastEvent(Events_1.WaveManagerNetworkEvents.FightEnded, (data) => {
            this.playMusicState(SountrackStates.End);
            this.async.setTimeout(() => {
                this.playMusicState(SountrackStates.Lobby);
            }, 3500);
        });
        // Player died
        this.connectNetworkBroadcastEvent(Events_1.Events.playerDeath, (data) => {
            this.playOneOff(SountrackOneOffs.Death);
        });
    }
    playMusicState(state) {
        this.currentTrack?.stop();
        if (this.stateTracks.has(state)) {
            const audio = this.stateTracks.get(state);
            if (audio) {
                audio.play();
                this.currentTrack = audio;
            }
        }
    }
    playOneOff(oneOff) {
        if (this.oneOffTracks.has(oneOff)) {
            const audio = this.oneOffTracks.get(oneOff);
            if (audio) {
                audio.play();
            }
        }
    }
}
exports.SoundtrackManager = SoundtrackManager;
SoundtrackManager.propsDefinition = {
    lobbyMusic: { type: core_1.PropTypes.Entity },
    battleMusic: { type: core_1.PropTypes.Entity },
    bossMusic: { type: core_1.PropTypes.Entity },
    endMusic: { type: core_1.PropTypes.Entity },
    deathStinger: { type: core_1.PropTypes.Entity },
};
core_1.Component.register(SoundtrackManager);
