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
 * Extended class for new lobby players to join or leave a match
 */
const hz = __importStar(require("horizon/core"));
const Events_1 = require("Events");
const PlayerEventTriggerBase_1 = require("PlayerEventTriggerBase");
class PlayerRegisterMatchTrigger extends PlayerEventTriggerBase_1.PlayerFireEventOnTriggerBase {
    onEntityEnterTrigger(_enteredBy) { }
    onEntityExitTrigger(_exitedBy) { }
    // We do not make the player deregister from standby as we want to reduce trolling from players leaving and entering the zone
    // also encourages more race starts
    onPlayerExitTrigger(exitedBy) {
        this.sendLocalBroadcastEvent(Events_1.Events.onDeregisterPlayerForMatch, { player: exitedBy });
    }
    onPlayerEnterTrigger(enteredBy) {
        this.sendLocalBroadcastEvent(Events_1.Events.onRegisterPlayerForMatch, { player: enteredBy });
    }
}
hz.Component.register(PlayerRegisterMatchTrigger);
