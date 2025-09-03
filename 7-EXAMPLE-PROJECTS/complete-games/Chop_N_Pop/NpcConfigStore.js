"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.NpcConfigStore = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const Behaviour_1 = require("Behaviour");
const core_1 = require("horizon/core");
class NpcConfigStore extends Behaviour_1.Behaviour {
    constructor() {
        super(...arguments);
        this.npcConfigs = new Map();
    }
    Awake() {
        NpcConfigStore.instance = this;
    }
    addNpcConfig(npcId, npcTuner) {
        this.npcConfigs.set(npcId, npcTuner);
    }
    getNpcConfig(npcId) {
        return this.npcConfigs.get(npcId)?.props;
    }
}
exports.NpcConfigStore = NpcConfigStore;
core_1.Component.register(NpcConfigStore);
