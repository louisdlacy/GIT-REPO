"use strict";
/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * @format
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
// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
const hz = __importStar(require("horizon/core"));
const DemoNinjaCommon_1 = require("DemoNinjaCommon");
const PLAY_HTML_COLOR = DemoNinjaCommon_1.HTMLHelpers.Green;
const OFF_HTML_COLOR = DemoNinjaCommon_1.HTMLHelpers.Gray;
function cycleNext(value, max, min = 0) {
    if (value < min) {
        return min;
    }
    return value >= max ? min : (value + 1);
}
function cyclePrevious(value, max, min = 0) {
    if (value > max) {
        return max;
    }
    return value <= min ? max : (value - 1);
}
// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
class NinjaMusicPlayer extends hz.Component {
    constructor() {
        super(...arguments);
        this.playing = false;
        this.audioSFXs = new Array();
        this.audioTitles = new Array();
        this.currentAudioIndex = 0;
    }
    cacheProps() {
        this.audioTitles = new Array();
        this.currentAudioIndex = 0;
        this.currentAudio = this.props.sfxAudio1;
        this.songTitleTxtObj = this.props.songTitleTxtObj;
        this.sfxAudio1 = this.props.sfxAudio1?.as(hz.AudioGizmo);
        this.sfxAudio2 = this.props.sfxAudio2?.as(hz.AudioGizmo);
        this.sfxAudio3 = this.props.sfxAudio3?.as(hz.AudioGizmo);
        this.sfxAudio4 = this.props.sfxAudio4?.as(hz.AudioGizmo);
        this.sfxAudio5 = this.props.sfxAudio5?.as(hz.AudioGizmo);
        this.sfxAudio6 = this.props.sfxAudio6?.as(hz.AudioGizmo);
        this.sfxAudio7 = this.props.sfxAudio7?.as(hz.AudioGizmo);
        this.sfxAudio8 = this.props.sfxAudio8?.as(hz.AudioGizmo);
        this.sfxAudio9 = this.props.sfxAudio9?.as(hz.AudioGizmo);
        this.sfxAudio10 = this.props.sfxAudio10?.as(hz.AudioGizmo);
        this.audioSFXs = new Array();
        // Initial + Fallback
        if ((0, DemoNinjaCommon_1.exists)(this.sfxAudio1)) {
            this.currentAudio = this.addAudio(this.props.sfxAudio1);
        }
        else {
            this.currentAudio = this.addAudio(this.props.sfxConstantAudio);
        }
        this.sfxAudio2 && this.addAudio(this.sfxAudio2);
        this.sfxAudio3 && this.addAudio(this.sfxAudio3);
        this.sfxAudio4 && this.addAudio(this.sfxAudio4);
        this.sfxAudio5 && this.addAudio(this.sfxAudio5);
        this.sfxAudio6 && this.addAudio(this.sfxAudio6);
        this.sfxAudio7 && this.addAudio(this.sfxAudio7);
        this.sfxAudio8 && this.addAudio(this.sfxAudio8);
        this.sfxAudio9 && this.addAudio(this.sfxAudio9);
        this.sfxAudio10 && this.addAudio(this.sfxAudio10);
    }
    subscribeToEvents() {
    }
    /** Remote Control Events - Presumes one is mapped */
    subscribeRemoteControlEvents(controller) {
    }
    start() {
        this.cacheProps();
        (0, DemoNinjaCommon_1.setText)(this.songTitleTxtObj, (0, DemoNinjaCommon_1.getStringWithBreaks)((0, DemoNinjaCommon_1.wrapColor)("Turbo Rocket Fuel Audio Tour", DemoNinjaCommon_1.HTMLHelpers.Pink), (0, DemoNinjaCommon_1.wrapColor)("w/ @JennyRockets", DemoNinjaCommon_1.HTMLHelpers.Pink), "", (0, DemoNinjaCommon_1.wrapColor)("Grab to Start!", DemoNinjaCommon_1.HTMLHelpers.Green)));
        this.grabController = this.props.grabController?.as(hz.Entity);
        if (this.grabController !== undefined) {
            this.connectCodeBlockEvent(this.grabController, hz.CodeBlockEvents.OnGrabStart, (_rightHand, _player) => {
                if (!this.playing) {
                    this.playCurrent();
                }
            });
            // Toggle Play/Stop
            this.connectCodeBlockEvent(this.grabController, hz.CodeBlockEvents.OnIndexTriggerDown, (_player) => {
                this.playing ? this.stopCurrent() : this.playCurrent();
            });
            // Return Controller
            this.connectCodeBlockEvent(this.grabController, hz.CodeBlockEvents.OnGrabEnd, (_player) => {
                this.resetGrabbableController(this.grabController);
            });
            // Previous
            this.connectCodeBlockEvent(this.grabController, hz.CodeBlockEvents.OnButton1Down, (_player) => {
                this.playPrevious();
            });
            // Next
            this.connectCodeBlockEvent(this.grabController, hz.CodeBlockEvents.OnButton2Down, (_player) => {
                this.playNext();
            });
            this.ogRemoteControlPosition = this.grabController.position.get();
            this.ogRemoteControlRotation = this.grabController.rotation.get();
        }
        this.props.playOnStart && (this.async.setTimeout(() => {
            this.playCurrent();
        }, 500));
    }
    addAudio(sfx) {
        this.audioSFXs.push(sfx);
        const title = sfx.name.get().toString();
        this.audioTitles.push(title);
        // Register Autoplay Send Audio Complete Signals
        if (this.props.autoPlay) {
            this.connectCodeBlockEvent(sfx, hz.CodeBlockEvents.OnAudioCompleted, () => this.playNext());
        }
        return sfx;
    }
    getCurrentAudio() {
        return this.currentAudio;
    }
    setCurrentAudio() {
        this.currentAudio = this.audioSFXs[this.currentAudioIndex];
        return this.currentAudio;
    }
    playNext(updateDisplay = true) {
        this.stopCurrent();
        const tmpPrev = this.currentAudioIndex;
        this.currentAudioIndex = cycleNext(tmpPrev, this.audioSFXs.length - 1);
        this.setCurrentAudio();
        this.playCurrent();
        updateDisplay && this.updateDisplay();
    }
    playPrevious() {
        this.stopCurrent();
        this.currentAudioIndex = cyclePrevious(this.currentAudioIndex, this.audioSFXs.length - 1);
        this.setCurrentAudio();
        this.playCurrent();
        this.updateDisplay();
    }
    playCurrent() {
        (0, DemoNinjaCommon_1.playSFX)(this.currentAudio);
        this.playing = true;
        this.updateDisplay();
    }
    getCurrentAudioName() {
        const currentAudio = this.getCurrentAudio();
        if ((0, DemoNinjaCommon_1.exists)(currentAudio)) {
            return this.currentAudio.name.get();
        }
        return "";
    }
    stopCurrent(updateDisplay = true) {
        (0, DemoNinjaCommon_1.stopSFX)(this.currentAudio);
        this.playing = false;
        updateDisplay && this.updateDisplay();
    }
    resetGrabbableController(remoteControl, returnSeconds = 5) {
        if ((0, DemoNinjaCommon_1.exists)(remoteControl)) {
            this.async.setTimeout(() => {
                (0, DemoNinjaCommon_1.setPosAndRot)(remoteControl, this.ogRemoteControlPosition, this.ogRemoteControlRotation);
            }, returnSeconds * 1000.0);
        }
    }
    updateDisplay() {
        let displayText = DemoNinjaCommon_1.HTMLHelpers.AlignCenter;
        displayText += (0, DemoNinjaCommon_1.wrapColor)("Rocket Fuel Audio Tour", DemoNinjaCommon_1.HTMLHelpers.Pink);
        displayText += DemoNinjaCommon_1.HTMLHelpers.Break;
        displayText += (0, DemoNinjaCommon_1.wrapColor)("w/ @JennyRockets", DemoNinjaCommon_1.HTMLHelpers.Pink);
        displayText += DemoNinjaCommon_1.HTMLHelpers.Break;
        if (this.audioSFXs.length > 0) {
            displayText += DemoNinjaCommon_1.HTMLHelpers.Break + (0, DemoNinjaCommon_1.wrapColor)(this.getCurrentAudioName(), this.playing ? PLAY_HTML_COLOR : OFF_HTML_COLOR);
            displayText += DemoNinjaCommon_1.HTMLHelpers.Break + (0, DemoNinjaCommon_1.wrapParens)((this.currentAudioIndex + 1).toString() + "/" + this.audioSFXs.length);
        }
        if (this.songTitleTxtObj != null) {
            (0, DemoNinjaCommon_1.setText)(this.songTitleTxtObj, displayText);
        }
    }
    updateTitle(displayText) {
        (0, DemoNinjaCommon_1.setText)(this.songTitleTxtObj, displayText);
    }
}
NinjaMusicPlayer.propsDefinition = {
    playOnStart: { type: hz.PropTypes.Boolean, default: true },
    autoPlay: { type: hz.PropTypes.Boolean, default: true },
    currentTitle: { type: hz.PropTypes.String, default: "(None)" },
    grabController: { type: hz.PropTypes.Entity },
    songTitleTxtObj: { type: hz.PropTypes.Entity },
    sfxConstantAudio: { type: hz.PropTypes.Entity },
    sfxAudio1: { type: hz.PropTypes.Entity },
    sfxAudio2: { type: hz.PropTypes.Entity },
    sfxAudio3: { type: hz.PropTypes.Entity },
    sfxAudio4: { type: hz.PropTypes.Entity },
    sfxAudio5: { type: hz.PropTypes.Entity },
    sfxAudio6: { type: hz.PropTypes.Entity },
    sfxAudio7: { type: hz.PropTypes.Entity },
    sfxAudio8: { type: hz.PropTypes.Entity },
    sfxAudio9: { type: hz.PropTypes.Entity },
    sfxAudio10: { type: hz.PropTypes.Entity },
};
hz.Component.register(NinjaMusicPlayer);
