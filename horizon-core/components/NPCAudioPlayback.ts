/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */


/**
  This script manages  playback of voice-over dialog in the world. All voice-over is stored as separate sound entities in the world, each of which
  is listed as a property in the script. These entities are bundled into groups matching gamestate, allowing for randmozied selection of the audio to 
  play when the gamestate is reached.

 */

  import * as hz from 'horizon/core';

export class NPCAudioPlayback extends hz.Component<typeof NPCAudioPlayback> {
  static propsDefinition = {
      VEIntro01: {type: hz.PropTypes.Entity},
      VEWelcome01: {type: hz.PropTypes.Entity},
      VEWelcome02: {type: hz.PropTypes.Entity},
      VEWelcome03: {type: hz.PropTypes.Entity},
      VEThanks01: {type: hz.PropTypes.Entity},
      VEThanks02: {type: hz.PropTypes.Entity},
      VEThanks03: {type: hz.PropTypes.Entity},
      VECollectGem01: {type: hz.PropTypes.Entity},
      VECollectGem02: {type: hz.PropTypes.Entity},
      VECollectGem03: {type: hz.PropTypes.Entity},
      VECollectGem04: {type: hz.PropTypes.Entity},
      VECollectGem05: {type: hz.PropTypes.Entity},
      VEInterference01: {type: hz.PropTypes.Entity},
      VEInterference02: {type: hz.PropTypes.Entity},
      VEInterference03: {type: hz.PropTypes.Entity},
      VEInterference04: {type: hz.PropTypes.Entity},
      // 250110 SPO Added:
      VEStartButton01: {type: hz.PropTypes.Entity},
      VEStartButton02: {type: hz.PropTypes.Entity},
      VEStartButton03: {type: hz.PropTypes.Entity},
      TMWelcomeMoney01: {type: hz.PropTypes.Entity},
      TMWelcomeMoney02: {type: hz.PropTypes.Entity},
      TMWelcomeNoMoney01: {type: hz.PropTypes.Entity},
      TMWelcomeNoMoney02: {type: hz.PropTypes.Entity},
      TMTransactionDone01: {type: hz.PropTypes.Entity},
      TMTransactionDone02: {type: hz.PropTypes.Entity},
      TMReplaceGem01: {type: hz.PropTypes.Entity},
      TMReplaceGem02: {type: hz.PropTypes.Entity},
      TMReplaceGem03: {type: hz.PropTypes.Entity},
      TMResetButton01: {type: hz.PropTypes.Entity},
      TMResetButton02: {type: hz.PropTypes.Entity},
      TMStartButton01: {type: hz.PropTypes.Entity},
      TMStartButton02: {type: hz.PropTypes.Entity},
      // 250110 SPO Added:
      TMAfterReset01: {type: hz.PropTypes.Entity},
      TMAfterReset02: {type: hz.PropTypes.Entity},
      TMAfterReset03: {type: hz.PropTypes.Entity},
  };

  private VEIntro: (hz.AudioGizmo|undefined)[] = [];
  private VEWelcome: (hz.AudioGizmo|undefined)[] = [];
  private VEThanks: (hz.AudioGizmo|undefined)[] = [];
  private VECollectGem: (hz.AudioGizmo|undefined)[] = [];
  private VEInterference: (hz.AudioGizmo|undefined)[] = [];
  // 250110 SPO Added:
  private VEStartButton: (hz.AudioGizmo|undefined)[] = [];

  private TMWelcomeMoney: (hz.AudioGizmo|undefined)[] = [];
  private TMWelcomeNoMoney: (hz.AudioGizmo|undefined)[] = [];
  private TMTransactionDone: (hz.AudioGizmo|undefined)[] = [];
  private TMReplaceGem: (hz.AudioGizmo|undefined)[] = [];
  private TMResetButton: (hz.AudioGizmo|undefined)[] = [];
  private TMStartButton: (hz.AudioGizmo|undefined)[] = [];
  // 250110 SPO Added:
  private TMAfterReset: (hz.AudioGizmo|undefined)[] = [];

  preStart() {
    this.VEIntro = [ this.props.VEIntro01 ].map((e) => e?.as(hz.AudioGizmo));
    this.VEWelcome = [ this.props.VEWelcome01, this.props.VEWelcome02, this.props.VEWelcome03 ].map((e) => e?.as(hz.AudioGizmo));
    this.VEThanks = [ this.props.VEThanks01, this.props.VEThanks02, this.props.VEThanks03 ].map((e) => e?.as(hz.AudioGizmo));
    this.VECollectGem = [ this.props.VECollectGem01, this.props.VECollectGem02, this.props.VECollectGem03, this.props.VECollectGem04, this.props.VECollectGem05].map((e) => e?.as(hz.AudioGizmo));
    this.VEInterference = [ this.props.VEInterference01, this.props.VEInterference02, this.props.VEInterference03, this.props.VEInterference04 ].map((e) => e?.as(hz.AudioGizmo));
   // 250110 SPO Added:
   this.VEStartButton = [ this.props.VEStartButton01, this.props.VEStartButton02, this.props.VEStartButton03 ].map((e) => e?.as(hz.AudioGizmo));

    this.TMWelcomeMoney = [ this.props.TMWelcomeMoney01, this.props.TMWelcomeMoney02 ].map((e) => e?.as(hz.AudioGizmo));
    this.TMWelcomeNoMoney = [ this.props.TMWelcomeNoMoney01, this.props.TMWelcomeNoMoney02 ].map((e) => e?.as(hz.AudioGizmo));
    this.TMTransactionDone = [ this.props.TMTransactionDone01, this.props.TMTransactionDone02 ].map((e) => e?.as(hz.AudioGizmo));
    this.TMReplaceGem = [ this.props.TMReplaceGem01, this.props.TMReplaceGem02, this.props.TMReplaceGem03 ].map((e) => e?.as(hz.AudioGizmo));
    this.TMResetButton = [ this.props.TMResetButton01, this.props.TMResetButton02 ].map((e) => e?.as(hz.AudioGizmo));
    this.TMStartButton = [ this.props.TMStartButton01, this.props.TMStartButton02 ].map((e) => e?.as(hz.AudioGizmo));
   // 250110 SPO Added:
   this.TMAfterReset = [ this.props.TMAfterReset01, this.props.TMAfterReset02, this.props.TMAfterReset03 ].map((e) => e?.as(hz.AudioGizmo));
  }

  start() {
  }
  
  private PlayRandomAudio(from : (hz.AudioGizmo|undefined)[]): void {
    let index: number = Math.floor(Math.random() * from.length);
    from[index]?.play();
  }

  public playVEIntro() { this.PlayRandomAudio(this.VEIntro) ; }
  public playVEWelcome() { this.PlayRandomAudio(this.VEWelcome) ; }
  public playVEThanks() { this.PlayRandomAudio(this.VEThanks) ; }
  public playVECollectGem() { this.PlayRandomAudio(this.VECollectGem) ; }
  public playVEInterference() { this.PlayRandomAudio(this.VEInterference) ; }
   // 250110 SPO Added:
   public playVEStartButton() { this.PlayRandomAudio(this.VEStartButton) ; }
  public playTMWelcomeMoney() { this.PlayRandomAudio(this.TMWelcomeMoney) ; }
  public playTMWelcomeNoMoney() { this.PlayRandomAudio(this.TMWelcomeNoMoney) ; }
  public playTMTransactionDone() { this.PlayRandomAudio(this.TMTransactionDone) ; }
  public playTMReplaceGem() { this.PlayRandomAudio(this.TMReplaceGem) ; }
  public playTMResetButton() { this.PlayRandomAudio(this.TMResetButton) ; }
  public playTMStartButton() { this.PlayRandomAudio(this.TMStartButton) ; }
   // 250110 SPO Added:
   public playTMAfterReset() { this.PlayRandomAudio(this.TMAfterReset) ; }

}
hz.Component.register(NPCAudioPlayback);