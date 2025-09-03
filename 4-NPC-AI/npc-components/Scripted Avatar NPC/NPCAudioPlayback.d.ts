/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 */
/**
  This script manages  playback of voice-over dialog in the world. All voice-over is stored as separate sound entities in the world, each of which
  is listed as a property in the script. These entities are bundled into groups matching gamestate, allowing for randmozied selection of the audio to
  play when the gamestate is reached.

 */
import * as hz from 'horizon/core';
export declare class NPCAudioPlayback extends hz.Component<typeof NPCAudioPlayback> {
    static propsDefinition: {
        VEIntro01: {
            type: "Entity";
        };
        VEWelcome01: {
            type: "Entity";
        };
        VEWelcome02: {
            type: "Entity";
        };
        VEWelcome03: {
            type: "Entity";
        };
        VEThanks01: {
            type: "Entity";
        };
        VEThanks02: {
            type: "Entity";
        };
        VEThanks03: {
            type: "Entity";
        };
        VECollectGem01: {
            type: "Entity";
        };
        VECollectGem02: {
            type: "Entity";
        };
        VECollectGem03: {
            type: "Entity";
        };
        VECollectGem04: {
            type: "Entity";
        };
        VECollectGem05: {
            type: "Entity";
        };
        VEInterference01: {
            type: "Entity";
        };
        VEInterference02: {
            type: "Entity";
        };
        VEInterference03: {
            type: "Entity";
        };
        VEInterference04: {
            type: "Entity";
        };
        VEStartButton01: {
            type: "Entity";
        };
        VEStartButton02: {
            type: "Entity";
        };
        VEStartButton03: {
            type: "Entity";
        };
        TMWelcomeMoney01: {
            type: "Entity";
        };
        TMWelcomeMoney02: {
            type: "Entity";
        };
        TMWelcomeNoMoney01: {
            type: "Entity";
        };
        TMWelcomeNoMoney02: {
            type: "Entity";
        };
        TMTransactionDone01: {
            type: "Entity";
        };
        TMTransactionDone02: {
            type: "Entity";
        };
        TMReplaceGem01: {
            type: "Entity";
        };
        TMReplaceGem02: {
            type: "Entity";
        };
        TMReplaceGem03: {
            type: "Entity";
        };
        TMResetButton01: {
            type: "Entity";
        };
        TMResetButton02: {
            type: "Entity";
        };
        TMStartButton01: {
            type: "Entity";
        };
        TMStartButton02: {
            type: "Entity";
        };
        TMAfterReset01: {
            type: "Entity";
        };
        TMAfterReset02: {
            type: "Entity";
        };
        TMAfterReset03: {
            type: "Entity";
        };
    };
    private VEIntro;
    private VEWelcome;
    private VEThanks;
    private VECollectGem;
    private VEInterference;
    private VEStartButton;
    private TMWelcomeMoney;
    private TMWelcomeNoMoney;
    private TMTransactionDone;
    private TMReplaceGem;
    private TMResetButton;
    private TMStartButton;
    private TMAfterReset;
    preStart(): void;
    start(): void;
    private PlayRandomAudio;
    playVEIntro(): void;
    playVEWelcome(): void;
    playVEThanks(): void;
    playVECollectGem(): void;
    playVEInterference(): void;
    playVEStartButton(): void;
    playTMWelcomeMoney(): void;
    playTMWelcomeNoMoney(): void;
    playTMTransactionDone(): void;
    playTMReplaceGem(): void;
    playTMResetButton(): void;
    playTMStartButton(): void;
    playTMAfterReset(): void;
}
