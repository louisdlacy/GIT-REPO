"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageHand = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const Behaviour_1 = require("Behaviour");
const Events_1 = require("Events");
const core_1 = require("horizon/core");
class CuePosition {
    constructor(entity, position, rotation) {
        this.disabled = false;
        this.entity = entity;
        this.position = position;
        this.rotation = rotation;
    }
}
class StageHand extends Behaviour_1.Behaviour {
    constructor() {
        super(...arguments);
        this.cuePositions = new Map;
    }
    Awake() {
        StageHand.instance = this;
    }
    Start() {
        this.connectNetworkBroadcastEvent(Events_1.Events.gameReset, this.resetToCuePosition.bind(this));
    }
    addCuePosition(entity, position, rotation) {
        if (!this.cuePositions.has(entity.id.toString())) {
            this.cuePositions.set(entity.id.toString(), new CuePosition(entity, position, rotation));
        }
        else {
            this.cuePositions.get(entity.id.toString()).disabled = false;
        }
    }
    disableCueReset(entity) {
        // Manually disable the reset for an entity if we don't want it to reset while on the server
        if (this.cuePositions.has(entity.id.toString())) {
            this.cuePositions.get(entity.id.toString()).disabled = true;
        }
    }
    resetToCuePosition() {
        // Only acts on the server, so if an entity is owned by a client, it will not be reset
        this.cuePositions.forEach((cuePosition) => {
            if (!cuePosition.disabled) {
                cuePosition.entity.position.set(cuePosition.position);
                cuePosition.entity.rotation.set(cuePosition.rotation);
            }
        });
    }
}
exports.StageHand = StageHand;
StageHand.propsDefinition = {};
core_1.Component.register(StageHand);
