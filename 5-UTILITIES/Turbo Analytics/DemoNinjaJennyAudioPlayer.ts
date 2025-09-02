/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * @format
 */

// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD

import * as hz from 'horizon/core';
import { HTMLHelpers, exists, getStringWithBreaks, playSFX, setPosAndRot, setText, stopSFX, wrapColor, wrapParens } from 'DemoNinjaCommon';

const PLAY_HTML_COLOR = HTMLHelpers.Green;
const OFF_HTML_COLOR = HTMLHelpers.Gray;

function cycleNext(value: number, max: number, min = 0): number {
  if (value < min) {
    return min;
  }
  return value >= max ? min : (value + 1);
}
function cyclePrevious(value: number, max: number, min = 0): number {
  if (value > max) {
    return max;
  }
  return value <= min ? max : (value - 1);
}

// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
class NinjaMusicPlayer extends hz.Component<typeof NinjaMusicPlayer> {
  static propsDefinition = {
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

  playing: boolean = false;

  audioSFXs = new Array<hz.AudioGizmo>();
  audioTitles = new Array<string>();
  currentAudioIndex: number = 0;
  currentAudio!: hz.AudioGizmo;
  ogRemoteControlPosition!: hz.Vec3;
  ogRemoteControlRotation!: hz.Quaternion;

  grabController!: hz.Entity | undefined;
  sfxAudio1: hz.AudioGizmo | undefined;
  sfxAudio2: hz.AudioGizmo | undefined;
  sfxAudio3: hz.AudioGizmo | undefined;
  sfxAudio4: hz.AudioGizmo | undefined;
  sfxAudio5: hz.AudioGizmo | undefined;
  sfxAudio6: hz.AudioGizmo | undefined;
  sfxAudio7: hz.AudioGizmo | undefined;
  sfxAudio8: hz.AudioGizmo | undefined;
  sfxAudio9: hz.AudioGizmo | undefined;
  sfxAudio10: hz.AudioGizmo | undefined;

  songTitleTxtObj!: hz.TextGizmo;

  cacheProps() {

    this.audioTitles = new Array<string>();
    this.currentAudioIndex = 0;
    this.currentAudio = this.props.sfxAudio1 as hz.AudioGizmo;
    this.songTitleTxtObj = this.props.songTitleTxtObj as hz.TextGizmo;

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

    this.audioSFXs = new Array<hz.AudioGizmo>();

    // Initial + Fallback
    if (exists(this.sfxAudio1)) {
      this.currentAudio = this.addAudio(this.props.sfxAudio1 as hz.AudioGizmo);
    } else {
      this.currentAudio = this.addAudio(this.props.sfxConstantAudio as hz.AudioGizmo)
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
  subscribeRemoteControlEvents(controller: hz.Entity): void {

  }

  start() {
    this.cacheProps();

    setText(this.songTitleTxtObj, getStringWithBreaks(
      wrapColor("Turbo Rocket Fuel Audio Tour", HTMLHelpers.Pink),
      wrapColor("w/ @JennyRockets", HTMLHelpers.Pink),
      "",
      wrapColor("Grab to Start!", HTMLHelpers.Green)));


    this.grabController = this.props.grabController?.as(hz.Entity);
    if (this.grabController !== undefined) {
      this.connectCodeBlockEvent(this.grabController, hz.CodeBlockEvents.OnGrabStart, (_rightHand: boolean, _player: hz.Player) => {
        if (!this.playing) {
          this.playCurrent();
        }
      });

      // Toggle Play/Stop
      this.connectCodeBlockEvent(this.grabController, hz.CodeBlockEvents.OnIndexTriggerDown, (_player: hz.Player) => {
        this.playing ? this.stopCurrent() : this.playCurrent();
      });

      // Return Controller
      this.connectCodeBlockEvent(this.grabController, hz.CodeBlockEvents.OnGrabEnd, (_player: hz.Player) => {
        this.resetGrabbableController(this.grabController as hz.Entity);
      });

      // Previous
      this.connectCodeBlockEvent(this.grabController, hz.CodeBlockEvents.OnButton1Down, (_player: hz.Player) => {
        this.playPrevious();
      });

      // Next
      this.connectCodeBlockEvent(this.grabController, hz.CodeBlockEvents.OnButton2Down, (_player: hz.Player) => {
        this.playNext();
      });

      this.ogRemoteControlPosition = this.grabController.position.get();
      this.ogRemoteControlRotation = this.grabController.rotation.get();

    }

    this.props.playOnStart && (
      this.async.setTimeout(() => {
        this.playCurrent();
      }, 500)
    )
  }

  addAudio(sfx: hz.AudioGizmo): hz.AudioGizmo {
    this.audioSFXs.push(sfx);
    const title = sfx.name.get().toString();
    this.audioTitles.push(title);

    // Register Autoplay Send Audio Complete Signals
    if (this.props.autoPlay) {
      this.connectCodeBlockEvent(sfx, hz.CodeBlockEvents.OnAudioCompleted, () => this.playNext());
    }
    return sfx;
  }

  getCurrentAudio(): hz.AudioGizmo {
    return this.currentAudio as hz.AudioGizmo;
  }

  setCurrentAudio(): hz.AudioGizmo {
    this.currentAudio = this.audioSFXs[this.currentAudioIndex] as hz.AudioGizmo;
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
    playSFX(this.currentAudio as hz.AudioGizmo);
    this.playing = true;
    this.updateDisplay();
  }

  getCurrentAudioName(): string {
    const currentAudio = this.getCurrentAudio();
    if (exists(currentAudio)) {
      return this.currentAudio.name.get();
    }
    return "";
  }

  stopCurrent(updateDisplay = true) {
    stopSFX(this.currentAudio);
    this.playing = false;
    updateDisplay && this.updateDisplay();
  }

  resetGrabbableController(remoteControl: hz.Entity, returnSeconds: number = 5) {
    if (exists(remoteControl)) {
      this.async.setTimeout(() => {
        setPosAndRot(remoteControl, this.ogRemoteControlPosition, this.ogRemoteControlRotation)
      }, returnSeconds * 1000.0);
    }
  }

  updateDisplay() {
    let displayText = HTMLHelpers.AlignCenter;
    displayText += wrapColor("Rocket Fuel Audio Tour", HTMLHelpers.Pink);
    displayText += HTMLHelpers.Break;
    displayText += wrapColor("w/ @JennyRockets", HTMLHelpers.Pink);
    displayText += HTMLHelpers.Break;

    if (this.audioSFXs.length > 0) {
      displayText += HTMLHelpers.Break + wrapColor(this.getCurrentAudioName(), this.playing ? PLAY_HTML_COLOR : OFF_HTML_COLOR);
      displayText += HTMLHelpers.Break + wrapParens((this.currentAudioIndex + 1).toString() + "/" + this.audioSFXs.length);
    }
    if (this.songTitleTxtObj != null) {
      setText(this.songTitleTxtObj, displayText);
    }
  }

  updateTitle(displayText: string) {
    setText(this.songTitleTxtObj, displayText);
  }

}
hz.Component.register(NinjaMusicPlayer)
