"use strict";
// Copyright (c) Meta Platforms, Inc. and affiliates.
Object.defineProperty(exports, "__esModule", { value: true });
exports.LootSystem = void 0;
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
const Behaviour_1 = require("Behaviour");
const core_1 = require("horizon/core");
class LootSystem extends Behaviour_1.Behaviour {
    Awake() {
        LootSystem.instance = this;
    }
    dropLoot(lootTable, position, rotation, force = false) {
        var lootDropTable = Behaviour_1.BehaviourFinder.GetBehaviour(lootTable);
        if (position.y < this.props.lootMinimumHeight) {
            position.y = this.props.lootMinimumHeight;
        }
        if (force || (lootDropTable?.shouldDropItem() ?? false)) {
            lootDropTable?.dropRandomItem(position, rotation);
        }
    }
}
exports.LootSystem = LootSystem;
LootSystem.propsDefinition = {
    lootMinimumHeight: { type: core_1.PropTypes.Number, default: 0.5 },
};
core_1.Component.register(LootSystem);
