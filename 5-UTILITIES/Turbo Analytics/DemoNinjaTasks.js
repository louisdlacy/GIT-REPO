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
const TurboAnalytics_1 = require("TurboAnalytics");
/** TASKS - Turbo Onboarding Demo: Triggers for marking Starts and Ends */
// TODO (Creator): TURBO DEMO ONLY - DO NOT USE IN YOUR WORLD
class TurboTaskTrigger extends hz.Component {
    start() {
        const P = this.props;
        (0, DemoNinjaCommon_1.setText)(P.startTaskDisplayTxt?.as(hz.TextGizmo), (0, DemoNinjaCommon_1.wrapColor)("Task Start (Overall): " + P.taskKey + "<br>Type: " + P.taskType + "(Start)", DemoNinjaCommon_1.HTMLHelpers.Green));
        (0, DemoNinjaCommon_1.setText)(P.endTaskDisplayText?.as(hz.TextGizmo), (0, DemoNinjaCommon_1.wrapColor)("Task End (Overall)", DemoNinjaCommon_1.HTMLHelpers.Red));
        (0, DemoNinjaCommon_1.setText)(P.step1_startDisplayText?.as(hz.TextGizmo), (0, DemoNinjaCommon_1.wrapColor)("Step 1: Start", DemoNinjaCommon_1.HTMLHelpers.MetaLightBlue));
        (0, DemoNinjaCommon_1.setText)(P.step1_endDisplayText?.as(hz.TextGizmo), (0, DemoNinjaCommon_1.wrapColor)("Step 1: End", DemoNinjaCommon_1.HTMLHelpers.Pink));
        (0, DemoNinjaCommon_1.setText)(P.step2_startDisplayText?.as(hz.TextGizmo), (0, DemoNinjaCommon_1.wrapColor)("Step 2: Start", DemoNinjaCommon_1.HTMLHelpers.MetaLightBlue));
        (0, DemoNinjaCommon_1.setText)(P.step2_endDisplayText?.as(hz.TextGizmo), (0, DemoNinjaCommon_1.wrapColor)("Step 2: End", DemoNinjaCommon_1.HTMLHelpers.Pink));
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
            this.connectCodeBlockEvent(this.startTaskTrigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
                (0, DemoNinjaCommon_1.playSFX)(this.sfxStart);
                this.startTask(player);
            });
        }
        ;
        // TASK: END (Overall)
        if (this.endTaskTrigger !== undefined) {
            this.connectCodeBlockEvent(this.endTaskTrigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
                (0, DemoNinjaCommon_1.playSFX)(this.sfxEnd);
                this.endTask(player);
            });
        }
        ;
        /**
         * Individual Triggers for each Start and End Action per Step (different than area triggers)
         * @remarks Why? Because, it's more likely that you would have unique start and end Actions (e.g. Race, Activity, Puzzle)
         */
        // Step 1
        if (this.step1_startTrigger !== undefined) {
            this.connectCodeBlockEvent(this.step1_startTrigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
                this.startStep(player, P.step1Key);
            });
        }
        if (this.step1_endTrigger !== undefined) {
            this.connectCodeBlockEvent(this.step1_endTrigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
                this.endStep(player, P.step1Key);
            });
        }
        // Step 2
        if (this.step2_startTrigger !== undefined) {
            this.connectCodeBlockEvent(this.step2_startTrigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
                this.startStep(player, P.step2Key);
            });
        }
        if (this.step2_endTrigger !== undefined) {
            this.connectCodeBlockEvent(this.step2_endTrigger, hz.CodeBlockEvents.OnPlayerEnterTrigger, (player) => {
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
    startTask(player) {
        (0, TurboAnalytics_1.Analytics)()?.sendTaskStart({
            player,
            taskKey: this.props.taskKey, taskType: this.props.taskType
        });
    }
    /** TASK END (OVERALL) **/
    endTask(player) {
        (0, TurboAnalytics_1.Analytics)()?.sendTaskEnd({
            player,
            taskKey: this.props.taskKey, taskType: this.props.taskType
        });
    }
    /** STEP (Subtask): START **/
    startStep(player, stepKey) {
        (0, DemoNinjaCommon_1.playSFX)(this.sfxStepStart);
        (0, TurboAnalytics_1.Analytics)()?.sendTaskStepStart({
            player,
            taskKey: this.props.taskKey, taskStepKey: stepKey, taskStepId: 1
        });
    }
    /** STEP (Subtask): END **/
    endStep(player, stepKey) {
        (0, DemoNinjaCommon_1.playSFX)(this.sfxStepEnd);
        (0, TurboAnalytics_1.Analytics)()?.sendTaskStepEnd({
            player,
            taskKey: this.props.taskKey, taskStepKey: stepKey, taskStepId: 2
        });
    }
}
TurboTaskTrigger.propsDefinition = {
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
};
hz.Component.register(TurboTaskTrigger);
