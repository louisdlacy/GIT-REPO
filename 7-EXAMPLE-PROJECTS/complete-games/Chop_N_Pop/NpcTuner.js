"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.NpcTuner = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const Behaviour_1 = require("Behaviour");
const core_1 = require("horizon/core");
const NpcConfigStore_1 = require("NpcConfigStore");
class NpcTuner extends Behaviour_1.Behaviour {
    Start() {
        NpcConfigStore_1.NpcConfigStore.instance.addNpcConfig(this.props.npcType, this);
    }
}
exports.NpcTuner = NpcTuner;
NpcTuner.propsDefinition = {
    // General
    npcType: { type: core_1.PropTypes.String, default: "default" },
    // Movement
    maxVisionDistance: { type: core_1.PropTypes.Number, default: 7 },
    walkSpeed: { type: core_1.PropTypes.Number, default: 1.0 },
    runSpeed: { type: core_1.PropTypes.Number, default: 0.0 },
    // Attack
    maxAttackDistance: { type: core_1.PropTypes.Number, default: 5 },
    maxAttachReach: { type: core_1.PropTypes.Number, default: 5 },
    attackLandDelay: { type: core_1.PropTypes.Number, default: 1000 },
    minAttackDamage: { type: core_1.PropTypes.Number, default: 1 },
    maxAttackDamage: { type: core_1.PropTypes.Number, default: 1 },
    attacksPerSecond: { type: core_1.PropTypes.Number, default: 1 },
    // HP & Damage
    minHp: { type: core_1.PropTypes.Number, default: 5 },
    maxHp: { type: core_1.PropTypes.Number, default: 5 },
    minBulletDamage: { type: core_1.PropTypes.Number, default: 1 },
    maxBulletDamage: { type: core_1.PropTypes.Number, default: 1 },
    minAxeDamage: { type: core_1.PropTypes.Number, default: 2 },
    maxAxeDamage: { type: core_1.PropTypes.Number, default: 2 },
    hitStaggerSeconds: { type: core_1.PropTypes.Number, default: 1 },
    // Knockback
    knockbackMinDamage: { type: core_1.PropTypes.Number, default: 2 },
    knockbackMultiplier: { type: core_1.PropTypes.Number, default: 2 },
    // Loot
    lootTable: { type: core_1.PropTypes.Entity }
};
core_1.Component.register(NpcTuner);
