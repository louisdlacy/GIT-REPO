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
exports.NPCAudioPlayback = void 0;
/**
  This script manages  playback of voice-over dialog in the world. All voice-over is stored as separate sound entities in the world, each of which
  is listed as a property in the script. These entities are bundled into groups matching gamestate, allowing for randmozied selection of the audio to
  play when the gamestate is reached.

 */
const hz = __importStar(require("horizon/core"));
class NPCAudioPlayback extends hz.Component {
    constructor() {
        super(...arguments);
        this.VEIntro = [];
        this.VEWelcome = [];
        this.VEThanks = [];
        this.VECollectGem = [];
        this.VEInterference = [];
        // 250110 SPO Added:
        this.VEStartButton = [];
        this.TMWelcomeMoney = [];
        this.TMWelcomeNoMoney = [];
        this.TMTransactionDone = [];
        this.TMReplaceGem = [];
        this.TMResetButton = [];
        this.TMStartButton = [];
        // 250110 SPO Added:
        this.TMAfterReset = [];
    }
    preStart() {
        this.VEIntro = [this.props.VEIntro01].map((e) => e?.as(hz.AudioGizmo));
        this.VEWelcome = [this.props.VEWelcome01, this.props.VEWelcome02, this.props.VEWelcome03].map((e) => e?.as(hz.AudioGizmo));
        this.VEThanks = [this.props.VEThanks01, this.props.VEThanks02, this.props.VEThanks03].map((e) => e?.as(hz.AudioGizmo));
        this.VECollectGem = [this.props.VECollectGem01, this.props.VECollectGem02, this.props.VECollectGem03, this.props.VECollectGem04, this.props.VECollectGem05].map((e) => e?.as(hz.AudioGizmo));
        this.VEInterference = [this.props.VEInterference01, this.props.VEInterference02, this.props.VEInterference03, this.props.VEInterference04].map((e) => e?.as(hz.AudioGizmo));
        // 250110 SPO Added:
        this.VEStartButton = [this.props.VEStartButton01, this.props.VEStartButton02, this.props.VEStartButton03].map((e) => e?.as(hz.AudioGizmo));
        this.TMWelcomeMoney = [this.props.TMWelcomeMoney01, this.props.TMWelcomeMoney02].map((e) => e?.as(hz.AudioGizmo));
        this.TMWelcomeNoMoney = [this.props.TMWelcomeNoMoney01, this.props.TMWelcomeNoMoney02].map((e) => e?.as(hz.AudioGizmo));
        this.TMTransactionDone = [this.props.TMTransactionDone01, this.props.TMTransactionDone02].map((e) => e?.as(hz.AudioGizmo));
        this.TMReplaceGem = [this.props.TMReplaceGem01, this.props.TMReplaceGem02, this.props.TMReplaceGem03].map((e) => e?.as(hz.AudioGizmo));
        this.TMResetButton = [this.props.TMResetButton01, this.props.TMResetButton02].map((e) => e?.as(hz.AudioGizmo));
        this.TMStartButton = [this.props.TMStartButton01, this.props.TMStartButton02].map((e) => e?.as(hz.AudioGizmo));
        // 250110 SPO Added:
        this.TMAfterReset = [this.props.TMAfterReset01, this.props.TMAfterReset02, this.props.TMAfterReset03].map((e) => e?.as(hz.AudioGizmo));
    }
    start() {
    }
    PlayRandomAudio(from) {
        let index = Math.floor(Math.random() * from.length);
        from[index]?.play();
    }
    playVEIntro() { this.PlayRandomAudio(this.VEIntro); }
    playVEWelcome() { this.PlayRandomAudio(this.VEWelcome); }
    playVEThanks() { this.PlayRandomAudio(this.VEThanks); }
    playVECollectGem() { this.PlayRandomAudio(this.VECollectGem); }
    playVEInterference() { this.PlayRandomAudio(this.VEInterference); }
    // 250110 SPO Added:
    playVEStartButton() { this.PlayRandomAudio(this.VEStartButton); }
    playTMWelcomeMoney() { this.PlayRandomAudio(this.TMWelcomeMoney); }
    playTMWelcomeNoMoney() { this.PlayRandomAudio(this.TMWelcomeNoMoney); }
    playTMTransactionDone() { this.PlayRandomAudio(this.TMTransactionDone); }
    playTMReplaceGem() { this.PlayRandomAudio(this.TMReplaceGem); }
    playTMResetButton() { this.PlayRandomAudio(this.TMResetButton); }
    playTMStartButton() { this.PlayRandomAudio(this.TMStartButton); }
    // 250110 SPO Added:
    playTMAfterReset() { this.PlayRandomAudio(this.TMAfterReset); }
}
exports.NPCAudioPlayback = NPCAudioPlayback;
NPCAudioPlayback.propsDefinition = {
    VEIntro01: { type: hz.PropTypes.Entity },
    VEWelcome01: { type: hz.PropTypes.Entity },
    VEWelcome02: { type: hz.PropTypes.Entity },
    VEWelcome03: { type: hz.PropTypes.Entity },
    VEThanks01: { type: hz.PropTypes.Entity },
    VEThanks02: { type: hz.PropTypes.Entity },
    VEThanks03: { type: hz.PropTypes.Entity },
    VECollectGem01: { type: hz.PropTypes.Entity },
    VECollectGem02: { type: hz.PropTypes.Entity },
    VECollectGem03: { type: hz.PropTypes.Entity },
    VECollectGem04: { type: hz.PropTypes.Entity },
    VECollectGem05: { type: hz.PropTypes.Entity },
    VEInterference01: { type: hz.PropTypes.Entity },
    VEInterference02: { type: hz.PropTypes.Entity },
    VEInterference03: { type: hz.PropTypes.Entity },
    VEInterference04: { type: hz.PropTypes.Entity },
    // 250110 SPO Added:
    VEStartButton01: { type: hz.PropTypes.Entity },
    VEStartButton02: { type: hz.PropTypes.Entity },
    VEStartButton03: { type: hz.PropTypes.Entity },
    TMWelcomeMoney01: { type: hz.PropTypes.Entity },
    TMWelcomeMoney02: { type: hz.PropTypes.Entity },
    TMWelcomeNoMoney01: { type: hz.PropTypes.Entity },
    TMWelcomeNoMoney02: { type: hz.PropTypes.Entity },
    TMTransactionDone01: { type: hz.PropTypes.Entity },
    TMTransactionDone02: { type: hz.PropTypes.Entity },
    TMReplaceGem01: { type: hz.PropTypes.Entity },
    TMReplaceGem02: { type: hz.PropTypes.Entity },
    TMReplaceGem03: { type: hz.PropTypes.Entity },
    TMResetButton01: { type: hz.PropTypes.Entity },
    TMResetButton02: { type: hz.PropTypes.Entity },
    TMStartButton01: { type: hz.PropTypes.Entity },
    TMStartButton02: { type: hz.PropTypes.Entity },
    // 250110 SPO Added:
    TMAfterReset01: { type: hz.PropTypes.Entity },
    TMAfterReset02: { type: hz.PropTypes.Entity },
    TMAfterReset03: { type: hz.PropTypes.Entity },
};
hz.Component.register(NPCAudioPlayback);
