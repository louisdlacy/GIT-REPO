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
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
/**
 * Works with gamestate to specifically control the gates to the start of a Match
 */
const GameUtils_1 = require("GameUtils");
const Events_1 = require("Events");
const hz = __importStar(require("horizon/core"));
class ToggleGatesOnGameStateChange extends hz.Component {
    preStart() {
        this.prepareStartAreaForRace();
        this.connectLocalBroadcastEvent(Events_1.Events.onGameStateChanged, (data) => {
            if (data.fromState === GameUtils_1.GameState.StartingMatch && data.toState === GameUtils_1.GameState.PlayingMatch) {
                this.closeStartAreaForMatch();
            }
            else if (data.toState === GameUtils_1.GameState.CompletedMatch || data.toState === GameUtils_1.GameState.ReadyForMatch) {
                this.prepareStartAreaForRace();
            }
        });
    }
    start() { }
    closeStartAreaForMatch() {
        this.setBarrierActive(true, this.props.enterGate1);
        this.setBarrierActive(true, this.props.enterGate2);
        this.setBarrierActive(false, this.props.exitGate1);
        this.setBarrierActive(false, this.props.exitGate2);
    }
    prepareStartAreaForRace() {
        this.setBarrierActive(false, this.props.enterGate1);
        this.setBarrierActive(false, this.props.enterGate2);
        this.setBarrierActive(true, this.props.exitGate1);
        this.setBarrierActive(true, this.props.exitGate2);
    }
    setBarrierActive(isActivated, barrierEntity) {
        barrierEntity?.collidable.set(isActivated);
        //we animated the barrier if it has an animation, otherwise we just show/hide it
        const animEnt = barrierEntity?.as(hz.AnimatedEntity);
        if (animEnt) {
            if (isActivated) {
                animEnt.stop();
            }
            else {
                animEnt.play();
            }
        }
        else {
            barrierEntity?.visible.set(isActivated);
        }
    }
    dispose() { }
}
ToggleGatesOnGameStateChange.propsDefinition = {
    //in the future, when there is an entity array, we can use that, but for now,
    //we hard code all the barriers access and use the parent objects if needed
    enterGate1: { type: hz.PropTypes.Entity },
    enterGate2: { type: hz.PropTypes.Entity },
    exitGate1: { type: hz.PropTypes.Entity },
    exitGate2: { type: hz.PropTypes.Entity },
};
hz.Component.register(ToggleGatesOnGameStateChange);
