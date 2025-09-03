"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateMachine = exports.StateConfigRecord = exports.NextStateEdges = exports.StateCallbackConfig = exports.StateCallbacks = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
var StateCallbacks;
(function (StateCallbacks) {
    StateCallbacks[StateCallbacks["None"] = 0] = "None";
    StateCallbacks[StateCallbacks["OnEnter"] = 1] = "OnEnter";
    StateCallbacks[StateCallbacks["OnUpdate"] = 2] = "OnUpdate";
    StateCallbacks[StateCallbacks["OnExit"] = 3] = "OnExit";
})(StateCallbacks || (exports.StateCallbacks = StateCallbacks = {}));
class StateCallbackConfig {
    constructor(callbackType, callback) {
        this.callbackType = callbackType;
        this.callback = callback;
    }
}
exports.StateCallbackConfig = StateCallbackConfig;
class NextStateEdges {
    constructor(condition, possibleStates = Array(0)) {
        this.condition = condition;
        this.possibleStates = possibleStates;
    }
}
exports.NextStateEdges = NextStateEdges;
class StateConfigRecord {
    constructor(name, callbacks = Array(0), nextStateEdges = Array(0)) {
        this.name = name;
        this.callbacks = callbacks;
        this.nextStateEdges = nextStateEdges;
    }
}
exports.StateConfigRecord = StateConfigRecord;
class State {
    constructor(name, onEnterCallback = function () { }, onUpdateCallback = function (deltaTime) { }, onExitCallback = function () { }, nextStateEdges = Array(0)) {
        this.name = name;
        this.onEnterCallback = onEnterCallback;
        this.onUpdateCallback = onUpdateCallback;
        this.onExitCallback = onExitCallback;
        this.nextStateEdges = nextStateEdges;
    }
}
class StateMachine {
    constructor(stateArray, configArray, enableLogging = false) {
        this.stateMap = new Map();
        stateArray.forEach(stateName => {
            this.stateMap.set(stateName, new State(stateName));
        });
        this.isActive = false;
        this.timer = -1;
        this.isLogging = enableLogging;
        this.config(configArray);
    }
    changeState(stateName) {
        if (this.isLogging)
            console.log("State: ", this.currentState?.name, "->", stateName);
        if (this.currentState?.name == stateName)
            return;
        var nextState = this.stateMap.get(stateName);
        if (nextState != undefined) {
            // Pause while we change state (Good practice, should be single threaded)
            this.isActive = false;
            // Cleanup last state
            if (this.currentState != undefined) {
                this.currentState.onExitCallback();
            }
            // Prime next state
            this.currentState = nextState;
            this.currentState.onEnterCallback();
            // Reset timer
            this.timer = 0;
            // Activate
            this.isActive = true;
        }
        else {
            console.warn("State not found: " + stateName);
        }
    }
    update(deltaTime) {
        // Don't update unecessarily
        if (!this.isActive || this.currentState == undefined) {
            return;
        }
        // Update the timer
        this.timer += deltaTime;
        // Update the current state
        this.currentState.onUpdateCallback(deltaTime);
        // Check for next state conditions
        for (var i = 0; i < this.currentState.nextStateEdges.length; i++) {
            if (this.currentState.nextStateEdges[i].condition()) {
                this.chooseNextState(this.currentState.nextStateEdges[i].possibleStates);
                return;
            }
        }
    }
    config(configArray) {
        configArray.forEach(config => {
            var state = this.stateMap.get(config.name);
            if (state != undefined) {
                config.callbacks.forEach((callbackConfig) => {
                    switch (callbackConfig.callbackType) {
                        case StateCallbacks.OnEnter:
                            state.onEnterCallback = callbackConfig.callback;
                            break;
                        case StateCallbacks.OnUpdate:
                            state.onUpdateCallback = callbackConfig.callback;
                            break;
                        case StateCallbacks.OnExit:
                            state.onExitCallback = callbackConfig.callback;
                            break;
                    }
                });
                state.nextStateEdges = config.nextStateEdges;
            }
        });
    }
    chooseNextState(possibleStates) {
        // Deal with the easy cases
        if (this.currentState == undefined || possibleStates.length == 0) {
            this.currentState = undefined;
            this.isActive = false;
            return;
        }
        else if (possibleStates.length == 1) {
            this.changeState(possibleStates[0][0]);
            return;
        }
        // Calculate the total odds of all the states
        var totalOdds = 0;
        possibleStates.forEach((state) => {
            totalOdds += state[1];
        });
        // Randomly select a state based on the odds
        var totalOdds = Math.random() * totalOdds;
        // Walk up the odds array and find the state that we should transition to
        for (var i = 0; i < possibleStates.length; i++) {
            totalOdds -= possibleStates[i][1];
            if (totalOdds <= 0) {
                this.changeState(possibleStates[i][0]);
                return;
            }
        }
        console.error("Error: Something is very wrong with the state machine");
    }
}
exports.StateMachine = StateMachine;
