/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * @format
 */

// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD

import * as hz from 'horizon/core';
import { TaskEndPayload, TaskStartPayload, TaskStepEndPayload, TaskStepStartPayload } from 'horizon/analytics';
import { HTMLHelpers, playSFX, setText, wrapColor } from 'DemoNinjaCommon';
import { Analytics } from 'TurboAnalytics';

/** TASKS - Turbo Onboarding Demo: Triggers for marking Starts and Ends */
// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
class TurboTaskTrigger extends hz.Component<typeof TurboTaskTrigger> {
  static propsDefinition = {
    // Metadata
    taskKey: { type: hz.PropTypes.String, default: "Task Steps" },
    taskType: { type: hz.PropTypes.String, default: "Ninja Tutorials" },
    step1Key: { type: hz.PropTypes.String, default: "Step A" },
    step2Key: { type: hz.PropTypes.String, default: "Step B" },

    sfxTaskOverallStart: { type: hz.PropTypes.Entity },
    sfxStepStart: { type: hz.PropTypes.Entity },
    sfxStepEnd: { type: hz.PropTypes.Entity },
    sfxTaskOverallEnd: { type: hz.PropTypes.Entity },

    startTaskDisplayTxt: { type: hz.PropTypes.Entity },
    endTaskDisplayText: { type: hz.PropTypes.Entity },

    startTaskTrigger: { type: hz.PropTypes.Entity },
    endTaskTrigger: { type: hz.PropTypes.Entity },

    step1_startTrigger: { type: hz.PropTypes.Entity },
    step1_startDisplayText: { type: hz.PropTypes.Entity },
    step1_endTrigger: { type: hz.PropTypes.Entity },
    step1_endDisplayText: { type: hz.PropTypes.Entity },

    step2_startTrigger: { type: hz.PropTypes.Entity },
    step2_startDisplayText: { type: hz.PropTypes.Entity },
    step2_endTrigger: { type: hz.PropTypes.Entity },
    step2_endDisplayText: { type: hz.PropTypes.Entity }
  }

  startTaskTrigger: hz.TriggerGizmo | undefined;
  endTaskTrigger: hz.TriggerGizmo | undefined;
  step1_startTrigger: hz.TriggerGizmo | undefined;
  step1_endTrigger: hz.TriggerGizmo | undefined;
  step2_startTrigger: hz.TriggerGizmo | undefined;
  step2_endTrigger: hz.TriggerGizmo | undefined;

  sfxStart: hz.AudioGizmo | undefined;
  sfxEnd: hz.AudioGizmo | undefined;
  sfxStepStart: hz.AudioGizmo | undefined;
  sfxStepEnd: hz.AudioGizmo | undefined;

  start() {

    const P = this.props;

    setText(P.startTaskDisplayTxt?.as(hz.TextGizmo), wrapColor("Task Start (Overall): " + P.taskKey + "<br>Type: " + P.taskType + "(Start)", HTMLHelpers.Green));
    setText(P.endTaskDisplayText?.as(hz.TextGizmo), wrapColor("Task End (Overall)", HTMLHelpers.Red));
    setText(P.step1_startDisplayText?.as(hz.TextGizmo), wrapColor("Step 1: Start", HTMLHelpers.MetaLightBlue));
    setText(P.step1_endDisplayText?.as(hz.TextGizmo), wrapColor("Step 1: End", HTMLHelpers.Pink));
    setText(P.step2_startDisplayText?.as(hz.TextGizmo), wrapColor("Step 2: Start", HTMLHelpers.MetaLightBlue));
    setText(P.step2_endDisplayText?.as(hz.TextGizmo), wrapColor("Step 2: End", HTMLHelpers.Pink));

    this.sfxStart = P.sfxTaskOverallStart?.as(hz.AudioGizmo);
    this.sfxStepStart = P.sfxStepStart?.as(hz.AudioGizmo);
    this.sfxEnd = P.sfxTaskOverallEnd?.as(hz.AudioGizmo);
    this.sfxStepEnd = P.sfxStepEnd?.as(hz.AudioGizmo);

    this.startTaskTrigger = P.startTaskTrigger?.as(hz.TriggerGizmo);
    this.step1_startTrigger = P.step1_startTrigger?.as(hz.TriggerGizmo);
    this.step1_endTrigger = P.step1_endTrigger?.as(hz.TriggerGizmo);
    this.step2_startTrigger = P.step2_startTrigger?.as(hz.TriggerGizmo);
    this.step2_endTrigger = P.step2_endTrigger?.as(hz.TriggerGizmo);
    this.endTaskTrigger = P.endTaskTrigger?.as(hz.TriggerGizmo);


    // TASK: START (Overall)
    if (this.startTaskTrigger !== undefined) {
      this.connectCodeBlockEvent(this.startTaskTrigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
        playSFX(this.sfxStart);
        this.startTask(player);
      });
    };

    // TASK: END (Overall)
    if (this.endTaskTrigger !== undefined) {
      this.connectCodeBlockEvent(this.endTaskTrigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
        playSFX(this.sfxEnd);
        this.endTask(player);
      });
    };

    /**
     * Individual Triggers for each Start and End Action per Step (different than area triggers)
     * @remarks Why? Because, it's more likely that you would have unique start and end Actions (e.g. Race, Activity, Puzzle)
     */

    // Step 1
    if (this.step1_startTrigger !== undefined) {
      this.connectCodeBlockEvent(this.step1_startTrigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
        this.startStep(player, P.step1Key);
      });
    }

    if (this.step1_endTrigger !== undefined) {
      this.connectCodeBlockEvent(this.step1_endTrigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
        this.endStep(player, P.step1Key);
      });
    }

    // Step 2
    if (this.step2_startTrigger !== undefined) {
      this.connectCodeBlockEvent(this.step2_startTrigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
        this.startStep(player, P.step2Key);
      });
    }

    if (this.step2_endTrigger !== undefined) {
      this.connectCodeBlockEvent(this.step2_endTrigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player: hz.Player) => {
        this.endStep(player, P.step2Key);
      });
    }

  }

  /** TASK: START (OVERALL)
   * @param player - The player who started the task
   * @param startFirstStep - Whether or not to start the first step concurrently
   * @remarks Ninja Note: Why not always startFirstStep=true?
   * Depending on your goals, you might want to kickoff the overall Task and allow for
   * unknown time between steps, including before the first one
  */
  startTask(player: hz.Player): void {
    Analytics()?.sendTaskStart({
      player,
      taskKey: this.props.taskKey, taskType: this.props.taskType
    } as TaskStartPayload)
  }
  /** TASK END (OVERALL) **/
  endTask(player: hz.Player): void {
    Analytics()?.sendTaskEnd({
      player,
      taskKey: this.props.taskKey, taskType: this.props.taskType
    } as TaskEndPayload)
  }

  /** STEP (Subtask): START **/
  startStep(player: hz.Player, stepKey: string): void {
    playSFX(this.sfxStepStart);
    Analytics()?.sendTaskStepStart({
      player,
      taskKey: this.props.taskKey, taskStepKey: stepKey, taskStepId: 1
    } as TaskStepStartPayload)
  }
  /** STEP (Subtask): END **/
  endStep(player: hz.Player, stepKey: string): void {
    playSFX(this.sfxStepEnd);
    Analytics()?.sendTaskStepEnd({
      player,
      taskKey: this.props.taskKey, taskStepKey: stepKey, taskStepId: 2
    } as TaskStepEndPayload)
  }
}
hz.Component.register(TurboTaskTrigger);
