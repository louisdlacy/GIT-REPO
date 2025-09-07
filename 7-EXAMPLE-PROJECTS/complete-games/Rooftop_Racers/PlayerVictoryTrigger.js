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
 * Extended class for setting Player victory state info
 */
const hz = __importStar(require("horizon/core"));
const Events_1 = require("Events");
const PlayerEventTriggerBase_1 = require("PlayerEventTriggerBase");
class PlayerVictoryTrigger extends PlayerEventTriggerBase_1.PlayerFireEventOnTriggerBase {
    onEntityEnterTrigger(_enteredBy) { }
    onEntityExitTrigger(_exitedBy) { }
    onPlayerExitTrigger(_exitedBy) { }
    onPlayerEnterTrigger(enteredBy) {
        console.warn('Player entered victory trigger', enteredBy.name.get());
        this.sendLocalBroadcastEvent(Events_1.Events.onPlayerReachedGoal, { player: enteredBy });
        if (this.props.particle1 && this.props.particle2) {
            this.props.particle1.as(hz.ParticleGizmo)?.play();
            this.props.particle2.as(hz.ParticleGizmo)?.play();
        }
    }
}
PlayerVictoryTrigger.propsDefinition = {
    particle1: { type: hz.PropTypes.Entity },
    particle2: { type: hz.PropTypes.Entity },
};
hz.Component.register(PlayerVictoryTrigger);
