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
exports.PlayerFireEventOnTriggerBase = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
/**
 * Base class that provides functionality that fires on players and entities entering and/or exiting triggers
 */
const hz = __importStar(require("horizon/core"));
class PlayerFireEventOnTriggerBase extends hz.Component {
    constructor() {
        super(...arguments);
        this.onEntityEnterTriggerEvent = null;
        this.onEntityExitTriggerEvent = null;
        this.onPlayerEnterTriggerEvent = null;
        this.onPlayerExitTriggerEvent = null;
    }
    preStart() {
        this.onEntityEnterTriggerEvent = this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnEntityEnterTrigger, this.onEntityEnterTrigger.bind(this));
        this.onEntityExitTriggerEvent = this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnEntityExitTrigger, this.onEntityExitTrigger.bind(this));
        this.onPlayerEnterTriggerEvent = this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerEnterTrigger, this.onPlayerEnterTrigger.bind(this));
        this.onPlayerExitTriggerEvent = this.connectCodeBlockEvent(this.entity, hz.CodeBlockEvents.OnPlayerExitTrigger, this.onPlayerExitTrigger.bind(this));
    }
    start() { }
    dispose() {
        this.onEntityEnterTriggerEvent?.disconnect();
        this.onEntityEnterTriggerEvent = null;
        this.onEntityExitTriggerEvent?.disconnect();
        this.onEntityExitTriggerEvent = null;
        this.onPlayerEnterTriggerEvent?.disconnect();
        this.onPlayerEnterTriggerEvent = null;
        this.onPlayerExitTriggerEvent?.disconnect();
        this.onPlayerExitTriggerEvent = null;
    }
}
exports.PlayerFireEventOnTriggerBase = PlayerFireEventOnTriggerBase;
